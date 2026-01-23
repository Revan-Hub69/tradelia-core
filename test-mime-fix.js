/**
 * Quick MIME Type Fix Test
 *
 * Tests if static assets are served correctly by Next.js
 */

const fetch = require('node-fetch');

async function testMimeFix() {
  console.log('🔧 Testing MIME type fix...\n');

  try {
    // Test if the main page loads without errors
    console.log('1. Testing main page load...');
    const response = await fetch('http://localhost:3000/en/dashboard');

    if (response.ok) {
      console.log('✅ Main page loads successfully');

      const html = await response.text();

      // Check if CSS and JS assets are referenced correctly
      const cssMatches = html.match(/href="[^"]*\/_next\/static\/css\/[^"]*\.css"/g) || [];
      const jsMatches = html.match(/src="[^"]*\/_next\/static\/chunks\/[^"]*\.js"/g) || [];

      console.log(`📊 Found ${cssMatches.length} CSS references and ${jsMatches.length} JS references`);

      if (cssMatches.length > 0 && jsMatches.length > 0) {
        console.log('✅ Static assets are properly referenced');

        // Test a sample CSS file
        if (cssMatches.length > 0) {
          const cssUrl = cssMatches[0].match(/href="([^"]*)"/)[1];
          const fullCssUrl = `http://localhost:3000${cssUrl}`;

          console.log('2. Testing CSS asset loading...');
          const cssResponse = await fetch(fullCssUrl);

          if (cssResponse.ok) {
            const contentType = cssResponse.headers.get('content-type');
            console.log(`✅ CSS loads successfully with content-type: ${contentType}`);

            if (contentType && contentType.includes('text/css')) {
              console.log('✅ CSS has correct MIME type');
            } else {
              console.log('❌ CSS has incorrect MIME type');
            }
          } else {
            console.log(`❌ CSS failed to load: ${cssResponse.status}`);
          }
        }

        // Test a sample JS file
        if (jsMatches.length > 0) {
          const jsUrl = jsMatches[0].match(/src="([^"]*)"/)[1];
          const fullJsUrl = `http://localhost:3000${jsUrl}`;

          console.log('3. Testing JS asset loading...');
          const jsResponse = await fetch(fullJsUrl);

          if (jsResponse.ok) {
            const contentType = jsResponse.headers.get('content-type');
            console.log(`✅ JS loads successfully with content-type: ${contentType}`);

            if (contentType && (contentType.includes('javascript') || contentType.includes('application/javascript'))) {
              console.log('✅ JS has correct MIME type');
            } else {
              console.log('❌ JS has incorrect MIME type');
            }
          } else {
            console.log(`❌ JS failed to load: ${jsResponse.status}`);
          }
        }
      } else {
        console.log('❌ No static assets found in HTML');
      }
    } else {
      console.log(`❌ Main page failed to load: ${response.status}`);
    }

    console.log('\n🎯 MIME Fix Test Complete');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMimeFix().catch(console.error);
