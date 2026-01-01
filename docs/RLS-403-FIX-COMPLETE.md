# Supabase RLS 403 Fix - Complete Guide

## Problem Summary

The public dashboard is receiving **403 Forbidden** errors when trying to access three tables:
- `cookie_preferences`
- `user_profiles`
- `start_flow_responses`

### Error Messages in Browser Console
```
Failed to load resource: the server responded with a status of 403 ()
```

### Root Cause
The dashboard is now **public/unauthenticated**, but Supabase RLS (Row Level Security) policies are configured to require authentication. This creates a mismatch:
- Dashboard tries to access data as `anon` (unauthenticated user)
- RLS policies reject `anon` access with 403 Forbidden

## Solution

We need to allow public (unauthenticated) access to these three tables. There are two approaches:

### Approach A: Disable RLS (Simpler, for dev/public data)
Remove row-level security restrictions entirely on these tables.

### Approach B: Create Public Policies (More secure, for production)
Keep RLS enabled but add policies that allow public read access.

**We're using Approach A** because:
- Dashboard is public (no sensitive data)
- Simpler to implement
- Easier to maintain

## Implementation

### Step 1: Apply the Migration

Choose ONE of these methods:

#### Method 1: Supabase Dashboard (Easiest) ⭐ RECOMMENDED

1. Open your Supabase project: https://app.supabase.com
2. Click on your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy this SQL:

```sql
-- Allow public (unauthenticated) access to dashboard tables
ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;

GRANT SELECT ON cookie_preferences TO anon;
GRANT SELECT ON user_profiles TO anon;
GRANT SELECT ON start_flow_responses TO anon;
```

6. Click **Run** (or Ctrl+Enter)
7. Wait for success messages
8. Done! ✅

#### Method 2: Command Line (if Supabase CLI installed)

```bash
supabase db push
```

This applies all pending migrations, including `20250101000011_allow_public_access.sql`.

#### Method 3: Node.js Script

```bash
npm run apply-rls-fix
```

(Requires a custom function in Supabase - not yet implemented)

### Step 2: Verify the Fix

1. Reload your dashboard page
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Look for requests to the three tables
5. Verify they return **200 OK** (not 403)

### Step 3: Test Data Access

Try accessing the dashboard and verify:
- ✅ Cookie preferences load
- ✅ User profile data displays
- ✅ Start flow responses appear
- ✅ No 403 errors in console

## What Each SQL Statement Does

| Statement | Purpose |
|-----------|---------|
| `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` | Removes RLS restrictions on the table |
| `GRANT SELECT ON ... TO anon` | Allows unauthenticated users to read data |

## Security Considerations

### ✅ Safe For:
- Public dashboards with read-only data
- Non-sensitive information
- Development/testing environments
- Data that's meant to be publicly accessible

### ⚠️ Not Recommended For:
- Sensitive user data (passwords, emails, etc.)
- Financial information
- Personal identifiable information (PII)
- Production systems with restricted access

### For Production with Sensitive Data:
Use RLS policies instead:

```sql
-- Keep RLS enabled
ALTER TABLE cookie_preferences ENABLE ROW LEVEL SECURITY;

-- Create a policy for public read access
CREATE POLICY "Allow public read on cookie_preferences"
ON cookie_preferences FOR SELECT
USING (true);
```

## Troubleshooting

### Still Getting 403 Errors?

1. **Clear browser cache**
   - Press Ctrl+Shift+Delete
   - Clear all cache
   - Reload page

2. **Check if migration was applied**
   - Go to Supabase Dashboard
   - Go to SQL Editor
   - Run: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
   - Verify the three tables exist

3. **Check RLS status**
   - Run: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('cookie_preferences', 'user_profiles', 'start_flow_responses');`
   - Should show `rowsecurity = false` for all three

4. **Check permissions**
   - Run: `SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name IN ('cookie_preferences', 'user_profiles', 'start_flow_responses');`
   - Should show `anon` role with `SELECT` privilege

### Still Not Working?

1. Check Supabase project logs:
   - Go to Supabase Dashboard
   - Go to **Logs** (left sidebar)
   - Look for error messages

2. Verify environment variables:
   - Check `.env.local` has correct `SUPABASE_URL` and keys
   - Verify the project URL matches your Supabase project

3. Try a different browser or incognito mode
   - Rules out browser cache issues

## Files Related to This Fix

- **Migration file**: `supabase/migrations/20250101000011_allow_public_access.sql`
- **Instructions**: `docs/RLS-FIX-INSTRUCTIONS.md`
- **This guide**: `docs/RLS-403-FIX-COMPLETE.md`

## Next Steps

After applying this fix:

1. ✅ Verify dashboard loads without 403 errors
2. ✅ Test all dashboard features
3. ✅ Check browser console for any remaining errors
4. ✅ Commit the migration to git
5. ✅ Deploy to production (if applicable)

## Questions?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase logs for error details
3. Verify all SQL statements executed successfully
4. Check that you're using the correct Supabase project

---

**Last Updated**: 2026-01-01
**Status**: Ready to apply
**Estimated Time**: 2-3 minutes
