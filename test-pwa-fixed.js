/**
 * PWA Fix Verification Test
 *
 * Tests that service worker no longer interferes with Next.js static assets
 * and PWA install prompt works correctly
 */

const puppeteer = require('puppeteer');

async function testPWAFixed() {
  console.log('🔧 Testing PWA fixes...\n');

  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
  });

  const page = await browser.newPage();

  // Listen for console errors
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('❌ Console Error:', msg.text());
    }
  });

  // Listen for network failures
  const networkFailures = [];
  page.on('response', (response) => {
    if (!response.ok() && response.url().includes('/_next/')) {
      networkFailures.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      });
      console.log('❌ Network Failure:', response.url(), response.status());
    }
  });

  try {
    console.log('1. Loading dashboard page...');
    await page.goto('http://localhost:3000/en/dashboard', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for page to fully load
    await page.waitForTimeout(3000);

    console.log('2. Checking for MIME type errors...');
    const mimeErrors = errors.filter(error =>
      error.includes('MIME type')
      || error.includes('ChunkLoadError')
      || error.includes('net::ERR_ABORTED'),
    );

    if (mimeErrors.length === 0) {
      console.log('✅ No MIME type errors found!');
    } else {
      console.log('❌ MIME type errors still present:');
      mimeErrors.forEach(error => console.log('  -', error));
    }

    console.log('3. Checking service worker registration...');
    const swStatus = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then((registration) => {
            resolve({
              registered: !!registration,
              scope: registration?.scope || null,
              state: registration?.active?.state || null,
            });
          });
        } else {
          resolve({ registered: false, scope: null, state: null });
        }
      });
    });

    console.log('Service Worker Status:', swStatus);

    console.log('4. Checking PWA install prompt...');

    // Wait for PWA provider to initialize
    await page.waitForTimeout(2000);

    // Check if install prompt is available
    const pwaStatus = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Check if beforeinstallprompt event was captured
        const installPromptAvailable = window.deferredPrompt !== undefined;

        // Check if PWA debug info is visible
        const debugElement = document.querySelector('[class*="PWA:"]');
        const debugInfo = debugElement ? debugElement.textContent : null;

        resolve({
          installPromptAvailable,
          debugInfo,
          isStandalone: window.matchMedia('(display-mode: standalone)').matches,
          userAgent: navigator.userAgent,
        });
      });
    });

    console.log('PWA Status:', pwaStatus);

    console.log('5. Testing static asset loading...');

    // Check if CSS and JS files are loading correctly
    const staticAssets = await page.evaluate(() => {
      const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const jsScripts = Array.from(document.querySelectorAll('script[src*="/_next/"]'));

      return {
        cssCount: cssLinks.length,
        jsCount: jsScripts.length,
        cssLoaded: cssLinks.every(link => !link.disabled),
        sampleCssUrl: cssLinks[0]?.href || null,
        sampleJsUrl: jsScripts[0]?.src || null,
      };
    });

    console.log('Static Assets:', staticAssets);

    // Summary
    console.log('\n📊 TEST SUMMARY:');
    console.log('================');
    console.log(`MIME Errors: ${mimeErrors.length === 0 ? '✅ FIXED' : '❌ STILL PRESENT'}`);
    console.log(`Network Failures: ${networkFailures.length === 0 ? '✅ NONE' : `❌ ${networkFailures.length} failures`}`);
    console.log(`Service Worker: ${swStatus.registered ? '✅ REGISTERED' : '❌ NOT REGISTERED'}`);
    console.log(`Static Assets: ${staticAssets.cssCount > 0 && staticAssets.jsCount > 0 ? '✅ LOADING' : '❌ ISSUES'}`);

    if (mimeErrors.length === 0 && networkFailures.length === 0) {
      console.log('\n🎉 PWA FIXES SUCCESSFUL! Service worker no longer interferes with Next.js assets.');
    } else {
      console.log('\n⚠️  Issues still present. Check the errors above.');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
testPWAFixed().catch(console.error);
