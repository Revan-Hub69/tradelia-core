# Repository Audit — 2026-04-17

Obiettivo: ridurre rumore operativo e separare artefatti non allineati allo stato prodotto corrente.

## Verifica top-level (cartella per cartella)

- `.github`, `.husky`, `.storybook`, `.vscode`: infrastruttura progetto (mantenute).
- `docs`: documentazione attiva + archivio storico (mantenuta).
- `legacy`: archivio storico centralizzato (estesa in questo audit).
- `messages`, `migrations`, `public`, `src`, `supabase`, `tests`: runtime/prodotto (mantenute).
- `scripts`: ripulita; tenuto solo lo script ancora richiamato dal workflow corrente.

## Azioni eseguite

1. **Archiviazione script non usati**
   - spostati da `scripts/` a `legacy/scripts/` tutti gli script non referenziati da `package.json` o da flussi attivi;
   - mantenuto in `scripts/` solo `validate-translations.ts` (usato da `npm run i18n:validate`).

2. **Archiviazione SQL storico in root**
   - spostato `supabase_trading_schema.sql` in `legacy/sql/`.

3. **Pulizia artefatti di log tracciati**
   - rimossi `.codex-next-dev.err.log` e `.codex-next-dev.out.log` dal repository;
   - aggiunta regola `.codex-next-dev*.log` in `.gitignore`.

## Nota di governance

Le cartelle legacy mantengono il materiale storico per tracciabilità,
ma non sono source-of-truth per prodotto o implementazione corrente.
