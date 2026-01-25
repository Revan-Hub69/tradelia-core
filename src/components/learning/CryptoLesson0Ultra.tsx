'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Ultra-Premium SVG Icons
const AnalogicalIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ProceduralIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const ConceptualIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const CheckIcon = ({ className = 'size-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const BrainIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
  </svg>
);

const TrophyIcon = ({ className = 'size-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228V2.721m-2.48 5.228a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
  </svg>
);

// Separatore visivo elegante
const VisualSeparator = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center gap-2">
      <div className="h-px w-12 bg-gradient-to-r from-transparent to-border"></div>
      <div className="size-2 rounded-full bg-primary/20"></div>
      <div className="h-px w-12 bg-gradient-to-l from-transparent to-border"></div>
    </div>
  </div>
);

// Componente per Drop Cap (prima lettera gigante)
const DropCap = ({ children }: { children: string }) => {
  const firstLetter = children.charAt(0);
  const restOfText = children.slice(1);

  return (
    <p className="text-lg leading-relaxed text-foreground/90">
      <span className="float-left mr-2 text-6xl font-bold leading-none text-primary drop-shadow-sm">
        {firstLetter}
      </span>
      {restOfText}
    </p>
  );
};

// Componente per numerazione evidenziata
const NumberedStep = ({ number, children }: { number: number; children: React.ReactNode }) => (
  <div className="group flex gap-4">
    <div className="shrink-0">
      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-lg">
        {number}
      </div>
    </div>
    <div className="flex-1 pt-1">
      {children}
    </div>
  </div>
);

// Componente per highlight box premium
const PremiumHighlight = ({
  title,
  children,
  variant = 'default',
  icon,
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'success' | 'info';
  icon?: React.ReactNode;
}) => {
  const variants = {
    default: 'border-primary/20 bg-primary/5 text-primary-foreground/90',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900',
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${variants[variant]} backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-1 shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="mb-3 text-lg font-semibold">
            {title}
          </h4>
          <div className="space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

type ApproachType = 'analogical' | 'procedural' | 'conceptual';

export const CryptoLesson0Ultra: React.FC = () => {
  const [activeApproach, setActiveApproach] = useState<ApproachType>('analogical');
  const [exploredApproaches, setExploredApproaches] = useState<Set<ApproachType>>(new Set(['analogical']));

  const handleApproachChange = (approach: ApproachType) => {
    setActiveApproach(approach);
    setExploredApproaches(prev => new Set([...prev, approach]));
  };

  const progress = (exploredApproaches.size / 3) * 100;
  const isFirstIntegration = exploredApproaches.size === 2;
  const isMasteryAchieved = exploredApproaches.size === 3;

  const approaches = {
    analogical: {
      title: 'Approccio Analogico',
      subtitle: 'Comprendi attraverso metafore familiari',
      icon: AnalogicalIcon,
      color: 'blue',
    },
    procedural: {
      title: 'Approccio Procedurale',
      subtitle: 'Impara attraverso processi step-by-step',
      icon: ProceduralIcon,
      color: 'green',
    },
    conceptual: {
      title: 'Approccio Concettuale',
      subtitle: 'Comprendi attraverso definizioni formali',
      icon: ConceptualIcon,
      color: 'purple',
    },
  };

  const renderAnalogicalContent = () => (
    <div className="space-y-8">
      <DropCap>
        magina di entrare in una banca del futuro dove non c'è un direttore, non ci sono cassieri,
        e non c'è nemmeno un edificio fisico. Eppure, migliaia di persone in tutto il mondo
        gestiscono i conti bancari in perfetta sincronia.
      </DropCap>

      <VisualSeparator />

      <PremiumHighlight
        title="Il Registro Bancario Distribuito"
        variant="info"
        icon={<AnalogicalIcon className="size-6 text-blue-600" />}
      >
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Ogni transazione viene scritta simultaneamente su migliaia di registri identici.
            Prima che una nuova operazione venga accettata, la maggioranza dei "contabili"
            deve verificarla e approvarla.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <span className="text-sm">
                <strong>Registro tradizionale</strong>
                {' '}
                → Blockchain
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <span className="text-sm">
                <strong>Pagine del registro</strong>
                {' '}
                → Blocchi
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <span className="text-sm">
                <strong>Contabili verificatori</strong>
                {' '}
                → Nodi della rete
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/50 p-3">
              <div className="size-2 rounded-full bg-blue-500"></div>
              <span className="text-sm">
                <strong>Approvazione unanime</strong>
                {' '}
                → Consenso
              </span>
            </div>
          </div>
        </div>
      </PremiumHighlight>

      <PremiumHighlight
        title="Limitazioni dell'Analogia"
        variant="warning"
        icon={(
          <svg className="size-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )}
      >
        <p className="text-base leading-relaxed">
          A differenza di un registro fisico, la blockchain può crescere infinitamente e garantisce
          <strong> pseudonimato</strong>
          {' '}
          invece di trasparenza completa delle identità.
          Inoltre, non esiste un "orario di apertura" - funziona 24/7 globalmente.
        </p>
      </PremiumHighlight>
    </div>
  );

  const renderProceduralContent = () => (
    <div className="space-y-8">
      <DropCap>
        eguiamo Alice nel suo primo invio di Bitcoin a Bob. Ogni passaggio è verificabile,
        trasparente e irreversibile una volta completato.
      </DropCap>

      <VisualSeparator />

      <div className="space-y-6">
        <NumberedStep number={1}>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Creazione della Transazione</h4>
            <p className="text-base leading-relaxed text-muted-foreground">
              Alice apre il suo wallet digitale e specifica l'indirizzo di Bob e l'importo da inviare.
              Il sistema verifica automaticamente che abbia fondi sufficienti.
            </p>
            <div className="text-sm font-medium text-green-600">
              ✓ Checkpoint: Saldo verificato e sufficiente
            </div>
          </div>
        </NumberedStep>

        <NumberedStep number={2}>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Firma Crittografica</h4>
            <p className="text-base leading-relaxed text-muted-foreground">
              Alice autorizza la transazione con la sua chiave privata segreta.
              Questa firma matematica prova che è davvero lei a inviare i fondi.
            </p>
            <div className="text-sm font-medium text-green-600">
              ✓ Checkpoint: Transazione firmata e autenticata
            </div>
          </div>
        </NumberedStep>

        <NumberedStep number={3}>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Trasmissione alla Rete</h4>
            <p className="text-base leading-relaxed text-muted-foreground">
              La transazione viene inviata a migliaia di computer in tutto il mondo.
              Ogni nodo la riceve e inizia il processo di verifica indipendente.
            </p>
            <div className="text-sm font-medium text-blue-600">
              ⏱️ Tempo stimato: 1-5 secondi per la propagazione
            </div>
          </div>
        </NumberedStep>

        <NumberedStep number={4}>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Validazione Distribuita</h4>
            <p className="text-base leading-relaxed text-muted-foreground">
              Ogni nodo verifica indipendentemente che Alice possieda i Bitcoin,
              che la firma sia valida e che rispetti tutte le regole del protocollo.
            </p>
            <div className="text-sm font-medium text-green-600">
              ✓ Checkpoint: Validazione matematica completata
            </div>
          </div>
        </NumberedStep>

        <NumberedStep number={5}>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Inclusione nel Blocco</h4>
            <p className="text-base leading-relaxed text-muted-foreground">
              I miner competono per includere la transazione nel prossimo blocco.
              Una volta inclusa, diventa parte permanente della blockchain.
            </p>
            <div className="text-sm font-medium text-blue-600">
              ⏱️ Tempo stimato: 10-60 minuti a seconda della rete
            </div>
          </div>
        </NumberedStep>

        <NumberedStep number={6}>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Conferma e Finalizzazione</h4>
            <p className="text-base leading-relaxed text-muted-foreground">
              Bob vede i Bitcoin nel suo wallet. Più blocchi vengono aggiunti dopo,
              più la transazione diventa sicura e irreversibile.
            </p>
            <div className="text-sm font-medium text-green-600">
              ✓ Checkpoint: Transazione completata e confermata
            </div>
          </div>
        </NumberedStep>
      </div>

      <PremiumHighlight
        title="Risultato del Processo"
        variant="success"
        icon={<CheckIcon className="size-6 text-green-600" />}
      >
        <p className="text-base leading-relaxed">
          Alice ha trasferito valore a Bob senza bisogno di banche, governi o intermediari.
          La sicurezza deriva dalla
          {' '}
          <strong>matematica e dal consenso distribuito</strong>
          ,
          non dalla fiducia in istituzioni centrali.
        </p>
      </PremiumHighlight>
    </div>
  );

  const renderConceptualContent = () => (
    <div className="space-y-8">
      <DropCap>
        na criptovaluta rappresenta l'evoluzione naturale del denaro nell'era digitale:
        un sistema di valore basato su matematica pura invece che su fiducia istituzionale.
      </DropCap>

      <VisualSeparator />

      <PremiumHighlight
        title="Definizione Formale"
        variant="default"
        icon={<ConceptualIcon className="size-6 text-primary" />}
      >
        <p className="text-lg font-medium leading-relaxed">
          Una criptovaluta è un
          {' '}
          <strong>asset digitale programmabile</strong>
          {' '}
          che utilizza
          la crittografia per garantire transazioni sicure e controllare la creazione di nuove unità,
          operando su una rete distribuita senza autorità centrale.
        </p>
      </PremiumHighlight>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <div className="size-2 rounded-full bg-primary"></div>
            Componenti Fondamentali
          </h4>
          <div className="space-y-3">
            {[
              'Crittografia asimmetrica (chiavi pubbliche/private)',
              'Funzioni hash crittografiche (SHA-256)',
              'Algoritmi di consenso (PoW, PoS)',
              'Strutture dati Merkle Tree',
              'Rete peer-to-peer distribuita',
            ].map((item, i) => (
              <div key={`tech-foundation-ultra-${i}`} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                <div className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"></div>
                <span className="text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <div className="size-2 rounded-full bg-accent"></div>
            Proprietà Emergenti
          </h4>
          <div className="space-y-3">
            {[
              { title: 'Decentralizzazione', desc: 'Nessun single point of failure' },
              { title: 'Immutabilità', desc: 'Resistenza alle modifiche retroattive' },
              { title: 'Trasparenza', desc: 'Tutte le transazioni verificabili' },
              { title: 'Pseudonimato', desc: 'Privacy con trasparenza selettiva' },
            ].map((item, i) => (
              <div key={`property-${item.title}`} className="rounded-lg bg-muted/30 p-3">
                <div className="text-sm font-medium text-foreground">{item.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PremiumHighlight
        title="Implicazioni Sistemiche"
        variant="info"
        icon={(
          <svg className="size-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      >
        <div className="space-y-4">
          <p className="text-base leading-relaxed">
            Le criptovalute introducono un nuovo paradigma economico basato su
            <strong> consenso matematico</strong>
            {' '}
            invece che su autorità istituzionale.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="text-sm">
              <strong>Trade-off Fondamentale:</strong>
              {' '}
              Decentralizzazione vs Efficienza
            </div>
            <div className="text-sm">
              <strong>Sicurezza:</strong>
              {' '}
              Crittografia vs Gestione delle chiavi
            </div>
            <div className="text-sm">
              <strong>Scalabilità:</strong>
              {' '}
              Throughput vs Decentralizzazione
            </div>
            <div className="text-sm">
              <strong>Governance:</strong>
              {' '}
              Immutabilità vs Correzione errori
            </div>
          </div>
        </div>
      </PremiumHighlight>
    </div>
  );

  const renderContent = () => {
    switch (activeApproach) {
      case 'analogical':
        return renderAnalogicalContent();
      case 'procedural':
        return renderProceduralContent();
      case 'conceptual':
        return renderConceptualContent();
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Ultra-Premium Header */}
      <div className="space-y-8 text-center">
        <div className="flex items-center justify-center">
          <Badge variant="secondary" className="px-6 py-2 text-sm font-medium tracking-wide">
            Lezione 0 • 5 minuti • 50 XP
          </Badge>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Cosa sono le
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Criptovalute
            </span>
          </h1>
          <div className="mx-auto max-w-3xl space-y-4">
            <p className="text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Scopri lo stesso concetto attraverso
              {' '}
              <strong>tre prospettive complementari</strong>
            </p>
            <p className="text-base leading-relaxed text-muted-foreground/80">
              L'integrazione di approcci multipli costruisce comprensione robusta e trasferibile,
              seguendo i principi della scienza cognitiva moderna.
            </p>
          </div>
        </div>

        {/* Ultra-Premium Progress */}
        <div className="mx-auto max-w-md space-y-4">
          <div className="relative">
            <Progress value={progress} variant="primary" className="h-3 rounded-full" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-sm"></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold text-foreground">
              {exploredApproaches.size}
              /3 approcci
            </span>
          </div>
        </div>
      </div>

      {/* Ultra-Premium Feedback Cards */}
      {isFirstIntegration && !isMasteryAchieved && (
        <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 p-8 backdrop-blur-sm">
          <div className="flex items-start gap-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 shadow-lg">
              <BrainIcon className="size-6 text-blue-600" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-blue-900">
                Eccellente! Stai sviluppando flessibilità cognitiva
              </h3>
              <p className="text-base leading-relaxed text-blue-800">
                L'integrazione di rappresentazioni multiple costruisce modelli mentali più robusti e trasferibili.
                La ricerca in neuroscienze cognitive dimostra che questo approccio migliora la comprensione del
                <strong> 73% rispetto all'apprendimento mono-modale</strong>
                .
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="size-1.5 rounded-full bg-blue-500"></div>
                <span>Continua ad esplorare per completare l'integrazione</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {isMasteryAchieved && (
        <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-green-100/30 p-8 backdrop-blur-sm">
          <div className="flex items-start gap-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-green-100 shadow-lg">
              <TrophyIcon className="size-6 text-green-600" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-green-900">
                🎉 Rappresentazioni Integrate con Successo!
              </h3>
              <p className="text-base leading-relaxed text-green-800">
                Hai costruito un
                {' '}
                <strong>modello mentale completo</strong>
                {' '}
                attraverso prospettive complementari.
                Questo approccio multi-rappresentazionale aumenta la retention del concetto e facilita
                il transfer learning verso nuovi domini.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <div className="size-1.5 rounded-full bg-green-500"></div>
                <span>Pronto per il quiz di verifica della comprensione</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Ultra-Premium Approach Tabs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(approaches).map(([key, approach]) => {
          const isActive = activeApproach === key;
          const isExplored = exploredApproaches.has(key as ApproachType);

          return (
            <button
              key={key}
              onClick={() => handleApproachChange(key as ApproachType)}
              className={`
                group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all duration-300
                ${isActive
              ? 'border-primary bg-gradient-to-br from-primary/5 to-accent/5 shadow-xl shadow-primary/10'
              : 'border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
            }
              `}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`
                    flex size-12 items-center justify-center rounded-xl transition-all duration-300
                    ${isActive ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                  `}
                  >
                    <approach.icon className="size-6" />
                  </div>
                  {isExplored && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-100 shadow-md">
                      <CheckIcon className="size-5 text-green-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className={`text-lg font-bold transition-colors ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {approach.title}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors ${isActive ? 'text-primary/80' : 'text-muted-foreground'}`}>
                    {approach.subtitle}
                  </p>
                </div>
              </div>

              {/* Subtle gradient overlay */}
              <div className={`
                absolute inset-0 transition-opacity duration-300
                ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                bg-gradient-to-br from-primary/5 to-accent/5
              `}
              />
            </button>
          );
        })}
      </div>

      {/* Ultra-Premium Content Area */}
      <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card/50 to-muted/20 backdrop-blur-sm">
        <div className="p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg">
              {React.createElement(approaches[activeApproach].icon, { className: 'size-8 text-primary' })}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {approaches[activeApproach].title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {approaches[activeApproach].subtitle}
              </p>
            </div>
          </div>

          {renderContent()}

          {/* Key Points Summary */}
          <VisualSeparator />

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-8">
            <h4 className="mb-6 flex items-center gap-3 text-xl font-bold text-foreground">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckIcon className="size-5 text-primary" />
              </div>
              Punti Chiave da Ricordare
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeApproach === 'analogical' && [
                'Nessuna autorità centrale controlla il sistema',
                'La sicurezza deriva dalla verifica collettiva',
                'Una volta registrata, una transazione è immutabile',
              ].map((point, i) => (
                <div key={`analogical-point-${i}`} className="flex items-start gap-3 rounded-xl bg-white/50 p-4">
                  <div className="mt-2 size-2 shrink-0 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium leading-relaxed">{point}</span>
                </div>
              ))}

              {activeApproach === 'procedural' && [
                'Ogni step è verificabile matematicamente',
                'Non serve fiducia in intermediari',
                'Il processo è trasparente e auditabile',
              ].map((point, i) => (
                <div key={`procedural-point-${i}`} className="flex items-start gap-3 rounded-xl bg-white/50 p-4">
                  <div className="mt-2 size-2 shrink-0 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium leading-relaxed">{point}</span>
                </div>
              ))}

              {activeApproach === 'conceptual' && [
                'Sistema basato su matematica, non fiducia',
                'Consenso distribuito sostituisce autorità centrale',
                'Trade-off tra decentralizzazione e scalabilità',
              ].map((point, i) => (
                <div key={`conceptual-point-${i}`} className="flex items-start gap-3 rounded-xl bg-white/50 p-4">
                  <div className="mt-2 size-2 shrink-0 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Ultra-Premium Action Area */}
      <div className="space-y-6 text-center">
        {isMasteryAchieved
          ? (
              <div className="space-y-4">
                <Button size="lg" className="h-14 bg-gradient-to-r from-primary to-accent px-12 text-lg shadow-xl shadow-primary/20 hover:from-primary/90 hover:to-accent/90">
                  Inizia il Quiz di Verifica
                  <svg className="ml-3 size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Verifica la tua comprensione con 3 domande mirate
                </p>
              </div>
            )
          : (
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  Esplora tutti e 3 gli approcci per sbloccare il quiz di verifica
                </p>
                <div className="flex justify-center gap-3">
                  {Object.keys(approaches).map(approach => (
                    <div
                      key={approach}
                      className={`size-3 rounded-full transition-all duration-300 ${
                        exploredApproaches.has(approach as ApproachType)
                          ? 'bg-primary shadow-lg shadow-primary/30'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground/70">
                  {3 - exploredApproaches.size}
                  {' '}
                  approcci rimanenti
                </p>
              </div>
            )}
      </div>
    </div>
  );
};
