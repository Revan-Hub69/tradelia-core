/**
 * Check Specific Email - Verifica se un'email specifica esiste già
 */

import readline from 'node:readline';

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function checkSpecificEmail() {
  console.log('🔍 Controllo Email Specifica\n');

  const email = await askQuestion('📧 Inserisci l\'email da controllare: ');

  if (!email || !email.includes('@')) {
    console.log('❌ Email non valida');
    rl.close();
    return;
  }

  console.log(`\n🔍 Controllando: ${email}\n`);

  try {
    // Test 1: Prova a registrare l'email
    console.log('1️⃣ Test registrazione...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password: 'TempPassword123!',
      options: {
        emailRedirectTo: 'https://tradelia.org/auth/callback',
      },
    });

    if (signupError) {
      console.log('❌ Errore registrazione:', signupError.message);

      if (signupError.message.includes('User already registered')) {
        console.log('🚨 CONFERMATO: L\'utente esiste già!\n');

        // Test 2: Prova il login per confermare
        console.log('2️⃣ Test login per conferma...');
        const testPassword = await askQuestion('🔐 Inserisci la password per testare il login (opzionale): ');

        if (testPassword) {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password: testPassword,
          });

          if (loginError) {
            console.log('❌ Login fallito:', loginError.message);
            if (loginError.message.includes('Invalid login credentials')) {
              console.log('🤔 Password sbagliata, ma l\'utente esiste');
            }
          } else {
            console.log('✅ Login riuscito! L\'utente esiste ed è attivo');
            console.log('👤 User ID:', loginData.user.id);
            console.log('📧 Email confermata:', loginData.user.email_confirmed_at ? 'Sì' : 'No');
          }
        }
      }
    } else {
      console.log('✅ Registrazione riuscita - l\'email era nuova');
      console.log('👤 Nuovo utente creato:', signupData.user.id);
    }

    // Test 3: Controlla OAuth providers
    console.log('\n3️⃣ Suggerimenti:');
    console.log('- Se l\'utente esiste, può usare "Password dimenticata"');
    console.log('- Può provare Google OAuth se si è registrato con Google');
    console.log('- Controlla se l\'email è scritta correttamente');
  } catch (error) {
    console.error('💥 Errore inaspettato:', error);
  }

  rl.close();
}

checkSpecificEmail().catch(console.error);
