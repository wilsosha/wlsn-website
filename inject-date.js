const fs = require('fs');
const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('__DEPLOY_DATE_PLACEHOLDER__', date);
fs.writeFileSync('index.html', html);
console.log('✓ Deploy date injected:', date);
