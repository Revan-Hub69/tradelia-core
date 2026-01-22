# Tradelia Icon System v2026

## Objective
Create a distinctive Tradelia signature icon system that reads enterprise-grade (calm, precise, crisp), with one subtle signature detail per icon — **no glow, no blur**.

## Core Rules
### IconBase (single source of truth)
- **24px viewBox** (`0 0 24 24`)
- `vector-effect="non-scaling-stroke"`
- `shape-rendering="geometricPrecision"`
- **Default strokeWidth: `1.75`** (use `2.0` only for specific weight needs)
- Tone variants via className:
  - `icon-tone-default`
  - `icon-tone-muted`
  - `icon-tone-active`
  - `icon-tone-danger`
  - `icon-tone-success`

### Signature Style
- One micro **notch / node / star** motif per nav icon.
- The signature is **geometry**, not effects.
- Must remain legible at **20px**.
- Same position language across nav icons (use a consistent corner/axis).

### Interaction
- Hover: **micro-contrast + micro-lift** (CSS only).
- Active: **accent + tonebar** preferred.
- Focus-visible: **ring + minimal drop-shadow**.
- Motion: **120–180ms**, no bounce, no continuous pulses.
- Respect `prefers-reduced-motion`: animations become static.

## Do / Don’t
**Do**
- Use clean geometry, aligned to the 24px grid.
- Use `strokeWidth={1.75}` in IconBase.
- Add one signature node per nav icon.
- Keep paths readable at 20–24px sizes.

**Don’t**
- ❌ Use Gaussian blur filters.
- ❌ Use global opacity on the SVG.
- ❌ Scale SVG via transforms (size via width/height only).
- ❌ Continuous pulsing or bouncing animations.

## Building a New Icon (Checklist)
1. Start from `IconBase`.
2. Draw on a **24px grid** with whole or half-pixel coordinates.
3. Use **only strokes** unless a solid fill is necessary for the signature node.
4. Add the signature node (same motif, same relative position).
5. Test at **20px** and **24px** sizes.

## QA Checklist
- [ ] Icon renders at 20px and 24px without visual noise.
- [ ] Signature node is visible but subtle.
- [ ] No blur filters, no SVG opacity, no scale transforms.
- [ ] Hover: micro-lift only (CSS), no bouncing.
- [ ] Focus-visible: ring + minimal shadow.
- [ ] `prefers-reduced-motion` disables motion.
- [ ] Sidebar + PWA bottom nav show consistent sizing.
