# Layout and Service Worker Fixes - January 2026

## Issues Resolved

### 1. Root Layout Missing Error
**Problem**: `not-found.tsx doesn't have a root layout. To fix this error, make sure every page has a root layout.`

**Root Cause**: Next.js 15 requires a root layout for the global `not-found.tsx` file at the app directory root.

**Solution**: Created `src/app/layout.tsx` with minimal HTML structure:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 2. Service Worker Registration Failed
**Problem**: `SecurityError: Failed to register a ServiceWorker for scope ('http://localhost:3001/') with script ('http://localhost:3001/sw.js'): The script resource is behind a redirect, which is disallowed.`

**Root Cause**: Middleware was intercepting service worker requests and causing redirects.

**Solutions Applied**:

1. **Updated middleware matcher** to exclude service worker files:
```typescript
'/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sw.js|sw-custom.js|workbox-.*\\.js|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.ico$|monitoring).*)'
```

2. **Added service worker headers** in `next.config.mjs`:
```javascript
{
  source: '/sw.js',
  headers: [
    {
      key: 'Content-Type',
      value: 'application/javascript',
    },
    {
      key: 'Cache-Control',
      value: 'no-cache, no-store, must-revalidate',
    },
    {
      key: 'Service-Worker-Allowed',
      value: '/',
    },
  ],
}
```

## Files Modified

1. `src/app/layout.tsx` - **Created** root layout for global not-found page
2. `src/middleware.ts` - Updated matcher to exclude service worker files
3. `next.config.mjs` - Added proper headers for service worker files

## Testing

Use `test-layout-sw-fix.html` to verify:
- Root 404 pages load without layout errors
- Service worker registers successfully without redirect errors
- Proper MIME types and headers are served

## Technical Notes

- Root layout is minimal and only used for global 404 fallbacks
- Service worker files are now properly excluded from middleware processing
- Headers ensure proper caching and security for service worker files
- Fixes maintain existing security and i18n functionality

## Verification Steps

1. Visit `/nonexistent-page` - should show 404 without layout error
2. Check browser console - service worker should register successfully
3. Network tab should show `sw.js` served with proper headers
4. No redirect errors in service worker registration