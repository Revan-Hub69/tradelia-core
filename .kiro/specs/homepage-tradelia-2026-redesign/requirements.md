# Requirements Document

## Introduction

Ridisegno completo della homepage Tradelia per conformità ai principi 2026: chiarezza > persuasione, verificabilità > opinione, neutralità > bias. La homepage attuale presenta violazioni critiche dell'architettura, design system e copy guidelines che compromettono l'efficacia del messaggio neutrale e accademico.

## Glossary

- **Tradelia_Homepage**: La pagina principale del sito web Tradelia
- **Design_System**: Sistema di componenti, colori, typography e spacing standardizzati
- **Palette_Istituzionale**: Colori desaturati conformi ai principi di neutralità
- **Copy_Neutrale**: Testi accademici senza linguaggio persuasivo o eccitante
- **Architettura_8_Sezioni**: Struttura homepage con 8 sezioni nell'ordine specifico
- **CSS_Variables**: Variabili CSS per colori e spacing del design system
- **Multilingua_System**: Sistema di traduzioni i18n per supporto italiano/inglese

## Requirements

### Requirement 1: Architettura Homepage Conforme

**User Story:** Come visitatore del sito, voglio una homepage con architettura chiara e logica, così da comprendere immediatamente cosa offre Tradelia senza confusione.

#### Acceptance Criteria

1. WHEN un utente visita la homepage, THE Tradelia_Homepage SHALL presentare esattamente 8 sezioni nell'ordine specificato
2. THE Tradelia_Homepage SHALL iniziare con sezione Hero contenente statement neutrale
3. THE Tradelia_Homepage SHALL includere sezione Contesto che spiega il problema delle affiliazioni
4. THE Tradelia_Homepage SHALL presentare sezione Funzionamento con 3 passaggi concreti
5. THE Tradelia_Homepage SHALL mostrare sezione Esempi con incompatibilità documentate
6. THE Tradelia_Homepage SHALL includere sezione Metodologia con fonti verificabili
7. THE Tradelia_Homepage SHALL presentare sezione Limiti con onestà intellettuale
8. THE Tradelia_Homepage SHALL concludere con sezione CTA discreto e Footer disclaimer

### Requirement 2: Design System Tradelia 2026

**User Story:** Come sviluppatore, voglio un design system completo e coerente, così da mantenere consistenza visiva e rispettare i principi di neutralità.

#### Acceptance Criteria

1. THE Design_System SHALL utilizzare CSS variables per tutti i colori della Palette_Istituzionale
2. THE Design_System SHALL implementare classi typography standardizzate (headline-1, headline-2, body-text, eyebrow-text)
3. THE Design_System SHALL definire spacing classes (section-lg, section-md, section-sm)
4. THE Design_System SHALL utilizzare max-width di 672px (max-w-2xl) per leggibilità ottimale
5. THE Design_System SHALL implementare componenti card-interactive con hover sottili
6. THE Design_System SHALL rispettare contrasti WCAG AAA (7:1) per accessibilità

### Requirement 3: Palette Colori Desaturata

**User Story:** Come visitatore, voglio un'interfaccia con colori neutri e professionali, così da percepire Tradelia come strumento serio e imparziale.

#### Acceptance Criteria

1. THE Palette_Istituzionale SHALL eliminare tutti i colori saturi (red-600, green-600, gray-900)
2. THE Palette_Istituzionale SHALL utilizzare --background: 0 0% 99% per sfondo principale
3. THE Palette_Istituzionale SHALL utilizzare --foreground: 220 15% 12% per testo principale
4. THE Palette_Istituzionale SHALL utilizzare --muted-foreground: 220 10% 40% per testo secondario
5. THE Palette_Istituzionale SHALL utilizzare --border: 220 10% 88% per bordi sottili
6. THE Palette_Istituzionale SHALL alternare background e muted/30 per ritmo visivo

### Requirement 4: Copy Neutrale e Accademico

**User Story:** Come potenziale utente, voglio testi chiari e neutri, così da comprendere cosa fa Tradelia senza pressioni commerciali o linguaggio eccitante.

#### Acceptance Criteria

1. THE Copy_Neutrale SHALL eliminare frasi eccitanti come "Dashboard anti-errori crypto"
2. THE Copy_Neutrale SHALL utilizzare "Verifica la coerenza tra obiettivi e strumenti crypto" come titolo principale
3. THE Copy_Neutrale SHALL sostituire "Inizia la verifica" con "Avvia verifica"
4. THE Copy_Neutrale SHALL includere eyebrow text per ogni sezione (una parola)
5. THE Copy_Neutrale SHALL utilizzare terminologia accademica e precisa
6. THE Copy_Neutrale SHALL evitare superlativi, iperboli e linguaggio persuasivo

### Requirement 5: Sistema Multilingua Funzionante

**User Story:** Come utente internazionale, voglio accedere ai contenuti nella mia lingua, così da comprendere meglio le informazioni presentate.

#### Acceptance Criteria

1. THE Multilingua_System SHALL supportare italiano e inglese con traduzioni complete
2. THE Multilingua_System SHALL implementare fallback a italiano se traduzione mancante
3. THE Multilingua_System SHALL gestire errori di traduzione senza crash dell'applicazione
4. THE Multilingua_System SHALL mantenere coerenza terminologica tra le lingue
5. THE Multilingua_System SHALL utilizzare file JSON separati per ogni lingua
6. THE Multilingua_System SHALL permettere cambio lingua senza reload della pagina

### Requirement 6: Componenti UI Conformi

**User Story:** Come sviluppatore, voglio componenti UI standardizzati e riutilizzabili, così da mantenere coerenza e facilitare manutenzione.

#### Acceptance Criteria

1. THE UI_Components SHALL implementare Button con varianti primary (bg-foreground) e outline
2. THE UI_Components SHALL implementare Card con hover translateY(-1px) sottile
3. THE UI_Components SHALL implementare Section con padding standardizzato
4. THE UI_Components SHALL implementare Container con max-width 672px
5. THE UI_Components SHALL utilizzare transizioni 150ms per tutte le interazioni
6. THE UI_Components SHALL rispettare prefers-reduced-motion per accessibilità

### Requirement 7: Performance e Accessibilità

**User Story:** Come utente con disabilità o connessione lenta, voglio una homepage veloce e accessibile, così da poter utilizzare il servizio senza barriere.

#### Acceptance Criteria

1. THE Tradelia_Homepage SHALL caricare in meno di 2 secondi su connessione 3G
2. THE Tradelia_Homepage SHALL rispettare WCAG AAA per contrasti e navigazione
3. THE Tradelia_Homepage SHALL implementare focus states visibili per navigazione keyboard
4. THE Tradelia_Homepage SHALL utilizzare semantic HTML per screen readers
5. THE Tradelia_Homepage SHALL ottimizzare structured data per SEO
6. THE Tradelia_Homepage SHALL minimizzare bundle size eliminando dipendenze inutili

### Requirement 8: Validazione e Testing

**User Story:** Come team di sviluppo, voglio validazione automatica della conformità, così da garantire che le modifiche rispettino i principi Tradelia 2026.

#### Acceptance Criteria

1. THE Validation_System SHALL verificare utilizzo corretto delle CSS variables
2. THE Validation_System SHALL controllare conformità copy guidelines (no linguaggio eccitante)
3. THE Validation_System SHALL validare architettura 8 sezioni nell'ordine corretto
4. THE Validation_System SHALL testare contrasti colori per WCAG AAA compliance
5. THE Validation_System SHALL verificare funzionamento sistema multilingua
6. THE Validation_System SHALL controllare performance e accessibilità automaticamente