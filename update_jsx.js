const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'frontend/src/pages/erp/Login.jsx'),
  path.join(__dirname, 'frontend/src/pages/erp/Register.jsx')
];

const replaceMap = [
  { from: /201,150,74/g, to: '245,158,11' },
  { from: /21,25,31/g, to: '15,23,42' },
  { from: /247,247,245/g, to: '248,250,252' }
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    replaceMap.forEach(({from, to}) => {
      content = content.replace(from, to);
    });
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
