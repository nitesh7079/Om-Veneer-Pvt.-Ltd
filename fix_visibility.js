const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'frontend/src/index.css');
const headerFile = path.join(__dirname, 'frontend/src/components/SiteHeader.jsx');
const footerFile = path.join(__dirname, 'frontend/src/components/SiteFooter.jsx');

// 1. Fix CSS
if (fs.existsSync(cssFile)) {
  let css = fs.readFileSync(cssFile, 'utf8');

  // Process Card
  css = css.replace(/background: rgba\(26,\s*32,\s*48,\s*0\.7\);/g, 'background: #ffffff;');
  css = css.replace(/border: 1px solid rgba\(245, 158, 11, 0\.15\);/g, 'border: 1px solid #e2e8f0;');
  
  // Pillars Card
  css = css.replace(/background: rgba\(26,\s*32,\s*48,\s*0\.5\);/g, 'background: #ffffff;');

  // Table
  css = css.replace(/background: rgba\(30,\s*41,\s*59,\s*0\.55\);/g, 'background: #ffffff;');
  css = css.replace(/border-bottom: 1px solid rgba\(245, 158, 11, 0\.08\);/g, 'border-bottom: 1px solid #e2e8f0;');
  css = css.replace(/background: linear-gradient\(135deg, rgba\(245, 158, 11, 0\.25\) 0%, rgba\(245, 158, 11, 0\.1\) 100%\);/g, 'background: #005a34;');
  css = css.replace(/\.hp-table th \{[\s\S]*?color: var\(--gold\);/g, (match) => match.replace('color: var(--gold);', 'color: #ffffff;'));

  // CTA Section
  css = css.replace(/background: linear-gradient\(180deg, rgba\(15,\s*23,\s*42,0\.4\) 0%, rgba\(30,\s*41,\s*59,0\.9\) 100%\);/g, 'background: #005a34;');
  css = css.replace(/\.hp-cta-title \{\s*[\s\S]*?color: var\(--cream\);\s*[\s\S]*?\}/g, (match) => match.replace('color: var(--cream);', 'color: #ffffff;'));
  css = css.replace(/\.hp-cta-desc \{\s*[\s\S]*?color: var\(--cream-dim\);\s*[\s\S]*?\}/g, (match) => match.replace('color: var(--cream-dim);', 'color: rgba(255, 255, 255, 0.9);'));

  fs.writeFileSync(cssFile, css, 'utf8');
}

// 2. Fix Header
if (fs.existsSync(headerFile)) {
  let header = fs.readFileSync(headerFile, 'utf8');
  // Change dropdown from bg-forest/95 to bg-white
  header = header.replace(/bg-forest\/95/g, 'bg-white');
  header = header.replace(/border-gold\/30/g, 'border-gray-200');
  fs.writeFileSync(headerFile, header, 'utf8');
}

// 3. Fix Footer
if (fs.existsSync(footerFile)) {
  let footer = fs.readFileSync(footerFile, 'utf8');
  // Change text-cream to text-white
  footer = footer.replace(/text-cream\/85/g, 'text-white/85');
  footer = footer.replace(/text-cream\/80/g, 'text-white/80');
  footer = footer.replace(/text-cream\/75/g, 'text-white/75');
  fs.writeFileSync(footerFile, footer, 'utf8');
}

console.log('Visibility fixes applied.');
