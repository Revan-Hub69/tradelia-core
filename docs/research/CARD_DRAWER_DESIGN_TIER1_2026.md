# Card & Drawer Design - Tier 1 Research 2026

**Date**: 2026-01-26  
**Status**: ✅ RESEARCH COMPLETE  
**Sources**: shadcn/ui, Vaul (Emil Kowalski), Radix UI, Modern UI patterns

---

## 🎯 EXECUTIVE SUMMARY

Ricerca su best practices 2026 per:
1. **Product Card Design** con variant selector
2. **Drawer Component** (mobile-first)
3. **Tabs Pattern** per drawer content
4. **Performance Optimization** per liste grandi

### Key Findings

1. **Vaul è lo standard** per drawer mobile (by Emil Kowalski, usato da Vercel)
2. **shadcn/ui Card** con variant selector è il pattern dominante
3. **Radix Tabs** per organizzare contenuto drawer
4. **CSS Variables performance issue** risolto con direct style updates
5. **Bottom Sheet > Modal** su mobile (native feel)

---

## 📱 DRAWER COMPONENT (Vaul Pattern)

### Source: Emil Kowalski - Building a Drawer Component
**URL**: https://emilkowal.ski/ui/building-a-drawer-component

### Why Vaul?
- Usato da Vercel in produzione
- Built on Radix Dialog (accessibility garantita)
- Drag-to-dismiss con momentum
- Snap points support
- Background scaling effect
- Mobile-first design

### Critical Performance Fix

**Problem**: Lag con >20 items nel drawer

**Solution**: Update style directly, not CSS variables

```typescript
// ❌ WRONG (causes recalculation for all children)
element.style.setProperty('--drawer-y', `${y}px`);

// ✅ RIGHT (direct style update)
element.style.transform = `translateY(${y}px)`;
```

**Impact**: Smooth 60fps anche con 100+ items

### Drag Gesture Features

1. **Momentum-based dragging**: Flick to close
2. **Damping at top**: Natural resistance quando già al top
3. **Scroll prevention**: `shouldDrag()` function
4. **Multi-touch handling**: Ignora touches dopo il primo
5. **100ms timeout**: Previene accidental close dopo scroll veloce

### Snap Points

```typescript
snapPoints: [0.25, 0.5, 0.75, 1.0] // % of viewport
```

- Momentum-based: flick hard → skip points
- Fixed values support: `snapPoints: ['200px', '50%', '100%']`
- Useful per input che deve stare visibile

### Background Animation

```typescript
// Illusion of <body> becoming another sheet
<Drawer scaleBackground>
  {/* Content */}
</Drawer>
```

- Border radius aumenta progressivamente
- Scale down effect (0.95)
- Basato su drag progress (40% drag = 60% border radius)


### Motion & Easing

**Curve**: Ionic Framework curve (matches iOS Sheet)  
**Duration**: 500ms (matches iOS)

```typescript
const iosCurve = 'cubic-bezier(0.32, 0.72, 0, 1)';
```

**Why important**: Right easing = native feel

### Input Handling (Critical for Forms)

**Problem**: Virtual keyboard pushes drawer up, hiding content

**Solution**: Visual Viewport API

```typescript
visualViewport.addEventListener('resize', () => {
  const keyboardHeight = window.innerHeight - visualViewport.height;
  drawer.style.height = `calc(100% - ${keyboardHeight}px)`;
});
```

**Benefits**:
- Drawer sits above keyboard
- Fully scrollable
- No content hidden

**Downside**: Slight delay (keyboard must be fully visible first)

---

## 🃏 CARD COMPONENT (Product Card Pattern)

### Source: shadcn/ui Product Card Variants
**URL**: https://www.shadcn.io/blocks/product-cards-05

### Pattern: Variant Selector in Card

**Features**:
- Color swatches con selection state
- Size buttons con availability indicators
- Dynamic price updates
- Add to cart con selected options
- Keyboard navigation accessible


### Card Structure (shadcn/ui)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  
  <CardContent>
    {/* Image, variants, price */}
  </CardContent>
  
  <CardFooter>
    {/* CTAs */}
  </CardFooter>
</Card>
```

### Variant Selector Patterns

**1. ToggleGroup (shadcn/ui)**
```tsx
<ToggleGroup type="single" value={selectedSize}>
  <ToggleGroupItem value="S">S</ToggleGroupItem>
  <ToggleGroupItem value="M">M</ToggleGroupItem>
  <ToggleGroupItem value="L">L</ToggleGroupItem>
</ToggleGroup>
```

**2. Radio Group (mobile-friendly)**
```tsx
<RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
  <RadioGroupItem value="10k">$10,000 @ €155</RadioGroupItem>
  <RadioGroupItem value="25k">$25,000 @ €250</RadioGroupItem>
</RadioGroup>
```

**3. Select/Combobox (many options)**
```tsx
<Select value={selectedSize} onValueChange={setSelectedSize}>
  <SelectTrigger>
    <SelectValue placeholder="Select size" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="10k">$10,000</SelectItem>
    {/* ... */}
  </SelectContent>
</Select>
```

### Best Practices (shadcn/ui)

1. **Separation of concerns**: Presentational vs container components
2. **Flexible props**: Customizable through props
3. **Semantic markup**: Proper HTML structure
4. **Accessible**: ARIA labels, keyboard navigation
5. **Theme-aware**: Tailwind tokens, dark mode support


---

## 📑 TABS COMPONENT (Drawer Content Organization)

### Source: Shadcraft - Best Practice Patterns for Tabbed Interfaces
**URL**: https://shadcraft.com/blog/best-practice-patterns-for-tabbed-interfaces-in-shadcn-ui

### UX Principles

**1. Keep labels short and scannable**
- ✅ Good: "Overview", "Pricing", "Rules", "Payout"
- ❌ Bad: "Account configuration details", "Things you might want to adjust"
- Aim for 1-2 words max
- No wrapping to multiple lines

**2. Use tabs only when content is related**
- Tabs = different views of same concept
- If feels like switching sections → use sidebar/stepper instead

**3. Maintain stable layout**
- Content should feel structurally similar
- Avoid huge height jumps
- No layout shifts between tabs

**4. Keep active tab visually clear**
- Underline indicator
- Background pill
- Border accent
- Color change

### Accessibility (Radix Built-in)

**Keyboard Navigation**:
- `Tab`: Focus tab list
- `Arrow Left/Right`: Navigate between tabs
- `Home/End`: First/last tab
- `Enter/Space`: Activate tab

**Screen Reader**:
- Semantic markup (role="tablist", role="tab", role="tabpanel")
- Readable labels (no icons alone)
- Preserve focus visibility


### Variants

**1. Default (underline)**
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="pricing">Pricing</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">{/* ... */}</TabsContent>
</Tabs>
```

**2. Segmented (pill background)**
- Mimics toggle group
- Use for mode switching (not pages)
- Example: "Light" / "Dark" theme

**3. Custom variants**
- Create only when adds clarity, not novelty
- Every variant = cognitive load

### Theming

**Color choices**:
- Strongest token for active indicator
- Low contrast for inactive tabs
- Clear hierarchy

**Spacing**:
- Accessible touch targets (44x44px minimum)
- Indicator ≠ touch target (make trigger large enough)

**Dark mode**:
- Test all variants in both modes
- Check contrast ratios
- Verify focus visibility

### When NOT to Use Tabs

❌ Avoid tabs when:
- More than 7 tabs (use sidebar)
- Content is sequential (use stepper)
- Users need to see multiple sections at once (use accordions)
- Content is unrelated (use separate pages)


---

## 🎨 DESIGN SYSTEM INTEGRATION

### shadcn/ui Philosophy

**Copy, don't install**:
- Components copied into your project
- Full control over code
- No black box dependencies
- Easy customization

**Built on**:
- Radix UI (accessibility, behavior)
- Tailwind CSS (styling)
- TypeScript (type safety)

### Component Anatomy (Consistent Pattern)

```tsx
// 1. Imports
import * as React from "react"
import { cn } from "@/lib/utils"

// 2. Component with forwardRef
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// 3. Export
export { Card }
```

**Pattern Benefits**:
- Consistent API across components
- Easy to extend
- Type-safe
- Composable


---

## 🚀 APPLICAZIONE A TRADELIA

### Program Card Component

**Structure**:
```tsx
<Card variant="interactive" size="default">
  <CardHeader>
    {/* Logo + Name + Badges */}
    <div className="flex items-center gap-3">
      <FirmLogo firm={organizer} size="md" />
      <div>
        <CardTitle>{program.name}</CardTitle>
        <CardDescription>{program.subtype}</CardDescription>
      </div>
      <Badges program={program} />
    </div>
    
    {/* Data Quality Indicator */}
    <FreshnessIndicator freshness={kpis.freshness_days} />
  </CardHeader>
  
  <CardContent>
    {/* Offer Selector */}
    <OfferSelector 
      offers={offers}
      selected={selectedOffer}
      onChange={setSelectedOffer}
    />
    
    {/* KPI Grid (stable, non cambia con offer) */}
    <KPIGrid kpis={kpis} />
    
    {/* Platforms */}
    <PlatformIcons platforms={market.platforms} />
  </CardContent>
  
  <CardFooter>
    <Button onClick={openDrawer}>View Details</Button>
    <Button variant="outline" onClick={addToCompare}>
      Compare
    </Button>
  </CardFooter>
</Card>
```

### Offer Selector (Desktop vs Mobile)

**Desktop**: Select/Combobox
```tsx
<Select value={selectedOffer} onValueChange={setSelectedOffer}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {offers.map(offer => (
      <SelectItem key={offer.id} value={offer.id}>
        ${offer.account_size.toLocaleString()} @ {offer.entry_fee} {offer.fee_currency}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```


**Mobile**: Bottom Sheet (Vaul)
```tsx
<Drawer open={selectorOpen} onOpenChange={setSelectorOpen}>
  <DrawerTrigger asChild>
    <Button variant="outline" className="w-full">
      {selectedOffer.account_size} @ {selectedOffer.entry_fee}
      <ChevronDown />
    </Button>
  </DrawerTrigger>
  
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Select Account Size</DrawerTitle>
    </DrawerHeader>
    
    <RadioGroup value={selectedOffer.id} onValueChange={handleSelect}>
      {offers.map(offer => (
        <div key={offer.id} className="flex items-center space-x-2 p-4">
          <RadioGroupItem value={offer.id} />
          <Label>
            ${offer.account_size.toLocaleString()} @ {offer.entry_fee} {offer.fee_currency}
            {offer.refundable && <Badge>Refundable</Badge>}
          </Label>
        </div>
      ))}
    </RadioGroup>
    
    <DrawerFooter>
      <Button onClick={() => setSelectorOpen(false)}>Confirm</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Challenge Drawer (Full Details)

**Structure**:
```tsx
<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
  <DrawerContent className="h-[90vh]">
    <DrawerHeader>
      <div className="flex items-center gap-3">
        <FirmLogo firm={organizer} size="lg" />
        <DrawerTitle>{program.name}</DrawerTitle>
      </div>
      <DrawerClose />
    </DrawerHeader>
    
    <Tabs defaultValue="overview" className="flex-1">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="rules">Rules</TabsTrigger>
        <TabsTrigger value="payout">Payout</TabsTrigger>
        <TabsTrigger value="markets">Markets</TabsTrigger>
        <TabsTrigger value="audit">Trust & Audit</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab program={program} organizer={organizer} />
      </TabsContent>
      
      <TabsContent value="pricing">
        <PricingTable offers={offers} selected={selectedOffer} />
      </TabsContent>
      
      {/* ... other tabs */}
    </Tabs>
  </DrawerContent>
</Drawer>
```


### Pricing Table (Desktop vs Mobile)

**Desktop**: Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Size</TableHead>
      <TableHead>Fee</TableHead>
      <TableHead>Refund</TableHead>
      <TableHead>Scaling</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {offers.map(offer => (
      <TableRow 
        key={offer.id}
        className={cn(offer.id === selectedOffer.id && "bg-accent")}
      >
        <TableCell>${offer.account_size.toLocaleString()}</TableCell>
        <TableCell>{offer.entry_fee} {offer.fee_currency}</TableCell>
        <TableCell>{offer.refundable ? "✓" : "—"}</TableCell>
        <TableCell>${offer.scaling_max.toLocaleString()}</TableCell>
        <TableCell>
          <Button size="sm" onClick={() => selectOffer(offer.id)}>
            Select
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Mobile**: Stacked Cards
```tsx
<div className="space-y-3">
  {offers.map(offer => (
    <Card 
      key={offer.id}
      className={cn(
        "cursor-pointer transition-colors",
        offer.id === selectedOffer.id && "border-primary"
      )}
      onClick={() => selectOffer(offer.id)}
    >
      <CardHeader>
        <CardTitle>${offer.account_size.toLocaleString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>Entry Fee: {offer.entry_fee} {offer.fee_currency}</div>
          <div>Refundable: {offer.refundable ? "✓" : "—"}</div>
          <div>Scaling: ${offer.scaling_max.toLocaleString()}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">Select</Button>
      </CardFooter>
    </Card>
  ))}
</div>
```


---

## ⚡ PERFORMANCE OPTIMIZATIONS

### 1. Lazy Loading Drawer Content

```tsx
const ChallengeDrawer = ({ programId, open }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['program-details', programId],
    queryFn: () => fetchProgramDetails(programId),
    enabled: open, // Only fetch when drawer opens
  });
  
  return (
    <Drawer open={open}>
      {isLoading ? <Skeleton /> : <DrawerContent data={data} />}
    </Drawer>
  );
};
```

### 2. Tab Content Lazy Loading

```tsx
<Tabs defaultValue="overview">
  <TabsContent value="overview">
    <OverviewTab /> {/* Always loaded */}
  </TabsContent>
  
  <TabsContent value="audit">
    <Suspense fallback={<Skeleton />}>
      <AuditTab /> {/* Lazy loaded */}
    </Suspense>
  </TabsContent>
</Tabs>
```

### 3. Virtual Scrolling (Large Lists)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const OfferList = ({ offers }) => {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: offers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <OfferCard 
            key={virtualRow.key}
            offer={offers[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
```


### 4. Memoization

```tsx
const ProgramCard = memo(({ program, offers, kpis }) => {
  const selectedOffer = useMemo(
    () => offers.find(o => o.is_featured) || offers[0],
    [offers]
  );
  
  const badges = useMemo(
    () => getBadges(program, selectedOffer),
    [program, selectedOffer]
  );
  
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}, (prev, next) => {
  // Custom comparison
  return prev.program.id === next.program.id &&
         prev.kpis.kpi_signature_hash === next.kpis.kpi_signature_hash;
});
```

### 5. Direct Style Updates (Vaul Pattern)

```tsx
// ❌ Avoid CSS variables for drag
const handleDrag = (y) => {
  element.style.setProperty('--drawer-y', `${y}px`);
};

// ✅ Use direct transform
const handleDrag = (y) => {
  element.style.transform = `translateY(${y}px)`;
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Card Component
- [ ] Use shadcn/ui Card as base
- [ ] Add variant="interactive" for hover effects
- [ ] Implement offer selector (Select desktop, Drawer mobile)
- [ ] KPI grid stable (non cambia con offer)
- [ ] Freshness indicator visible
- [ ] Badges system (FREE, FEATURED, etc.)
- [ ] Platform icons (SVG, no emoji)
- [ ] Comparison checkbox
- [ ] Responsive (mobile/desktop)

### Drawer Component
- [ ] Use Vaul (shadcn/ui Drawer)
- [ ] Height: 90vh (mobile), 80vh (desktop)
- [ ] Drag-to-dismiss enabled
- [ ] Background scaling effect
- [ ] Lazy load content (only when open)
- [ ] Direct style updates (performance)
- [ ] Visual Viewport API for inputs
- [ ] Close button + backdrop


### Tabs Component
- [ ] Use Radix Tabs (shadcn/ui)
- [ ] 6 tabs: Overview, Pricing, Rules, Payout, Markets, Audit
- [ ] Short labels (1-2 words)
- [ ] Keyboard navigation working
- [ ] Active tab visually clear
- [ ] Lazy load heavy tabs (Audit)
- [ ] Stable layout (no height jumps)
- [ ] Dark mode tested

### Pricing Table
- [ ] Desktop: Table component
- [ ] Mobile: Stacked cards
- [ ] Sortable columns (fee, size)
- [ ] Selected row highlighted
- [ ] Copy row to clipboard
- [ ] Responsive breakpoint: 768px

### Performance
- [ ] Lazy load drawer content
- [ ] Lazy load tab content
- [ ] Virtual scrolling (if >50 offers)
- [ ] Memoize expensive calculations
- [ ] Direct style updates for animations
- [ ] Test with 100+ items

### Accessibility
- [ ] Keyboard navigation complete
- [ ] ARIA labels on all icons
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] Color contrast 4.5:1+
- [ ] Touch targets 44x44px+

---

## 🎯 DECISIONI FINALI

### Card Design
- **Base**: shadcn/ui Card
- **Variant**: interactive (hover effects)
- **Selector**: Select (desktop), Drawer (mobile)
- **Layout**: Header + Content + Footer

### Drawer Design
- **Library**: Vaul (shadcn/ui Drawer)
- **Height**: 90vh mobile, 80vh desktop
- **Features**: Drag-to-dismiss, snap points, background scaling
- **Performance**: Direct style updates, lazy loading

### Tabs Design
- **Library**: Radix Tabs (shadcn/ui)
- **Count**: 6 tabs max
- **Variant**: Default (underline)
- **Loading**: Lazy per tab pesanti

### Mobile Pattern
- **Selector**: Bottom sheet con radio group
- **Pricing**: Stacked cards (non tabella)
- **Drawer**: Full height, drag-to-dismiss
- **Touch**: 44x44px minimum targets

---

**Status**: ✅ READY FOR IMPLEMENTATION  
**Next**: Apply patterns to Tradelia components  
**Estimated Time**: 4-6 hours for all components
