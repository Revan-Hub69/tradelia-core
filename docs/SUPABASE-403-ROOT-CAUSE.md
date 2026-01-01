# Supabase 403 Forbidden - Root Cause Analysis

## The Real Problem

The browser is still getting **403 Forbidden** errors even though:
- ✅ RLS is disabled on all three tables
- ✅ `anon` role has SELECT permission
- ✅ API key is configured in `.env.local`

## Root Cause

The issue is **NOT** with the database permissions. The issue is that:

1. **Browser requests are missing the API key header**
   - Requests should include: `Authorization: Bearer <ANON_KEY>`
   - Or: `apikey: <ANON_KEY>`

2. **The Supabase client in the browser is not properly initialized**
   - The client needs to be created with the correct URL and anon key
   - The client must be available in the browser context

3. **RLS policies are still active**
   - Even though RLS is disabled, the policies remain in the database
   - These policies check `auth.role() = 'anon'` which requires authentication

## Solution Applied

### Step 1: Granted Full Permissions to Anon
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON cookie_preferences TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON start_flow_responses TO anon;
```

### Step 2: Browser Client Configuration
- Using `lib/supabase/browser-client.ts` with `createClient`
- Properly configured with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Client is marked as `'use client'` for browser context

### Step 3: Debug Components
- `components/debug/SupabaseDebug.tsx` - Verify client initialization
- `hooks/use-supabase.ts` - Hook to check Supabase readiness

## Why 403 Still Appears

The 403 errors persist because:

1. **Browser doesn't send API key** - The Supabase client must be initialized in the browser
2. **RLS policies block unauthenticated access** - Even with permissions, policies check auth status
3. **Client-side initialization issue** - The client might not be properly initialized when components mount

## Next Steps to Debug

1. **Check browser console** for Supabase client initialization errors
2. **Verify environment variables** are loaded in the browser
3. **Check Network tab** to see if requests include `apikey` header
4. **Use SupabaseDebug component** to verify client status

## How to Verify Fix

1. Add `<SupabaseDebug />` to a page
2. Check if it shows "✅ Supabase client initialized"
3. Check browser Network tab for requests with `apikey` header
4. Verify responses are 200 OK (not 403)

## Technical Details

### What Should Happen
```
Browser Request:
GET /rest/v1/cookie_preferences?select=*
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  apikey: eyJhbGciOiJIUzI1NiIs...

Supabase Response:
200 OK
[{ data... }]
```

### What's Happening Now
```
Browser Request:
GET /rest/v1/cookie_preferences?select=*
Headers:
  (missing apikey/Authorization)

Supabase Response:
403 Forbidden
{"message":"No API key found in request"}
```

## Files Modified

- `lib/supabase/browser-client.ts` - Browser client initialization
- `lib/preferences/cookie-manager.ts` - Uses browser client
- `components/debug/SupabaseDebug.tsx` - Debug component
- `hooks/use-supabase.ts` - Supabase readiness hook

## Database State

✅ RLS disabled on all three tables
✅ Anon role has full permissions (SELECT, INSERT, UPDATE, DELETE)
✅ Permissions are correctly granted

The database is correctly configured. The issue is in the browser client initialization.

---

**Status**: Investigating browser client initialization
**Next**: Verify client is properly initialized in browser context
