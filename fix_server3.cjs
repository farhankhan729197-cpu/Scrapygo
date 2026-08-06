const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Replace leftover `else {` that are preceded by nothing but whitespace and maybe a `}`?
// Actually wait, let's just find `else {` that is invalid.
// In the snippet, it's `}; \n else {\n usersStore.set... }`
code = code.replace(/\};\s*else\s*\{\s*usersStore\.set\([^)]+\);\s*\}/g, ';\nusersStore.set($1);');
fs.writeFileSync('server.ts', code);
