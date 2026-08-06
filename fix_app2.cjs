const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/\/\/ Check Firebase connection status.*?checkFirebaseStatus\(\);\n\s*\}, \[currentUser\?\.phone\]\);\n\n/s, '');
code = code.replace(/const fetchUserEvaluations = async.*?console\.warn\(\"\[Firebase\] Failed to fetch evaluations from Firestore:\", err\);\n\s*\}\n\s*\};\n\n/s, '');
code = code.replace(/\/\/ Firebase connection and sync states\n/g, '');
code = code.replace(/setFirebaseConnected/g, '// setFirebaseConnected');
fs.writeFileSync('src/App.tsx', code);
