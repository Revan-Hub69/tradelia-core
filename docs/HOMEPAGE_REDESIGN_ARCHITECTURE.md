# Homepage Redesign Architecture

## Product Direction

Homepage direction is now fixed:

- one product
- one promise
- one primary CTA

Product:

- `TradeScope`
- a trading cost simulator
- focused on spreads, swaps, commissions, leverage, and holding horizon

This is not a prop-firm marketplace and not a directory of unrelated tools.

## Homepage Job

The homepage must do four things in order:

1. create doubt about the trader's current instrument or broker choice
2. explain why cost structure destroys otherwise valid strategies
3. show a believable calculation mechanism
4. transition the user into the simulator

## Design Direction

Visual language target:

- terminal-lite, not Bloomberg cosplay
- product interface first, landing page second
- high signal density, low decorative fluff
- crisp surfaces and strong hierarchy
- quantitative credibility over testimonials

Avoid:

- generic SaaS gradients
- oversized glassmorphism everywhere
- fake trust badges
- testimonial walls
- multiple equal CTAs competing for attention

## Information Hierarchy

### 1. Navbar

Purpose:

- anchor the narrative
- expose the simulator CTA immediately
- use compact market-data style microcopy

### 2. Hero

Purpose:

- present the core thesis fast
- show that the product reasons about cost structure, not vague "insights"

Must contain:

- sharp H1
- cost-first subtitle
- one primary CTA
- one diagnostic visual

### 3. Problem Section

Purpose:

- amplify the user's hidden loss mechanism
- make cost drag feel structural rather than incidental

Must contain:

- direct statement of pain
- explanation of why trader habit creates drag
- compact quantitative panel or matrix

### 4. Mechanism Section

Purpose:

- explain how the simulator works without sounding magical

Must contain:

- three clear steps
- plain language
- no AI theater

### 5. Simulator Preview

Purpose:

- feel like a real product surface
- show how user inputs change the analysis

Must contain:

- capital
- leverage
- holding horizon
- trade frequency
- output surface with cost pressure interpretation

### 6. FAQ

Purpose:

- remove friction
- clarify scope and methodology

### 7. Disclaimer + Footer

Purpose:

- close the page with clarity, not filler

## Component Map

Current component ownership:

- `src/templates/Navbar.tsx`
- `src/templates/TradeHero.tsx`
- `src/templates/ProblemSection.tsx`
- `src/templates/HowItWorks.tsx`
- `src/templates/ScenarioSection.tsx`
- `src/templates/FAQ.tsx`
- `src/templates/DisclaimerBar.tsx`
- `src/templates/LandingFooter.tsx`

## Copy Guardrails

Preferred vocabulary:

- cost drag
- holding pressure
- execution quality
- broker fee structure
- real spreads
- overnight swaps
- deterministic output

Avoid:

- life-changing
- unlock alpha
- AI-powered edge
- best broker in the world
- guaranteed profits

## UX Guardrails

- mobile first
- CTA visible within first viewport
- one dominant path
- section anchors must match navbar items
- visuals must support the thesis, not decorate it

## Success Criteria

The homepage is aligned when:

- a new visitor understands the product in under 10 seconds
- the page feels like a quantitative product, not a startup template
- the simulator preview feels adjacent to a real workflow
- documentation and metadata describe the same product
