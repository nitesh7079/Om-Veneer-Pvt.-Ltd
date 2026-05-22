const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname);

const replaceMap = [
  { from: /Hari Om Veneer Udhyog/g, to: 'Om Veneer Udhyog' },
  { from: /Hari Om Veneer/g, to: 'Om Veneer' },
  { from: /hariomveneer/g, to: 'omveneer' },
  { from: /Hari Om ERP/g, to: 'Om ERP' },
  { from: /hari_om_veneer/g, to: 'om_veneer' },
  { from: /Hari Om/g, to: 'Om' },
  { from: /HARI OM/g, to: 'OM' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) { 
      if (!['node_modules', '.git', 'dist', '.next'].includes(file)) {
        results = results.concat(walk(filePath));
      }
    } else { 
      if (['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.md', '.css'].includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(directoryPath);

files.forEach(file => {
  if (file === __filename) return;
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replaceMap.forEach(({from, to}) => {
    content = content.replace(from, to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
