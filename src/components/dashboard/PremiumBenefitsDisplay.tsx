'use client';

import {
  BarChart3,
  CheckCircle,
  Clock,
  Crown,
  Download,
  Shield,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

type PremiumBenefitsDisplayProps = {
  userTier: 'free' | 'premium';
  onUpgrade?: () => void;
  className?: string;
};

/**
 * PremiumBenefitsDisplay - Shows premium vs free benefits comparison
 *
 * Features:
 * - Clear tier comparison
 * - Strategic upgrade prompts
 * - Glassmorphism design
 * - Mobile-responsive layout
 */
export const PremiumBenefitsDisplay: React.FC<PremiumBenefitsDisplayProps> = ({
  userTier,
  onUpgrade,
  className = '',
}) => {
  const benefits = [
    {
      icon: BarChart3,
      title: 'Analytics Avanzati',
      description: 'Statistiche dettagliate sui tuoi progressi',
      free: false,
      premium: true,
    },
    {
      icon: Target,
      title: 'Obiettivi Personalizzati',
      description: 'Imposta e traccia obiettivi di studio personalizzati',
      free: false,
      premium: true,
    },
    {
      icon: Download,
      title: 'Contenuti Offline',
      description: 'Scarica lezioni per studiare senza connessione',
      free: false,
      premium: true,
    },
    {
      icon: Users,
      title: 'Supporto Prioritario',
      description: 'Assistenza dedicata e tempi di risposta rapidi',
      free: false,
      premium: true,
    },
    {
      icon: Zap,
      title: 'Accesso Anticipato',
      description: 'Nuove funzionalità e contenuti in anteprima',
      free: false,
      premium: true,
    },
    {
      icon: Shield,
      title: 'Backup Cloud',
      description: 'Sincronizzazione automatica su tutti i dispositivi',
      free: true,
      premium: true,
    },
    {
      icon: Clock,
      title: 'Percorsi Fondamentali',
      description: 'Accesso completo ai contenuti base',
      free: true,
      premium: true,
    },
  ];

  const freeBenefits = benefits.filter(benefit => benefit.free);
  const premiumOnlyBenefits = benefits.filter(benefit => benefit.premium && !benefit.free);

  if (userTier === 'premium') {
    return (
      <div className={`rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-950 dark:to-orange-950 ${className}`}>
        <div className="mb-4 flex items-center gap-3">
          <Crown className="size-6 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
              Account Premium Attivo
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Hai accesso a tutte le funzionalità premium
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {benefits.filter(b => b.premium).map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-center gap-3 rounded-lg bg-white/50 p-3 dark:bg-white/10">
                <Icon className="size-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-medium">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Plan */}
      <div className="rounded-lg border border-white/20 bg-white/40 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Piano Gratuito</h3>
            <p className="text-sm text-muted-foreground">
              Accesso ai contenuti fondamentali
            </p>
          </div>
          <div className="rounded-full bg-green-100 px-3 py-1 dark:bg-green-900">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Attivo</span>
          </div>
        </div>

        <div className="space-y-3">
          {freeBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="size-4 text-green-600" />
                <Icon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Upgrade */}
      <div className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-950 dark:to-orange-950">
        <div className="mb-4 flex items-center gap-3">
          <Crown className="size-6 text-amber-600 dark:text-amber-400" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
              Passa a Premium
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Sblocca tutte le funzionalità avanzate
            </p>
          </div>
        </div>

        {/* Premium Benefits */}
        <div className="mb-6 space-y-3">
          {premiumOnlyBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-1 dark:bg-amber-900">
                  <Icon className="size-3 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {benefit.title}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing */}
        <div className="mb-4 rounded-lg bg-white/50 p-4 dark:bg-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-800 dark:text-amber-200">€9.99</span>
            <span className="text-sm text-amber-700 dark:text-amber-300">/mese</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Cancella in qualsiasi momento
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onUpgrade}
          className="w-full bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
        >
          <Crown className="mr-2 size-4" />
          Inizia Prova Gratuita di 7 Giorni
        </Button>

        <p className="mt-2 text-center text-xs text-amber-600 dark:text-amber-400">
          Nessun impegno • Cancella quando vuoi
        </p>
      </div>

      {/* Feature Comparison Table */}
      <div className="rounded-lg border border-white/20 bg-white/40 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="mb-4 text-lg font-semibold">Confronto Funzionalità</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="pb-2 text-left">Funzionalità</th>
                <th className="pb-2 text-center">Gratuito</th>
                <th className="pb-2 text-center">Premium</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {benefits.map((benefit, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="py-2">{benefit.title}</td>
                  <td className="py-2 text-center">
                    {benefit.free
                      ? (
                          <CheckCircle className="mx-auto size-4 text-green-600" />
                        )
                      : (
                          <X className="mx-auto size-4 text-gray-400" />
                        )}
                  </td>
                  <td className="py-2 text-center">
                    {benefit.premium
                      ? (
                          <CheckCircle className="mx-auto size-4 text-green-600" />
                        )
                      : (
                          <X className="mx-auto size-4 text-gray-400" />
                        )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
