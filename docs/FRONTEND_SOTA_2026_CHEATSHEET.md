# Frontend Cheat Sheet

TradeScope homepage design rules.

Use this document for public landing work.

## Visual Direction

Target:

- fintech product UI
- clean, sharp, data-aware
- more "analysis console" than "marketing site"

Not target:

- generic SaaS hero
- soft startup gradients
- random glass cards
- testimonial-first layout

## Typography

Use typography to separate narrative from data:

- H1/H2: strong, compressed, low-ornament
- body: readable, neutral
- micro labels: mono, uppercase, tracked
- numeric output: mono whenever it improves scanning

Rules:

- keep headings short
- avoid decorative highlighted words unless they carry meaning
- use mono for labels, values, and system-like meta

## Color Strategy

Base:

- light neutral background
- deep slate surfaces
- one strong blue for primary actions
- amber/red only for cost pressure and warning states

Color should explain:

- blue = action or neutral analytical emphasis
- amber = caution / hold pressure
- red = drag / erosion / negative cost impact
- green only when there is a real positive state, not as decoration

## Layout Rules

Homepage should feel like a sequence of product surfaces:

1. thesis
2. problem
3. mechanism
4. simulator

Use:

- asymmetric grids
- panel rhythm
- compact row structures
- explicit section breaks

Avoid:

- endless same-looking cards
- four equally weighted columns
- large empty center-aligned blocks stacked forever

## Panels

Preferred panel language:

- sharp border hierarchy
- medium radius, not pill-everything
- dense internal structure
- subtle shadows
- occasional dark monitor surfaces for data-heavy areas

Good panel anatomy:

- eyebrow
- main label
- one meaningful number or visual
- one short explanatory line

## Hero Rules

Hero must do three things:

- state the problem
- state the mechanism
- move to the simulator

Hero visual should be:

- diagnostic
- comparative
- legible at a glance

Hero visual should not be:

- abstract
- decorative
- a random fintech illustration

## Simulator Preview Rules

The simulator block must look close to a real tool.

Required traits:

- visible inputs
- output hierarchy
- cost attribution
- one or two interpretation cues

Avoid:

- fake realism with too many made-up numbers
- empty charts with generic labels
- CTA-only preview without analytical consequence

## Motion

Use motion sparingly:

- section reveal
- accordion expansion
- hover state refinement

Avoid:

- floating blobs
- repeated spring animations on every card
- motion that competes with reading

## Content Density

TradeScope should feel denser than a startup landing, but lighter than a trading terminal.

Good:

- labels
- values
- short analytical notes
- compact tables or matrices

Bad:

- walls of copy
- empty whitespace used as fake premium
- multiple explanatory paragraphs where one sharp sentence is enough

## Implementation Notes

Use these component goals:

- `Navbar`: compact market-data framing
- `TradeHero`: thesis + diagnostic surface
- `ProblemSection`: cost drag matrix
- `HowItWorks`: mechanism with system flavor
- `ScenarioSection`: control panel + analysis console
- `FAQ`: friction removal, not visual centerpiece

## Review Checklist

Before shipping a homepage change, verify:

- does the page still read as one product?
- does the first screen explain the value without scrolling?
- does the visual hierarchy privilege the simulator?
- does the design feel more like a product interface than a SaaS template?
- are docs and metadata still aligned with the same positioning?
