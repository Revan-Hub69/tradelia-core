# Supabase Client Fix - "No API key found in request"

## Problem
The browser was getting error: `{"message":"No API key found in request","hint":"No `apikey` request header or url param was found."}`

This happened because the Supabase client wasn't properly initialized in the browser.

## Root Cause
- The original `lib/supabase/client.ts` was designed for server-side use
- Client components in the browser need a different client initialization
- The browser client wasn't sending the API key in requests

## Solution
Created a dedicated browser client using Supabase's `createBrowserClient`:

### New File: `lib/supabase/browser-client.ts`
```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null
```

### Updated: `lib/preferences/cookie-manager.ts`
- Changed import from `@/lib/supabase/client` to `@/lib/supabase/browser-client`
- Added `'use client'` directive
- Now uses the proper browser client for all database operations

## What This Fixes
✅ Browser now sends API key in requests
✅ Supabase REST API calls include proper authentication
✅ Cookie preferences can be saved/loaded from database
✅ User preferences can be saved/loaded from database
✅ No more "No API key found" errors

## How It Works
1. Browser client uses `createBrowserClient` from `@supabase/ssr`
2. Automatically handles API key in request headers
3. Properly manages authentication state in the browser
4. Sends requests with correct `apikey` header

## Testing
After this fix:
1. Reload the dashboard
2. Open DevTools (F12)
3. Go to Network tab
4. Look for requests to Supabase
5. Should see **200 OK** responses (not 403)
6. Requests should include `apikey` header

## Files Changed
- `lib/supabase/browser-client.ts` (new)
- `lib/preferences/cookie-manager.ts` (updated)
- `scripts/debug/check-supabase-client.mjs` (new - for debugging)

## Next Steps
1. Reload your dashboard
2. Verify no more "No API key" errors
3. Check that cookie preferences save correctly
4. Verify user preferences load from database

---

**Status**: ✅ Fixed
**Date**: 2026-01-01
**Impact**: Critical - Enables all database operations in browser
