const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend/src');

// 1. Update CompanyPage.jsx & HomePage.jsx Timber Section
function updateTimberSection(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace icon: "X" with image: "/images/wood/placeholder.jpg"
  content = content.replace(/icon:\s*"🌳"/g, 'image: "/images/products/2-5mm-core.jpg", // REPLACE WITH WOOD PHOTO/VIDEO URL');
  content = content.replace(/icon:\s*"🍃"/g, 'image: "/images/products/2-5mm-fali.jpg", // REPLACE WITH WOOD PHOTO/VIDEO URL');
  content = content.replace(/icon:\s*"🌿"/g, 'image: "/images/products/1-8mm-core.jpg", // REPLACE WITH WOOD PHOTO/VIDEO URL');
  content = content.replace(/icon:\s*"🪵"/g, 'image: "/images/products/1-8mm-fali.webp", // REPLACE WITH WOOD PHOTO/VIDEO URL');

  // Update rendering logic
  content = content.replace(
    /<div className="hp-pillar-icon"[^>]*>\{wood\.icon\}<\/div>/g,
    '<img src={wood.image} alt={wood.name} className="w-full h-32 object-cover rounded-t-xl mb-4" />'
  );
  content = content.replace(
    /<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-\[#f0fdf4\] text-3xl shadow-sm">\s*\{wood\.icon\}\s*<\/div>/g,
    '<img src={wood.image} alt={wood.name} className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm" />'
  );

  // For HomePage.jsx, also remove the p-6 padding on the card if we want the image to go to the edge, but rounded-t-xl works.
  
  fs.writeFileSync(filePath, content, 'utf8');
}

updateTimberSection(path.join(baseDir, 'pages/CompanyPage.jsx'));
updateTimberSection(path.join(baseDir, 'pages/HomePage.jsx'));

// 2. Update productDetails.js to include gallery and video placeholders
const productDetailsPath = path.join(baseDir, 'productDetails.js');
let pdContent = fs.readFileSync(productDetailsPath, 'utf8');

// Insert gallery and video into every product object
pdContent = pdContent.replace(/features:\s*\[/g, 'gallery: [\n      "/images/products/2-5mm-core.jpg", // Replace with actual photo\n      "/images/products/2-5mm-fali.jpg", // Replace with actual photo\n      "/images/products/1-8mm-core.jpg", // Replace with actual photo\n      "/images/products/1-8mm-fali.webp", // Replace with actual photo\n    ],\n    video: "/videos/sample-video.mp4", // Replace with actual video\n    features: [');

fs.writeFileSync(productDetailsPath, pdContent, 'utf8');

// 3. Update ProductDetailPage.jsx
const pdPagePath = path.join(baseDir, 'ProductDetailPage.jsx');
let pdPageContent = fs.readFileSync(pdPagePath, 'utf8');

// First, convert the dark theme to light theme for ProductDetailPage while we are here, to be consistent
pdPageContent = pdPageContent.replace(/bg-forest/g, 'bg-[#f8fafc]');
pdPageContent = pdPageContent.replace(/text-cream/g, 'text-gray-900');
pdPageContent = pdPageContent.replace(/text-cream\/85/g, 'text-gray-600');
pdPageContent = pdPageContent.replace(/text-cream\/90/g, 'text-gray-700');
pdPageContent = pdPageContent.replace(/bg-pine\/40/g, 'bg-white');
pdPageContent = pdPageContent.replace(/bg-pine\/45/g, 'bg-[#f0fdf4]');
pdPageContent = pdPageContent.replace(/border-gold\/25/g, 'border-gray-200');
pdPageContent = pdPageContent.replace(/border-gold\/20/g, 'border-gray-200');
pdPageContent = pdPageContent.replace(/bg-black\/30/g, 'bg-white/95');
pdPageContent = pdPageContent.replace(/bg-forest\/80/g, 'bg-white');
pdPageContent = pdPageContent.replace(/bg-forest\/85/g, 'bg-white');
pdPageContent = pdPageContent.replace(/from-black\/20 via-black\/35 to-forest\/70/g, 'from-transparent to-[#f8fafc]');

// Add the Media Gallery Section after Specifications
const mediaGallerySection = `
      {/* ── Media Gallery & Video ── */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        <h2 className="font-heading text-2xl text-gold mb-6">Product Media Gallery</h2>
        
        {/* Video Player */}
        {product.video && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-8 w-full overflow-hidden rounded-2xl border border-gray-200 shadow-premium bg-black"
          >
            <video 
              controls 
              className="w-full max-h-[500px] object-contain"
              poster={product.image}
            >
              <source src={product.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        )}

        {/* 4-Image Photo Gallery */}
        {product.gallery && product.gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.gallery.map((imgSrc, i) => (
              <motion.img
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                src={imgSrc}
                alt={\`\${product.name} Gallery \${i+1}\`}
                className="h-48 w-full rounded-xl border border-gray-200 object-cover shadow-sm transition hover:scale-105"
              />
            ))}
          </div>
        )}
      </section>
`;

pdPageContent = pdPageContent.replace(/<\/div>\s*<\/PageLayout>/, mediaGallerySection + '      </div>\n    </PageLayout>');

fs.writeFileSync(pdPagePath, pdPageContent, 'utf8');

console.log('Successfully updated the codebase to support real media files (photos/videos).');
