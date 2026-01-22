/**
 * Test OAuth Configuration
 * Esegui questo script per verificare che la configurazione OAuth sia corretta
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase OAuth Configuration...\n');

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`📍 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOAuth() {
  try {
    // Test basic connection
    console.log('\n🔗 Testing connection...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ Connection failed:', sessionError.message);
      return;
    }

    console.log('✅ Connection successful');

    // Test OAuth URL generation (this doesn't require actual OAuth setup)
    console.log('\n🔐 Testing OAuth URL generation...');

    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        skipBrowserRedirect: true, // Don't actually redirect, just test URL generation
      },
    });

    if (oauthError) {
      console.error('❌ OAuth configuration error:', oauthError.message);
      console.log('\n🔧 Possible solutions:');
      console.log('1. Enable Google provider in Supabase Dashboard');
      console.log('2. Add redirect URL: http://localhost:3000/auth/callback');
      console.log('3. Configure Google OAuth credentials');
      return;
    }

    if (oauthData?.url) {
      console.log('✅ OAuth URL generated successfully');
      console.log(`🔗 OAuth URL: ${oauthData.url.substring(0, 100)}...`);
    }

    console.log('\n✅ OAuth configuration appears to be working!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Go to: http://localhost:3000/auth');
    console.log('3. Try "Continue with Google"');
    console.log('4. Check browser console for any errors');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Check your Supabase configuration:');
    console.log('1. Verify URL and keys in .env.local');
    console.log('2. Check Supabase Dashboard → Authentication → Providers');
    console.log('3. Ensure Google OAuth is enabled and configured');
  }
}

testOAuth();
