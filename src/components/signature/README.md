# Tradelia Signature Design System

Enterprise-grade visual fingerprint components based on 2026 design trends.

## Overview

The Tradelia Signature Design System transforms generic interfaces into enterprise memorable experiences through:

- **Liquid Glass**: Dynamic optical behaviors with micro-grain textures
- **Anti-AI Crafting**: Human-feel textures that differentiate from AI-generated content
- **Signature Branding**: Unique visual elements for instant brand recognition

## Components

### TradelliaGlass
Base glass component with signature micro-grain texture and brand highlights.

```tsx
import { TradelliaGlass } from '@/components/signature';

<TradelliaGlass variant="primary" intensity="medium" shape="default">
  Content with signature glass treatment
</TradelliaGlass>
```

### GlassCard
Pre-configured glass card for common use cases.

```tsx
import { GlassCard } from '@/components/signature';

<GlassCard variant="primary" interactive>
  Interactive card with signature treatments
</GlassCard>
```

### SignatureShape
Unique geometric treatments for brand differentiation.

```tsx
import { SignatureShape } from '@/components/signature';

<SignatureShape shape="pill" variant="primary" size="md">
  Tradelia Pill Shape
</SignatureShape>
```

### VisualWeight
Consistent visual hierarchy system.

```tsx
import { VisualWeight, HeroBanner, ContentCard } from '@/components/signature';

<HeroBanner>Primary attention element</HeroBanner>
<ContentCard>Important supporting content</ContentCard>
```

## CSS Utilities

The system includes utility classes for consistent application:

- `.glass-tradelia` - Signature glass treatment
- `.shape-tradelia-pill` - Pill shape
- `.shape-tradelia-notch` - Notch shape  
- `.shape-tradelia-cut` - Cut shape
- `.weight-primary` - Primary visual weight
- `.weight-secondary` - Secondary visual weight
- `.weight-tertiary` - Tertiary visual weight

## Design Tokens

Signature tokens are available in CSS custom properties:

```css
:root {
  /* Glass treatments */
  --glass-tradelia-bg: rgba(255, 255, 255, 0.1);
  --glass-tradelia-border: rgba(255, 255, 255, 0.2);
  --glass-tradelia-highlight: rgba(var(--primary-rgb), 0.1);
  
  /* Motion personality */
  --ease-tradelia: cubic-bezier(0.34, 1.56, 0.64, 1);
  --delay-tradelia-micro: 40ms;
  
  /* Texture */
  --texture-grain: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
}
```

## Integration Guide

### Upgrading Existing Components

1. **Replace generic cards** with `GlassCard` or `TradelliaGlass`
2. **Add signature shapes** for badges and labels using `SignatureShape`
3. **Apply visual hierarchy** with `VisualWeight` components
4. **Use utility classes** for consistent styling

### Example Integration

```tsx
// Before: Generic design
<div className="bg-white/10 border border-white/20 rounded-xl p-6">
  <span className="bg-primary text-white px-3 py-1 rounded-full">Badge</span>
  <h3>Title</h3>
  <p>Description</p>
</div>

// After: Signature Tradelia
<GlassCard variant="secondary" interactive>
  <SignatureShape shape="pill" variant="primary" size="sm">Badge</SignatureShape>
  <h3>Title</h3>
  <p>Description</p>
</GlassCard>
```

## Performance Considerations

- Uses GPU-accelerated transforms and opacity
- Respects `prefers-reduced-motion`
- Optimized for 60fps interactions
- Minimal DOM overhead

## Accessibility

- Full WCAG 2.1 AA compliance
- Proper focus management
- Screen reader support
- Motion preference respect

## Browser Support

- Modern browsers with backdrop-filter support
- Graceful degradation for older browsers
- CSS custom properties required