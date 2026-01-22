/**
 * Debug Script: User Already Registered Error
 * Testa se l'errore "User already registered" è reale o falso positivo
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserRegistration() {
  console.log('🔍 Testing "User already registered" error...\n');

  // Test email (use a test email that should NOT exist)
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  console.log(`📧 Testing with email: ${testEmail}`);
  console.log(`🔐 Testing with password: ${testPassword}\n`);

  try {
    // Test 1: Try to sign up
    console.log('1️⃣ Attempting signup...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'https://tradelia.org/auth/callback',
      },
    });

    if (signupError) {
      console.error('❌ Signup Error:', signupError.message);
      console.error('❌ Error Code:', signupError.status);
      console.error('❌ Full Error:', JSON.stringify(signupError, null, 2));

      // Check if this is the "User already registered" error
      if (signupError.message.includes('User already registered')) {
        console.log('\n🚨 FALSO POSITIVO CONFERMATO!');
        console.log('L\'errore "User already registered" viene lanciato anche per utenti nuovi');
        console.log('Questo indica un problema di configurazione Supabase, non un utente esistente\n');
      }
    } else {
      console.log('✅ Signup successful!');
      console.log('📧 User data:', JSON.stringify(signupData.user, null, 2));
    }

    // Test 2: Check if user actually exists in auth.users
    console.log('\n2️⃣ Checking if user exists in database...');
    const { data: session } = await supabase.auth.getSession();
    console.log('👤 Current session:', session.session ? 'Exists' : 'None');

    // Test 3: Try to sign in (should fail if user doesn't exist)
    console.log('\n3️⃣ Attempting signin to verify user existence...');
    const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signinError) {
      console.log('❌ Signin Error:', signinError.message);
      if (signinError.message.includes('Invalid login credentials')) {
        console.log('✅ CONFERMATO: L\'utente NON esiste nel database');
        console.log('✅ L\'errore "User already registered" era un FALSO POSITIVO\n');
      }
    } else {
      console.log('✅ Signin successful - user exists');
      console.log('👤 User data:', JSON.stringify(signinData.user, null, 2));
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }

  // Test 4: Check Supabase configuration
  console.log('\n4️⃣ Checking Supabase configuration...');

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Auth configuration error:', error.message);
    } else {
      console.log('✅ Auth configuration OK');
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }

  console.log('\n📋 DIAGNOSI:');
  console.log('Se vedi "User already registered" ma poi "Invalid login credentials",');
  console.log('significa che il problema è nella configurazione email di Supabase,');
  console.log('NON che l\'utente esiste già.\n');

  console.log('🔧 SOLUZIONE:');
  console.log('1. Controllare configurazione email provider (Brevo)');
  console.log('2. Verificare SMTP settings in Supabase dashboard');
  console.log('3. Temporaneamente disabilitare email confirmation');
  console.log('4. Usare Google OAuth come alternativa\n');
}

// Run the test
testUserRegistration().catch(console.error);
