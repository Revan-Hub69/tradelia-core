#!/usr/bin/env python3
"""
Apply RLS fix to Supabase for public dashboard access.
This script disables RLS on public tables and grants SELECT to anon role.
"""

import os
import sys
import json
from pathlib import Path

# Load environment variables
env_file = Path(".env.local")
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key] = value

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    print("   Make sure .env.local is configured")
    sys.exit(1)

print("🔧 Applying RLS fix for public dashboard access...\n")
print(f"📍 Supabase Project: {SUPABASE_URL}\n")

SQL_STATEMENTS = [
    ("Disable RLS on cookie_preferences", "ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;"),
    ("Disable RLS on user_profiles", "ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;"),
    ("Disable RLS on start_flow_responses", "ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;"),
    ("Grant SELECT on cookie_preferences to anon", "GRANT SELECT ON cookie_preferences TO anon;"),
    ("Grant SELECT on user_profiles to anon", "GRANT SELECT ON user_profiles TO anon;"),
    ("Grant SELECT on start_flow_responses to anon", "GRANT SELECT ON start_flow_responses TO anon;"),
]

print("📋 SQL Statements to Execute:\n")
print("=" * 80)

for name, sql in SQL_STATEMENTS:
    print(f"\n✓ {name}")
    print(f"  SQL: {sql}")

print("\n" + "=" * 80)
print("\n✅ Instructions Generated\n")
print("📌 NEXT STEPS:")
print("   1. Go to: https://app.supabase.com")
print("   2. Select your project")
print("   3. Go to SQL Editor")
print("   4. Create a new query")
print("   5. Copy and paste the SQL statements above")
print("   6. Click Run")
print("   7. Reload your dashboard\n")
print("📖 For detailed instructions, see: docs/RLS-FIX-INSTRUCTIONS.md")
