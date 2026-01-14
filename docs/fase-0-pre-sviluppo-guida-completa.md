# FASE 0: PRE-SVILUPPO - Guida Accademica Completa

> Documento di ricerca approfondita per Tradelia 2.0
> Fonti: Steve Blank, Rob Fitzpatrick, Clayton Christensen, Alexander Osterwalder, Nielsen Norman Group, IDEO

---

## Indice

1. [Problem Definition](#1-problem-definition)
2. [Empathy Mapping](#2-empathy-mapping)
3. [User Personas](#3-user-personas)
4. [Customer Discovery (Steve Blank)](#4-customer-discovery)
5. [The Mom Test (Rob Fitzpatrick)](#5-the-mom-test)
6. [Jobs To Be Done (Clayton Christensen)](#6-jobs-to-be-done)
7. [Value Proposition Canvas (Osterwalder)](#7-value-proposition-canvas)
8. [Competitive Analysis](#8-competitive-analysis)
9. [Tecniche di Validazione](#9-tecniche-di-validazione)
10. [Applicazione a Tradelia 2.0](#10-applicazione-a-tradelia)

---

## 1. PROBLEM DEFINITION

### 1.1 Cos'è un Problem Statement?

Un problem statement è una descrizione chiara e concisa del problema che un progetto cerca di risolvere. Evidenzia il gap tra la situazione attuale e l'outcome ideale.

**Perché è importante:**
- Allinea il team sulla direzione
- Guida ogni decisione di design
- Misura la rilevanza delle idee prodotte
- Evita di costruire soluzioni per problemi inesistenti

### 1.2 Point of View (POV) Statement - Design Thinking

Il POV è il formato standard per definire il problema nel Design Thinking. Si basa su una comprensione profonda degli utenti specifici, dei loro bisogni e degli insight più essenziali.

**Formula POV:**
```
[UTENTE] ha bisogno di [BISOGNO] perché [INSIGHT]
```

**Esempio generico:**
```
Marco, un professionista di 35 anni, ha bisogno di 
un modo per imparare le crypto in 10 minuti al giorno
perché vuole investire ma si sente sopraffatto dalla complessità
e non ha tempo per corsi lunghi.
```

### 1.3 "How Might We" (HMW) Questions

Dopo aver definito il POV, si trasforma in domande "How Might We" per aprire lo spazio delle soluzioni.

**Formula:**
```
How might we [AZIONE] per [UTENTE] in modo che [OUTCOME]?
```

**Regole per buone HMW:**
- Non troppo ampie (es. "HMW risolvere l'educazione?")
- Non troppo strette (es. "HMW aggiungere un bottone?")
- Non suggeriscono già una soluzione
- Invitano alla collaborazione e esplorazione

**Esempi per Tradelia:**
```
✅ HMW rendere l'apprendimento crypto così coinvolgente 
   che gli utenti vogliano tornare ogni giorno?

✅ HMW trasformare concetti complessi in lezioni 
   che si completano in 5 minuti?

✅ HMW dare agli utenti un senso di progresso 
   anche dopo una sola sessione?

❌ HMW aggiungere badge all'app? (troppo specifica)
❌ HMW educare le persone? (troppo vaga)
```

### 1.4 5 Whys Technique

Tecnica per arrivare alla root cause di un problema, chiedendo "perché" 5 volte consecutive.

**Esempio:**
```
Problema: Gli utenti abbandonano i corsi crypto

1. Perché? → Perché li trovano noiosi
2. Perché? → Perché sono troppo lunghi e teorici
3. Perché? → Perché sono progettati come corsi universitari
4. Perché? → Perché i creatori sono esperti, non educatori
5. Perché? → Perché non hanno studiato come le persone imparano

ROOT CAUSE: I corsi crypto non sono progettati 
con principi di learning design e gamification
```

---

## 2. EMPATHY MAPPING

### 2.1 Cos'è un Empathy Map?

Un Empathy Map è una visualizzazione collaborativa che articola cosa sappiamo di un tipo specifico di utente. Creato da Dave Gray, è diventato uno strumento fondamentale nel Design Thinking.

**Scopo:**
- Creare comprensione condivisa dei bisogni utente
- Esternalizzare la conoscenza sugli utenti
- Guidare le decisioni di design
- Identificare gap nella ricerca

### 2.2 I 4 Quadranti Tradizionali (Nielsen Norman Group)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         [UTENTE/PERSONA]                        │
│                              👤                                 │
│                                                                 │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                    │
│         SAYS               │              THINKS                │
│    (Cosa dice)             │           (Cosa pensa)             │
│                            │                                    │
│  Citazioni dirette dalle   │  Cosa occupa la sua mente?         │
│  interviste. Cosa dice     │  Cosa è importante per lui?        │
│  ad alta voce?             │  Preoccupazioni non espresse?      │
│                            │                                    │
├────────────────────────────┼────────────────────────────────────┤
│                            │                                    │
│         DOES               │              FEELS                 │
│     (Cosa fa)              │          (Cosa sente)              │
│                            │                                    │
│  Azioni e comportamenti    │  Stato emotivo. Cosa lo           │
│  osservabili. Come si      │  preoccupa? Cosa lo eccita?       │
│  comporta in pubblico?     │  Come si sente riguardo           │
│                            │  all'esperienza?                   │
│                            │                                    │
└────────────────────────────┴────────────────────────────────────┘
```

### 2.3 Empathy Map Estesa (con Pains & Gains)

```
┌─────────────────────────────────────────────────────────────────┐
│                         [UTENTE/PERSONA]                        │
├────────────────────────────┬────────────────────────────────────┤
│         SAYS               │              THINKS                │
├────────────────────────────┼────────────────────────────────────┤
│         DOES               │              FEELS                 │
├────────────────────────────┴────────────────────────────────────┤
│                                                                 │
│    PAINS (Frustrazioni)         │      GAINS (Desideri)        │
│    ─────────────────────        │      ────────────────        │
│    • Paure                      │      • Desideri              │
│    • Frustrazioni               │      • Bisogni               │
│    • Ostacoli                   │      • Misure di successo    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Come Compilare un Empathy Map

**Step 1: Definire l'utente**
- Chi stiamo mappando? (persona specifica o segmento)
- Qual è la situazione/contesto?

**Step 2: Raccogliere dati**
- Interviste utente
- Osservazioni sul campo
- Survey e questionari
- Dati analytics
- Feedback support

**Step 3: Compilare i quadranti**
- Usare post-it (uno per insight)
- Citare direttamente quando possibile
- Distinguere fatti da assunzioni

**Step 4: Sintetizzare**
- Identificare pattern
- Evidenziare contraddizioni (Says vs Does)
- Estrarre insight chiave

### 2.5 Empathy Map per Tradelia 2.0

```
┌─────────────────────────────────────────────────────────────────┐
│                    CRYPTO CURIOUS MARCO                         │
│                    35 anni, impiegato                           │
├────────────────────────────┬────────────────────────────────────┤
│         SAYS               │              THINKS                │
│                            │                                    │
│ "Le crypto sono troppo     │ "Tutti ne parlano, dovrei         │
│  complicate per me"        │  capirci qualcosa anch'io"        │
│                            │                                    │
│ "Non ho tempo per          │ "È troppo tardi per entrare?      │
│  studiare queste cose"     │  Ho già perso il treno?"          │
│                            │                                    │
│ "Ho paura di perdere       │ "Non voglio sembrare ignorante    │
│  tutti i miei soldi"       │  quando ne parlano gli amici"     │
│                            │                                    │
│ "Non so da dove iniziare"  │ "Sarà una truffa come dicono      │
│                            │  in TV?"                          │
├────────────────────────────┼────────────────────────────────────┤
│         DOES               │              FEELS                 │
│                            │                                    │
│ • Guarda video YouTube     │ 😰 FOMO (Fear of Missing Out)     │
│   casuali sulle crypto     │                                    │
│                            │ 😕 Confusione e overwhelm         │
│ • Chiede ad amici che      │                                    │
│   "ne sanno di più"        │ 😤 Frustrazione per la            │
│                            │    complessità                     │
│ • Rimanda l'apprendimento  │                                    │
│   "lo faccio domani"       │ 😟 Ansia di fare errori           │
│                            │    irreversibili                   │
│ • Legge titoli di news     │                                    │
│   ma non approfondisce     │ 🤔 Curiosità mista a scetticismo  │
│                            │                                    │
├────────────────────────────┴────────────────────────────────────┤
│  PAINS                          │  GAINS                        │
│  ──────                         │  ─────                        │
│  • Overload informativo         │  • Capire le basi in poco     │
│  • Linguaggio troppo tecnico    │    tempo (5-10 min/giorno)    │
│  • Mancanza di percorso         │  • Sentirsi sicuro nelle      │
│    strutturato                  │    conversazioni              │
│  • Paura di errori irreversibili│  • Progressione chiara        │
│  • Non sapere di chi fidarsi    │  • Apprendimento senza stress │
│  • Tempo limitato               │  • Sapere "abbastanza"        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. USER PERSONAS

### 3.1 Cos'è una Persona?

Una persona è un personaggio fittizio ma basato su dati reali che rappresenta un segmento di utenti chiave. Serve a umanizzare i dati di ricerca e guidare le decisioni di design.

**Componenti di una Persona:**

| Sezione | Contenuto |
|---------|-----------|
| **Demographics** | Nome, età, occupazione, location |
| **Background** | Storia, contesto, situazione |
| **Goals** | Cosa vuole ottenere |
| **Frustrations** | Pain points, ostacoli |
| **Motivations** | Cosa lo spinge ad agire |
| **Behaviors** | Come si comporta, abitudini |
| **Tech Savviness** | Livello di competenza tecnologica |
| **Quote** | Frase rappresentativa |

### 3.2 Persona Template

```
┌─────────────────────────────────────────────────────────────────┐
│  📷 FOTO        NOME: _______________                           │
│                 ETÀ: ____  OCCUPAZIONE: _______________         │
│                 LOCATION: _______________                       │
│                                                                 │
│  "Quote rappresentativa che cattura l'essenza della persona"    │
├─────────────────────────────────────────────────────────────────┤
│  BACKGROUND                                                     │
│  ───────────                                                    │
│  [Breve storia e contesto della persona]                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  GOALS                        │  FRUSTRATIONS                   │
│  ─────                        │  ────────────                   │
│  • Goal 1                     │  • Frustration 1                │
│  • Goal 2                     │  • Frustration 2                │
│  • Goal 3                     │  • Frustration 3                │
│                               │                                 │
├───────────────────────────────┼─────────────────────────────────┤
│  MOTIVATIONS                  │  BEHAVIORS                      │
│  ───────────                  │  ─────────                      │
│  • Motivation 1               │  • Behavior 1                   │
│  • Motivation 2               │  • Behavior 2                   │
│  • Motivation 3               │  • Behavior 3                   │
│                               │                                 │
├───────────────────────────────┴─────────────────────────────────┤
│  TECH SAVVINESS: ○○○○○ (1-5)                                    │
│  CRYPTO KNOWLEDGE: ○○○○○ (1-5)                                  │
│  TIME AVAILABLE: ○○○○○ (1-5)                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Personas per Tradelia 2.0

**PERSONA 1: Marco "Il Curioso"**

```
┌─────────────────────────────────────────────────────────────────┐
│  👨‍💼          MARCO ROSSI                                       │
│               35 anni, Account Manager                          │
│               Milano, Italia                                    │
│                                                                 │
│  "Tutti parlano di Bitcoin ma io non ci capisco niente.        │
│   Vorrei almeno sapere di cosa stanno parlando."               │
├─────────────────────────────────────────────────────────────────┤
│  BACKGROUND                                                     │
│  Marco lavora in una azienda di consulenza. Ha una famiglia    │
│  con due figli piccoli. Ha poco tempo libero ma è curioso      │
│  di natura. Ha sentito colleghi parlare di crypto e si sente   │
│  escluso dalle conversazioni.                                   │
├─────────────────────────────────────────────────────────────────┤
│  GOALS                        │  FRUSTRATIONS                   │
│  • Capire le basi delle       │  • Troppa informazione          │
│    crypto in poco tempo       │    contraddittoria online       │
│  • Partecipare alle           │  • Linguaggio troppo tecnico    │
│    conversazioni con colleghi │  • Non sa da dove iniziare      │
│  • Valutare se investire      │  • Paura di sembrare stupido    │
│    una piccola somma          │    facendo domande              │
├───────────────────────────────┼─────────────────────────────────┤
│  MOTIVATIONS                  │  BEHAVIORS                      │
│  • FOMO sociale               │  • Usa smartphone 2h/giorno     │
│  • Curiosità intellettuale    │  • Preferisce video brevi       │
│  • Potenziale guadagno        │  • Impara durante commute       │
│  • Non restare indietro       │  • Abbandona contenuti lunghi   │
├───────────────────────────────┴─────────────────────────────────┤
│  TECH SAVVINESS: ●●●○○ (3/5)                                    │
│  CRYPTO KNOWLEDGE: ●○○○○ (1/5)                                  │
│  TIME AVAILABLE: ●●○○○ (2/5)                                    │
└─────────────────────────────────────────────────────────────────┘
```

**PERSONA 2: Giulia "La Scettica"**

```
┌─────────────────────────────────────────────────────────────────┐
│  👩‍🎓          GIULIA BIANCHI                                    │
│               28 anni, Data Analyst                             │
│               Roma, Italia                                      │
│                                                                 │
│  "Ho sentito troppe storie di truffe. Voglio capire            │
│   la tecnologia prima di mettere anche solo 1 euro."           │
├─────────────────────────────────────────────────────────────────┤
│  BACKGROUND                                                     │
│  Giulia ha una laurea in statistica e lavora con i dati.       │
│  È naturalmente scettica e vuole prove concrete. Ha amici      │
│  che hanno perso soldi in crypto e vuole evitare gli stessi    │
│  errori. Apprezza l'apprendimento strutturato.                 │
├─────────────────────────────────────────────────────────────────┤
│  GOALS                        │  FRUSTRATIONS                   │
│  • Capire la tecnologia       │  • Hype esagerato sui social    │
│    blockchain in profondità   │  • Mancanza di fonti affidabili │
│  • Distinguere progetti       │  • "Guru" che vendono corsi     │
│    legittimi da truffe        │  • Informazioni superficiali    │
│  • Prendere decisioni         │  • Nessun percorso strutturato  │
│    informate                  │                                 │
├───────────────────────────────┼─────────────────────────────────┤
│  MOTIVATIONS                  │  BEHAVIORS                      │
│  • Sicurezza finanziaria      │  • Ricerca approfondita         │
│  • Comprensione tecnica       │  • Legge documentazione         │
│  • Autonomia decisionale      │  • Confronta più fonti          │
│  • Non farsi fregare          │  • Prende appunti               │
├───────────────────────────────┴─────────────────────────────────┤
│  TECH SAVVINESS: ●●●●○ (4/5)                                    │
│  CRYPTO KNOWLEDGE: ●●○○○ (2/5)                                  │
│  TIME AVAILABLE: ●●●○○ (3/5)                                    │
└─────────────────────────────────────────────────────────────────┘
```

**PERSONA 3: Luca "L'Entusiasta"**

```
┌─────────────────────────────────────────────────────────────────┐
│  👨‍💻          LUCA VERDI                                        │
│               22 anni, Studente Universitario                   │
│               Bologna, Italia                                   │
│                                                                 │
│  "Ho già comprato qualche crypto ma non so davvero             │
│   cosa sto facendo. Voglio imparare sul serio."                │
├─────────────────────────────────────────────────────────────────┤
│  BACKGROUND                                                     │
│  Luca studia economia e ha già fatto qualche trade su          │
│  exchange. Ha guadagnato e perso soldi senza capire perché.    │
│  Vuole passare da "gambler" a investitore informato.           │
│  Usa molto il telefono e ama le app gamificate.                │
├─────────────────────────────────────────────────────────────────┤
│  GOALS                        │  FRUSTRATIONS                   │
│  • Capire perché i prezzi     │  • Ha perso soldi per           │
│    salgono e scendono         │    decisioni impulsive          │
│  • Imparare analisi tecnica   │  • Non capisce i whitepaper     │
│    e fondamentale             │  • Troppi "segnali" su Telegram │
│  • Diventare un investitore   │  • Informazioni frammentate     │
│    consapevole                │                                 │
├───────────────────────────────┼─────────────────────────────────┤
│  MOTIVATIONS                  │  BEHAVIORS                      │
│  • Guadagnare soldi           │  • Sempre sul telefono          │
│  • Essere "early" su trend    │  • Usa Duolingo per lingue      │
│  • Impressionare gli amici    │  • Ama badge e achievement      │
│  • Indipendenza finanziaria   │  • Competitive (leaderboard)    │
├───────────────────────────────┴─────────────────────────────────┤
│  TECH SAVVINESS: ●●●●● (5/5)                                    │
│  CRYPTO KNOWLEDGE: ●●●○○ (3/5)                                  │
│  TIME AVAILABLE: ●●●●○ (4/5)                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. CUSTOMER DISCOVERY (Steve Blank)

### 4.1 Il Metodo Customer Development

Steve Blank, professore a Stanford e serial entrepreneur, ha creato il metodo Customer Development basato su un principio fondamentale:

> "Non ci sono fatti dentro il tuo edificio, quindi esci a testarli."

Il metodo sfida l'approccio tradizionale "build it and they will come" e propone invece di validare le ipotesi PRIMA di costruire.

### 4.2 I 4 Step del Customer Development

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   SEARCH                              EXECUTION                  │
│   ──────                              ─────────                  │
│                                                                  │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│   │  CUSTOMER   │    │  CUSTOMER   │    │  CUSTOMER   │         │
│   │  DISCOVERY  │───▶│ VALIDATION  │───▶│  CREATION   │         │
│   └─────────────┘    └─────────────┘    └─────────────┘         │
│         │                  │                   │                 │
│         │    PIVOT         │                   │                 │
│         │◀─────────────────│                   │                 │
│         │                  │                   ▼                 │
│         │                  │            ┌─────────────┐         │
│         │                  │            │   COMPANY   │         │
│         │                  │            │  BUILDING   │         │
│         │                  │            └─────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Step 1: Customer Discovery**
- Trasforma la visione del founder in ipotesi di business model
- Testa le ipotesi con potenziali clienti
- Obiettivo: capire se il problema esiste davvero

**Step 2: Customer Validation**
- Verifica se il business model è ripetibile e scalabile
- Se non lo è, torna a Customer Discovery (PIVOT)
- Obiettivo: trovare product-market fit

**Step 3: Customer Creation**
- Inizia l'esecuzione
- Costruisce domanda end-user
- Scala il business

**Step 4: Company Building**
- Transizione da startup a company
- Focus sull'esecuzione del modello validato

### 4.3 Customer Discovery in Dettaglio

**Fase 1: Definire le Ipotesi**

Prima di parlare con chiunque, documenta le tue assunzioni:

| Categoria | Ipotesi da Testare |
|-----------|-------------------|
| **Problema** | Il problema che pensi esista |
| **Segmento** | Chi ha questo problema |
| **Soluzione** | Come pensi di risolverlo |
| **Canali** | Come raggiungerai i clienti |
| **Revenue** | Come guadagnerai |
| **Costi** | Quanto costerà |

**Ipotesi Tradelia (esempio):**
```
PROBLEMA: Le persone vogliono imparare crypto ma trovano 
          le risorse esistenti troppo complesse e noiose.

SEGMENTO: Adulti 25-45 anni, professionisti, curiosi ma 
          con poco tempo, no background tecnico.

SOLUZIONE: App gamificata con micro-lezioni di 5 minuti,
          quiz interattivi, sistema XP e streak.

CANALI:   Social media, SEO, word of mouth.

REVENUE:  Freemium (base gratis, premium a pagamento).

COSTI:    Sviluppo, hosting, content creation.
```

**Fase 2: Testare le Ipotesi**

Esci dall'edificio e parla con potenziali clienti:
- Minimo 10-20 interviste per segmento
- Cerca pattern, non conferme
- Ascolta più di quanto parli
- Documenta tutto

**Fase 3: Analizzare e Iterare**

Dopo le interviste:
- Ipotesi validata → Procedi
- Ipotesi invalidata → Pivot
- Dati insufficienti → Più interviste

### 4.4 Domande per Customer Discovery

**Domande sul Problema:**
```
1. "Raccontami dell'ultima volta che hai provato a imparare 
    qualcosa sulle crypto."

2. "Qual è stata la parte più frustrante di quell'esperienza?"

3. "Come hai cercato di risolvere questo problema?"

4. "Quanto tempo dedichi attualmente all'apprendimento?"

5. "Cosa ti ha fatto smettere/abbandonare?"
```

**Domande sul Comportamento:**
```
6. "Quali risorse usi attualmente per informarti sulle crypto?"

7. "Quanto spesso le usi? Quando durante la giornata?"

8. "Hai mai pagato per un corso o risorsa? Quanto?"

9. "Cosa ti piace delle risorse che usi?"

10. "Cosa cambieresti se potessi?"
```

**Domande sul Valore:**
```
11. "Se esistesse una soluzione perfetta, come sarebbe?"

12. "Quanto pagheresti per risolvere questo problema?"

13. "Cosa ti farebbe tornare ogni giorno?"

14. "Come sapresti di aver 'imparato abbastanza'?"

15. "A chi consiglieresti una risorsa del genere?"
```

**La Domanda Magica (Steve Blank):**
```
"Cosa avrei dovuto chiederti che non ti ho chiesto?"
```

---

## 5. THE MOM TEST (Rob Fitzpatrick)

### 5.1 Il Problema delle Interviste

Rob Fitzpatrick nel suo libro "The Mom Test" spiega perché la maggior parte delle interviste fallisce:

> "Non dovresti chiedere a nessuno se la tua idea di business è buona. 
> È una domanda sbagliata, e tutti ti mentiranno almeno un po'."

Il problema: le persone vogliono essere gentili. Tua mamma ti dirà sempre che la tua idea è fantastica perché ti ama, non perché lo è davvero.

### 5.2 Le 3 Regole del Mom Test

**Regola 1: Parla della loro vita, non della tua idea**
```
❌ SBAGLIATO: "Useresti un'app per imparare crypto?"
✅ GIUSTO:    "Come impari attualmente sulle crypto?"

❌ SBAGLIATO: "Ti piacerebbe avere lezioni di 5 minuti?"
✅ GIUSTO:    "Quanto tempo dedichi all'apprendimento in una sessione tipica?"

❌ SBAGLIATO: "Pagheresti 10€/mese per questo?"
✅ GIUSTO:    "Quanto hai speso in risorse educative nell'ultimo anno?"
```

**Regola 2: Chiedi del passato, non del futuro**
```
❌ SBAGLIATO: "Useresti questa feature?"
✅ GIUSTO:    "Raccontami l'ultima volta che hai provato a..."

❌ SBAGLIATO: "Quanto spesso la useresti?"
✅ GIUSTO:    "Quanto spesso hai usato [soluzione attuale] la settimana scorsa?"

❌ SBAGLIATO: "Compreresti questo prodotto?"
✅ GIUSTO:    "Hai mai comprato qualcosa di simile? Cosa? Quanto?"
```

**Regola 3: Parla meno, ascolta di più**
```
Rapporto ideale: 20% tu, 80% loro

❌ SBAGLIATO: Spiegare la tua idea per 10 minuti
✅ GIUSTO:    Fare una domanda e stare zitto

❌ SBAGLIATO: Interrompere per aggiungere dettagli
✅ GIUSTO:    Lasciare silenzi scomodi (rivelano insight)

❌ SBAGLIATO: Difendere la tua idea quando criticata
✅ GIUSTO:    "Interessante, dimmi di più..."
```

### 5.3 Segnali di Pericolo nelle Interviste

**Complimenti (Red Flag 🚩)**
```
"Wow, è un'idea fantastica!"
"Lo userei sicuramente!"
"Dovresti assolutamente farlo!"

→ Questi sono complimenti, non dati. Ignora.
```

**Ipotesi sul futuro (Red Flag 🚩)**
```
"Penso che lo userei..."
"Probabilmente pagherei..."
"Potrei essere interessato..."

→ Le persone non sanno prevedere il loro comportamento futuro.
```

**Segnali positivi (Green Flag ✅)**
```
"Ho provato X, Y, Z ma nessuno funziona"
→ Problema reale, hanno cercato soluzioni

"Ho speso €200 in corsi l'anno scorso"
→ Willingness to pay dimostrata

"Posso presentarti 3 amici con lo stesso problema?"
→ Problema diffuso, potenziale referral
```

### 5.4 Script di Intervista Mom Test per Tradelia

```
INTRO (2 min)
─────────────
"Ciao! Sto facendo ricerca su come le persone imparano 
argomenti finanziari complessi. Non sto vendendo nulla, 
voglio solo capire la tua esperienza. Va bene se prendo appunti?"

CONTESTO (5 min)
────────────────
"Raccontami un po' di te. Cosa fai nella vita?"
"Come ti informi generalmente su argomenti nuovi?"

PROBLEMA (10 min)
─────────────────
"Hai mai provato a imparare qualcosa sulle crypto o blockchain?"

[Se sì]
"Raccontami com'è andata. Cosa hai usato?"
"Qual è stata la parte più difficile?"
"Hai continuato o hai smesso? Perché?"

[Se no]
"C'è un motivo per cui non l'hai fatto?"
"Cosa ti servirebbe per iniziare?"

COMPORTAMENTO ATTUALE (5 min)
─────────────────────────────
"Quali risorse usi per informarti su finanza/investimenti?"
"Quanto tempo dedichi a settimana?"
"Quando durante la giornata?"

VALORE (5 min)
──────────────
"Se potessi cambiare una cosa del modo in cui impari, cosa sarebbe?"
"Hai mai pagato per corsi o risorse educative? Quanto?"
"Cosa ti farebbe tornare ogni giorno su una risorsa?"

CHIUSURA (3 min)
────────────────
"C'è qualcosa che avrei dovuto chiederti?"
"Conosci altre persone che potrei intervistare?"
"Posso ricontattarti se ho altre domande?"
```

### 5.5 Come Analizzare le Interviste

**Template di Analisi:**

| Intervista # | Problema Confermato? | Soluzione Attuale | Willingness to Pay | Quote Chiave |
|--------------|---------------------|-------------------|-------------------|--------------|
| 1 | ✅ Sì | YouTube, Reddit | €0 (mai pagato) | "Troppo tecnico" |
| 2 | ✅ Sì | Nessuna | €10/mese | "Non so da dove iniziare" |
| 3 | ❌ No | Non interessato | N/A | "Non mi fido" |
| ... | ... | ... | ... | ... |

**Pattern da cercare:**
- Quanti confermano il problema? (target: >70%)
- Quali parole usano per descriverlo?
- Quali soluzioni hanno già provato?
- Quanto hanno speso?
- Perché hanno abbandonato?

---

## 6. JOBS TO BE DONE (Clayton Christensen)

### 6.1 La Teoria JTBD

Clayton Christensen, professore ad Harvard, ha sviluppato la teoria Jobs To Be Done:

> "Le persone non comprano prodotti, 'assumono' prodotti per fare un lavoro nella loro vita."

L'insight chiave: non competiamo con prodotti simili, ma con tutto ciò che il cliente potrebbe "assumere" per fare lo stesso lavoro.

**Esempio classico - Il Milkshake:**
McDonald's voleva vendere più milkshake. Invece di chiedere "come possiamo migliorare il milkshake?", hanno chiesto "per quale lavoro i clienti assumono il milkshake?"

Scoperta: il 40% dei milkshake veniva comprato la mattina da pendolari. Il "lavoro" era:
- Tenere occupata una mano durante il commute
- Avere qualcosa che dura tutto il tragitto
- Non sporcare i vestiti
- Sentirsi sazi fino a pranzo

Competitor reali: banana, bagel, Snickers - non altri milkshake!

### 6.2 Struttura di un Job Statement

**Formula:**
```
Quando [SITUAZIONE], voglio [MOTIVAZIONE], così posso [OUTCOME DESIDERATO]
```

**Esempio Tradelia:**
```
Quando sento colleghi parlare di crypto e mi sento escluso,
voglio capire rapidamente i concetti base,
così posso partecipare alle conversazioni senza sembrare ignorante.
```

### 6.3 I 3 Tipi di Jobs

**1. Functional Jobs (Cosa vuole fare)**
```
• Imparare cos'è Bitcoin
• Capire come funziona un wallet
• Sapere la differenza tra exchange
```

**2. Emotional Jobs (Come vuole sentirsi)**
```
• Sentirsi competente
• Non sentirsi stupido
• Sentirsi parte del "club"
• Sentirsi sicuro nelle decisioni
```

**3. Social Jobs (Come vuole essere percepito)**
```
• Essere visto come informato
• Non essere visto come "quello che non capisce"
• Poter consigliare altri
• Essere rispettato per la conoscenza
```

### 6.4 Jobs To Be Done per Tradelia

```
┌─────────────────────────────────────────────────────────────────┐
│                    JOBS TO BE DONE - TRADELIA                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FUNCTIONAL JOBS                                                │
│  ───────────────                                                │
│  • Capire le basi delle crypto in poco tempo                    │
│  • Distinguere progetti legittimi da truffe                     │
│  • Sapere come comprare/vendere in sicurezza                    │
│  • Capire i rischi prima di investire                           │
│  • Rimanere aggiornato sulle novità                             │
│                                                                 │
│  EMOTIONAL JOBS                                                 │
│  ──────────────                                                 │
│  • Sentirmi competente in un argomento nuovo                    │
│  • Non sentirmi sopraffatto dalla complessità                   │
│  • Sentirmi sicuro nelle mie decisioni                          │
│  • Provare soddisfazione nel progresso                          │
│  • Non avere ansia di "perdere tutto"                           │
│                                                                 │
│  SOCIAL JOBS                                                    │
│  ───────────                                                    │
│  • Partecipare alle conversazioni con colleghi/amici            │
│  • Non sembrare ignorante quando si parla di crypto             │
│  • Poter dare consigli informati ad altri                       │
│  • Essere visto come "uno che ci capisce"                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Job Map - Il Processo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                         JOB MAP                                 │
│            "Imparare le basi delle crypto"                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. DEFINE        "Cosa devo sapere esattamente?"               │
│     ──────        → Tradelia: Path chiari con obiettivi         │
│                                                                 │
│  2. LOCATE        "Dove trovo informazioni affidabili?"         │
│     ──────        → Tradelia: Contenuto curato, no ricerca      │
│                                                                 │
│  3. PREPARE       "Come mi organizzo per imparare?"             │
│     ───────       → Tradelia: Sessioni di 5 min, reminder       │
│                                                                 │
│  4. CONFIRM       "Sto imparando la cosa giusta?"               │
│     ───────       → Tradelia: Quiz, feedback immediato          │
│                                                                 │
│  5. EXECUTE       "Come applico quello che imparo?"             │
│     ───────       → Tradelia: Esempi pratici, simulazioni       │
│                                                                 │
│  6. MONITOR       "Sto facendo progressi?"                      │
│     ───────       → Tradelia: XP, livelli, streak               │
│                                                                 │
│  7. MODIFY        "Devo cambiare approccio?"                    │
│     ──────        → Tradelia: Adaptive learning (futuro)        │
│                                                                 │
│  8. CONCLUDE      "Ho raggiunto il mio obiettivo?"              │
│     ────────      → Tradelia: Badge completamento, certificato  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. VALUE PROPOSITION CANVAS (Alexander Osterwalder)

### 7.1 Cos'è il Value Proposition Canvas?

Creato da Alexander Osterwalder (autore del Business Model Canvas), il Value Proposition Canvas aiuta ad allineare prodotti/servizi con i bisogni dei clienti.

**Statistica chiave:** Secondo CB Insights, il 42% delle startup fallisce perché non c'è bisogno di mercato. Il VPC aiuta a evitare questo errore.

### 7.2 I Due Lati del Canvas

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   VALUE PROPOSITION                    CUSTOMER PROFILE         │
│   (Quadrato)                           (Cerchio)                │
│                                                                 │
│   ┌─────────────────┐                 ╭─────────────────╮       │
│   │                 │                 │                 │       │
│   │  Products &     │                 │  Customer       │       │
│   │  Services       │                 │  Jobs           │       │
│   │                 │                 │                 │       │
│   │  ─────────────  │    ═══════▶    │  ─────────────  │       │
│   │                 │     FIT?        │                 │       │
│   │  Pain           │                 │  Pains          │       │
│   │  Relievers      │                 │                 │       │
│   │                 │                 │  ─────────────  │       │
│   │  ─────────────  │                 │                 │       │
│   │                 │                 │  Gains          │       │
│   │  Gain           │                 │                 │       │
│   │  Creators       │                 │                 │       │
│   │                 │                 │                 │       │
│   └─────────────────┘                 ╰─────────────────╯       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Customer Profile (Lato Destro)

**Customer Jobs:**
- Cosa stanno cercando di fare?
- Quali task vogliono completare?
- Quali problemi vogliono risolvere?
- Quali bisogni vogliono soddisfare?

**Pains:**
- Cosa li frustra?
- Quali ostacoli incontrano?
- Quali rischi temono?
- Cosa li tiene svegli la notte?

**Gains:**
- Quali benefici cercano?
- Cosa li renderebbe felici?
- Cosa li sorprenderebbe positivamente?
- Come misurano il successo?

### 7.4 Value Proposition (Lato Sinistro)

**Products & Services:**
- Cosa offri?
- Quali prodotti/servizi/features?

**Pain Relievers:**
- Come elimini le frustrazioni?
- Come riduci i rischi?
- Come rimuovi gli ostacoli?

**Gain Creators:**
- Come crei benefici?
- Come superi le aspettative?
- Come rendi la vita migliore?

### 7.5 Value Proposition Canvas per Tradelia

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     VALUE PROPOSITION CANVAS - TRADELIA                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   VALUE PROPOSITION                         CUSTOMER PROFILE                │
│                                                                             │
│   ┌───────────────────────┐               ╭───────────────────────╮         │
│   │                       │               │                       │         │
│   │  PRODUCTS & SERVICES  │               │    CUSTOMER JOBS      │         │
│   │  ───────────────────  │               │    ─────────────      │         │
│   │                       │               │                       │         │
│   │  • App mobile/web     │               │  • Capire le basi     │         │
│   │  • Micro-lezioni 5min │               │    delle crypto       │         │
│   │  • Quiz interattivi   │               │  • Partecipare a      │         │
│   │  • Sistema XP/Livelli │               │    conversazioni      │         │
│   │  • Streak giornaliero │               │  • Valutare se        │         │
│   │  • Badge achievement  │               │    investire          │         │
│   │  • Path strutturati   │               │  • Non fare errori    │         │
│   │                       │               │    costosi            │         │
│   │                       │               │                       │         │
│   ├───────────────────────┤               ├───────────────────────┤         │
│   │                       │               │                       │         │
│   │  PAIN RELIEVERS       │    ═══════▶   │       PAINS           │         │
│   │  ──────────────       │     FIT       │       ─────           │         │
│   │                       │               │                       │         │
│   │  • Contenuto curato   │               │  • Overload info      │         │
│   │    (no ricerca)       │               │  • Linguaggio tecnico │         │
│   │  • Linguaggio         │               │  • No percorso chiaro │         │
│   │    semplice           │               │  • Paura errori       │         │
│   │  • Sessioni brevi     │               │  • Poco tempo         │         │
│   │    (5 min)            │               │  • Non sapere di chi  │         │
│   │  • Feedback immediato │               │    fidarsi            │         │
│   │  • Progressione       │               │  • Contenuti noiosi   │         │
│   │    guidata            │               │                       │         │
│   │                       │               │                       │         │
│   ├───────────────────────┤               ├───────────────────────┤         │
│   │                       │               │                       │         │
│   │  GAIN CREATORS        │               │       GAINS           │         │
│   │  ─────────────        │               │       ─────           │         │
│   │                       │               │                       │         │
│   │  • Gamification       │               │  • Capire in poco     │         │
│   │    (XP, badge)        │               │    tempo              │         │
│   │  • Senso di           │               │  • Sentirsi sicuro    │         │
│   │    progresso          │               │  • Progressione       │         │
│   │  • Streak motivation  │               │    visibile           │         │
│   │  • Celebrazioni       │               │  • Apprendimento      │         │
│   │  • Contenuto          │               │    divertente         │         │
│   │    aggiornato         │               │  • Autonomia          │         │
│   │                       │               │    decisionale        │         │
│   │                       │               │                       │         │
│   └───────────────────────┘               ╰───────────────────────╯         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.6 Verificare il FIT

**Domande per verificare l'allineamento:**

| Pain | Pain Reliever | FIT? |
|------|---------------|------|
| Overload informativo | Contenuto curato, path strutturati | ✅ |
| Linguaggio tecnico | Spiegazioni semplici, analogie | ✅ |
| Poco tempo | Sessioni 5 minuti | ✅ |
| Contenuti noiosi | Gamification, quiz interattivi | ✅ |
| Paura errori | Ambiente sicuro, no soldi veri | ✅ |

| Gain | Gain Creator | FIT? |
|------|--------------|------|
| Capire in poco tempo | Micro-lezioni, focus essenziale | ✅ |
| Sentirsi sicuro | Quiz, feedback, spiegazioni | ✅ |
| Progressione visibile | XP, livelli, badge | ✅ |
| Apprendimento divertente | Gamification, celebrazioni | ✅ |

---

## 8. COMPETITIVE ANALYSIS

### 8.1 Framework di Analisi Competitiva

**SWOT Analysis:**
```
┌─────────────────────────┬─────────────────────────┐
│      STRENGTHS          │      WEAKNESSES         │
│      (Interno +)        │      (Interno -)        │
├─────────────────────────┼─────────────────────────┤
│    OPPORTUNITIES        │        THREATS          │
│      (Esterno +)        │      (Esterno -)        │
└─────────────────────────┴─────────────────────────┘
```

**Porter's Five Forces:**
```
                    ┌─────────────────┐
                    │   NEW ENTRANTS  │
                    │   (Minaccia)    │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│  SUPPLIERS  │───▶│   COMPETITIVE   │◀───│   BUYERS    │
│  (Potere)   │    │    RIVALRY      │    │  (Potere)   │
└─────────────┘    └────────┬────────┘    └─────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   SUBSTITUTES   │
                    │   (Minaccia)    │
                    └─────────────────┘
```

### 8.2 Competitor Analysis per Tradelia

**Competitor Diretti:**

| Competitor | Tipo | Pro | Contro | Prezzo |
|------------|------|-----|--------|--------|
| **Coinbase Learn** | Earn-to-learn | Guadagni crypto | Solo basics, no gamification | Gratis |
| **Binance Academy** | Articoli/video | Completo | Noioso, no interattività | Gratis |
| **CryptoZombies** | Coding game | Gamificato | Solo per developer | Gratis |
| **Udemy Courses** | Video corsi | Approfonditi | Lunghi, costosi, no mobile | €20-100 |

**Competitor Indiretti (Substitutes):**

| Competitor | Job che fa | Pro | Contro |
|------------|-----------|-----|--------|
| **YouTube** | Imparare gratis | Gratuito, vasto | Qualità variabile, no struttura |
| **Reddit/Twitter** | Restare aggiornati | Community | Rumore, bias, no learning path |
| **Amici "esperti"** | Consigli rapidi | Fiducia | Spesso sbagliati, incompleti |
| **Non fare nulla** | Evitare rischio | Zero effort | FOMO, opportunità perse |

### 8.3 SWOT Tradelia

```
┌─────────────────────────────────┬─────────────────────────────────┐
│          STRENGTHS              │          WEAKNESSES             │
│          ─────────              │          ──────────             │
│                                 │                                 │
│  • Gamification (come Duolingo) │  • Brand sconosciuto            │
│  • Focus solo su crypto         │  • No community esistente       │
│  • Mobile-first                 │  • Contenuto da creare          │
│  • Micro-lezioni (5 min)        │  • Team piccolo                 │
│  • UX semplice                  │  • Budget limitato              │
│                                 │                                 │
├─────────────────────────────────┼─────────────────────────────────┤
│         OPPORTUNITIES           │           THREATS               │
│         ─────────────           │           ───────               │
│                                 │                                 │
│  • Mercato crypto in crescita   │  • Competitor con più risorse   │
│  • Nessun "Duolingo for Crypto" │  • Regolamentazione crypto      │
│  • Trend gamification education │  • Volatilità mercato crypto    │
│  • Mobile learning in crescita  │  • Saturazione contenuti        │
│  • Partnership con exchange     │  • Cambio interesse pubblico    │
│                                 │                                 │
└─────────────────────────────────┴─────────────────────────────────┘
```

### 8.4 Competitive Positioning

```
                    GAMIFICATION
                         ▲
                         │
                    ★ TRADELIA
                         │
    BASIC ◄──────────────┼──────────────► ADVANCED
                         │
         Coinbase Learn  │  Binance Academy
                         │
                         │
                    YouTube
                         │
                         ▼
                    NO GAMIFICATION
```

**Unique Value Proposition:**
> "Tradelia è il Duolingo delle crypto: impara le basi in 5 minuti al giorno 
> con lezioni gamificate, quiz interattivi e un sistema di progressione 
> che ti fa tornare ogni giorno."

---

## 9. TECNICHE DI VALIDAZIONE

### 9.1 Panoramica delle Tecniche

| Tecnica | Effort | Tempo | Costo | Affidabilità | Cosa Valida |
|---------|--------|-------|-------|--------------|-------------|
| **Landing Page** | Basso | 1-3 giorni | €0-100 | Media | Interesse |
| **Smoke Test** | Basso | 1 giorno | €0-50 | Media | Interesse |
| **Concierge MVP** | Medio | 2-4 sett | €0-500 | Alta | Problema + Soluzione |
| **Wizard of Oz** | Medio | 2-4 sett | €100-1000 | Alta | Soluzione |
| **Crowdfunding** | Alto | 4-8 sett | €500+ | Molto Alta | Willingness to Pay |
| **Pre-orders** | Medio | 2-4 sett | €100-500 | Molto Alta | Willingness to Pay |

### 9.2 Landing Page Test

**Cos'è:**
Una singola pagina web che descrive il prodotto e raccoglie email di interessati.

**Come funziona:**
1. Crea landing page con value proposition
2. Aggiungi CTA "Iscriviti per accesso anticipato"
3. Porta traffico (ads, social, community)
4. Misura conversion rate

**Metriche:**
- Conversion rate (email / visitatori)
- Benchmark: >5% = interesse validato
- Bonus: qualità delle email (corporate vs personal)

**Esempio Tradelia:**
```
HEADLINE: Impara le Crypto in 5 Minuti al Giorno

SUBHEADLINE: L'app gamificata che trasforma concetti 
complessi in lezioni semplici e divertenti.

BULLET POINTS:
✓ Micro-lezioni di 5 minuti
✓ Quiz interattivi
✓ Guadagna XP e badge
✓ Streak giornaliero

CTA: [Iscriviti per Accesso Anticipato]

SOCIAL PROOF: "Già 500+ persone in lista d'attesa"
```

### 9.3 Smoke Test (Fake Door)

**Cos'è:**
Mostrare una feature come se esistesse per misurare l'interesse reale.

**Come funziona:**
1. Aggiungi un bottone/link per una feature non esistente
2. Quando l'utente clicca, mostra "Coming Soon"
3. Traccia quanti cliccano
4. Opzionale: raccogli email per notifica

**Esempio:**
```
[Bottone: "Prova la Lezione Demo"]
     │
     ▼
"Questa feature sarà disponibile presto!
 Lascia la tua email per essere notificato."
```

**Metriche:**
- Click-through rate
- Email raccolte
- Confronto tra diverse feature

### 9.4 Concierge MVP

**Cos'è:**
Offrire il servizio manualmente a pochi utenti prima di automatizzare.

**Come funziona:**
1. Trova 5-10 early adopters
2. Offri il servizio "a mano"
3. Impara cosa vogliono veramente
4. Itera basandoti sul feedback
5. Automatizza solo dopo aver validato

**Esempio Tradelia:**
```
CONCIERGE MVP:
─────────────
• Trova 10 persone interessate a imparare crypto
• Ogni giorno manda loro una micro-lezione via WhatsApp
• Includi 3 domande quiz
• Traccia manualmente XP e streak
• Chiedi feedback dopo ogni lezione
• Dopo 2 settimane: analizza cosa ha funzionato
```

**Vantaggi:**
- Impari direttamente dai clienti
- Costo quasi zero
- Puoi pivotare rapidamente
- Costruisci relazioni con early adopters

### 9.5 Wizard of Oz MVP

**Cos'è:**
L'utente pensa di interagire con un sistema automatico, ma dietro c'è un umano.

**Differenza con Concierge:**
- Concierge: l'utente SA che è manuale
- Wizard of Oz: l'utente PENSA sia automatico

**Come funziona:**
1. Crea un'interfaccia che sembra automatica
2. Dietro le quinte, un umano fa il lavoro
3. L'utente ha l'esperienza "reale"
4. Validi l'esperienza utente

**Esempio famoso - Zappos:**
Nick Swinmurn voleva validare se la gente avrebbe comprato scarpe online. Invece di costruire un e-commerce:
1. Fotografò scarpe nei negozi locali
2. Le mise su un sito semplice
3. Quando qualcuno ordinava, andava a comprare le scarpe e le spediva
4. Validò l'idea prima di investire in inventory

**Esempio Tradelia:**
```
WIZARD OF OZ MVP:
─────────────────
• Crea un'app/sito con UI semplice
• L'utente seleziona "Inizia Lezione"
• Dietro le quinte: tu selezioni manualmente la lezione
• L'utente completa il quiz
• Tu calcoli manualmente XP e aggiorni il profilo
• L'utente vede "Hai guadagnato 10 XP!"
```

### 9.6 Pre-orders / Crowdfunding

**Cos'è:**
Chiedere soldi PRIMA di costruire il prodotto.

**Perché è il test più forte:**
> "Parlare è facile. Pagare è difficile."

Se qualcuno paga prima che il prodotto esista, hai validato:
- Il problema esiste
- La soluzione è desiderata
- Willingness to pay è reale

**Piattaforme:**
- Kickstarter / Indiegogo (crowdfunding)
- Gumroad (pre-orders)
- Stripe (pagamenti diretti)

**Esempio Tradelia:**
```
PRE-ORDER OFFER:
────────────────
"Tradelia Premium - Accesso Lifetime"

Prezzo lancio: €29 (invece di €99)

Include:
✓ Accesso a tutti i path
✓ Nessuna pubblicità
✓ Badge "Early Supporter"
✓ Accesso anticipato a nuove feature

[Acquista Ora - Disponibile da Marzo 2026]

Garanzia: Rimborso completo se non soddisfatto
```

### 9.7 Matrice di Validazione

```
┌─────────────────────────────────────────────────────────────────┐
│                    MATRICE DI VALIDAZIONE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        COSA VALIDARE                            │
│                                                                 │
│              Problema    Soluzione    Willingness               │
│              Esiste?     Funziona?    to Pay?                   │
│              ────────    ─────────    ───────────               │
│                                                                 │
│  Interviste     ✅          ⚠️           ❌                      │
│                                                                 │
│  Landing Page   ⚠️          ⚠️           ⚠️                      │
│                                                                 │
│  Smoke Test     ⚠️          ✅           ⚠️                      │
│                                                                 │
│  Concierge      ✅          ✅           ⚠️                      │
│                                                                 │
│  Wizard of Oz   ✅          ✅           ⚠️                      │
│                                                                 │
│  Pre-orders     ✅          ✅           ✅                      │
│                                                                 │
│  ✅ = Valida bene   ⚠️ = Valida parzialmente   ❌ = Non valida  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. APPLICAZIONE A TRADELIA 2.0

### 10.1 Piano di Validazione Fase 0

**Settimana 1-2: Research**

| Giorno | Attività | Output |
|--------|----------|--------|
| 1-2 | Definire ipotesi | Documento ipotesi |
| 3-4 | Creare Empathy Map | Empathy Map v1 |
| 5-7 | Preparare script interviste | Script Mom Test |
| 8-10 | Condurre 10 interviste | Note interviste |
| 11-12 | Analizzare pattern | Report insights |
| 13-14 | Aggiornare Empathy Map | Empathy Map v2 |

**Settimana 3: Validation**

| Giorno | Attività | Output |
|--------|----------|--------|
| 15-16 | Creare landing page | Landing page live |
| 17-18 | Lanciare ads test | Campagna attiva |
| 19-20 | Raccogliere dati | Metriche conversion |
| 21 | Analizzare risultati | Report validazione |

**Settimana 4: Decision**

| Giorno | Attività | Output |
|--------|----------|--------|
| 22-23 | Sintetizzare findings | Documento finale |
| 24-25 | Decidere: Proceed/Pivot | Decisione documentata |
| 26-28 | Pianificare Fase 1 | Piano dettagliato |

### 10.2 Ipotesi da Validare

```
┌─────────────────────────────────────────────────────────────────┐
│                    IPOTESI TRADELIA 2.0                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  IPOTESI PROBLEMA (da validare con interviste)                  │
│  ─────────────────                                              │
│                                                                 │
│  H1: Le persone vogliono imparare crypto ma trovano             │
│      le risorse esistenti troppo complesse.                     │
│      → Metrica: >70% intervistati conferma                      │
│                                                                 │
│  H2: Il tempo è un ostacolo principale all'apprendimento.       │
│      → Metrica: >60% cita "poco tempo" come problema            │
│                                                                 │
│  H3: Le persone hanno provato altre risorse e abbandonato.      │
│      → Metrica: >50% ha abbandonato almeno una risorsa          │
│                                                                 │
│  IPOTESI SOLUZIONE (da validare con landing page)               │
│  ────────────────                                               │
│                                                                 │
│  H4: Un'app gamificata con micro-lezioni attira interesse.      │
│      → Metrica: >5% conversion rate landing page                │
│                                                                 │
│  H5: Il modello "Duolingo for Crypto" risuona con il target.    │
│      → Metrica: >30% cita Duolingo come riferimento positivo    │
│                                                                 │
│  IPOTESI BUSINESS (da validare con pre-orders)                  │
│  ───────────────                                                │
│                                                                 │
│  H6: Le persone pagherebbero €5-10/mese per questo servizio.    │
│      → Metrica: >20 pre-orders a €29 lifetime                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.3 Criteri Go/No-Go

**GO (Procedi a Fase 1) se:**
- ✅ >70% intervistati conferma il problema
- ✅ >5% conversion rate landing page
- ✅ >20 pre-orders raccolti
- ✅ Pattern chiari nei feedback

**PIVOT se:**
- ⚠️ Problema confermato ma soluzione sbagliata
- ⚠️ Segmento sbagliato (cambia target)
- ⚠️ Value proposition non risuona

**NO-GO se:**
- ❌ <30% conferma il problema
- ❌ <1% conversion rate
- ❌ 0 pre-orders
- ❌ Feedback consistentemente negativo

### 10.4 Template Documento Ipotesi

```markdown
# Ipotesi: [Nome Ipotesi]

## Descrizione
[Cosa crediamo sia vero]

## Perché è importante
[Cosa succede se è vera/falsa]

## Come la testiamo
[Metodo di validazione]

## Metrica di successo
[Numero specifico che indica successo]

## Risultato
- [ ] Validata
- [ ] Invalidata
- [ ] Inconclusiva

## Evidence
[Dati raccolti]

## Azioni
[Cosa facciamo basandoci sul risultato]
```

---

## CHECKLIST FASE 0

### Pre-Research
- [ ] Ipotesi documentate
- [ ] Target audience definito
- [ ] Script interviste preparato
- [ ] Canali per trovare intervistati identificati

### Research
- [ ] 10+ interviste condotte
- [ ] Note dettagliate per ogni intervista
- [ ] Pattern identificati
- [ ] Empathy Map completata
- [ ] Personas create (2-3)

### Frameworks
- [ ] Problem Statement definito
- [ ] Jobs To Be Done mappati
- [ ] Value Proposition Canvas completato
- [ ] Competitive Analysis fatta

### Validation
- [ ] Landing page creata
- [ ] Traffico portato (ads/organic)
- [ ] Metriche raccolte
- [ ] Pre-orders testati (opzionale)

### Decision
- [ ] Findings sintetizzati
- [ ] Decisione Go/Pivot/No-Go presa
- [ ] Piano Fase 1 creato (se Go)

---

## FONTI E RIFERIMENTI

1. **Steve Blank** - "The Four Steps to the Epiphany" (2005)
2. **Rob Fitzpatrick** - "The Mom Test" (2013)
3. **Clayton Christensen** - "Competing Against Luck" (2016)
4. **Alexander Osterwalder** - "Value Proposition Design" (2014)
5. **Nielsen Norman Group** - "Empathy Mapping" (2018)
6. **IDEO** - "Design Thinking" methodology
7. **Interaction Design Foundation** - "How Might We" questions
8. **Michael Porter** - "Competitive Strategy" (1980)

---

*Documento creato: 14 Gennaio 2026*
*Per Tradelia 2.0 - "Duolingo for Crypto"*

*Content was rephrased for compliance with licensing restrictions*
