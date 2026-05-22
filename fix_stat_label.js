const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'frontend/src/index.css');

if (fs.existsSync(cssFile)) {
  let css = fs.readFileSync(cssFile, 'utf8');

  // Fix hp-stat-label which is light text on light background
  css = css.replace(/color: rgba\(248, 250, 252,0\.65\);/g, 'color: #4b5563;');

  // Also verify hp-hero-sub is white text (it's over a dark image)
  css = css.replace(/color: rgba\(248, 250, 252, 0\.82\);/g, 'color: rgba(255, 255, 255, 0.9);');

  fs.writeFileSync(cssFile, css, 'utf8');
  console.log('Fixed hp-stat-label visibility');
}
