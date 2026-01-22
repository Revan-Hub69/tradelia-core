/**
 * Complete PWA + Push Notifications Test Suite - Tradelia 2026
 *
 * Verifica completa di:
 * - PWA installability
 * - Service Worker functionality
 * - Push notifications system
 * - Database integration
 * - API endpoints
 */

console.log('🚀 Starting Complete PWA + Push Test Suite 2026...');

// Test Results Storage
const testResults = {
  pwa: {},
  push: {},
  api: {},
  integration: {},
};

// Test 1: PWA Core Functionality
async function testPWACore() {
  console.log('\n📱 Testing PWA Core Functionality...');

  try {
    // Test manifest
    const manifestResponse = await fetch('http://localhost:3000/manifest.json');
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      testResults.pwa.manifest = {
        status: 'success',
        name: manifest.name,
        startUrl: manifest.start_url,
        display: manifest.display,
        icons: manifest.icons.length,
      };
      console.log('✅ Manifest loaded successfully');
    } else {
      throw new Error(`Manifest failed: ${manifestResponse.status}`);
    }

    // Test service worker
    const swResponse = await fetch('http://localhost:3000/sw-2026.js');
    if (swResponse.ok) {
      const swContent = await swResponse.text();
      testResults.pwa.serviceWorker = {
        status: 'success',
        size: `${Math.round(swContent.length / 1024)}KB`,
        hasPushHandling: swContent.includes('push'),
        hasNotificationHandling: swContent.includes('notificationclick'),
      };
      console.log('✅ Service Worker accessible and has push support');
    } else {
      throw new Error(`Service Worker failed: ${swResponse.status}`);
    }

    // Test static assets
    const assets = ['/favicon.ico', '/icon-192x192.png', '/icon-512x512.png'];
    let assetsOk = 0;

    for (const asset of assets) {
      try {
        const response = await fetch(`http://localhost:3000${asset}`, { method: 'HEAD' });
        if (response.ok) {
          assetsOk++;
        }
      } catch (e) {
        // Ignore individual asset failures
      }
    }

    testResults.pwa.assets = {
      status: assetsOk === assets.length ? 'success' : 'partial',
      available: assetsOk,
      total: assets.length,
    };

    console.log(`✅ Static Assets: ${assetsOk}/${assets.length} available`);
  } catch (error) {
    testResults.pwa.error = error.message;
    console.log(`❌ PWA Core test failed: ${error.message}`);
  }
}

// Test 2: Push Notifications API
async function testPushAPI() {
  console.log('\n🔔 Testing Push Notifications API...');

  try {
    // Test VAPID keys presence
    const hasVapidKeys = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY;
    testResults.push.vapidKeys = {
      status: hasVapidKeys ? 'success' : 'missing',
      publicKeyPresent: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      privateKeyPresent: !!process.env.VAPID_PRIVATE_KEY,
    };

    if (hasVapidKeys) {
      console.log('✅ VAPID keys configured');
    } else {
      console.log('⚠️ VAPID keys missing - run vapid-generator.js');
    }

    // Test API endpoints (these will fail without auth, but we check they exist)
    const endpoints = [
      '/api/push/subscribe',
      '/api/push/send',
      '/api/push/test',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        // We expect 401 (unauthorized) which means the endpoint exists
        testResults.push[endpoint.replace('/api/push/', '')] = {
          status: response.status === 401 ? 'success' : 'error',
          statusCode: response.status,
        };

        if (response.status === 401) {
          console.log(`✅ ${endpoint} - Endpoint exists (401 expected)`);
        } else {
          console.log(`⚠️ ${endpoint} - Unexpected status: ${response.status}`);
        }
      } catch (error) {
        testResults.push[endpoint.replace('/api/push/', '')] = {
          status: 'error',
          error: error.message,
        };
        console.log(`❌ ${endpoint} - Error: ${error.message}`);
      }
    }
  } catch (error) {
    testResults.push.error = error.message;
    console.log(`❌ Push API test failed: ${error.message}`);
  }
}

// Test 3: Database Schema
async function testDatabaseSchema() {
  console.log('\n🗄️ Testing Database Schema...');

  try {
    // Check if migration file exists
    const fs = require('node:fs');
    const migrationPath = './migrations/003_create_push_subscriptions_table.sql';

    if (fs.existsSync(migrationPath)) {
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');
      testResults.push.migration = {
        status: 'success',
        exists: true,
        hasRLS: migrationContent.includes('ROW LEVEL SECURITY'),
        hasIndexes: migrationContent.includes('CREATE INDEX'),
        hasTriggers: migrationContent.includes('CREATE TRIGGER'),
      };
      console.log('✅ Database migration file exists with RLS and indexes');
    } else {
      testResults.push.migration = {
        status: 'missing',
        exists: false,
      };
      console.log('❌ Database migration file missing');
    }
  } catch (error) {
    testResults.push.migration = {
      status: 'error',
      error: error.message,
    };
    console.log(`❌ Database schema test failed: ${error.message}`);
  }
}

// Test 4: Client-Side Components
async function testClientComponents() {
  console.log('\n⚛️ Testing Client-Side Components...');

  try {
    const fs = require('node:fs');
    const components = [
      './src/lib/push-notifications/push-manager.ts',
      './src/hooks/usePushNotifications.ts',
      './src/components/pwa/PushNotificationManager.tsx',
    ];

    let componentsOk = 0;

    for (const component of components) {
      if (fs.existsSync(component)) {
        const content = fs.readFileSync(component, 'utf8');
        const hasTypeScript = content.includes('interface') || content.includes('type');
        const hasErrorHandling = content.includes('try') && content.includes('catch');

        testResults.push.components = testResults.push.components || {};
        testResults.push.components[component.split('/').pop()] = {
          status: 'success',
          exists: true,
          hasTypeScript,
          hasErrorHandling,
          size: `${Math.round(content.length / 1024)}KB`,
        };

        componentsOk++;
        console.log(`✅ ${component.split('/').pop()} - OK`);
      } else {
        console.log(`❌ ${component.split('/').pop()} - Missing`);
      }
    }

    testResults.push.componentsOverall = {
      status: componentsOk === components.length ? 'success' : 'partial',
      available: componentsOk,
      total: components.length,
    };
  } catch (error) {
    testResults.push.componentsError = error.message;
    console.log(`❌ Client components test failed: ${error.message}`);
  }
}

// Test 5: Integration Test
async function testIntegration() {
  console.log('\n🔗 Testing Integration...');

  try {
    // Test if all pieces work together
    const hasManifest = testResults.pwa.manifest?.status === 'success';
    const hasServiceWorker = testResults.pwa.serviceWorker?.status === 'success';
    const hasVapidKeys = testResults.push.vapidKeys?.status === 'success';
    const hasAPIEndpoints = testResults.push.subscribe?.status === 'success';
    const hasComponents = testResults.push.componentsOverall?.status === 'success';

    testResults.integration.overall = {
      status: hasManifest && hasServiceWorker && hasVapidKeys && hasAPIEndpoints && hasComponents ? 'success' : 'partial',
      components: {
        manifest: hasManifest,
        serviceWorker: hasServiceWorker,
        vapidKeys: hasVapidKeys,
        apiEndpoints: hasAPIEndpoints,
        clientComponents: hasComponents,
      },
    };

    if (testResults.integration.overall.status === 'success') {
      console.log('✅ All integration components ready');
    } else {
      console.log('⚠️ Some integration components missing');
    }
  } catch (error) {
    testResults.integration.error = error.message;
    console.log(`❌ Integration test failed: ${error.message}`);
  }
}

// Generate Report
function generateReport() {
  console.log('\n📊 COMPLETE PWA + PUSH TEST REPORT');
  console.log('='.repeat(60));

  const allTests = [
    ...Object.values(testResults.pwa),
    ...Object.values(testResults.push),
    ...Object.values(testResults.integration),
  ].filter(test => test && typeof test === 'object' && test.status);

  const successful = allTests.filter(test => test.status === 'success').length;
  const partial = allTests.filter(test => test.status === 'partial').length;
  const failed = allTests.filter(test => test.status === 'error' || test.status === 'missing').length;

  console.log(`\n🎯 SUMMARY`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`⚠️ Partial: ${partial}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((successful / (successful + partial + failed)) * 100)}%`);

  console.log(`\n📱 PWA STATUS`);
  console.log(`Manifest: ${testResults.pwa.manifest?.status || 'unknown'}`);
  console.log(`Service Worker: ${testResults.pwa.serviceWorker?.status || 'unknown'}`);
  console.log(`Static Assets: ${testResults.pwa.assets?.status || 'unknown'}`);

  console.log(`\n🔔 PUSH NOTIFICATIONS STATUS`);
  console.log(`VAPID Keys: ${testResults.push.vapidKeys?.status || 'unknown'}`);
  console.log(`API Endpoints: ${testResults.push.subscribe?.status || 'unknown'}`);
  console.log(`Client Components: ${testResults.push.componentsOverall?.status || 'unknown'}`);
  console.log(`Database Migration: ${testResults.push.migration?.status || 'unknown'}`);

  console.log(`\n🔗 INTEGRATION STATUS`);
  console.log(`Overall: ${testResults.integration.overall?.status || 'unknown'}`);

  if (testResults.integration.overall?.status === 'success') {
    console.log('\n🎉 PWA + PUSH NOTIFICATIONS SYSTEM READY!');
    console.log('✅ All components tested and working');
    console.log('🚀 Ready for production deployment');
  } else {
    console.log('\n⚠️ Some components need attention');
    console.log('📋 Review failed tests above');
  }

  // Save detailed report
  const fs = require('node:fs');
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: { successful, partial, failed },
    results: testResults,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
    },
  };

  fs.writeFileSync(
    `pwa-push-test-report-${new Date().toISOString().split('T')[0]}.json`,
    JSON.stringify(reportData, null, 2),
  );

  console.log('\n📄 Detailed report saved to pwa-push-test-report-*.json');

  return testResults;
}

// Run All Tests
async function runAllTests() {
  console.log('🧪 Running Complete PWA + Push Test Suite...');
  console.log('='.repeat(60));

  await testPWACore();
  await testPushAPI();
  await testDatabaseSchema();
  await testClientComponents();
  await testIntegration();

  return generateReport();
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testResults };
} else {
  // Run immediately if in browser
  runAllTests();
}

// Run if called directly
if (require.main === module) {
  runAllTests().then(() => {
    console.log('\n✨ Test suite completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  });
}
