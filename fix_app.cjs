const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/const \[firebaseConnected, setFirebaseConnected\] = useState.*?\n/g, '');
code = code.replace(/const \[firebaseProjectId, setFirebaseProjectId\] = useState.*?\n/g, '');
code = code.replace(/\/\/ Check Firebase connection status.*?checkFirebaseStatus\(\);\n\n/s, '');
code = code.replace(/const syncEvaluationToFirebase = async.*?syncEvaluationToFirebase\(newRequest\);\n/s, '');
// And there is another call to syncEvaluationToFirebase
code = code.replace(/\/\/ Sync to Firestore if Firebase is active\n\s*syncEvaluationToFirebase\(newRequest\);\n/g, '');
// And the badge
code = code.replace(/\{\/\* Firebase Status Badge \*\/\}.*?Local Sync"\}\n\s*<\/span>\n\s*<\/div>/s, '');
fs.writeFileSync('src/App.tsx', code);
