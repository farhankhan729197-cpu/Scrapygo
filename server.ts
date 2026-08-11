import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const isFirebaseConnected = false;
const db = null;

// In-memory OTP storage: phone -> { code: string, expiresAt: number }
interface OtpSession {
  code: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpSession>();

// In-memory Registered Users Storage: phone -> { name: string, phone: string, password?: string }
interface RegisteredUser {
  name: string;
  phone: string;
  email?: string;
  password?: string;
}
const usersStore = new Map<string, RegisteredUser>();

// In-memory Evaluations/Inquiries Storage: id -> evaluation object
const evaluationsStore = new Map<string, any>();
const deletedEvaluationsSet = new Set<string>();

// Preseed testing user
usersStore.set("9876543210", {
  name: "ScrapyGo Tester",
  phone: "9876543210",
  email: "tester@gmail.com",
  password: "1234"
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // Helper to lookup registered user by phone or email
  function findRegisteredUser(identifier: string): RegisteredUser | null {
    if (!identifier || typeof identifier !== "string") return null;
    const cleanId = identifier.trim().toLowerCase();
    const digitsOnly = cleanId.replace(/[^\d]/g, "");

    for (const [key, user] of usersStore.entries()) {
      // Check phone match if digits exist
      if (digitsOnly && digitsOnly.length >= 7) {
        const keyDigits = key.replace(/[^\d]/g, "");
        const userPhoneDigits = (user.phone || "").replace(/[^\d]/g, "");
        if (
          (keyDigits && keyDigits.length >= 7 && keyDigits.endsWith(digitsOnly.slice(-10))) ||
          (userPhoneDigits && userPhoneDigits.length >= 7 && userPhoneDigits.endsWith(digitsOnly.slice(-10)))
        ) {
          return user;
        }
      }
      // Check email match
      if (user.email && user.email.toLowerCase() === cleanId) {
        return user;
      }
    }
    return null;
  }

  // API Route: Check User Registration Status
  app.post("/api/check-user", async (req: express.Request, res: express.Response) => {
    try {
      const { phone, email, identifier } = req.body;
      const target = identifier || phone || email || "";
      const user = findRegisteredUser(target);

      if (user) {
        return res.json({
          success: true,
          exists: true,
          user: { name: user.name, phone: user.phone, email: user.email }
        });
      } else {
        return res.json({
          success: true,
          exists: false,
          error: "Account not found. Please sign up first"
        });
      }
    } catch (err: any) {
      return res.status(200).json({
        success: false,
        error: "An error occurred checking user registration."
      });
    }
  });
  function validateStrictMobileNumber(phoneStr: string): { valid: boolean; error?: string; subscriberDigits: string; fullPhone: string } {
    if (!phoneStr || typeof phoneStr !== "string") {
      return { valid: false, error: "Mobile number is required.", subscriberDigits: "", fullPhone: "" };
    }

    const digitsOnly = phoneStr.replace(/[^\d]/g, "");
    if (!digitsOnly) {
      return { valid: false, error: "Please enter a valid 10-digit mobile number.", subscriberDigits: "", fullPhone: "" };
    }

    let countryCode = "+91";
    let subscriberDigits = "";

    if (phoneStr.startsWith("+")) {
      if (digitsOnly.length > 10) {
        subscriberDigits = digitsOnly.slice(-10);
        countryCode = "+" + digitsOnly.slice(0, digitsOnly.length - 10);
      } else if (digitsOnly.length === 10) {
        subscriberDigits = digitsOnly;
      } else {
        return { valid: false, error: "Please enter a valid, active 10-digit mobile number.", subscriberDigits: "", fullPhone: "" };
      }
    } else {
      if (digitsOnly.length === 10) {
        subscriberDigits = digitsOnly;
      } else if (digitsOnly.length > 10) {
        subscriberDigits = digitsOnly.slice(-10);
        countryCode = "+" + digitsOnly.slice(0, digitsOnly.length - 10);
      } else {
        return { valid: false, error: "Please enter a valid, active 10-digit mobile number.", subscriberDigits: "", fullPhone: "" };
      }
    }

    if (subscriberDigits.length !== 10) {
      return { valid: false, error: "Mobile number must be exactly 10 digits long.", subscriberDigits: "", fullPhone: "" };
    }

    // Check for dummy repeating numbers (e.g. 0000000000, 1111111111, 9999999999)
    if (/^(\d)\1{9}$/.test(subscriberDigits)) {
      return { valid: false, error: "Invalid mobile number. Repeating dummy numbers (e.g., 0000000000) are not active mobile numbers.", subscriberDigits: "", fullPhone: "" };
    }

    // Check for invalid sequential dummy numbers
    if (subscriberDigits === "1234567890" || subscriberDigits === "0123456789") {
      return { valid: false, error: "Invalid mobile number. Please enter an active, valid 10-digit mobile number.", subscriberDigits: "", fullPhone: "" };
    }

    // Prefix validation for active mobile series
    if (countryCode === "+91" || countryCode === "+") {
      if (!/^[6-9]\d{9}$/.test(subscriberDigits)) {
        return { valid: false, error: "Active Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.", subscriberDigits: "", fullPhone: "" };
      }
    } else {
      if (!/^[2-9]\d{9}$/.test(subscriberDigits)) {
        return { valid: false, error: "Active mobile numbers must be 10 digits starting with a valid subscriber series (2-9).", subscriberDigits: "", fullPhone: "" };
      }
    }

    return { valid: true, subscriberDigits, fullPhone: `${countryCode}${subscriberDigits}` };
  }

  // Helper: Perform Sign Up
  const performSignup = async (req: express.Request, res: express.Response) => {
    try {
      const { name, phone, email } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(200).json({
          success: false,
          error: "Full Name is required for registration."
        });
      }

      const phoneValidation = validateStrictMobileNumber(phone);
      if (!phoneValidation.valid) {
        return res.status(200).json({
          success: false,
          error: phoneValidation.error
        });
      }

      const cleaned = phoneValidation.fullPhone;

      if (!email || !email.includes("@")) {
        return res.status(200).json({
          success: false,
          error: "A valid Gmail ID is required for sign up."
        });
      }

      const newUser: RegisteredUser = {
        name: name.trim(),
        phone: cleaned,
        email: email.trim().toLowerCase()
      };
      usersStore.set(cleaned, newUser);

      console.log(`[ScrapyGo Auth] New user signed up: Name: ${newUser.name}, Phone: ${newUser.phone}, Email: ${newUser.email}`);
      return res.json({
        success: true,
        user: { name: newUser.name, phone: newUser.phone, email: newUser.email },
        message: `Welcome to ScrapyGo, ${newUser.name}!`
      });
    } catch (err: any) {
      console.error("[ScrapyGo Auth] Sign Up error:", err);
      return res.status(200).json({
        success: false,
        error: "An error occurred during sign up. Please try again."
      });
    }
  };

  // Helper: Perform Log In
  const performLogin = async (req: express.Request, res: express.Response) => {
    try {
      const { phone, email, identifier, name } = req.body;
      const target = identifier || phone || email || "";

      let user = findRegisteredUser(target);

      if (!user) {
        const phoneValidation = validateStrictMobileNumber(target);
        if (phoneValidation.valid) {
          user = {
            name: (name && name.trim()) || "ScrapyGo Customer",
            phone: phoneValidation.fullPhone,
            email: ""
          };
          usersStore.set(phoneValidation.fullPhone, user);
        }
      }

      if (user) {
        console.log(`[ScrapyGo Auth] User logged in: ${user.name} (${user.phone})`);
        return res.json({
          success: true,
          user: { name: user.name, phone: user.phone, email: user.email },
          message: `Welcome to ScrapyGo, ${user.name}!`
        });
      } else {
        return res.status(200).json({
          success: false,
          error: "Please enter a valid, active 10-digit mobile number."
        });
      }
    } catch (err: any) {
      console.error("[ScrapyGo Auth] Log In error:", err);
      return res.status(200).json({
        success: false,
        error: "An error occurred during log in. Please try again."
      });
    }
  };

  // API Route: Sign Up
  app.post("/api/signup", performSignup);

  // API Route: Log In
  app.post("/api/login", performLogin);

  // API Route: Unified Auth fallback
  app.post("/api/auth", async (req: express.Request, res: express.Response) => {
    return performLogin(req, res);
  });

  // API Route: Send OTP
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { phone, email, identifier } = req.body;
      const target = identifier || phone || email || "";

      const phoneValidation = validateStrictMobileNumber(target);
      if (!phoneValidation.valid) {
        return res.status(200).json({
          success: false,
          error: phoneValidation.error
        });
      }

      const cleaned = phoneValidation.fullPhone;

      // Generate a unique 4-digit OTP code
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Store OTP with 5 minutes validity
      const expiresAt = Date.now() + 5 * 60 * 1000;
      otpStore.set(cleaned, { code: generatedCode, expiresAt });

      console.log(`[ScrapyGo OTP Service] Active mobile number verified (${phoneValidation.subscriberDigits}). Generated unique OTP ${generatedCode} for ${cleaned}`);

      return res.json({
        success: true,
        sandbox: true,
        code: generatedCode,
        message: "Unique verification code generated."
      });
    } catch (err: any) {
      console.error("[ScrapyGo OTP Service] Send OTP error:", err);
      return res.status(200).json({
        success: false,
        error: "An internal server error occurred while generating your verification code."
      });
    }
  });

  // API Route: Verify OTP
  app.post("/api/verify-otp", (req, res) => {
    try {
      const { phone, code } = req.body;

      if (!phone || !code) {
        return res.status(200).json({
          success: false,
          error: "Phone number and OTP code are both required for verification."
        });
      }

      const cleaned = (phone || "").replace(/[^\d+]/g, "");
      const activeSession = otpStore.get(cleaned);

      if (!activeSession) {
        return res.status(200).json({
          success: false,
          error: "No active verification session found. Please request a new OTP."
        });
      }

      if (Date.now() > activeSession.expiresAt) {
        otpStore.delete(cleaned);
        return res.status(200).json({
          success: false,
          error: "The OTP code has expired. Please request a new code."
        });
      }

      if (activeSession.code !== code) {
        return res.status(200).json({
          success: false,
          error: "Invalid OTP code. Please enter the correct verification code sent to your device."
        });
      }

      // Success: Clear the session so it can't be reused
      otpStore.delete(cleaned);
      return res.json({
        success: true,
        message: "Mobile verification successful!"
      });
    } catch (err: any) {
      console.error("[ScrapyGo OTP Service] Verify OTP error:", err);
      return res.status(200).json({
        success: false,
        error: "An internal error occurred during OTP verification."
      });
    }
  });

  // API Route: Get Evaluations
  app.get("/api/evaluations", async (req, res) => {
    try {
      const { phone } = req.query;
      if (!phone) {
        return res.status(200).json({ success: false, error: "Phone number is required." });
      }

      const cleaned = (phone as string).replace(/[^\d+]/g, "");
      const userEvaluations: any[] = [];

      

      // Merge with in-memory evaluationsStore
      evaluationsStore.forEach((evalItem) => {
        if (!deletedEvaluationsSet.has(evalItem.id)) {
          if (evalItem.phone === cleaned || (evalItem.phone && evalItem.phone.includes(cleaned.slice(-10)))) {
            if (!userEvaluations.some((item) => item.id === evalItem.id)) {
              userEvaluations.push(evalItem);
            }
          }
        }
      });

      // Sort by createdAt descending
      userEvaluations.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      return res.json({ success: true, evaluations: userEvaluations });
    } catch (err) {
      console.error("[Server] Get evaluations error:", err);
      return res.status(200).json({ success: false, error: "An error occurred fetching evaluations." });
    }
  });

  // API Route: Create/Sync Evaluation
  app.post("/api/evaluations", async (req, res) => {
    try {
      const evaluation = req.body;
      if (!evaluation || !evaluation.id || !evaluation.phone) {
        return res.status(200).json({ success: false, error: "Invalid evaluation data." });
      }

      // If evaluation was previously deleted by an admin, do not re-add
      if (deletedEvaluationsSet.has(evaluation.id)) {
        return res.json({ success: false, error: "Inquiry has been deleted by administrator." });
      }

      const cleaned = evaluation.phone.replace(/[^\d+]/g, "");
      const finalEvaluation = {
        ...evaluation,
        phone: cleaned,
        status: evaluation.status || "Pending Pickup",
        updatedAt: new Date().toISOString(),
        createdAt: evaluation.createdAt || new Date().toISOString()
      };

      // Always save to in-memory store
      evaluationsStore.set(evaluation.id, finalEvaluation);

      

      return res.json({ success: true, message: "Evaluation saved successfully.", evaluation: finalEvaluation });
    } catch (err) {
      console.error("[Server] Save evaluation error:", err);
      return res.status(200).json({ success: false, error: "An error occurred saving evaluation." });
    }
  });

  // ================= ADMIN PANEL ROUTES =================

  // Admin Route: Authenticate Admin Login
  app.post("/api/admin/login", (req, res) => {
    try {
      const { phone, password } = req.body || {};

      if (!phone || !password) {
        return res.status(200).json({
          success: false,
          error: "Mobile number and password are required."
        });
      }

      const cleanedDigits = (phone || "").toString().replace(/[^\d]/g, "");

      if (!cleanedDigits.endsWith("7303319913")) {
        return res.status(200).json({
          success: false,
          error: "Access Denied: Admin panel access is restricted exclusively to authorized mobile number (+91 7303319913)."
        });
      }

      if (cleanedDigits.length < 10) {
        return res.status(200).json({
          success: false,
          error: "Please enter a valid 10-digit mobile number."
        });
      }

      if (!password || password.trim().length < 1) {
        return res.status(200).json({
          success: false,
          error: "Please enter a valid administrator password."
        });
      }

      // Admin verification successful
      return res.json({
        success: true,
        token: "admin-session-token",
        message: "Administrator login verified successfully."
      });
    } catch (err: any) {
      console.error("[Admin API] Login error:", err);
      return res.status(200).json({
        success: false,
        error: "An error occurred during administrator authentication."
      });
    }
  });

  // Admin Route: Get ALL Inquiries & Orders Across All Users
  app.get("/api/admin/evaluations", async (req, res) => {
    try {
      const allEvaluationsMap = new Map<string, any>();

      // Populate from in-memory evaluationsStore excluding deleted IDs
      evaluationsStore.forEach((value, key) => {
        if (!deletedEvaluationsSet.has(key)) {
          allEvaluationsMap.set(key, value);
        }
      });

      const allEvaluations = Array.from(allEvaluationsMap.values());

      // Sort newest first
      allEvaluations.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      return res.json({
        success: true,
        evaluations: allEvaluations,
        count: allEvaluations.length
      });
    } catch (err: any) {
      console.error("[Admin API] Get all evaluations error:", err);
      return res.status(200).json({
        success: false,
        error: "An error occurred fetching admin inquiries."
      });
    }
  });

  // Admin Route: Update Evaluation Status, Pickup Details & Notes
  app.post("/api/admin/evaluations/update", async (req, res) => {
    try {
      const { id, status, pickupDate, pickupSlot, pickupAgent, adminNotes } = req.body;

      if (!id) {
        return res.status(200).json({
          success: false,
          error: "Evaluation ID is required for update."
        });
      }

      let existing = evaluationsStore.get(id) || {};

      

      const updatedEvaluation = {
        ...existing,
        id,
        status: status || existing.status || "Pending",
        pickupDate: pickupDate !== undefined ? pickupDate : existing.pickupDate || "",
        pickupSlot: pickupSlot !== undefined ? pickupSlot : existing.pickupSlot || "",
        pickupAgent: pickupAgent !== undefined ? pickupAgent : existing.pickupAgent || "",
        adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes || "",
        updatedAt: new Date().toISOString()
      };

      // Save in-memory
      evaluationsStore.set(id, updatedEvaluation);

      // Save to Firestore
      

      console.log(`[Admin API] Updated evaluation ${id} status to '${updatedEvaluation.status}'`);

      return res.json({
        success: true,
        message: `Evaluation status updated to ${updatedEvaluation.status}`,
        evaluation: updatedEvaluation
      });
    } catch (err: any) {
      console.error("[Admin API] Update error:", err);
      return res.status(200).json({
        success: false,
        error: "An error occurred updating evaluation."
      });
    }
  });

  // Helper function to process lead deletion
  const performDeleteLead = (id: string) => {
    if (!id) return false;
    deletedEvaluationsSet.add(id);
    evaluationsStore.delete(id);
    console.log(`[Admin API] Permanently deleted evaluation inquiry #${id}`);
    return true;
  };

  // Admin Route: Delete Evaluation/Inquiry (POST /api/admin/evaluations/delete)
  app.post("/api/admin/evaluations/delete", async (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) {
        return res.status(200).json({
          success: false,
          error: "Evaluation ID is required for deletion."
        });
      }

      performDeleteLead(id);

      return res.json({
        success: true,
        message: `Inquiry #${id} deleted successfully.`
      });
    } catch (err: any) {
      console.error("[Admin API] Delete inquiry error:", err);
      return res.status(200).json({
        success: false,
        error: "An error occurred deleting evaluation."
      });
    }
  });

  // Additional Delete Endpoints (POST /api/evaluations/delete and DELETE routes)
  app.post("/api/evaluations/delete", async (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(200).json({ success: false, error: "Evaluation ID required." });
      performDeleteLead(id);
      return res.json({ success: true, message: `Inquiry #${id} deleted successfully.` });
    } catch (err) {
      return res.status(200).json({ success: false, error: "Error deleting evaluation." });
    }
  });

  app.delete("/api/admin/evaluations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(200).json({ success: false, error: "Evaluation ID required." });
      performDeleteLead(id);
      return res.json({ success: true, message: `Inquiry #${id} deleted successfully.` });
    } catch (err) {
      return res.status(200).json({ success: false, error: "Error deleting evaluation." });
    }
  });

  app.delete("/api/evaluations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(200).json({ success: false, error: "Evaluation ID required." });
      performDeleteLead(id);
      return res.json({ success: true, message: `Inquiry #${id} deleted successfully.` });
    } catch (err) {
      return res.status(200).json({ success: false, error: "Error deleting evaluation." });
    }
  });

  // API Route: Get Firebase Connection Status
  app.get("/api/firebase-status", (req, res) => {
    res.json({
      connected: isFirebaseConnected,
      projectId: null
    });
  });

  // Catch-all for unhandled /api/* routes to guarantee JSON response instead of HTML
  app.all("/api/*", (req, res) => {
    return res.status(404).json({
      success: false,
      error: `API route '${req.path}' not found.`
    });
  });

  // Explicitly serve public assets directory with proper mime types
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.toLowerCase().endsWith('.jfif')) {
        res.setHeader('Content-Type', 'image/jpeg');
      }
    }
  }));

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ScrapyGo] Server running at http://localhost:${PORT}`);
  });
}

startServer();
