# DRAWER RESPONSIVE AUDIT - 2026-01-27

## 🔍 PROBLEMI IDENTIFICATI

### ❌ Header NON Responsive
```tsx
// ATTUALE (PROBLEMA)
<div className="flex items-start gap-4 px-6 py-5">
  <h2 className="mb-2 text-2xl font-bold">  // ← Sempre 24px!
  <div className="text-sm text-muted-foreground">  // ← Sempre 14px!
```

**Problema**: Dimensioni fisse su tutti i breakpoint

### ❌ Footer NON Responsive
```tsx
// ATTUALE (PROBLEMA)
<footer className="glass-panel sticky bottom-0 border-t border-border/50 px-6 py-5">
  // ← Sempre px-6 py-5
```

### ❌ Badges NON Responsive
```tsx
// ATTUALE (PROBLEMA)
<span className="text-xs font-bold">  // ← Sempre 12px
```

### ❌ Close Button NON Responsive
```tsx
// ATTUALE (PROBLEMA)
<button className="shrink-0 rounded-xl p-2.5">  // ← Sempre 40px
  <CloseIcon />  // ← Sempre 20px
```

## 📊 BEST PRACTICE 2026 - RESPONSIVE SCALE

### Material Design 3 + iOS HIG Guidelines

#### Typography Scale
| Element | Mobile (<640px) | Tablet (640-1023px) | Desktop (1024px+) |
|---------|----------------|---------------------|-------------------|
| H1 (Title) | 20px (text-xl) | 24px (text-2xl) | 28px (text-3xl) |
| H2 (Section) | 16px (text-base) | 18px (text-lg) | 20px (text-xl) |
| Body | 14px (text-sm) | 14px (text-sm) | 16px (text-base) |
| Caption | 12px (text-xs) | 12px (text-xs) | 14px (text-sm) |
| Badge | 11px (text-xs) | 12px (text-xs) | 12px (text-xs) |

#### Spacing Scale
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Header padding | px-4 py-4 | px-6 py-5 | px-8 py-6 |
| Content padding | px-4 py-6 | px-6 py-8 | px-8 py-10 |
| Section gap | space-y-6 | space-y-8 | space-y-10 |
| Card padding | p-3 | p-4 | p-5 |
| Button padding | px-3 py-2 | px-4 py-2.5 | px-5 py-3 |

#### Touch Targets
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Primary button | 48px | 44px | 40px |
| Secondary button | 44px | 40px | 36px |
| Icon button | 44px | 40px | 36px |
| Close button | 44px | 44px | 40px |

#### Icon Sizes
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Section icon | 36px container, 18px icon | 40px container, 20px icon | 44px container, 22px icon |
| Badge icon | 14px | 16px | 16px |
| Button icon | 20px | 20px | 20px |

## ✅ CORREZIONI NECESSARIE

### 1. Header Responsive
```tsx
<header className="glass-panel sticky top-0 z-10 border-b border-border/50 backdrop-blur-xl">
  <div className="flex items-start gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
    <div className="min-w-0 flex-1">
      {/* Badges */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5 sm:mb-3 sm:gap-2">
        <span className="text-[11px] sm:text-xs">Badge</span>
      </div>
      
      {/* Title */}
      <h2 className="mb-1.5 text-xl font-bold sm:mb-2 sm:text-2xl lg:text-3xl">
        {program.name}
      </h2>
      
      {/* Meta */}
      <div className="text-xs text-muted-foreground sm:text-sm">
        {program.organizer_name}
      </div>
    </div>
    
    {/* Close Button */}
    <button className="shrink-0 rounded-xl p-2 sm:p-2.5 lg:p-3">
      <CloseIcon className="size-5 sm:size-5 lg:size-6" />
    </button>
  </div>
</header>
```

### 2. Content Responsive
```tsx
<div className="flex-1 overflow-y-auto">
  <div className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:space-y-10 lg:px-8 lg:py-10">
    {/* Sections */}
  </div>
</div>
```

### 3. Footer Responsive
```tsx
<footer className="glass-panel sticky bottom-0 border-t border-border/50 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5 lg:px-8 lg:py-6">
  <div className="flex gap-2.5 sm:gap-3 lg:gap-4">
    <button className="flex-1 px-3 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base">
      Close
    </button>
    <button className="flex-1 px-3 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base">
      Start Challenge
    </button>
  </div>
</footer>
```

### 4. SectionHeader Responsive
```tsx
// GIÀ FATTO ✅
<div className="mb-4 flex items-center gap-2.5 sm:mb-5 sm:gap-3 lg:mb-6">
  <div className="flex size-9 items-center justify-center sm:size-10 lg:size-11">
    {icon}
  </div>
  <h3 className="text-base font-bold sm:text-lg lg:text-xl">{title}</h3>
</div>
```

## 📐 GERARCHIA VISIVA

### Livello 1 - Primario (Drawer Title)
- Mobile: text-xl (20px) font-bold
- Tablet: text-2xl (24px) font-bold
- Desktop: text-3xl (28px) font-bold

### Livello 2 - Secondario (Section Headers)
- Mobile: text-base (16px) font-bold
- Tablet: text-lg (18px) font-bold
- Desktop: text-xl (20px) font-bold

### Livello 3 - Terziario (Subsections)
- Mobile: text-sm (14px) font-semibold
- Tablet: text-sm (14px) font-semibold
- Desktop: text-base (16px) font-semibold

### Livello 4 - Body
- Mobile: text-sm (14px)
- Tablet: text-sm (14px)
- Desktop: text-base (16px)

### Livello 5 - Caption
- Mobile: text-xs (12px)
- Tablet: text-xs (12px)
- Desktop: text-sm (14px)

## 🎯 RATIO OTTIMALI

### Desktop (1024px+)
- Title : Section : Body = 28px : 20px : 16px = 1.75 : 1.25 : 1
- Spacing: 32px section gap, 24px card padding

### Tablet (640-1023px)
- Title : Section : Body = 24px : 18px : 14px = 1.71 : 1.29 : 1
- Spacing: 24px section gap, 16px card padding

### Mobile (<640px)
- Title : Section : Body = 20px : 16px : 14px = 1.43 : 1.14 : 1
- Spacing: 20px section gap, 12px card padding

## 🔧 AZIONI RICHIESTE

1. ✅ SectionHeader - GIÀ RESPONSIVE
2. ❌ Header drawer - DA FIXARE
3. ❌ Footer drawer - DA FIXARE
4. ❌ Badges - DA FIXARE
5. ❌ Close button - DA FIXARE
6. ✅ Content padding - GIÀ FATTO
7. ✅ Section components - GIÀ RESPONSIVE

## 📱 TEST BREAKPOINTS

### Mobile (375px - iPhone SE)
- Header height: ~100px
- Title: 20px
- Badges: 11px
- Touch targets: 48px

### Tablet (768px - iPad)
- Header height: ~110px
- Title: 24px
- Badges: 12px
- Touch targets: 44px

### Desktop (1440px)
- Header height: ~120px
- Title: 28px
- Badges: 12px
- Touch targets: 40px

## 🎨 VISUAL WEIGHT

### Mobile
- Più compatto per massimizzare spazio
- Font più piccoli ma leggibili
- Touch targets più grandi (48px)

### Tablet
- Bilanciato tra mobile e desktop
- Font intermedi
- Touch targets standard (44px)

### Desktop
- Più arioso e spaziato
- Font più grandi per leggibilità
- Touch targets più piccoli (40px, mouse precision)
