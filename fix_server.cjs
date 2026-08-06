const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/import { initializeApp } from "firebase\/app";\n/, '');
code = code.replace(/import { getFirestore.*? } from "firebase\/firestore";\n/, '');
code = code.replace(/\/\/ Firebase initialization.*?mode\.\"\);\n\}\n/s, 'const isFirebaseConnected = false;\nconst db = null;\n');
fs.writeFileSync('server.ts', code);
