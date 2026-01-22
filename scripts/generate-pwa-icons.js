/**
 * GENERATE PWA ICONS - TRADELIA LOGO BASED
 * 
 * Creates required PWA icons using the existing Tradelia logo:
 * - 192x192px PNG (required by Chrome)
 * - 512x512px PNG (required by Chrome)
 * - Maskable versions for better OS integration
 */

const fs = require('fs');
const path = require('path');

// Read the existing Tradelia logo
function getTradeliaLogo() {
  const logoPath = path.join(__dirname, '..', 'public', 'icon.svg');
  try {
    return fs.readFileSync(logoPath, 'utf8');
  } catch (error) {
    console.error('❌ Could not read Tradelia logo:', error.message);
    return null;
  }
}

function generatePWAIcons() {
  console.log('🎨 Generating PWA icons using Tradelia logo...');

  const originalLogo = getTradeliaLogo();
  if (!originalLogo) {
    console.error('❌ Cannot proceed without Tradelia logo');
    return;
  }

  console.log('✅ Found Tradelia logo');

  const icons = [
    { size: 192, filename: 'icon-192x192.png' },
    { size: 512, filename: 'icon-512x512.png' },
    { size: 192, filename: 'icon-192x192-maskable.png', maskable: true },
    { size: 512, filename: 'icon-512x512-maskable.png', maskable: true }
  ];

  console.log('📝 Icons to generate:');
  icons.forEach(icon => {
    console.log(`  - ${icon.filename} (${icon.size}x${icon.size}${icon.maskable ? ' maskable' : ''})`);
  });

  // Create SVG versions with proper sizing
  createTradeliaPWAIcons(icons, originalLogo);
}

function createTradeliaPWAIcons(icons, originalLogo) {
  console.log('🔧 Creating Tradelia PWA icons...');
  
  const createTradeliaSVGIcon = (size, maskable = false) => {
    const padding = maskable ? size * 0.1 : 0; // 10% padding for maskable
    const logoSize = size - (padding * 2);
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Extract the logo content (remove the outer SVG wrapper)
    const logoContent = originalLogo
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>/, '')
      .trim();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background for maskable icons -->
  ${maskable ? `<rect width="${size}" height="${size}" fill="#1D4ED8"/>` : ''}
  
  <!-- Tradelia logo centered and scaled -->
  <g transform="translate(${centerX - logoSize/2}, ${centerY - logoSize/2}) scale(${logoSize/32})">
    ${logoContent}
  </g>
</svg>`;
  };

  // Generate SVG files with Tradelia logo
  icons.forEach(icon => {
    const svgContent = createTradeliaSVGIcon(icon.size, icon.maskable);
    const svgPath = path.join(__dirname, '..', 'public', icon.filename.replace('.png', '.svg'));
    
    try {
      fs.writeFileSync(svgPath, svgContent);
      console.log(`✅ Created ${icon.filename.replace('.png', '.svg')}`);
    } catch (error) {
      console.error(`❌ Failed to create ${icon.filename}:`, error.message);
    }
  });

  // Also create a high-quality favicon
  createFavicon();

  console.log('\n📝 NEXT STEPS:');
  console.log('1. The SVG icons are ready and will work for PWA');
  console.log('2. For better compatibility, convert SVG to PNG using:');
  console.log('   - Online tools like convertio.co or cloudconvert.com');
  console.log('   - Or use Sharp/ImageMagick locally');
  console.log('3. Test PWA installability in Chrome DevTools');
  console.log('4. Verify icons appear correctly in install prompt');
}

function createFavicon() {
  // Create a 32x32 favicon that matches the PWA icons
  const faviconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#1D4ED8"/>
  <path d="M8 11h16M16 11v12" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <circle cx="22" cy="11" r="2" fill="#059669"/>
</svg>`;

  const faviconPath = path.join(__dirname, '..', 'public', 'favicon-updated.svg');
  
  try {
    fs.writeFileSync(faviconPath, faviconSVG);
    console.log('✅ Created updated favicon');
  } catch (error) {
    console.error('❌ Failed to create favicon:', error.message);
  }
}

// Run the generator
if (require.main === module) {
  generatePWAIcons();
}

module.exports = { generatePWAIcons };