const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'frontend/src/index.css');

let content = fs.readFileSync(cssFile, 'utf8');

const replaceMap = [
  { from: /201,\s*150,\s*74/g, to: '245, 158, 11' },
  { from: /21,\s*25,\s*31/g, to: '15, 23, 42' },
  { from: /30,\s*37,\s*53/g, to: '30, 41, 59' },
  { from: /247,\s*247,\s*245/g, to: '248, 250, 252' },
  { from: /#15191f/g, to: '#0f172a' },
  { from: /#1a2030/g, to: '#1e293b' },
  { from: /#1e2535/g, to: '#334155' },
  { from: /#c9964a/g, to: '#f59e0b' },
  { from: /#f7f7f5/g, to: '#f8fafc' },
];

replaceMap.forEach(({from, to}) => {
  content = content.replace(from, to);
});

fs.writeFileSync(cssFile, content, 'utf8');
console.log('Updated index.css colors');
