# Tradelia 2026 - Contracts

> Se non è scritto, verrà rotto.

Questa cartella contiene i contratti fondamentali del progetto. Ogni contratto definisce regole vincolanti che devono essere rispettate da umani e AI.

## Contratti Attivi

| Contratto | Descrizione | Status |
|-----------|-------------|--------|
| [design-contract.md](./design-contract.md) | Palette, contrasti, focus, spacing | ✅ Attivo |
| [ux-contract.md](./ux-contract.md) | Comportamenti mobile, ESC, errori, stati vuoti | ✅ Attivo |
| [state-contract.md](./state-contract.md) | Ownership dello stato (sidebar, auth, layout) | ✅ Attivo |
| [security-contract.md](./security-contract.md) | Cosa è pubblico, cosa no | ✅ Attivo |
| [sidebar-contract.md](./sidebar-contract.md) | Specifiche sidebar hybrid | ✅ Attivo |

## Regola d'Oro

**Se non puoi verificarlo automaticamente, non è finito.**

## Come Usare

1. Prima di implementare una feature, leggi i contratti rilevanti
2. Se una regola non è chiara, chiedi prima di procedere
3. Se devi violare un contratto, documenta il perché e aggiorna il contratto
4. L'AI deve seguire questi contratti come vincoli, non suggerimenti
