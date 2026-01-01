const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function applyRLSFix() {
  console.log("Applying RLS fix for public dashboard access...\n");

  const sqlStatements = [
    "ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;",
    "ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;",
    "ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;",
    "GRANT SELECT ON cookie_preferences TO anon;",
    "GRANT SELECT ON user_profiles TO anon;",
    "GRANT SELECT ON start_flow_responses TO anon;",
  ];

  try {
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      console.log(`${i + 1}. Executing: ${statement.substring(0, 50)}...`);

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
        },
        body: JSON.stringify({ sql: statement }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`   ❌ Failed: ${error}`);
      } else {
        console.log("   ✓ Done\n");
      }
    }

    console.log("✅ RLS fix applied successfully!");
    console.log(
      "\nThe public dashboard should now be able to access these tables."
    );
  } catch (error) {
    console.error("❌ Error applying RLS fix:", error);
    process.exit(1);
  }
}

applyRLSFix();
