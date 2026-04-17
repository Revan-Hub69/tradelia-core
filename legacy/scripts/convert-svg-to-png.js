/**
 * Convert SVG icons to PNG using Sharp
 */

const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

async function convertSVGToPNG() {
  console.log('🔄 Converting SVG icons to PNG...');

  const icons = [
    { input: 'icon-192x192.svg', output: 'icon-192x192.png', size: 192 },
    { input: 'icon-512x512.svg', output: 'icon-512x512.png', size: 512 },
    { input: 'icon-192x192-maskable.svg', output: 'icon-192x192-maskable.png', size: 192 },
    { input: 'icon-512x512-maskable.svg', output: 'icon-512x512-maskable.png', size: 512 },
  ];

  const publicDir = path.join(__dirname, '..', 'public');

  for (const icon of icons) {
    const inputPath = path.join(publicDir, icon.input);
    const outputPath = path.join(publicDir, icon.output);

    try {
      if (fs.existsSync(inputPath)) {
        await sharp(inputPath)
          .resize(icon.size, icon.size)
          .png()
          .toFile(outputPath);

        console.log(`✅ Created ${icon.output}`);
      } else {
        console.log(`⚠️ SVG not found: ${icon.input}`);
      }
    } catch (error) {
      console.error(`❌ Failed to convert ${icon.input}:`, error.message);
    }
  }

  console.log('✅ PNG conversion complete!');
}

// Run if called directly
if (require.main === module) {
  convertSVGToPNG().catch(console.error);
}

module.exports = { convertSVGToPNG };
