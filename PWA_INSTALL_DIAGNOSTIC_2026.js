/**
 * PWA Install Diagnostic Tool - 2026
 * Diagnoses why PWA install prompt is not showing
 */

console.log('🔍 PWA Install Diagnostic Starting...');

// Check 1: Manifest validation
console.log('\n1. 📋 MANIFEST VALIDATION');
fetch('/manifest.json')
  .then(response => response.json())
  .then((manifest) => {
    console.log('✅ Manifest loaded successfully');
    console.log('📍 Start URL:', manifest.start_url);
    console.log('📱 Display mode:', manifest.display);
    console.log('🎨 Theme color:', manifest.theme_color);
    console.log('🖼️ Icons count:', manifest.icons?.length || 0);

    // Check for required fields
    const required = ['name', 'start_url', 'display', 'icons'];
    const missing = required.filter(field => !manifest[field]);

    if (missing.length > 0) {
      console.log('❌ Missing required fields:', missing);
    } else {
      console.log('✅ All required manifest fields present');
    }

    // Check icon requirements
    const hasValidIcons = manifest.icons?.some((icon) => {
      const size = Number.parseInt(icon.sizes);
      return size >= 192;
    });

    if (hasValidIcons) {
      console.log('✅ Valid icons (192px+) found');
    } else {
      console.log('❌ No valid icons found (need 192px+)');
    }
  })
  .catch((error) => {
    console.log('❌ Manifest loading failed:', error);
  });

// Check 2: Service Worker status
console.log('\n2. ⚙️ SERVICE WORKER STATUS');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length > 0) {
      console.log('✅ Service Worker registered');
      registrations.forEach((registration, index) => {
        console.log(`   SW ${index + 1}:`, registration.scope);
        console.log('   State:', registration.active?.state || 'inactive');
      });
    } else {
      console.log('❌ No Service Worker registered');
    }
  });
} else {
  console.log('❌ Service Worker not supported');
}

// Check 3: HTTPS requirement
console.log('\n3. 🔒 HTTPS VALIDATION');
if (location.protocol === 'https:' || location.hostname === 'localhost') {
  console.log('✅ Secure context (HTTPS or localhost)');
} else {
  console.log('❌ Not secure context - PWA requires HTTPS');
}

// Check 4: beforeinstallprompt event
console.log('\n4. 📱 INSTALL PROMPT EVENT');
let installPromptReceived = false;

window.addEventListener('beforeinstallprompt', (e) => {
  installPromptReceived = true;
  console.log('✅ beforeinstallprompt event fired!');
  console.log('🎯 PWA is installable');

  // Store the event for manual triggering
  window.deferredPrompt = e;
  e.preventDefault();

  // Show custom install button
  console.log('💡 You can now trigger install manually');
});

// Check after 5 seconds if event was received
setTimeout(() => {
  if (!installPromptReceived) {
    console.log('❌ beforeinstallprompt event NOT received');
    console.log('🔍 Possible reasons:');
    console.log('   - PWA already installed');
    console.log('   - Manifest or SW issues');
    console.log('   - Insufficient user engagement');
    console.log('   - Browser-specific requirements not met');
  }
}, 5000);

// Check 5: User engagement heuristics
console.log('\n5. 👤 USER ENGAGEMENT');
const visitCount = localStorage.getItem('pwa-visit-count') || 0;
const newCount = Number.parseInt(visitCount) + 1;
localStorage.setItem('pwa-visit-count', newCount.toString());

console.log('📊 Visit count:', newCount);
if (newCount >= 2) {
  console.log('✅ Sufficient user engagement (2+ visits)');
} else {
  console.log('⚠️ May need more user engagement');
}

// Check 6: Browser compatibility
console.log('\n6. 🌐 BROWSER COMPATIBILITY');
const userAgent = navigator.userAgent;
const isChrome = userAgent.includes('Chrome');
const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
const isFirefox = userAgent.includes('Firefox');
const isEdge = userAgent.includes('Edge');

console.log('🔍 Browser:', {
  Chrome: isChrome,
  Safari: isSafari,
  Firefox: isFirefox,
  Edge: isEdge,
});

if (isChrome || isEdge) {
  console.log('✅ Full PWA support');
} else if (isSafari) {
  console.log('⚠️ Limited PWA support (no beforeinstallprompt)');
  console.log('💡 Safari uses "Add to Home Screen" in share menu');
} else if (isFirefox) {
  console.log('⚠️ Basic PWA support');
} else {
  console.log('❓ Unknown browser PWA support');
}

// Check 7: Network conditions
console.log('\n7. 🌐 NETWORK STATUS');
if ('connection' in navigator) {
  const connection = navigator.connection;
  console.log('📶 Connection type:', connection.effectiveType);
  console.log('📊 Downlink:', connection.downlink, 'Mbps');
} else {
  console.log('📶 Network API not supported');
}

console.log('🔄 Online status:', navigator.onLine ? 'Online' : 'Offline');

// Check 8: Storage and permissions
console.log('\n8. 💾 STORAGE & PERMISSIONS');
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then((estimate) => {
    console.log('💾 Storage quota:', Math.round(estimate.quota / 1024 / 1024), 'MB');
    console.log('💾 Storage used:', Math.round(estimate.usage / 1024 / 1024), 'MB');
  });
}

// Manual install function
window.triggerPWAInstall = function () {
  console.log('\n🚀 MANUAL INSTALL TRIGGER');

  if (window.deferredPrompt) {
    console.log('📱 Triggering install prompt...');
    window.deferredPrompt.prompt();

    window.deferredPrompt.userChoice.then((choiceResult) => {
      console.log('👤 User choice:', choiceResult.outcome);
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      window.deferredPrompt = null;
    });
  } else {
    console.log('❌ No deferred prompt available');
    console.log('💡 Try: window.triggerPWAInstall() after page load');
  }
};

// Summary
setTimeout(() => {
  console.log('\n📋 DIAGNOSTIC SUMMARY');
  console.log('🔧 To fix PWA install issues:');
  console.log('1. Ensure all manifest fields are valid');
  console.log('2. Verify service worker is active');
  console.log('3. Check HTTPS requirement');
  console.log('4. Increase user engagement (multiple visits)');
  console.log('5. Test in Chrome/Edge for full support');
  console.log('\n💡 Manual install: window.triggerPWAInstall()');
}, 6000);

export default {};
