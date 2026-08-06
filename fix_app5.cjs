const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `      estimatedPrice: estimatedPrice,
      phone: phone,
      status: 'Pending Pickup',`;

const replaceStr = `      estimatedPrice: estimatedPrice,
      phone: currentUser.phone,
      status: 'Pending Pickup',`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
