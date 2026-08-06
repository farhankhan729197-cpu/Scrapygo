const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/;\s*usersStore\.set\(\$1\);/g, '};\nusersStore.set(cleaned, newUser);');
fs.writeFileSync('server.ts', code);
