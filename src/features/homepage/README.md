# Homepage Architecture (clean split)

Questa cartella è l'unica source-of-truth per la homepage pubblica.

## Entry points

- `ModularHomepage.tsx` → homepage attiva.
- `legacy/LegacyHomepage.tsx` → homepage precedente, isolata in legacy.

## Regole per refactor futuri

1. Nuove sezioni: aggiungerle solo in `sections/`.
2. Codice legacy: mai rimetterlo in `src/templates/`, mantenerlo in `legacy/`.
3. `src/app/[locale]/(unauth)/page.tsx` deve importare dal barrel `@/features/homepage`.
4. Il simulatore in homepage resta placeholder finché il nuovo engine modulare non è pronto.

## Perché

Separare "active" e "legacy" riduce ambiguità per agenti e sviluppatori:
- meno punti di ingresso
- meno import incrociati
- percorso di migrazione esplicito
