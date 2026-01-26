# Multi-Challenge UX Strategy 2026

**Date**: 2026-01-26  
**Status**: 🎯 DECISION NEEDED  
**Question**: Come mostrare multiple challenges per firm (es. FTMO ha 5 account sizes)?

---

## 🎯 IL PROBLEMA

### Esempio Reale: FTMO
```
FTMO Challenge ha 5 varianti:
- $10,000 @ €155
- $25,000 @ €250
- $50,000 @ €345
- $100,000 @ €540
- $200,000 @ €1,080

Stesse regole, stesso program, solo account size e prezzo diversi.
```

### Esempio Reale: FundedNext
```
FundedNext ha 6 challenge types × 6 account sizes = 36 varianti:
- Stellar Lite: $5K, $15K, $25K, $50K, $100K, $200K
- Stellar 2-Step: $5K, $15K, $25K, $50K, $100K, $200K
- Express: $5K, $15K, $25K, $50K, $100K, $200K
... (36 combinazioni totali)
```

**Domanda**: Come le mostriamo nella UI?

---

## 📊 OPZIONE 1: Card per Ogni Offer (Flat List)

### Come Funziona
Ogni offer = 1 card separata nella grid.

```
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ FTMO Challenge      │ │ FTMO Challenge      │ │ FTMO Challenge      │
│ $10,000 @ €155      │ │ $25,000 @ €250      │ │ $50,000 @ €345      │
│ 2-Step • 10% Target │ │ 2-Step • 10% Target │ │ 2-Step • 10% Target │
│ [View Details]      │ │ [View Details]      │ │ [View Details]      │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ FTMO Challenge      │ │ FTMO Challenge      │
│ $100,000 @ €540     │ │ $200,000 @ €1,080   │
│ 2-Step • 10% Target │ │ 2-Step • 10% Target │
│ [View Details]      │ │ [View Details]      │
└─────────────────────┘ └─────────────────────┘
```

### Pro
- ✅ Semplice da implementare
- ✅ Facile da filtrare/ordinare per prezzo
- ✅ Ogni card è self-contained
- ✅ Buono per confronto diretto

### Contro
- ❌ Molto ripetitivo (5 card quasi identiche)
- ❌ Scroll infinito (100+ cards totali)
- ❌ Difficile capire che sono varianti dello stesso program
- ❌ Spreco di spazio

### Quando Usare
- Se hai pochi offers per firm (max 3-4)
- Se le varianti sono molto diverse tra loro
- Se vuoi massima granularità nei filtri

---

## 📊 OPZIONE 2: Card Grouped con Dropdown (Recommended ⭐)

### Come Funziona
1 card per program, con dropdown per scegliere account size.

```
┌─────────────────────────────────────────────────┐
│ [FTMO Logo]                    [💰 Refundable]  │
│                                                  │
│ FTMO Challenge                                   │
│ 2-Step Evaluation                                │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Select Account Size ▼                       │ │
│ │ • $10,000 @ €155                            │ │
│ │ • $25,000 @ €250                            │ │
│ │ • $50,000 @ €345                            │ │
│ │ • $100,000 @ €540                           │ │
│ │ • $200,000 @ €1,080                         │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ┌─────────┬─────────┬─────────┬─────────┐      │
│ │ Target  │ Drawdown│ Split   │ Days    │      │
│ │ 10%     │ 10%     │ 90%     │ 4+      │      │
│ └─────────┴─────────┴─────────┴─────────┘      │
│                                                  │
│ [View Details] [Compare]                         │
└─────────────────────────────────────────────────┘
```

### Drawer Behavior
Quando clicchi "View Details":
- Drawer mostra info del program
- Tabs per ogni account size
- Oppure: table comparativa di tutte le sizes

```
┌─────────────────────────────────────────────────┐
│ FTMO Challenge - Details                    [×] │
├─────────────────────────────────────────────────┤
│                                                  │
│ [Overview] [Pricing] [Rules] [Payout]           │
│                                                  │
│ === PRICING ===                                  │
│                                                  │
│ | Size     | Fee    | Refund | Scaling |        │
│ |----------|--------|--------|---------|        │
│ | $10K     | €155   | ✓      | $200K   |        │
│ | $25K     | €250   | ✓      | $200K   |        │
│ | $50K     | €345   | ✓      | $200K   |        │
│ | $100K    | €540   | ✓      | $200K   |        │
│ | $200K    | €1,080 | ✓      | $200K   |        │
│                                                  │
│ [Start Challenge]                                │
└─────────────────────────────────────────────────┘
```

### Pro
- ✅ Compatto (1 card invece di 5)
- ✅ Chiaro che sono varianti dello stesso program
- ✅ Facile confrontare prezzi
- ✅ Meno scroll
- ✅ Drawer mostra tutte le opzioni insieme

### Contro
- ❌ Più complesso da implementare
- ❌ Richiede interazione per vedere tutte le opzioni
- ❌ Filtro per prezzo meno immediato

### Quando Usare
- ✅ **Quando hai molte varianti dello stesso program** (FTMO, FundedNext)
- ✅ Quando le varianti differiscono solo per size/prezzo
- ✅ Quando vuoi UI pulita e scannable

---

## 📊 OPZIONE 3: Card Grouped con Expansion (Hybrid)

### Come Funziona
1 card collapsed, espandibile per vedere tutte le varianti.

```
┌─────────────────────────────────────────────────┐
│ [FTMO Logo]                    [💰 Refundable]  │
│                                                  │
│ FTMO Challenge                                   │
│ 2-Step Evaluation                                │
│                                                  │
│ From €155 • 5 account sizes available           │
│                                                  │
│ ┌─────────┬─────────┬─────────┬─────────┐      │
│ │ Target  │ Drawdown│ Split   │ Days    │      │
│ │ 10%     │ 10%     │ 90%     │ 4+      │      │
│ └─────────┴─────────┴─────────┴─────────┘      │
│                                                  │
│ [Show All Sizes ▼] [View Details]               │
└─────────────────────────────────────────────────┘

// Quando clicchi "Show All Sizes":

┌─────────────────────────────────────────────────┐
│ [FTMO Logo]                    [💰 Refundable]  │
│                                                  │
│ FTMO Challenge                                   │
│ 2-Step Evaluation                                │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ $10,000 @ €155      [Select] [Details]     │ │
│ │ $25,000 @ €250      [Select] [Details]     │ │
│ │ $50,000 @ €345      [Select] [Details]     │ │
│ │ $100,000 @ €540     [Select] [Details]     │ │
│ │ $200,000 @ €1,080   [Select] [Details]     │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ [Hide Sizes ▲]                                   │
└─────────────────────────────────────────────────┘
```

### Pro
- ✅ Compatto quando collapsed
- ✅ Tutte le opzioni visibili quando expanded
- ✅ Buon compromesso tra Opzione 1 e 2
- ✅ Facile confrontare prezzi

### Contro
- ❌ Richiede click per vedere tutte le opzioni
- ❌ Può diventare lungo quando expanded
- ❌ Più complesso da implementare

### Quando Usare
- Quando vuoi dare overview rapida ma anche dettaglio on-demand
- Quando hai 3-10 varianti per program
- Quando vuoi massima flessibilità

---

## 🎯 RACCOMANDAZIONE

### Per Tradelia: **OPZIONE 2 (Grouped con Dropdown)** ⭐

**Perché**:
1. **Scalabilità**: Funziona con 5 varianti (FTMO) o 36 (FundedNext)
2. **Chiarezza**: Utente capisce subito che sono varianti dello stesso program
3. **Compattezza**: 1 card invece di 5-36
4. **Drawer Ottimale**: Mostra tutte le opzioni in table comparativa
5. **Mobile Friendly**: Meno scroll, più contenuto visibile

### Implementazione Dettagliata

#### Card Component
```tsx
interface ChallengeCardProps {
  program: Program;
  offers: Offer[]; // Array di tutte le varianti
  defaultOfferId?: string; // Offer selezionato di default
}

export function ChallengeCard({ program, offers, defaultOfferId }: ChallengeCardProps) {
  const [selectedOffer, setSelectedOffer] = useState(
    offers.find(o => o.id === defaultOfferId) || offers[0]
  );
  
  return (
    <Card>
      <CardHeader>
        <FirmLogo firmId={program.organizer_id} />
        <h3>{program.name}</h3>
        <ChallengeTypeBadge type={program.subtype} />
      </CardHeader>
      
      <CardContent>
        {/* Account Size Selector */}
        <Select value={selectedOffer.id} onValueChange={(id) => {
          setSelectedOffer(offers.find(o => o.id === id)!);
        }}>
          <SelectTrigger>
            <SelectValue>
              {formatAccountSize(selectedOffer.account_size)} @ {formatCurrency(selectedOffer.entry_fee, selectedOffer.fee_currency)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {offers.map(offer => (
              <SelectItem key={offer.id} value={offer.id}>
                {formatAccountSize(offer.account_size)} @ {formatCurrency(offer.entry_fee, offer.fee_currency)}
                {offer.refundable && <Badge>Refundable</Badge>}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Key Metrics (same for all offers in same program) */}
        <MetricsGrid offer={selectedOffer} />
        
        {/* Platforms */}
        <PlatformIcons platforms={selectedOffer.market_access?.platforms} />
      </CardContent>
      
      <CardFooter>
        <Button onClick={() => openDrawer(program, offers, selectedOffer)}>
          View Details
        </Button>
        <Button variant="outline" onClick={() => addToCompare(selectedOffer)}>
          Compare
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### Drawer Component
```tsx
interface ChallengeDrawerProps {
  program: Program;
  offers: Offer[];
  selectedOffer: Offer;
}

export function ChallengeDrawer({ program, offers, selectedOffer }: ChallengeDrawerProps) {
  return (
    <Drawer>
      <DrawerHeader>
        <h2>{program.name}</h2>
        <FirmLogo firmId={program.organizer_id} />
      </DrawerHeader>
      
      <DrawerContent>
        <Tabs defaultValue="pricing">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="payout">Payout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pricing">
            {/* Comparison Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Size</TableHead>
                  <TableHead>Entry Fee</TableHead>
                  <TableHead>Refundable</TableHead>
                  <TableHead>Scaling Max</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map(offer => (
                  <TableRow key={offer.id} className={offer.id === selectedOffer.id ? 'bg-accent' : ''}>
                    <TableCell>{formatAccountSize(offer.account_size)}</TableCell>
                    <TableCell>{formatCurrency(offer.entry_fee, offer.fee_currency)}</TableCell>
                    <TableCell>{offer.refundable ? '✓' : '✗'}</TableCell>
                    <TableCell>{formatAccountSize(offer.scaling_max)}</TableCell>
                    <TableCell>
                      <Button size="sm">Select</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="rules">
            {/* Rules for selected offer */}
            <RulesDisplay offer={selectedOffer} />
          </TabsContent>
          
          {/* ... other tabs */}
        </Tabs>
      </DrawerContent>
      
      <DrawerFooter>
        <Button onClick={() => startChallenge(selectedOffer)}>
          Start Challenge
        </Button>
      </DrawerFooter>
    </Drawer>
  );
}
```

#### Query Strategy
```typescript
// Get programs with their offers grouped
async function getProgramsWithOffers() {
  // 1. Get all programs
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'active');
  
  // 2. Get all offers for these programs
  const { data: offers } = await supabase
    .from('offers')
    .select('*, market_access(*)')
    .in('program_id', programs.map(p => p.id))
    .order('display_order');
  
  // 3. Group offers by program
  const programsWithOffers = programs.map(program => ({
    ...program,
    offers: offers.filter(o => o.program_id === program.id),
  }));
  
  return programsWithOffers;
}
```

---

## 📊 CASO SPECIALE: FundedNext (6 Challenge Types)

FundedNext ha 6 challenge types diversi (non solo account sizes):
- Stellar Lite (regole diverse)
- Stellar 2-Step (regole diverse)
- Express (regole diverse)
- etc.

**Soluzione**: Ogni challenge type = 1 program separato

```
Database:
- Program: fundednext-stellar-lite (6 offers)
- Program: fundednext-stellar-2step (6 offers)
- Program: fundednext-express (6 offers)

UI:
- Card: FundedNext Stellar Lite (dropdown con 6 sizes)
- Card: FundedNext Stellar 2-Step (dropdown con 6 sizes)
- Card: FundedNext Express (dropdown con 6 sizes)
```

**Rationale**: Challenge types con regole diverse = programs diversi.

---

## ✅ DECISIONE FINALE

**Implementiamo OPZIONE 2**:
- 1 card per program
- Dropdown per selezionare account size
- Drawer con table comparativa di tutte le sizes
- Query raggruppa offers per program_id

**Vantaggi**:
- ✅ Scalabile (funziona con 5 o 36 varianti)
- ✅ Chiaro (utente capisce la struttura)
- ✅ Compatto (meno scroll)
- ✅ Drawer ottimale (confronto facile)

**Vuoi che proceda con questa strategia?** 🎯

