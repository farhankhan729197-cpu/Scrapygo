const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Replace all blocks like if (isFirebaseConnected && db) { ... }
code = code.replace(/if\s*\(isFirebaseConnected\s*&&\s*db\)\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[^}]*\}\s*\}/g, '');

// Also remove the catch block for `getDocs` if there are any trailing ones
code = code.replace(/if\s*\(isFirebaseConnected\s*&&\s*db\)\s*\{[\s\S]*?\}\s*\}/g, '');

// Wait, the API route `/api/firebase-status` references firebaseConfig
code = code.replace(/projectId: firebaseConfig\.projectId \|\| null/g, 'projectId: null');

fs.writeFileSync('server.ts', code);
