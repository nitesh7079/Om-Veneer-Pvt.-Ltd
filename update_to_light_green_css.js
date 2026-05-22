const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'frontend/src/index.css');

let content = fs.readFileSync(cssFile, 'utf8');

// Root variables and base body colors
content = content.replace(/:root \{\s*color: #f8fafc;\s*background-color: #0f172a;\s*\}/g, `:root {\n  color: #111827;\n  background-color: #ffffff;\n}`);
content = content.replace(/background:\s*radial-gradient\(circle at 12% 18%, rgba\(255, 255, 255, 0\.05\), transparent 44%\),\s*radial-gradient\(circle at 86% 82%, rgba\(245, 158, 11, 0\.15\), transparent 40%\),\s*#0f172a;/g, `background:\n    radial-gradient(circle at 12% 18%, rgba(0, 90, 52, 0.05), transparent 44%),\n    radial-gradient(circle at 86% 82%, rgba(0, 122, 75, 0.03), transparent 40%),\n    #ffffff;`);
content = content.replace(/color: #f8fafc;/g, `color: #111827;`);

// Public layout
content = content.replace(/\.public-layout \{\s*color: #f8fafc !important;\s*\}/g, `.public-layout {\n  color: #111827 !important;\n}`);

// Nav link
content = content.replace(/\.site-nav-link \{\s*color: rgba\(248, 250, 252, 0\.9\) !important;\s*\}/g, `.site-nav-link {\n  color: #111827 !important;\n}`);
content = content.replace(/\.site-nav-link:hover \{\s*color: #f59e0b !important;\s*\}/g, `.site-nav-link:hover {\n  color: #005a34 !important;\n}`);

// Premium root variables
content = content.replace(/--gold: #f59e0b;/g, `--gold: #d4af37;`);
content = content.replace(/--gold-light: #fbbf24;/g, `--gold-light: #e6c863;`);
content = content.replace(/--gold-dim: rgba\(245, 158, 11, 0\.25\);/g, `--gold-dim: rgba(212, 175, 55, 0.25);`);
content = content.replace(/--forest: #0f172a;/g, `--forest: #005a34;`);
content = content.replace(/--forest-mid: #1e293b;/g, `--forest-mid: #007a4b;`);
content = content.replace(/--pine: #334155;/g, `--pine: #e8f5e9;`);
content = content.replace(/--cream: #f8fafc;/g, `--cream: #111827;`);
content = content.replace(/--cream-dim: rgba\(248, 250, 252, 0\.75\);/g, `--cream-dim: #4b5563;`);

// Specific backgrounds and sections to make light
content = content.replace(/rgba\(30,\s*41,\s*59,\s*0\.6\)/g, '#ffffff'); // product cards bg
content = content.replace(/rgba\(30, 41, 59, 0\.6\)/g, '#ffffff');
content = content.replace(/linear-gradient\(135deg, rgba\(30,41,59,0\.85\) 0%, rgba\(15,23,42,0\.6\) 100%\)/g, '#f8fafc'); // split section
content = content.replace(/linear-gradient\(180deg, rgba\(30,41,59,0\.7\) 0%, rgba\(15,23,42,0\.4\) 100%\)/g, '#f1f5f9'); // section alt
content = content.replace(/rgba\(15, 23, 42, 0\.5\)/g, '#f8fafc'); // stats bg
content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.75\)/g, '#e5e7eb'); // tags
content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.85\)/g, 'rgba(0, 0, 0, 0.3)'); // overlays
content = content.replace(/rgba\(15,\s*23,\s*42,\s*0\.95\)/g, 'rgba(255, 255, 255, 0.95)'); // marquee gradient
content = content.replace(/linear-gradient\(to top, rgba\(15,23,42,0\.95\) 0%, transparent 100%\)/g, 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)');
content = content.replace(/linear-gradient\(to top, rgba\(15,23,42,0\.85\) 0%, transparent 60%\)/g, 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)');

// Trust bar
content = content.replace(/rgba\(248, 250, 252, 0\.75\)/g, '#ffffff');

// Update border colors
content = content.replace(/rgba\(245, 158, 11, 0\.18\)/g, '#e2e8f0');
content = content.replace(/rgba\(245, 158, 11, 0\.12\)/g, '#e2e8f0');

fs.writeFileSync(cssFile, content, 'utf8');
console.log('Updated index.css to Light Corporate Green theme.');
