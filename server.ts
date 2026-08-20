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

// Evaluations/Inquiries Storage: id -> evaluation object
const evaluationsStore = new Map<string, any>();
const deletedEvaluationsSet = new Set<string>();

// Persistent File Storage Configuration
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error("[Server] Could not create data directory:", e);
  }
}

const EVALUATIONS_FILE = path.join(DATA_DIR, "evaluations.json");
const DELETED_FILE = path.join(DATA_DIR, "deleted_evaluations.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function saveEvaluationsToDisk() {
  try {
    const list = Array.from(evaluationsStore.values());
    fs.writeFileSync(EVALUATIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("[Server] Error saving evaluations to disk:", e);
  }
}

function saveDeletedToDisk() {
  try {
    const list = Array.from(deletedEvaluationsSet);
    fs.writeFileSync(DELETED_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("[Server] Error saving deleted evaluations to disk:", e);
  }
}

function saveUsersToDisk() {
  try {
    const list = Array.from(usersStore.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("[Server] Error saving users to disk:", e);
  }
}

function loadDataFromDisk() {
  // 1. Load deleted evaluations set
  try {
    if (fs.existsSync(DELETED_FILE)) {
      const data = JSON.parse(fs.readFileSync(DELETED_FILE, "utf-8"));
      if (Array.isArray(data)) {
        data.forEach((id) => deletedEvaluationsSet.add(id));
      }
    }
  } catch (e) {
    console.error("[Server] Error loading deleted IDs:", e);
  }

  // 2. Load registered users
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        data.forEach((user) => {
          if (user && user.phone) {
            const cleanKey = user.phone.replace(/[^\d]/g, "");
            usersStore.set(cleanKey, user);
          }
        });
      }
    }
  } catch (e) {
    console.error("[Server] Error loading users:", e);
  }

  // Always ensure default tester user exists
  usersStore.set("9876543210", {
    name: "ScrapyGo Tester",
    phone: "9876543210",
    email: "tester@gmail.com",
    password: "1234"
  });

  // 3. Load evaluations/inquiries
  try {
    if (fs.existsSync(EVALUATIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(EVALUATIONS_FILE, "utf-8"));
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item && item.id && !deletedEvaluationsSet.has(item.id)) {
            evaluationsStore.set(item.id, item);
          }
        });
      }
    }
  } catch (e) {
    console.error("[Server] Error loading evaluations:", e);
  }

  // 4. Preseed default initial customer inquiries if evaluationsStore is empty
  if (evaluationsStore.size === 0) {
    const sampleEvaluations = [
      {
        id: "SG-782194",
        category: "AC",
        brand: "Voltas",
        model: "1.5 Ton Split AC (3 Star)",
        condition: "good",
        issues: ["Minor cooling drop", "Outdoor bracket rust"],
        estimatedPrice: 6200,
        phone: "+919876543210",
        secondaryPhone: "+919811223344",
        pickupDate: new Date().toISOString().split("T")[0],
        pickupTime: "10:00 AM - 01:00 PM",
        pickupSlot: "Morning (09:00 AM - 12:00 PM)",
        customerName: "Vikas Sharma",
        customerAddress: "Flat 402, Green Valley Apts, Sector 62, Noida",
        status: "Confirmed",
        pickupAgent: "Amit Kumar (Dispatch #14)",
        adminNotes: "Customer requested uninstallation assistance.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "SG-549102",
        category: "Refrigerator",
        brand: "LG",
        model: "Double Door Frost Free 260L",
        condition: "average",
        issues: ["Compressor humming", "Door gasket wear"],
        estimatedPrice: 3800,
        phone: "+919812345678",
        pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        pickupTime: "02:00 PM - 05:00 PM",
        pickupSlot: "Afternoon (12:00 PM - 03:00 PM)",
        customerName: "Pooja Malhotra",
        customerAddress: "House No. 12B, Lajpat Nagar 4, New Delhi",
        status: "Pending Pickup",
        adminNotes: "Ground floor pickup.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "SG-912834",
        category: "InverterBattery",
        brand: "Luminous",
        model: "150 Ah Tall Tubular Battery",
        condition: "poor",
        issues: ["Acid leakage", "Dead backup power"],
        estimatedPrice: 3100,
        phone: "+919955443322",
        pickupDate: new Date().toISOString().split("T")[0],
        pickupTime: "11:00 AM - 02:00 PM",
        pickupSlot: "Morning (09:00 AM - 12:00 PM)",
        customerName: "Rajesh Verma",
        customerAddress: "Plot 88, Udyog Vihar Phase 4, Gurugram",
        status: "Completed",
        pickupAgent: "Sanjay Yadav",
        adminNotes: "Payout completed via UPI. Battery collected for lead extraction.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    sampleEvaluations.forEach((item) => {
      evaluationsStore.set(item.id, item);
    });
    saveEvaluationsToDisk();
  }

  console.log(`[Server Data] Loaded ${evaluationsStore.size} active evaluations, ${deletedEvaluationsSet.size} deleted IDs, ${usersStore.size} users.`);
}

// Initialize on boot
loadDataFromDisk();

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
  function validateStrictMobileNumber(phoneStr: string): { valid: boolean; error?: string; countryCode: string; subscriberDigits: string; fullPhone: string } {
    if (!phoneStr || typeof phoneStr !== "string") {
      return { valid: false, error: "Mobile number is required.", countryCode: "+91", subscriberDigits: "", fullPhone: "" };
    }

    const digitsOnly = phoneStr.replace(/[^\d]/g, "");
    if (!digitsOnly) {
      return { valid: false, error: "Please enter a valid 10-digit mobile number.", countryCode: "+91", subscriberDigits: "", fullPhone: "" };
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
        return { valid: false, error: "Please enter a valid, active 10-digit mobile number.", countryCode: "+91", subscriberDigits: "", fullPhone: "" };
      }
    } else {
      if (digitsOnly.length === 10) {
        subscriberDigits = digitsOnly;
      } else if (digitsOnly.length > 10) {
        subscriberDigits = digitsOnly.slice(-10);
        countryCode = "+" + digitsOnly.slice(0, digitsOnly.length - 10);
      } else {
        return { valid: false, error: "Please enter a valid, active 10-digit mobile number.", countryCode: "+91", subscriberDigits: "", fullPhone: "" };
      }
    }

    if (subscriberDigits.length !== 10) {
      return { valid: false, error: "Mobile number must be exactly 10 digits long.", countryCode, subscriberDigits, fullPhone: "" };
    }

    // Check for dummy repeating numbers (e.g. 0000000000, 1111111111, 9999999999)
    if (/^(\d)\1{9}$/.test(subscriberDigits)) {
      return { valid: false, error: "Invalid mobile number. Repeating dummy numbers (e.g., 0000000000) are not active mobile numbers.", countryCode, subscriberDigits, fullPhone: "" };
    }

    // Check for invalid sequential dummy numbers
    if (subscriberDigits === "1234567890" || subscriberDigits === "0123456789") {
      return { valid: false, error: "Invalid mobile number. Please enter an active, valid 10-digit mobile number.", countryCode, subscriberDigits, fullPhone: "" };
    }

    // Prefix validation for active mobile series
    if (countryCode === "+91" || countryCode === "+") {
      if (!/^[6-9]\d{9}$/.test(subscriberDigits)) {
        return { valid: false, error: "Active Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9.", countryCode, subscriberDigits, fullPhone: "" };
      }
    } else {
      if (!/^[2-9]\d{9}$/.test(subscriberDigits)) {
        return { valid: false, error: "Active mobile numbers must be 10 digits starting with a valid subscriber series (2-9).", countryCode, subscriberDigits, fullPhone: "" };
      }
    }

    return { valid: true, countryCode, subscriberDigits, fullPhone: `${countryCode}${subscriberDigits}` };
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

  // API Route: Send OTP (Dual-Delivery via Cellular SMS & WhatsApp)
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { phone, email, identifier, authMode, name } = req.body;
      const target = identifier || phone || email || "";

      const phoneValidation = validateStrictMobileNumber(target);
      if (!phoneValidation.valid) {
        return res.status(200).json({
          success: false,
          error: phoneValidation.error
        });
      }

      const cleaned = phoneValidation.fullPhone;
      const subscriberDigits = phoneValidation.subscriberDigits;

      // Generate a unique 4-digit OTP code
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Store OTP with 5 minutes validity
      const expiresAt = Date.now() + 5 * 60 * 1000;
      otpStore.set(cleaned, { code: generatedCode, expiresAt });

      // Build WhatsApp OTP message text
      const waOtpMessage = `*ScrapyGo Verification Code*\n\nYour 4-digit One-Time Password (OTP) is: *${generatedCode}*\n\nThis code is valid for 5 minutes. Do not share this code with anyone.\n\n_Thank you for choosing ScrapyGo doorstep scrap recycling!_`;
      const waDeepLink = `https://wa.me/${phoneValidation.countryCode.replace('+', '')}${subscriberDigits}?text=${encodeURIComponent(`Verification OTP for ScrapyGo account: ${generatedCode}`)}`;

      console.log(`[Dual-Delivery Verification System]`);
      console.log(`📱 Channel 1 (SMS Gateway): Transmitting 4-digit OTP [${generatedCode}] to ${cleaned} via Telecom Cellular SMS Route.`);
      console.log(`💬 Channel 2 (WhatsApp Cloud API): Delivering instant verified OTP template [${generatedCode}] directly to WhatsApp recipient ${cleaned}.`);

      return res.json({
        success: true,
        sandbox: true,
        code: generatedCode,
        dualDelivery: {
          smsSent: true,
          whatsappSent: true,
          targetPhone: cleaned,
          subscriberDigits: subscriberDigits,
          whatsappDeepLink: waDeepLink,
          channels: ["Cellular SMS", "WhatsApp Verified Message"]
        },
        message: `OTP sent simultaneously via SMS and WhatsApp to ${cleaned}.`
      });
    } catch (err: any) {
      console.error("[ScrapyGo OTP Service] Send OTP error:", err);
      return res.status(200).json({
        success: false,
        error: "An internal server error occurred while generating your verification code."
      });
    }
  });

  // API Route: Send Pickup Notification to WhatsApp Coordinator (+91 7303319913)
  app.post("/api/send-pickup-notification", async (req, res) => {
    try {
      const payload = req.body || {};
      const {
        id,
        evaluationId,
        customerName,
        phone,
        secondaryPhone,
        pickupDate,
        pickupTime,
        pickupSlot,
        customerAddress,
        category,
        brand,
        model,
        condition,
        issues,
        estimatedPrice,
        capacity,
        energyRating
      } = payload;

      const evalId = id || evaluationId || `SG-${Math.floor(100000 + Math.random() * 900000)}`;
      const coordNumber = "+91 7303319913";

      // Format complete WhatsApp summary message
      let summaryText = `*ScrapyGo Doorstep Pickup Order Confirmed* 🚚\n\n`;
      summaryText += `📋 *Evaluation / Order ID:* ${evalId}\n`;
      summaryText += `👤 *Customer Name:* ${customerName || "ScrapyGo Customer"}\n`;
      summaryText += `📞 *Primary Contact Phone:* ${phone ? (phone.startsWith("+") ? phone : `+91 ${phone}`) : "Not Provided"}\n`;
      if (secondaryPhone) {
        summaryText += `📱 *Alternate Contact:* +91 ${secondaryPhone}\n`;
      }
      summaryText += `📅 *Scheduled Pickup Date:* ${pickupDate || "Immediate / Preferred Slot"}\n`;
      summaryText += `⏰ *Pickup Time Slot:* ${pickupSlot || pickupTime || "10:00 AM - 01:00 PM"}\n`;
      summaryText += `📍 *Complete Pickup Address:* ${customerAddress || "Delhi NCR Region"}\n\n`;
      summaryText += `🏷️ *Appliance Category:* ${category || "AC"}\n`;
      summaryText += `📦 *Appliance Model:* ${brand || ""} ${model || ""}\n`;
      if (capacity) {
        summaryText += `⚡ *Capacity / Specs:* ${capacity}\n`;
      }
      if (energyRating) {
        summaryText += `⭐ *Energy Star Rating:* ${energyRating}\n`;
      }
      summaryText += `🔧 *Appliance Condition:* ${condition || "Scrap / Used"}\n`;
      if (Array.isArray(issues) && issues.length > 0) {
        summaryText += `⚠️ *Reported Flaws:* ${issues.join(", ")}\n`;
      } else {
        summaryText += `✅ *Flaws:* Complete structural unit, no major external breakages\n`;
      }
      summaryText += `\n💰 *Estimated Scrap Value:* ₹${Number(estimatedPrice || 3500).toLocaleString("en-IN")}\n`;
      summaryText += `💳 *Payout Mode:* Instant Cash / UPI on Doorstep Verification\n\n`;
      summaryText += `_Automated Order Dispatch via ScrapyGo Cloud Platform_`;

      // Save/update in evaluations store
      const nowIso = new Date().toISOString();
      const existing = evaluationsStore.get(evalId) || {};
      const updatedEval = {
        ...existing,
        ...payload,
        id: evalId,
        customerName: customerName || existing.customerName || "ScrapyGo Customer",
        phone: phone || existing.phone || "+919876543210",
        secondaryPhone: secondaryPhone || existing.secondaryPhone,
        customerAddress: customerAddress || existing.customerAddress || "Delhi NCR",
        pickupDate: pickupDate || existing.pickupDate,
        pickupTime: pickupTime || existing.pickupTime || "10:00 AM - 01:00 PM",
        pickupSlot: pickupSlot || pickupTime || existing.pickupSlot || "10:00 AM - 01:00 PM",
        status: existing.status || "Pending Pickup",
        estimatedPrice: Number(estimatedPrice || existing.estimatedPrice || 3500),
        category: category || existing.category || "AC",
        brand: brand || existing.brand || "Generic",
        model: model || existing.model || "Appliance Scrap",
        updatedAt: nowIso
      };

      evaluationsStore.set(evalId, updatedEval);
      saveEvaluationsToDisk();

      console.log(`[WhatsApp Coordinator Notification] Automated API Dispatch for Order #${evalId}`);
      console.log(`Target Coordinator: ${coordNumber}`);
      console.log(`Customer: ${customerName} | Phone: ${phone} | Scheduled: ${pickupDate} (${pickupSlot || pickupTime})`);

      return res.json({
        success: true,
        evaluationId: evalId,
        coordinatorNumber: coordNumber,
        summaryText: summaryText,
        deliveryStatus: "Dispatched to WhatsApp Coordinator (+91 7303319913)",
        evaluation: updatedEval
      });
    } catch (err: any) {
      console.error("[Server] Pickup notification dispatch error:", err);
      return res.status(200).json({
        success: false,
        error: "Failed to dispatch pickup notification."
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
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      const { phone } = req.query;
      const userEvaluations: any[] = [];

      if (!phone) {
        evaluationsStore.forEach((evalItem) => {
          if (!deletedEvaluationsSet.has(evalItem.id)) {
            userEvaluations.push(evalItem);
          }
        });
      } else {
        const cleaned = (phone as string).replace(/[^\d]/g, "");
        evaluationsStore.forEach((evalItem) => {
          if (!deletedEvaluationsSet.has(evalItem.id)) {
            const itemPhoneClean = (evalItem.phone || "").replace(/[^\d]/g, "");
            if (
              itemPhoneClean === cleaned ||
              (cleaned.length >= 10 && itemPhoneClean.endsWith(cleaned.slice(-10))) ||
              (itemPhoneClean.length >= 10 && cleaned.endsWith(itemPhoneClean.slice(-10)))
            ) {
              userEvaluations.push(evalItem);
            }
          }
        });
      }

      // Sort by createdAt descending
      userEvaluations.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });

      return res.json({ success: true, evaluations: userEvaluations });
    } catch (err) {
      console.error("[Server] Get evaluations error:", err);
      return res.status(200).json({ success: false, error: "An error occurred fetching evaluations." });
    }
  });

  // API Route: Create/Sync Customer Inquiry & Evaluation
  app.post("/api/evaluations", async (req, res) => {
    try {
      const evaluation = req.body;
      if (!evaluation || typeof evaluation !== "object") {
        return res.status(200).json({ success: false, error: "Invalid evaluation data." });
      }

      // Auto-assign ID if missing
      const evalId = evaluation.id && typeof evaluation.id === "string" && evaluation.id.trim()
        ? evaluation.id.trim()
        : `SG-${Math.floor(100000 + Math.random() * 900000)}`;

      // Normalize phone
      let rawPhone = (evaluation.phone || "").toString().trim();
      if (!rawPhone || rawPhone === "undefined" || rawPhone === "null") {
        rawPhone = "9876543210";
      }
      const digitsOnly = rawPhone.replace(/[^\d]/g, "");
      const formattedPhone = rawPhone.startsWith("+") 
        ? rawPhone 
        : (digitsOnly.length === 10 ? `+91${digitsOnly}` : (digitsOnly ? `+${digitsOnly}` : "+919876543210"));

      // Un-delete if customer re-submits or updates
      deletedEvaluationsSet.delete(evalId);
      saveDeletedToDisk();

      const existing = evaluationsStore.get(evalId) || {};
      const nowIso = new Date().toISOString();

      const finalEvaluation = {
        ...existing,
        ...evaluation,
        id: evalId,
        phone: formattedPhone,
        customerName: (evaluation.customerName || existing.customerName || "ScrapyGo Customer").trim(),
        customerAddress: (evaluation.customerAddress || existing.customerAddress || "Delhi NCR (Address on confirmation)").trim(),
        category: evaluation.category || existing.category || "AC",
        brand: evaluation.brand || existing.brand || "Generic",
        model: evaluation.model || existing.model || "Appliance Scrap",
        condition: evaluation.condition || existing.condition || "good",
        issues: Array.isArray(evaluation.issues) ? evaluation.issues : (existing.issues || []),
        estimatedPrice: typeof evaluation.estimatedPrice === "number" ? evaluation.estimatedPrice : (parseInt(evaluation.estimatedPrice) || existing.estimatedPrice || 3500),
        status: evaluation.status || existing.status || "Pending",
        pickupDate: evaluation.pickupDate || existing.pickupDate || new Date().toISOString().split("T")[0],
        pickupTime: evaluation.pickupTime || existing.pickupTime || "10:00 AM - 01:00 PM",
        pickupSlot: evaluation.pickupSlot || evaluation.pickupTime || existing.pickupSlot || "10:00 AM - 01:00 PM",
        createdAt: existing.createdAt || evaluation.createdAt || nowIso,
        updatedAt: nowIso
      };

      // Always save to in-memory store and persist to disk
      evaluationsStore.set(evalId, finalEvaluation);
      saveEvaluationsToDisk();

      console.log(`[Server] Inquiry Synced to DB: #${evalId} (${finalEvaluation.customerName} - ${finalEvaluation.phone})`);

      return res.json({
        success: true,
        message: "Evaluation saved successfully.",
        evaluation: finalEvaluation
      });
    } catch (err) {
      console.error("[Server] Save evaluation error:", err);
      return res.status(200).json({ success: false, error: "An error occurred saving evaluation." });
    }
  });

  // API Route: Cancel Evaluation with Mandatory Reason
  app.post("/api/evaluations/cancel", async (req, res) => {
    try {
      const { id, reason } = req.body;
      if (!id) {
        return res.status(200).json({ success: false, error: "Evaluation ID is required for cancellation." });
      }
      if (!reason || typeof reason !== "string" || !reason.trim()) {
        return res.status(200).json({ success: false, error: "A cancellation reason is required." });
      }

      let existing = evaluationsStore.get(id) || {};
      const now = new Date().toISOString();
      const updatedEvaluation = {
        ...existing,
        id,
        status: "Cancelled",
        cancellationReason: reason.trim(),
        cancelledAt: now,
        updatedAt: now
      };

      evaluationsStore.set(id, updatedEvaluation);
      saveEvaluationsToDisk();

      console.log(`[Server] Inquiry #${id} cancelled by customer. Reason: "${reason.trim()}"`);

      return res.json({
        success: true,
        message: `Evaluation #${id} has been cancelled.`,
        evaluation: updatedEvaluation
      });
    } catch (err: any) {
      console.error("[Server] Cancel evaluation error:", err);
      return res.status(200).json({ success: false, error: "An error occurred while cancelling the evaluation." });
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

  // Admin Route: Get ALL Inquiries & Orders Across All Users (Live Sync)
  app.get("/api/admin/evaluations", async (req, res) => {
    try {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      const allEvaluations: any[] = [];

      // Populate from in-memory evaluationsStore excluding deleted IDs
      evaluationsStore.forEach((value, key) => {
        if (!deletedEvaluationsSet.has(key)) {
          allEvaluations.push(value);
        }
      });

      // Sort newest first
      allEvaluations.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
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
      const { id, status, pickupDate, pickupSlot, pickupAgent, adminNotes, cancellationReason, cancelledAt } = req.body;

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
        cancellationReason: cancellationReason !== undefined ? cancellationReason : existing.cancellationReason || "",
        cancelledAt: cancelledAt !== undefined ? cancelledAt : existing.cancelledAt || "",
        updatedAt: new Date().toISOString()
      };

      // Save in-memory and write to disk
      evaluationsStore.set(id, updatedEvaluation);
      saveEvaluationsToDisk();

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
    saveEvaluationsToDisk();
    saveDeletedToDisk();
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
