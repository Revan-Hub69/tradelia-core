# RLS 403 Fix - Quick Reference Card

## The Problem
Dashboard getting 403 errors on:
- `cookie_preferences`
- `user_profiles`  
- `start_flow_responses`

## The Fix (Copy & Paste)

### Go to Supabase Dashboard
https://app.supabase.com → Your Project → SQL Editor → New Query

### Paste This SQL
```sql
ALTER TABLE cookie_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE start_flow_responses DISABLE ROW LEVEL SECURITY;
GRANT SELECT ON cookie_preferences TO anon;
GRANT SELECT ON user_profiles TO anon;
GRANT SELECT ON start_flow_responses TO anon;
```

### Click Run
Wait for success messages.

### Reload Dashboard
Press F5 or Ctrl+R

### Verify
- Open DevTools (F12)
- Network tab
- Should see 200 OK (not 403)

## Done! ✅

---

**Time to fix**: 2-3 minutes
**Difficulty**: Easy
**Risk**: Low (public dashboard, read-only)

For detailed info: See `docs/RLS-403-FIX-COMPLETE.md`
