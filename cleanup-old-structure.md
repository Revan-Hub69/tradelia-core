# Cleanup Old Structure

After testing the new i18n structure, delete these old files:

## Files to Delete
- `app/(marketing)/layout.tsx`
- `app/(marketing)/page.tsx`
- `app/about/page.tsx`
- `app/dashboard/page.tsx`
- `app/library/page.tsx`
- `app/library/[slug]/page.tsx`
- `app/topics/page.tsx`
- `app/topics/[topic]/page.tsx`
- `app/paths/[horizon]/page.tsx`
- `app/paths/[horizon]/[unit]/page.tsx`
- `app/not-found.tsx`

## Folders to Delete (after removing files)
- `app/(marketing)/`
- `app/about/`
- `app/dashboard/`
- `app/library/`
- `app/topics/`
- `app/paths/`

## Commands to run:
```bash
# Remove old files
rm -rf app/\(marketing\)
rm -rf app/about
rm -rf app/dashboard  
rm -rf app/library
rm -rf app/topics
rm -rf app/paths
rm app/not-found.tsx

# Install Supabase
npm install @supabase/supabase-js
```

## Test the new structure:
1. Run `npm run dev`
2. Test routes:
   - `/` (should redirect to `/it`)
   - `/it` (Italian home)
   - `/en` (English home - will need translation)
   - `/it/about`, `/en/about`
   - All other routes with locale prefix

## After testing, update:
1. Replace YOUR_PROJECT_ID in package.json generate-types script
2. Create Supabase project and update .env.local
3. Run `npm run generate-types` to replace mock types