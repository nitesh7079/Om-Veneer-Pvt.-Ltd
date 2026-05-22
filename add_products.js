const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend/src');

// 1. Update productImageLinks.js
const imageLinksPath = path.join(baseDir, 'productImageLinks.js');
let imageLinksContent = fs.readFileSync(imageLinksPath, 'utf8');
const newImageLinks = `
  "2.4mm Core": "/images/products/2-5mm-core.jpg",
  "2.4mm Fali": "/images/products/2-5mm-fali.jpg",
  "2.6mm Core": "/images/products/2-5mm-core.jpg",
  "2.6mm Fali": "/images/products/2-5mm-fali.jpg",
  "2.7mm Core": "/images/products/2-5mm-core.jpg",
  "2.7mm Fali": "/images/products/2-5mm-fali.jpg",
`;
imageLinksContent = imageLinksContent.replace(/};\s*export default/g, newImageLinks + '};\n\nexport default');
fs.writeFileSync(imageLinksPath, imageLinksContent, 'utf8');

// 2. Update siteData.js
const siteDataPath = path.join(baseDir, 'siteData.js');
let siteDataContent = fs.readFileSync(siteDataPath, 'utf8');
const newProductsSiteData = [2.4, 2.6, 2.7].map((size, index) => {
  return `  {
    _id: "new-${index}-core",
    name: "${size}mm Core",
    description: "Premium ${size}mm core veneer for strong plywood structure and consistent performance.",
    image: productImageLinks["${size}mm Core"],
  },
  {
    _id: "new-${index}-fali",
    name: "${size}mm Fali",
    description: "Reliable ${size}mm fali veneer with clean grain and dependable adhesive performance.",
    image: productImageLinks["${size}mm Fali"],
  },`;
}).join('\n');
siteDataContent = siteDataContent.replace(/];\s*export const galleryImages/g, newProductsSiteData + '\n];\n\nexport const galleryImages');
fs.writeFileSync(siteDataPath, siteDataContent, 'utf8');

// 3. Update HomePage.jsx
const homePagePath = path.join(baseDir, 'pages/HomePage.jsx');
let homePageContent = fs.readFileSync(homePagePath, 'utf8');
const newHomePageProducts = [2.4, 2.6, 2.7].map(size => {
  return `  { name: "${size}mm Core", tag: "Core Veneer", image: productImageLinks["${size}mm Core"] },\n  { name: "${size}mm Fali", tag: "Fali Veneer", image: productImageLinks["${size}mm Fali"] },`;
}).join('\n');
homePageContent = homePageContent.replace(/];\s*\/\* ── Animation Variants/g, newHomePageProducts + '\n];\n\n/* ── Animation Variants');
fs.writeFileSync(homePagePath, homePageContent, 'utf8');

// 4. Update productDetails.js
const productDetailsPath = path.join(baseDir, 'productDetails.js');
let productDetailsContent = fs.readFileSync(productDetailsPath, 'utf8');
const newProductDetails = [2.4, 2.6, 2.7].map(size => {
  return `  {
    name: "${size}mm Core",
    slug: "${size.toString().replace('.', '-')}-mm-core",
    image: productImageLinks["${size}mm Core"],
    description: "${size}mm Core veneer is designed for high-strength plywood manufacturing with stable thickness and consistent layer integrity.",
    features: [
      "Uniform thickness for better board consistency",
      "Strong bonding support during lamination",
      "Moisture-balanced material for stable performance",
      "Suitable for industrial plywood production",
    ],
    specifications: {
      Thickness: "${size}mm",
      Material: "Core Veneer",
      Application: "Plywood Core Layer",
      Quality: "Industrial Grade",
      Supply: "Nepal and India",
    },
    uses: [
      "Commercial plywood production",
      "Structural panel core assembly",
    ],
  },
  {
    name: "${size}mm Fali",
    slug: "${size.toString().replace('.', '-')}-mm-fali",
    image: productImageLinks["${size}mm Fali"],
    description: "${size}mm Fali veneer offers clean grain quality and dependable surface behavior, suitable for plywood units requiring consistency.",
    features: [
      "Balanced grain pattern",
      "Consistent finishing response",
      "Good adhesive compatibility",
      "Reliable quality for production cycles",
    ],
    specifications: {
      Thickness: "${size}mm",
      Material: "Fali Veneer",
      Application: "Plywood Layering",
      Quality: "Premium Supply Grade",
      Supply: "Nepal and India",
    },
    uses: [
      "General plywood manufacturing",
      "Panel layering for smooth finish",
    ],
  },`;
}).join('\n');
productDetailsContent = productDetailsContent.replace(/];\s*export const toProductSlug/g, newProductDetails + '\n];\n\nexport const toProductSlug');
fs.writeFileSync(productDetailsPath, productDetailsContent, 'utf8');

console.log('Successfully added all new products to the codebase.');
