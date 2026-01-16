'use client';

import { useState } from 'react';

// ============================================
// ALTERNATIVA 1: Constellation Network
// ============================================
const Illustration1 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
    <svg viewBox="0 0 300 300" className="size-full">
      <defs>
        <radialGradient id="nodeGlow1">
          <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Connection lines */}
      <g stroke="hsl(217, 91%, 60%)" strokeOpacity="0.3" strokeWidth="1">
        <line x1="50" y1="80" x2="150" y2="150" />
        <line x1="150" y1="150" x2="250" y2="100" />
        <line x1="150" y1="150" x2="100" y2="220" />
        <line x1="150" y1="150" x2="220" y2="230" />
        <line x1="50" y1="80" x2="100" y2="220" />
        <line x1="250" y1="100" x2="220" y2="230" />
      </g>
      {/* Nodes */}
      <circle cx="50" cy="80" r="8" fill="url(#nodeGlow1)" />
      <circle cx="150" cy="150" r="12" fill="hsl(217, 91%, 60%)" />
      <circle cx="250" cy="100" r="6" fill="url(#nodeGlow1)" />
      <circle cx="100" cy="220" r="7" fill="url(#nodeGlow1)" />
      <circle cx="220" cy="230" r="5" fill="url(#nodeGlow1)" />
      {/* Center icon */}
      <text x="150" y="155" textAnchor="middle" fill="white" fontSize="14">₿</text>
    </svg>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">1. Constellation Network</p>
  </div>
);

// ============================================
// ALTERNATIVA 2: Isometric Blocks
// ============================================
const Illustration2 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
    <svg viewBox="0 0 300 300" className="size-full">
      <defs>
        <linearGradient id="blockGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="blockGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* Isometric cubes */}
      <g transform="translate(150, 180)">
        {/* Back cube */}
        <polygon points="0,-80 40,-60 40,0 0,-20 -40,0 -40,-60" fill="url(#blockGrad1)" opacity="0.5" />
        {/* Middle cube */}
        <polygon points="0,-40 40,-20 40,40 0,20 -40,40 -40,-20" fill="url(#blockGrad2)" opacity="0.7" />
        {/* Front cube */}
        <polygon points="0,0 40,20 40,80 0,60 -40,80 -40,20" fill="url(#blockGrad1)" />
        {/* Top faces */}
        <polygon points="0,-80 40,-60 0,-40 -40,-60" fill="#93C5FD" opacity="0.3" />
        <polygon points="0,-40 40,-20 0,0 -40,-20" fill="#93C5FD" opacity="0.4" />
        <polygon points="0,0 40,20 0,40 -40,20" fill="#93C5FD" opacity="0.5" />
      </g>
    </svg>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">2. Isometric Blocks</p>
  </div>
);

// ============================================
// ALTERNATIVA 3: Gradient Orbs Only
// ============================================
const Illustration3 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-slate-900">
    <div className="absolute -left-10 -top-10 size-40 rounded-full bg-blue-500/30 blur-3xl" />
    <div className="absolute -bottom-10 -right-10 size-32 rounded-full bg-cyan-500/30 blur-3xl" />
    <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/40 blur-2xl" />
    <div className="absolute left-1/4 top-1/3 size-16 rounded-full bg-purple-500/30 blur-2xl" />
    {/* Center text */}
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-6xl font-bold text-white/10">T</span>
    </div>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">3. Gradient Orbs</p>
  </div>
);

// ============================================
// ALTERNATIVA 4: Circuit Board
// ============================================
const Illustration4 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
    <svg viewBox="0 0 300 300" className="size-full">
      <defs>
        <linearGradient id="circuitGrad">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Circuit paths */}
      <g stroke="#3B82F6" strokeWidth="2" fill="none" strokeOpacity="0.4">
        <path d="M20 150 H100 V80 H150" />
        <path d="M150 80 H200 V150 H280" />
        <path d="M150 80 V150" />
        <path d="M150 150 V220 H100" />
        <path d="M150 150 H200 V220 H250" />
        <path d="M20 220 H60 V180" />
      </g>
      {/* Nodes */}
      <g fill="#3B82F6">
        <circle cx="150" cy="150" r="10" />
        <circle cx="150" cy="80" r="5" />
        <circle cx="100" cy="150" r="4" />
        <circle cx="200" cy="150" r="4" />
        <circle cx="100" cy="220" r="4" />
        <circle cx="250" cy="220" r="4" />
      </g>
      {/* Center symbol */}
      <text x="150" y="155" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Ξ</text>
    </svg>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">4. Circuit Board</p>
  </div>
);

// ============================================
// ALTERNATIVA 5: Floating Cards
// ============================================
const Illustration5 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
    {/* Background glow */}
    <div className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />
    {/* Floating cards */}
    <div
      className="absolute left-8 top-12 h-20 w-32 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
      style={{ transform: 'rotateX(10deg) rotateY(-10deg)' }}
    >
      <div className="p-2 text-xs text-white/60">Lezione 1</div>
    </div>
    <div
      className="absolute right-8 top-20 h-24 w-36 rounded-lg border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm"
      style={{ transform: 'rotateX(5deg) rotateY(5deg)' }}
    >
      <div className="p-3 text-sm font-medium text-white/80">₿ Bitcoin</div>
    </div>
    <div
      className="absolute bottom-16 left-16 h-16 w-28 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
      style={{ transform: 'rotateX(-5deg) rotateY(-5deg)' }}
    >
      <div className="p-2 text-xs text-white/60">+10 XP</div>
    </div>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">5. Floating Cards</p>
  </div>
);

// ============================================
// ALTERNATIVA 6: Abstract Waves
// ============================================
const Illustration6 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-slate-900">
    <svg viewBox="0 0 300 300" className="size-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d="M0 200 Q75 150 150 180 T300 160 V300 H0 Z" fill="url(#waveGrad1)" />
      <path d="M0 220 Q75 180 150 200 T300 180 V300 H0 Z" fill="url(#waveGrad2)" />
      <path d="M0 240 Q75 210 150 230 T300 210 V300 H0 Z" fill="#3B82F6" fillOpacity="0.2" />
    </svg>
    {/* Floating element */}
    <div className="absolute left-1/2 top-1/3 -translate-x-1/2">
      <div className="flex size-16 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
        <span className="text-2xl text-blue-400">📚</span>
      </div>
    </div>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">6. Abstract Waves</p>
  </div>
);

// ============================================
// ALTERNATIVA 7: Hexagon Grid
// ============================================
const Illustration7 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
    <svg viewBox="0 0 300 300" className="size-full">
      <defs>
        <pattern id="hexPattern" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon
            points="30,0 60,15 60,45 30,60 0,45 0,15"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1"
            strokeOpacity="0.2"
            transform="translate(0, -4)"
          />
        </pattern>
      </defs>
      <rect width="300" height="300" fill="url(#hexPattern)" />
      {/* Highlighted hexagons */}
      <polygon points="150,120 180,135 180,165 150,180 120,165 120,135" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2" />
      <polygon points="210,150 240,165 240,195 210,210 180,195 180,165" fill="#60A5FA" fillOpacity="0.2" stroke="#60A5FA" strokeWidth="1" />
      <polygon points="90,150 120,165 120,195 90,210 60,195 60,165" fill="#60A5FA" fillOpacity="0.2" stroke="#60A5FA" strokeWidth="1" />
      {/* Center icon */}
      <text x="150" y="155" textAnchor="middle" fill="white" fontSize="20">₿</text>
    </svg>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">7. Hexagon Grid</p>
  </div>
);

// ============================================
// ALTERNATIVA 8: Radial Burst
// ============================================
const Illustration8 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-slate-900">
    <svg viewBox="0 0 300 300" className="size-full">
      <defs>
        <radialGradient id="burstGrad">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Radial lines */}
      <g stroke="#3B82F6" strokeOpacity="0.3">
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="150"
            y1="150"
            x2={150 + Math.cos((i * 30 * Math.PI) / 180) * 120}
            y2={150 + Math.sin((i * 30 * Math.PI) / 180) * 120}
            strokeWidth={i % 3 === 0 ? 2 : 1}
          />
        ))}
      </g>
      {/* Concentric circles */}
      <circle cx="150" cy="150" r="40" fill="none" stroke="#3B82F6" strokeOpacity="0.2" />
      <circle cx="150" cy="150" r="80" fill="none" stroke="#3B82F6" strokeOpacity="0.15" />
      <circle cx="150" cy="150" r="120" fill="none" stroke="#3B82F6" strokeOpacity="0.1" />
      {/* Center */}
      <circle cx="150" cy="150" r="30" fill="url(#burstGrad)" />
      <circle cx="150" cy="150" r="20" fill="#3B82F6" />
      <text x="150" y="156" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">T</text>
    </svg>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">8. Radial Burst</p>
  </div>
);

// ============================================
// ALTERNATIVA 9: Layered Mountains
// ============================================
const Illustration9 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
    <svg viewBox="0 0 300 300" className="size-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
        <linearGradient id="mountain3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      {/* Back mountain */}
      <polygon points="0,300 50,180 120,220 180,160 250,200 300,140 300,300" fill="url(#mountain1)" />
      {/* Middle mountain */}
      <polygon points="0,300 80,200 150,240 200,180 280,220 300,180 300,300" fill="url(#mountain2)" />
      {/* Front mountain */}
      <polygon points="0,300 100,220 180,260 220,200 300,240 300,300" fill="url(#mountain3)" />
      {/* Stars */}
      <circle cx="50" cy="60" r="2" fill="white" fillOpacity="0.5" />
      <circle cx="120" cy="40" r="1.5" fill="white" fillOpacity="0.4" />
      <circle cx="200" cy="70" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="260" cy="50" r="1" fill="white" fillOpacity="0.3" />
      {/* Moon/Sun */}
      <circle cx="240" cy="80" r="20" fill="#3B82F6" fillOpacity="0.3" />
    </svg>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">9. Layered Mountains</p>
  </div>
);

// ============================================
// ALTERNATIVA 10: Data Flow
// ============================================
const Illustration10 = () => (
  <div className="relative size-80 overflow-hidden rounded-2xl bg-slate-900">
    <svg viewBox="0 0 300 300" className="size-full">
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      {/* Flow lines */}
      <g fill="none" stroke="url(#flowGrad)" strokeWidth="2" strokeOpacity="0.5">
        <path d="M30 80 Q80 80 100 120 T150 150 T200 120 T270 100" />
        <path d="M30 150 Q80 150 100 180 T150 200 T200 180 T270 150" />
        <path d="M30 220 Q80 220 100 200 T150 180 T200 200 T270 220" />
      </g>
      {/* Data points */}
      <g fill="#3B82F6">
        <circle cx="100" cy="120" r="6" />
        <circle cx="150" cy="150" r="8" />
        <circle cx="200" cy="120" r="5" />
        <circle cx="100" cy="180" r="5" />
        <circle cx="150" cy="200" r="6" />
        <circle cx="200" cy="180" r="4" />
      </g>
      {/* Labels */}
      <g fill="white" fontSize="8" fillOpacity="0.6">
        <text x="100" y="105">BTC</text>
        <text x="145" y="135">ETH</text>
        <text x="195" y="105">SOL</text>
      </g>
    </svg>
    <p className="absolute bottom-2 left-2 text-xs text-white/50">10. Data Flow</p>
  </div>
);

// ============================================
// MAIN PAGE
// ============================================
export default function IllustrationsPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const illustrations = [
    { id: 1, name: 'Constellation Network', component: Illustration1 },
    { id: 2, name: 'Isometric Blocks', component: Illustration2 },
    { id: 3, name: 'Gradient Orbs', component: Illustration3 },
    { id: 4, name: 'Circuit Board', component: Illustration4 },
    { id: 5, name: 'Floating Cards', component: Illustration5 },
    { id: 6, name: 'Abstract Waves', component: Illustration6 },
    { id: 7, name: 'Hexagon Grid', component: Illustration7 },
    { id: 8, name: 'Radial Burst', component: Illustration8 },
    { id: 9, name: 'Layered Mountains', component: Illustration9 },
    { id: 10, name: 'Data Flow', component: Illustration10 },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold">Hero Illustration Alternatives</h1>
        <p className="mb-8 text-muted-foreground">
          Clicca su una per selezionarla. Dimmi quale preferisci e la implemento.
        </p>

        {selected && (
          <div className="mb-8 rounded-lg border border-primary bg-primary/10 p-4">
            <p className="font-medium">
              Selezionata:
              {' '}
              <span className="text-primary">{illustrations[selected - 1]?.name}</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {illustrations.map(({ id, component: Component }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={`rounded-2xl p-2 transition-all ${
                selected === id
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'hover:ring-2 hover:ring-white/20'
              }`}
            >
              <Component />
            </button>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Legenda stili:</h2>
          <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <li><strong>1. Constellation:</strong> Network di nodi connessi, tech/crypto vibe</li>
            <li><strong>2. Isometric:</strong> Cubi 3D impilati, blockchain/building blocks</li>
            <li><strong>3. Gradient Orbs:</strong> Minimalista, solo sfumature, premium feel</li>
            <li><strong>4. Circuit:</strong> Stile PCB/tech, connessioni digitali</li>
            <li><strong>5. Floating Cards:</strong> UI elements 3D, app-like</li>
            <li><strong>6. Waves:</strong> Astratto, fluido, calmo</li>
            <li><strong>7. Hexagon:</strong> Pattern geometrico, crypto/blockchain</li>
            <li><strong>8. Radial:</strong> Esplosione dal centro, energia</li>
            <li><strong>9. Mountains:</strong> Landscape astratto, journey/crescita</li>
            <li><strong>10. Data Flow:</strong> Flusso dati, fintech/analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
