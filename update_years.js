const fs = require('fs');
const path = require('path');

function replaceYears(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceYears(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace "15+ Years" -> "10+ Years"
      // Replace "15 years" -> "10 years"
      // Replace "15+" -> "10+"
      
      let newContent = content
        .replace(/15\+ Years/gi, '10+ Years')
        .replace(/15 years/gi, '10 years')
        .replace(/15\+/g, '10+');

      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceYears(path.join(__dirname, 'frontend/src'));
