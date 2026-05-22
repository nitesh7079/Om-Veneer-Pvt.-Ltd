const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'frontend/src/index.css');

let content = fs.readFileSync(cssFile, 'utf8');

// Fix hero text to be white since it's on a dark image
content = content.replace(/\.hp-hero-title \{\s*[\s\S]*?color: var\(--cream\);\s*[\s\S]*?\}/g, function(match) {
  return match.replace('color: var(--cream);', 'color: #ffffff;');
});

content = content.replace(/\.hp-hero-sub \{\s*[\s\S]*?color: rgba\(248, 250, 252, 0\.82\);\s*[\s\S]*?\}/g, function(match) {
  return match.replace('color: rgba(248, 250, 252, 0.82);', 'color: rgba(255, 255, 255, 0.9);');
});

// Update split section gradient to be light green instead of dark
content = content.replace(/background: linear-gradient\(135deg, rgba\(30, 41, 59,0\.85\) 0%, rgba\(15, 23, 42,0\.6\) 100%\);/g, 'background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);');
content = content.replace(/background: linear-gradient\(180deg, rgba\(30, 41, 59,0\.7\) 0%, rgba\(15, 23, 42,0\.4\) 100%\);/g, 'background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);');

// Trust bar text is white but maybe trust background is light?
// .hp-trust background is linear-gradient(90deg, var(--forest-mid), var(--pine))
// --forest-mid is #007a4b and --pine is #e8f5e9
// Let's make trust bar solid dark green and text white
content = content.replace(/background: linear-gradient\(90deg, var\(--forest-mid\), var\(--pine\)\);/g, 'background: #005a34;');

// Product tag background to light green
content = content.replace(/background: #e5e7eb;/g, 'background: #e8f5e9;');
content = content.replace(/border: 1px solid rgba\(245, 158, 11,0\.35\);/g, 'border: 1px solid #007a4b;');
// Product tag text to dark green
content = content.replace(/color: var\(--gold\);\s*background: #e8f5e9;/g, 'color: #005a34;\n  background: #e8f5e9;');

// Stats grid background update
content = content.replace(/border: 1px solid rgba\(245, 158, 11, 0\.2\);/g, 'border: 1px solid rgba(0, 90, 52, 0.2);');

// Product grid shadows to be much lighter and softer
content = content.replace(/box-shadow: 0 4px 24px rgba\(0,0,0,0\.3\);/g, 'box-shadow: 0 4px 20px rgba(0, 90, 52, 0.08);');
content = content.replace(/box-shadow: 0 12px 40px rgba\(0,0,0,0\.45\);/g, 'box-shadow: 0 12px 30px rgba(0, 90, 52, 0.15);');

fs.writeFileSync(cssFile, content, 'utf8');
console.log('Refined CSS for light corporate theme.');
