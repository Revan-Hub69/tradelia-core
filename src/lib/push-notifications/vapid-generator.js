/**
 * VAPID Keys Generator for Tradelia PWA 2026
 * 
 * Generates VAPID keys for Web Push API
 * Run once: node src/lib/push-notifications/vapid-generator.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateVAPIDKeys() {
  // Generate ECDSA P-256 key pair
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'der'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der'
    }
  });

  // Convert to base64url format
  const publicKeyBase64 = publicKey.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  const privateKeyBase64 = privateKey.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return {
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64
  };
}

function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const keys = generateVAPIDKeys();
  
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Remove existing VAPID keys
  envContent = envContent.replace(/^NEXT_PUBLIC_VAPID_PUBLIC_KEY=.*$/gm, '');
  envContent = envContent.replace(/^VAPID_PRIVATE_KEY=.*$/gm, '');
  
  // Add new VAPID keys
  envContent += `\n# VAPID Keys for Push Notifications (Generated ${new Date().toISOString()})\n`;
  envContent += `NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}\n`;
  envContent += `VAPID_PRIVATE_KEY=${keys.privateKey}\n`;
  
  // Clean up extra newlines
  envContent = envContent.replace(/\n\n+/g, '\n\n').trim() + '\n';
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ VAPID keys generated and saved to .env.local');
  console.log(`📱 Public Key: ${keys.publicKey.substring(0, 20)}...`);
  console.log(`🔐 Private Key: ${keys.privateKey.substring(0, 20)}...`);
  console.log('\n🚀 You can now use push notifications in your PWA!');
}

// Run if called directly
if (require.main === module) {
  updateEnvFile();
}

module.exports = { generateVAPIDKeys, updateEnvFile };