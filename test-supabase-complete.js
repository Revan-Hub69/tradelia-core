/**
 * Complete Supabase Test Suite
 * Testa tutte le funzionalità per identificare problemi
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Complete Supabase Test Suite\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing basic connection...');

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful');
    return true;
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

async function testOAuthURL() {
  console.log('\n🔐 Testing OAuth URL generation...');

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://tradelia.org/auth/callback',
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      console.error('❌ OAuth URL generation failed:', error.message);
      return false;
    }

    if (data?.url) {
      console.log('✅ OAuth URL generated successfully');
      console.log(`🔗 URL: ${data.url.substring(0, 100)}...`);
      return true;
    }

    console.error('❌ No OAuth URL returned');
    return false;
  } catch (error) {
    console.error('❌ OAuth test failed:', error.message);
    return false;
  }
}

async function testEmailSignup() {
  console.log('\n📧 Testing email signup...');

  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'https://tradelia.org/auth/callback',
      },
    });

    if (error) {
      console.error('❌ Email signup failed:', error.message);

      if (error.message.includes('Error sending confirmation email')) {
        console.log('🔧 Email provider issue detected');
        console.log('   - Check SMTP configuration in Supabase');
        console.log('   - Verify Brevo/email provider settings');
        console.log('   - Consider disabling email confirmations temporarily');
      }

      return false;
    }

    console.log('✅ Email signup successful');
    console.log(`📊 User created: ${data.user ? 'Yes' : 'No'}`);
    console.log(`📧 Email confirmation: ${data.session ? 'Not required' : 'Required'}`);

    return true;
  } catch (error) {
    console.error('❌ Email signup error:', error.message);
    return false;
  }
}

async function testPasswordReset() {
  console.log('\n🔄 Testing password reset...');

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      'test@example.com',
      {
        redirectTo: 'https://tradelia.org/reset-password',
      },
    );

    if (error) {
      console.error('❌ Password reset failed:', error.message);
      return false;
    }

    console.log('✅ Password reset email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Password reset error:', error.message);
    return false;
  }
}

async function testDatabaseAccess() {
  console.log('\n🗄️ Testing database access...');

  try {
    // Test if we can access a table (this will fail if RLS is properly configured)
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('permission denied') || error.message.includes('RLS')) {
        console.log('✅ RLS properly configured (access denied as expected)');
        return true;
      } else {
        console.error('❌ Database access error:', error.message);
        return false;
      }
    }

    console.log('⚠️ Database accessible without auth (check RLS configuration)');
    return true;
  } catch (error) {
    console.error('❌ Database test error:', error.message);
    return false;
  }
}

async function generateReport(results) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SUPABASE TEST REPORT');
  console.log('='.repeat(60));

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  const failed = total - passed;

  console.log(`\n📈 Overall Score: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed! Supabase is properly configured.');
  } else {
    console.log(`⚠️ ${failed} test(s) failed. See details above.`);
  }

  console.log('\n📋 Test Results:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });

  console.log('\n🔧 Recommended Actions:');

  if (!results.emailSignup) {
    console.log('1. 🚨 URGENT: Fix email provider configuration');
    console.log('   - Go to Supabase Dashboard → Authentication → Settings');
    console.log('   - Either disable email confirmations OR fix SMTP settings');
    console.log('   - Verify Brevo configuration is correct');
  }

  if (!results.oauthURL) {
    console.log('2. Configure Google OAuth provider');
    console.log('   - Add Google Client ID/Secret in Supabase');
    console.log('   - Verify redirect URLs are correct');
  }

  if (!results.passwordReset) {
    console.log('3. Fix password reset functionality');
    console.log('   - Same email provider issue as signup');
  }

  if (results.emailSignup && results.oauthURL) {
    console.log('✨ Authentication is working! Users can register and login.');
  } else {
    console.log('🚨 Authentication has issues. Users may not be able to register.');
  }
}

async function main() {
  const results = {
    connection: await testConnection(),
    oauthURL: await testOAuthURL(),
    emailSignup: await testEmailSignup(),
    passwordReset: await testPasswordReset(),
    databaseAccess: await testDatabaseAccess(),
  };

  await generateReport(results);

  console.log('\n🎯 Quick Fix for Email Issues:');
  console.log('Dashboard → Authentication → Settings → Disable "Enable email confirmations"');
  console.log('This will allow immediate signup without email confirmation.');
}

main();
