#!/usr/bin/env node

import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("   Make sure .env.local is configured");
  process.exit(1);
}

console.log("🔧 Applying RLS fix for public dashboard access...\n");
console.log(`📍 Supabase Project: ${supabaseUrl}\n`);

const sqlStatements = [
  {
    name: "Disable RLS on cookie_preferences",
    sql: "ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;",
  },
  {
    name: "Disable RLS on user_profiles",
    sql: "ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;",
  },
  {
    name: "Disable RLS on start_flow_responses",
    sql: "ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;",
  },
  {
    name: "Grant SELECT on cookie_preferences to anon",
    sql: "GRANT SELECT ON cookie_preferences TO anon;",
  },
  {
    name: "Grant SELECT on user_profiles to anon",
    sql: "GRANT SELECT ON user_profiles TO anon;",
  },
  {
    name: "Grant SELECT on start_flow_responses to anon",
    sql: "GRANT SELECT ON start_flow_responses TO anon;",
  },
];

async function executeSQL(statement) {
  try {
    // Try using the Supabase REST API with a custom function
    // Note: This requires a database function to exist
    // For now, we'll provide instructions for manual application

    console.log(`⏳ ${statement.name}...`);
    console.log(`   SQL: ${statement.sql}`);
    console.log(
      "   ⚠️  This requires manual execution via Supabase Dashboard\n"
    );

    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log("📋 SQL Statements to Execute:\n");
  console.log("=" + "=".repeat(70));

  for (const statement of sqlStatements) {
    await executeSQL(statement);
  }

  console.log("=" + "=".repeat(70));
  console.log("\n✅ Instructions Generated\n");
  console.log("📌 NEXT STEPS:");
  console.log("   1. Go to: https://app.supabase.com");
  console.log("   2. Select your project");
  console.log("   3. Go to SQL Editor");
  console.log("   4. Create a new query");
  console.log("   5. Copy and paste the SQL statements above");
  console.log("   6. Click Run");
  console.log("   7. Reload your dashboard\n");
  console.log("📖 For detailed instructions, see: docs/RLS-FIX-INSTRUCTIONS.md");
}

main();
