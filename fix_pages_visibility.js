const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/src/pages');

function fixJSXFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixJSXFiles(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // A safe way is to change text-cream to text-gray-900 and text-cream/X to text-gray-700
      // UNLESS they are in a class string that contains 'bg-forest' or 'bg-pine'
      
      // Let's just do a global replace for all `text-cream` to `text-gray-900`
      // and then fix the cards that need to be light.
      // But actually, Greenply uses dark text even on light green cards.
      // If we change text-cream to text-gray-900, it will look great on white and light green.
      // And on bg-forest (dark green) cards, text-gray-900 might be hard to read.
      
      // Let's replace `text-cream` with `text-gray-900` where it's explicitly set.
      content = content.replace(/text-cream(?!\/)/g, 'text-gray-900');
      
      // For text-cream with opacity, like text-cream/80, text-cream/90, replace with text-gray-700
      content = content.replace(/text-cream\/(?:80|85|88|90)/g, 'text-gray-700');
      
      // Now, for cards that use bg-forest/80, we should ensure text is white.
      // Instead of parsing HTML, let's just make ALL those cards bg-white or bg-pine/10
      // Greenply has white cards.
      content = content.replace(/bg-forest\/(?:75|80)/g, 'bg-white');
      content = content.replace(/bg-pine\/40/g, 'bg-[#f0fdf4]');
      content = content.replace(/bg-pine\/45/g, 'bg-[#f8fafc]');
      
      // Also fix any `style={{color:'#f7f7f5'}}` inline styles making text white
      content = content.replace(/style={{[^}]*color:\s*['"]#f7f7f5['"][^}]*}}/g, '');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

fixJSXFiles(pagesDir);
console.log('Fixed visibility issues in all pages.');
