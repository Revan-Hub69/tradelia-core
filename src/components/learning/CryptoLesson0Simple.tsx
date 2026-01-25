'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const CryptoLesson0Simple: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analogical' | 'procedural' | 'conceptual'>('analogical');
  const [exploredTabs, setExploredTabs] = useState<Set<string>>(new Set(['analogical']));

  const handleTabClick = (tab: 'analogical' | 'procedural' | 'conceptual') => {
    setActiveTab(tab);
    setExploredTabs(prev => new Set([...prev, tab]));
  };

  const progress = (exploredTabs.size / 3) * 100;

  const content = {
    analogical: {
      title: 'Approccio Analogico',
      icon: '🎭',
      content: 'Immagina un quaderno magico condiviso tra migliaia di persone. Ogni volta che qualcuno vuole scrivere qualcosa, tutti devono essere d\'accordo.',
    },
    procedural: {
      title: 'Approccio Procedurale',
      icon: '🔧',
      content: 'Step 1: Alice apre il wallet. Step 2: Inserisce l\'indirizzo di Bob. Step 3: Firma la transazione. Step 4: La rete verifica tutto.',
    },
    conceptual: {
      title: 'Approccio Concettuale',
      icon: '📚',
      content: 'Una criptovaluta è un asset digitale programmabile regolato da protocolli crittografici e un ledger distribuito.',
    },
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <Badge variant="secondary">
          Lezione 0 • 5 min • 50 XP
        </Badge>
        <h1 className="text-3xl font-bold">
          Cosa sono le Criptovalute
        </h1>
        <p className="text-gray-600">
          La stessa verità, tre modi di capirla
        </p>
        <div className="mx-auto max-w-md">
          <Progress value={progress} />
          <p className="mt-2 text-sm text-gray-500">
            {exploredTabs.size}
            /3 approcci esplorati
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
        {Object.entries(content).map(([key, data]) => (
          <button
            type="button"
            key={key}
            onClick={() => handleTabClick(key as any)}
            className={`
              flex flex-1 items-center gap-2 rounded-md p-4 transition-colors
              ${activeTab === key
            ? 'border border-blue-200 bg-blue-100 text-blue-800'
            : 'bg-white text-gray-600 hover:bg-gray-50'
          }
            `}
          >
            <span className="text-xl">{data.icon}</span>
            <div className="text-left">
              <div className="flex items-center gap-2 font-medium">
                {data.title}
                {exploredTabs.has(key) && <span className="text-green-600">✓</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            {content[activeTab].icon}
            {' '}
            {content[activeTab].title}
          </h2>
          <p className="leading-relaxed text-gray-700">
            {content[activeTab].content}
          </p>
        </div>
      </Card>

      {/* Action */}
      <div className="text-center">
        {exploredTabs.size === 3
          ? (
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Inizia il Quiz! 🎯
              </Button>
            )
          : (
              <p className="text-gray-600">
                Esplora tutti e 3 gli approcci per sbloccare il quiz
              </p>
            )}
      </div>
    </div>
  );
};
