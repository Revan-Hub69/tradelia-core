# Tooltip Visibility Fix - Tradelia 2026

## Problem
Tooltips on ThemeSwitcher and LanguageSwitcherDashboard were appearing on hover but content was **invisible** - going UNDER the page background (not under the header).

## Root Cause
Radix UI Tooltip does **NOT** use Portal by default, so it renders inside the parent component (DashboardHeader with `position: sticky`). This creates a DOM hierarchy issue where the tooltip is trapped inside the header's stacking context.

## Solution
Added `TooltipPrimitive.Portal` wrapper to render tooltip at document root, outside the header's DOM hierarchy.

### File Changed
`src/components/ui/tooltip.tsx`

```tsx
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>  {/* ← Added Portal wrapper */}
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-[100] overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
```

## Why Portal Works
- Portal renders content at document root (`<body>`)
- Escapes parent stacking context (header's `position: sticky`)
- Tooltip now appears above all page content
- z-index `z-[100]` now works correctly

## Verification
- ✅ Build passes: `npm run build` (22.9s)
- ✅ Dev server running: `http://localhost:3000`
- ✅ No TypeScript errors
- ✅ Tooltips now render at document root

## Components Affected
- `ThemeSwitcher.tsx` - Theme toggle tooltip
- `LanguageSwitcherDashboard.tsx` - Language selector tooltip

## Best Practice 2026
Always use Portal for overlay components (tooltips, popovers, modals) to avoid stacking context issues with sticky/fixed positioned parents.
