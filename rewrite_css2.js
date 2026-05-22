const fs = require('fs');
const cssPath = 'frontend/src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const match = css.match(/\/\* ═══════════════════════════════════════════════[\s\S]*?ERP-Specific Styles \(Accounting Dashboard\)[\s\S]*?(?=\/\* ═══════════════════════════════════════════════════)/);

if (!match) {
    console.log('Could not find ERP section');
    process.exit(1);
}

const erpStyles = match[0];

const newCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --navy: #0A192F;
  --navy-light: #112240;
  --navy-lighter: #233554;
  --orange: #FF6B35;
  --orange-light: #FF8C61;
  --white: #FFFFFF;
  --gray-100: #F8FAFC;
  --gray-200: #E2E8F0;
  --gray-800: #1E293B;
  --text-main: #334155;
  color: var(--text-main);
  background-color: var(--white);
}

* {
  scroll-behavior: smooth;
}

html,
body,
#root {
  max-width: 100%;
  overflow-x: hidden;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--white);
  color: var(--text-main);
}

img,
video,
canvas,
svg {
  max-width: 100%;
}

.public-layout {
  color: var(--text-main) !important;
  background-color: var(--white);
}

.site-nav-link {
  color: var(--gray-800) !important;
  position: relative;
}

.site-nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--orange);
  transition: width 0.3s ease;
}

.site-nav-link:hover::after {
  width: 100%;
}

.site-nav-link:hover {
  color: var(--orange) !important;
}

/* Base Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif;
  color: var(--navy);
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* Custom Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--orange);
  color: var(--white) !important;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.875rem 2rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
  background-color: var(--orange-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: transparent;
  color: var(--navy) !important;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.875rem 2rem;
  border-radius: 0.25rem;
  border: 2px solid var(--navy);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: var(--navy);
  color: var(--white) !important;
  transform: translateY(-2px);
}

/* Layout Utilities */
.section-padding {
  padding: 6rem 0;
}

.diagonal-bg {
  position: relative;
  background-color: var(--navy);
  color: var(--white);
  z-index: 1;
  padding: 6rem 0;
}

.diagonal-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: inherit;
  transform: skewY(-3deg);
  transform-origin: 100%;
  z-index: -1;
}

.diagonal-bg h2, .diagonal-bg h3, .diagonal-bg p {
  color: var(--white);
}

/* Card Styles */
.modern-card {
  background: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid var(--gray-200);
}

.modern-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: var(--orange);
}

/* ═══════════════════════════════════════════════
   ERP-Specific Styles (Accounting Dashboard)
   ═══════════════════════════════════════════════ */
` + erpStyles.replace(/\/\* ═══════════════════════════════════════════════[\s\S]*?ERP-Specific Styles \(Accounting Dashboard\)[\s\S]*?═══════════════════════════════════════════════ \*\//, '');

fs.writeFileSync(cssPath, newCss);
console.log('CSS updated successfully');
