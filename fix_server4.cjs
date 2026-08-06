const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/\};\s*else\s*\{\s*usersStore\.set\(([^)]+)\);\s*\}/g, ';\nusersStore.set($1);');
fs.writeFileSync('server.ts', code);
