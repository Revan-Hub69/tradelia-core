# Fixing Supabase RLS 403 Errors for Public Dashboard

## Problem
The public dashboard is getting 403 Forbidden errors when trying to access:
- `cookie_preferences`
- `user_profiles`
- `start_flow_responses`

This is because RLS (Row Level Security) policies are blocking unauthenticated access.

## Solution

### Option 1: Apply via Supabase Dashboard (Recommended - Easiest)

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the SQL below:

```sql
-- Allow public (unauthenticated) access to dashboard tables
-- This is for the public trading dashboard

-- Disable RLS on tables that should be publicly accessible
ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;

-- Grant public read access to these tables
GRANT SELECT ON cookie_preferences TO anon;
GRANT SELECT ON user_profiles TO anon;
GRANT SELECT ON start_flow_responses TO anon;
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success" messages for each statement
7. Reload your dashboard page - the 403 errors should be gone

### Option 2: Apply via Node.js Script

Run this command from the project root:

```bash
npx ts-node scripts/debug/apply-rls-fix.ts
```

This will execute the same SQL statements programmatically.

### Option 3: Apply via Supabase CLI (if installed)

```bash
supabase db push
```

This will apply all pending migrations, including `20250101000011_allow_public_access.sql`.

## Verification

After applying the fix:

1. Reload the dashboard page
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Look for requests to:
   - `cookie_preferences`
   - `user_profiles`
   - `start_flow_responses`
5. These should now return **200 OK** instead of **403 Forbidden**

## What This Does

- **Disables RLS** on the three tables (removes row-level security restrictions)
- **Grants SELECT permission** to the `anon` role (unauthenticated users)
- Allows the public dashboard to read data without authentication

## Security Note

This approach is suitable for:
- Public dashboards with read-only data
- Development/testing environments
- Data that doesn't contain sensitive information

For production with sensitive data, consider using RLS policies with specific conditions instead of disabling RLS entirely.
