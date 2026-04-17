# TradeScope

TradeScope è la direzione pubblica corrente di Tradelia.

È un simulatore di costi operativi per trader discrezionali e investitori attivi:

- confronta l'impatto reale di spread, funding/swap e commissioni
- misura la pressione dei costi rispetto a orizzonte, leva e frequenza operativa
- aiuta a trovare la combinazione broker + strumento più efficiente in base al contesto

## Stato del repository

Il repository contiene ancora moduli legacy oltre al flusso pubblico corrente.
Per evitare confusione, homepage attiva e homepage legacy sono ora separate.

## Source of truth (prodotto attivo)

Documentazione canonica:

- `docs/README.md`
- `docs/HOMEPAGE_REDESIGN_ARCHITECTURE.md`
- `docs/FRONTEND_SOTA_2026_CHEATSHEET.md`

Architettura homepage attiva:

- route entrypoint: `src/app/[locale]/(unauth)/page.tsx`
- feature root: `src/features/homepage/`
- homepage attiva: `src/features/homepage/ModularHomepage.tsx`
- sezioni modulari: `src/features/homepage/sections/*`
- homepage legacy isolata: `src/features/homepage/legacy/*`

## Legacy material

La documentazione storica è in:

- `docs/legacy/*`
- `legacy/*` (artifact e SQL storici rimossi dalla root)

Questi file non guidano direttamente il prodotto pubblico attuale salvo revisione esplicita.
