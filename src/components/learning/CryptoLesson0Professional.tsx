'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Professional SVG Icons
const AnalogicalIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ProceduralIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4a2 2 0 002 2h2a2 2 0 002-2v-4m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2v2a2 2 0 01-2 2M9 5a2 2 0 012 2v2a2 2 0 01-2 2" />
  </svg>
);

const ConceptualIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CheckIcon = ({ className = 'size-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const BrainIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const TrophyIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

type ApproachType = 'analogical' | 'procedural' | 'conceptual';

type ApproachConfig = {
  id: ApproachType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    primary: string;
    background: string;
    border: string;
    text: string;
  };
  content: {
    title: string;
    sections: Array<{
      type: 'intro' | 'highlight' | 'list' | 'warning';
      content: string;
      items?: string[];
    }>;
    keyPoints: string[];
  };
};

const approaches: ApproachConfig[] = [
  {
    id: 'analogical',
    title: 'Approccio Analogico',
    description: 'Comprendi attraverso metafore familiari',
    icon: AnalogicalIcon,
    color: {
      primary: 'text-blue-600',
      background: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
    },
    content: {
      title: 'Il Registro Digitale Condiviso',
      sections: [
        {
          type: 'intro',
          content: 'Immagina un registro bancario che invece di essere custodito in una banca, è condiviso tra migliaia di persone in tutto il mondo. Ogni transazione deve essere verificata e approvata dalla maggioranza prima di essere registrata definitivamente.',
        },
        {
          type: 'highlight',
          content: 'Mapping concettuale:',
          items: [
            'Registro bancario → Blockchain (catena di blocchi)',
            'Pagine del registro → Blocchi di transazioni',
            'Verificatori → Nodi della rete',
            'Firma del direttore → Consenso distribuito',
          ],
        },
        {
          type: 'warning',
          content: 'Limitazioni dell\'analogia: A differenza di un registro fisico, la blockchain può crescere infinitamente e garantisce pseudonimato invece di trasparenza completa delle identità.',
        },
      ],
      keyPoints: [
        'Nessuna autorità centrale controlla il sistema',
        'La sicurezza deriva dalla verifica collettiva',
        'Una volta registrata, una transazione è praticamente immutabile',
      ],
    },
  },
  {
    id: 'procedural',
    title: 'Approccio Procedurale',
    description: 'Impara attraverso processi step-by-step',
    icon: ProceduralIcon,
    color: {
      primary: 'text-green-600',
      background: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
    },
    content: {
      title: 'Come Funziona una Transazione Crypto',
      sections: [
        {
          type: 'intro',
          content: 'Seguiamo il processo completo di una transazione Bitcoin da Alice a Bob:',
        },
        {
          type: 'list',
          content: 'Processo di transazione:',
          items: [
            '1. Alice crea la transazione specificando destinatario e importo',
            '2. Alice firma digitalmente con la sua chiave privata',
            '3. La transazione viene trasmessa alla rete peer-to-peer',
            '4. I nodi validano la transazione secondo le regole del protocollo',
            '5. I miner includono la transazione in un nuovo blocco',
            '6. Il blocco viene aggiunto alla blockchain dopo il consenso',
            '7. Bob riceve la conferma e può utilizzare i fondi',
          ],
        },
        {
          type: 'highlight',
          content: 'Tempo stimato: 10-60 minuti a seconda della rete e delle commissioni pagate.',
        },
      ],
      keyPoints: [
        'Ogni step è verificabile matematicamente',
        'Non serve fiducia in intermediari',
        'Il processo è trasparente e auditabile',
      ],
    },
  },
  {
    id: 'conceptual',
    title: 'Approccio Concettuale',
    description: 'Comprendi attraverso definizioni formali',
    icon: ConceptualIcon,
    color: {
      primary: 'text-purple-600',
      background: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
    },
    content: {
      title: 'Definizione Tecnica delle Criptovalute',
      sections: [
        {
          type: 'intro',
          content: 'Una criptovaluta è un asset digitale che utilizza la crittografia per garantire transazioni sicure e controllare la creazione di nuove unità, operando su una rete distribuita senza autorità centrale.',
        },
        {
          type: 'highlight',
          content: 'Componenti fondamentali:',
          items: [
            'Crittografia asimmetrica (chiavi pubbliche/private)',
            'Funzioni hash crittografiche (SHA-256)',
            'Algoritmi di consenso (Proof of Work, Proof of Stake)',
            'Strutture dati Merkle Tree',
            'Rete peer-to-peer distribuita',
          ],
        },
        {
          type: 'list',
          content: 'Proprietà emergenti:',
          items: [
            'Decentralizzazione: Nessun single point of failure',
            'Immutabilità: Resistenza alle modifiche retroattive',
            'Trasparenza: Tutte le transazioni sono pubblicamente verificabili',
            'Pseudonimato: Privacy delle identità con trasparenza delle transazioni',
          ],
        },
      ],
      keyPoints: [
        'Sistema basato su matematica e crittografia, non fiducia',
        'Consenso distribuito sostituisce l\'autorità centrale',
        'Trade-off tra decentralizzazione, sicurezza e scalabilità',
      ],
    },
  },
];

export const CryptoLesson0Professional: React.FC = () => {
  const [activeApproach, setActiveApproach] = useState<ApproachType>('analogical');
  const [exploredApproaches, setExploredApproaches] = useState<Set<ApproachType>>(new Set(['analogical']));

  const handleApproachChange = (approach: ApproachType) => {
    setActiveApproach(approach);
    setExploredApproaches(prev => new Set([...prev, approach]));
  };

  const progress = (exploredApproaches.size / 3) * 100;
  const isFirstIntegration = exploredApproaches.size === 2;
  const isMasteryAchieved = exploredApproaches.size === 3;
  const activeApproachData = approaches.find(a => a.id === activeApproach)!;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            Lezione 0 • 5 minuti • 50 XP
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cosa sono le Criptovalute
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Scopri lo stesso concetto attraverso tre prospettive complementari.
            L'integrazione di approcci multipli costruisce comprensione robusta e trasferibile.
          </p>
        </div>

        {/* Progress Section */}
        <div className="mx-auto max-w-md space-y-3">
          <Progress value={progress} variant="primary" className="h-2" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{exploredApproaches.size}</span>
            {' '}
            di
            <span className="font-medium">3</span>
            {' '}
            approcci esplorati
          </p>
        </div>
      </div>

      {/* Feedback Cards */}
      {isFirstIntegration && !isMasteryAchieved && (
        <Card className="border-blue-200 bg-blue-50/50 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
              <BrainIcon className="size-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">
                Eccellente! Stai sviluppando flessibilità cognitiva
              </h3>
              <p className="mt-1 text-sm text-blue-800">
                L'integrazione di rappresentazioni multiple costruisce modelli mentali più robusti e trasferibili.
                Continua ad esplorare per completare la comprensione.
              </p>
            </div>
          </div>
        </Card>
      )}

      {isMasteryAchieved && (
        <Card className="border-green-200 bg-green-50/50 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
              <TrophyIcon className="size-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">
                Rappresentazioni Integrate con Successo!
              </h3>
              <p className="mt-1 text-sm text-green-800">
                Hai costruito un modello mentale completo attraverso prospettive complementari.
                Ora sei pronto per il quiz di verifica.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Approach Tabs */}
      <div className="grid gap-3 sm:grid-cols-3">
        {approaches.map((approach) => {
          const isActive = activeApproach === approach.id;
          const isExplored = exploredApproaches.has(approach.id);

          return (
            <button
              type="button"
              key={approach.id}
              onClick={() => handleApproachChange(approach.id)}
              className={`
                group relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all duration-200
                ${isActive
              ? `${approach.color.border} ${approach.color.background} shadow-lg`
              : 'border-border bg-card hover:border-primary/20 hover:shadow-md'
            }
              `}
            >
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-3">
                  <div className={`
                    flex size-10 items-center justify-center rounded-lg transition-colors
                    ${isActive ? 'bg-white/80' : 'bg-muted'}
                  `}
                  >
                    <approach.icon className={`size-5 ${isActive ? approach.color.primary : 'text-muted-foreground'}`} />
                  </div>
                  {isExplored && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon className="size-4 text-green-600" />
                    </div>
                  )}
                </div>

                <h3 className={`mb-2 font-semibold ${isActive ? approach.color.text : 'text-foreground'}`}>
                  {approach.title}
                </h3>
                <p className={`text-sm ${isActive ? `${approach.color.text}/80` : 'text-muted-foreground'}`}>
                  {approach.description}
                </p>
              </div>

              {/* Subtle gradient overlay for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className={`flex size-12 items-center justify-center rounded-xl ${activeApproachData.color.background}`}>
              <activeApproachData.icon className={`size-6 ${activeApproachData.color.primary}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {activeApproachData.content.title}
              </h2>
              <p className="text-muted-foreground">
                {activeApproachData.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {activeApproachData.content.sections.map((section, index) => (
              <div key={`section-${activeApproachData.id}-${index}`} className="space-y-3">
                {section.type === 'intro' && (
                  <p className="text-base leading-relaxed text-foreground">
                    {section.content}
                  </p>
                )}

                {section.type === 'highlight' && (
                  <div className={`rounded-lg border p-4 ${activeApproachData.color.border} ${activeApproachData.color.background}`}>
                    <h4 className={`mb-3 font-semibold ${activeApproachData.color.text}`}>
                      {section.content}
                    </h4>
                    {section.items && (
                      <ul className={`space-y-2 ${activeApproachData.color.text}`}>
                        {section.items.map(item => (
                          <li key={`highlight-item-${index}-${item.substring(0, 15)}`} className="flex items-start gap-2 text-sm">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {section.type === 'list' && (
                  <div>
                    <h4 className="mb-3 font-semibold text-foreground">
                      {section.content}
                    </h4>
                    {section.items && (
                      <ol className="space-y-2">
                        {section.items.map((item, i) => (
                          <li key={`list-item-${index}-${i}`} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                              {i + 1}
                            </span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                {section.type === 'warning' && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 size-5 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm text-amber-800">
                        <span className="font-medium">Nota importante:</span>
                        {' '}
                        {section.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Key Points */}
            <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Punti Chiave
              </h4>
              <ul className="space-y-2">
                {activeApproachData.content.keyPoints.map(point => (
                  <li key={`keypoint-${activeApproachData.id}-${point.substring(0, 15)}`} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Area */}
      <div className="text-center">
        {isMasteryAchieved
          ? (
              <Button size="lg" className="h-12 bg-gradient-to-r from-primary to-accent px-8 text-base hover:from-primary/90 hover:to-accent/90">
                Inizia il Quiz di Verifica
                <svg className="ml-2 size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            )
          : (
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Esplora tutti e 3 gli approcci per sbloccare il quiz di verifica
                </p>
                <div className="flex justify-center gap-2">
                  {approaches.map(approach => (
                    <div
                      key={approach.id}
                      className={`size-2 rounded-full transition-colors ${
                        exploredApproaches.has(approach.id) ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
      </div>
    </div>
  );
};
