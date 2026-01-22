/**
 * Debug Supabase Signup Issues
 * Testa direttamente l'API di signup per identificare il problema
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Debug Supabase Signup Issues...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  console.log('📧 Testing signup with:', testEmail);
  console.log('🔗 Redirect URL:', 'https://tradelia.org/auth/callback');

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'https://tradelia.org/auth/callback',
      },
    });

    if (error) {
      console.error('❌ Signup failed:', error);
      console.log('\n🔧 Possible solutions:');

      if (error.message.includes('Invalid redirect URL')) {
        console.log('1. Add https://tradelia.org/auth/callback to Supabase Redirect URLs');
        console.log('2. Check Site URL is set to https://tradelia.org');
      } else if (error.message.includes('rate limit')) {
        console.log('1. Wait a few minutes before trying again');
        console.log('2. Check if IP is rate limited');
      } else if (error.message.includes('email')) {
        console.log('1. Check email provider configuration in Supabase');
        console.log('2. Verify email templates are valid');
      } else {
        console.log('1. Check Supabase logs in dashboard');
        console.log('2. Verify project configuration');
      }

      return;
    }

    console.log('✅ Signup successful!');
    console.log('📊 Response:', {
      user: data.user ? 'Created' : 'Not created',
      session: data.session ? 'Active' : 'Pending confirmation',
    });

    if (!data.session) {
      console.log('📧 Email confirmation required - check email templates');
    }
  } catch (error) {
    console.error('❌ Network/API error:', error.message);
    console.log('\n🔧 Check:');
    console.log('1. Internet connection');
    console.log('2. Supabase service status');
    console.log('3. API keys validity');
  }
}

async function checkConfiguration() {
  console.log('🔧 Checking Supabase configuration...\n');

  try {
    // Test basic connection
    const { data: session, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful');

    // Test with localhost redirect (should work)
    console.log('\n🧪 Testing with localhost redirect...');

    const testEmail = `localhost-test-${Date.now()}@example.com`;
    const { error: localhostError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    });

    if (localhostError) {
      console.error('❌ Even localhost fails:', localhostError.message);
      console.log('🚨 This indicates a server-side configuration issue');
    } else {
      console.log('✅ Localhost works - issue is with production URL');
    }

    return true;
  } catch (error) {
    console.error('❌ Configuration check failed:', error.message);
    return false;
  }
}

async function main() {
  const configOk = await checkConfiguration();

  if (configOk) {
    console.log(`\n${'='.repeat(50)}`);
    console.log('🧪 Testing production signup...\n');
    await testSignup();
  }

  console.log('\n📋 Next steps:');
  console.log('1. Check Supabase Dashboard → Authentication → URL Configuration');
  console.log('2. Verify Site URL: https://tradelia.org');
  console.log('3. Add Redirect URL: https://tradelia.org/auth/callback');
  console.log('4. Check email provider configuration');
  console.log('5. Review Supabase logs for detailed error info');
}

main();
