const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend/src');

// 1. siteData.js
const siteDataPath = path.join(baseDir, 'siteData.js');
let siteData = fs.readFileSync(siteDataPath, 'utf8');
// Remove the Door Board Ply object from defaultProducts
siteData = siteData.replace(/\s*\{\s*_id:\s*"5",\s*name:\s*"Door Board Ply",[\s\S]*?\},/, '');
// Remove from galleryImages if it's there
siteData = siteData.replace(/\s*\{\s*src:\s*productImageLinks\["Door Board Ply"\],[\s\S]*?\},/, '');
// Remove from heroSlides
siteData = siteData.replace(/\s*productImageLinks\["Door Board Ply"\],/, '');
fs.writeFileSync(siteDataPath, siteData, 'utf8');

// 2. productDetails.js
const productDetailsPath = path.join(baseDir, 'productDetails.js');
let productDetails = fs.readFileSync(productDetailsPath, 'utf8');
// Remove the Door Board Ply object from productDetails array
productDetails = productDetails.replace(/\s*\{\s*name:\s*"Door Board Ply",[\s\S]*?uses:\s*\[[\s\S]*?\],\s*\},/, '');
fs.writeFileSync(productDetailsPath, productDetails, 'utf8');

// 3. HomePage.jsx
const homePagePath = path.join(baseDir, 'pages/HomePage.jsx');
let homePage = fs.readFileSync(homePagePath, 'utf8');
// Remove from products array
homePage = homePage.replace(/\s*\{\s*name:\s*"Door Board Ply",\s*tag:\s*"Door Board",\s*image:\s*productImageLinks\["Door Board Ply"\]\s*\},/, '');
fs.writeFileSync(homePagePath, homePage, 'utf8');

// 4. productImageLinks.js
const imageLinksPath = path.join(baseDir, 'productImageLinks.js');
let imageLinks = fs.readFileSync(imageLinksPath, 'utf8');
imageLinks = imageLinks.replace(/\s*"Door Board Ply":\s*"\/images\/products\/door-board-ply.webp",/, '');
fs.writeFileSync(imageLinksPath, imageLinks, 'utf8');

console.log('Removed Door Board Ply successfully.');
