/**
 * False Positive Analysis - Analizza il problema "User already registered"
 * quando l'utente NON esiste realmente
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

async function analyzeFalsePositive() {
  console.log('🔍 ANALISI FALSO POSITIVO "User already registered"\n');

  // Simula il flusso dell'app
  const testEmail = 'test-false-positive@example.com';
  const testPassword = 'TestPassword123!';

  console.log(`📧 Email di test: ${testEmail}\n`);

  try {
    // STEP 1: Simula checkEmailExists (quello che fa l'app)
    console.log('1️⃣ STEP 1: checkEmailExists() - Come fa l\'app');
    const { error: checkError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'temp-check-password-123',
      options: {
        emailRedirectTo: `https://tradelia.org/auth/callback`,
      },
    });

    if (checkError) {
      const errorMsg = checkError.message.toLowerCase();
      if (errorMsg.includes('user already registered')) {
        console.log('❌ checkEmailExists() dice: UTENTE ESISTE');
        console.log('➡️  App dovrebbe andare a LOGIN');
      } else {
        console.log('✅ checkEmailExists() dice: UTENTE NON ESISTE');
        console.log('➡️  App va a SIGNUP');
        console.log(`📝 Errore check: ${checkError.message}`);
      }
    } else {
      console.log('✅ checkEmailExists() dice: UTENTE NON ESISTE (no error)');
      console.log('➡️  App va a SIGNUP');
    }

    // STEP 2: Simula il signup reale (quello che fallisce)
    console.log('\n2️⃣ STEP 2: Signup reale - Quello che fallisce');
    const { data: realSignup, error: realError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `https://tradelia.org/auth/callback?redirect=/dashboard`,
      },
    });

    if (realError) {
      console.log('❌ SIGNUP REALE FALLISCE:', realError.message);
      
      if (realError.message.includes('User already registered')) {
        console.log('\n🚨 FALSO POSITIVO CONFERMATO!');
        console.log('✅ checkEmailExists() dice: utente NON esiste');
        console.log('❌ signup reale dice: utente GIÀ esiste');
        console.log('\n🔍 POSSIBILI CAUSE:');
        console.log('1. Problema configurazione email (Brevo/SMTP)');
        console.log('2. Rate limiting Supabase');
        console.log('3. Conflitto tra tentativi multipli');
        console.log('4. Cache/timing issue');
      }
    } else {
      console.log('✅ SIGNUP REALE RIUSCITO');
      console.log('👤 User creato:', realSignup.user.id);
    }

    // STEP 3: Verifica stato finale
    console.log('\n3️⃣ STEP 3: Verifica stato finale');
    const { data: loginTest, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      console.log('❌ Login test fallisce:', loginError.message);
      if (loginError.message.includes('Invalid login credentials')) {
        console.log('🔍 CONFERMATO: L\'utente NON esiste nel database');
        console.log('📋 DIAGNOSI: Errore "User already registered" è FALSO POSITIVO');
      }
    } else {
      console.log('✅ Login test riuscito - utente esiste');
    }

    // STEP 4: Analisi configurazione
    console.log('\n4️⃣ STEP 4: Analisi configurazione Supabase');
    
    // Check auth settings
    const { data: settings } = await supabase.auth.getSession();
    console.log('🔧 Auth session check:', settings.session ? 'OK' : 'None');

    console.log('\n📋 RACCOMANDAZIONI:');
    console.log('1. 🔧 Controllare configurazione email in Supabase Dashboard');
    console.log('2. 📧 Verificare settings Brevo/SMTP');
    console.log('3. ⏱️  Aggiungere delay tra checkEmailExists e signup');
    console.log('4. 🔄 Implementare retry logic per falsi positivi');
    console.log('5. 🚫 Temporaneamente disabilitare email confirmation');

  } catch (error) {
    console.error('💥 Errore durante analisi:', error);
  }
}

analyzeFalsePositive().catch(console.error);