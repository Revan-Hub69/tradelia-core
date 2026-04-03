# TradeScope

TradeScope is the current public product direction for Tradelia.

It is a trading cost simulator for discretionary traders and active investors:

- compares the real cost impact of spreads, swaps, and commissions
- maps cost pressure to holding horizon, leverage, and trade frequency
- helps identify the broker and instrument setup that protects net returns

## Current Product Scope

The repo still contains legacy dashboard, challenge, and research modules from previous directions.

Canonical product direction for the homepage and public narrative is now:

- single-tool landing
- cost-first decision support
- no prop-firm marketplace framing
- no multi-tool directory framing

## Canonical Docs

Use these files as the source of truth for the current direction:

- `docs/README.md`
- `docs/HOMEPAGE_REDESIGN_ARCHITECTURE.md`
- `docs/FRONTEND_SOTA_2026_CHEATSHEET.md`

## Legacy Material

Files about trading challenges, prop firms, or AI signals are legacy or research context.
They should not drive new public-facing copy unless they are explicitly re-approved.

## Development

Core public entrypoint:

- `src/app/[locale]/(unauth)/page.tsx`

Main homepage sections:

- `src/templates/Navbar.tsx`
- `src/templates/TradeHero.tsx`
- `src/templates/ProblemSection.tsx`
- `src/templates/HowItWorks.tsx`
- `src/templates/ScenarioSection.tsx`
- `src/templates/FAQ.tsx`
- `src/templates/LandingFooter.tsx`

Translations:

- `messages/it/*`
- `messages/en/*`

## Positioning Guardrails

Do:

- speak in terms of execution costs, cost drag, broker fee structure, holding pressure
- make the product feel like a quantitative decision interface
- privilege product truth over marketing language

Do not:

- describe the homepage as a prop-firm hub
- describe the product as three separate tools
- reintroduce generic SaaS landing tropes as the main visual language
