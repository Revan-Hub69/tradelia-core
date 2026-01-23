# Hydration Snapshots Logs

Questa directory contiene i logs catturati dal `ProductionHydrationLogger` in produzione.

## 📁 File generati

### Snapshot completi (JSON)
- `hydration-after-hydration-TIMESTAMP.json` - Snapshot dopo hydration
- `hydration-after-interaction-TIMESTAMP.json` - Snapshot dopo prima interazione
- `hydration-on-error-TIMESTAMP.json` - Snapshot quando React hydration error

Ogni file contiene:
- Full document HTML
- Tutti gli elementi header
- Tutti i `.glass-button` con 40+ CSS properties
- Tutti i `.header-icon` con 40+ CSS properties
- CSS files caricati
- Runtime flags
- Performance timing

### Log aggregati (JSONL)
- `hydration-snapshots.jsonl` - Tutti gli snapshot (1 JSON per riga)
- `hydration-summary.jsonl` - Summary compatti per quick scan

## 🔍 Come analizzare

### Metodo 1: Script automatico (RACCOMANDATO)
```bash
node scripts/analyze-hydration-snapshots.js
```

Output:
- Confronto automatico BEFORE vs AFTER
- Classi aggiunte/rimosse
- CSS properties cambiate (con valori)
- Inline styles cambiati

### Metodo 2: Manuale con jq
```bash
# Mostra tutti i snapshot
cat hydration-snapshots.jsonl | jq '.'

# Mostra solo i summary
cat hydration-summary.jsonl | jq '.'

# Filtra per tipo
cat hydration-snapshots.jsonl | jq 'select(.snapshotType == "after-hydration")'

# Estrai backdrop-filter del primo button
cat hydration-snapshots.jsonl | jq '.allGlassButtons[0].computedStyles.backdropFilter'
```

### Metodo 3: Apri JSON in VS Code
1. Apri file `hydration-after-hydration-*.json`
2. Usa "Format Document" (Shift+Alt+F)
3. Naviga la struttura con fold/unfold

## 📊 Struttura snapshot

```json
{
  "timestamp": 1737648645123,
  "snapshotType": "after-hydration",
  "url": "https://tradelia.org/dashboard",
  "theme": "dark",
  "viewport": { "width": 1920, "height": 1080 },
  
  "allGlassButtons": [
    {
      "selector": "button#theme-switcher.glass-button.header-icon",
      "tagName": "BUTTON",
      "id": "theme-switcher",
      "classes": ["glass-button", "header-icon", "relative", "flex", ...],
      "attributes": {
        "type": "button",
        "aria-label": "Cambia tema",
        "data-state": "closed"
      },
      "inlineStyle": "will-change: transform; transform: translateZ(0px);",
      "computedStyles": {
        "backdropFilter": "none",  // ❌ PROBLEMA!
        "background": "rgba(255, 255, 255, 0.6)",  // ❌ Light in dark!
        "transform": "matrix(1, 0, 0, 1, 0, 0)",
        "transition": "background-color 0.3s ...",
        "animation": "none 0s ease 0s 1 normal none running",
        "boxShadow": "rgba(0, 0, 0, 0.2) 0px 4px 16px 0px, ...",
        // ... altri 30+ properties
      },
      "outerHTML": "<button type=\"button\" ...",
      "boundingRect": {
        "x": 1800,
        "y": 20,
        "width": 44,
        "height": 44
      }
    }
  ],
  
  "cssFiles": [
    {
      "href": "https://tradelia.org/_next/static/css/33f9fee427a0ea62.css",
      "disabled": false,
      "rulesCount": 1234
    }
  ],
  
  "runtimeFlags": {
    "ready": true,
    "theme": "dark"
  },
  
  "performanceTiming": {
    "domContentLoaded": 1234,
    "loadComplete": 2345,
    "timeSincePageLoad": 3456
  }
}
```

## 🎯 Cosa cercare

### Problema: backdrop-filter
```bash
# Confronta before/after
cat hydration-snapshots.jsonl | jq -r '
  select(.snapshotType == "after-hydration" or .snapshotType == "after-interaction") |
  "\(.snapshotType): \(.allGlassButtons[0].computedStyles.backdropFilter)"
'
```

Output atteso:
```
after-hydration: none  ❌
after-interaction: blur(12px)  ✅
```

### Problema: background colors
```bash
cat hydration-snapshots.jsonl | jq -r '
  "\(.snapshotType): \(.allGlassButtons[0].computedStyles.background)"
'
```

### Problema: classi mancanti
```bash
cat hydration-snapshots.jsonl | jq '
  {
    type: .snapshotType,
    classes: .allGlassButtons[0].classes
  }
'
```

## 🧹 Pulizia logs

```bash
# Rimuovi logs vecchi (più di 7 giorni)
find logs/ -name "hydration-*.json" -mtime +7 -delete

# Rimuovi tutti i logs
rm -f logs/hydration-*.json logs/*.jsonl
```

## 📝 Note

- I logs sono generati SOLO in production (`NODE_ENV=production`)
- Ogni visita genera 1-2 snapshot (after-hydration + after-interaction)
- I file possono diventare grandi (100KB-1MB per snapshot)
- Considera di implementare log rotation se necessario
