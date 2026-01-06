'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/components/LanguageSelector';

/**
 * Hook modulare per le traduzioni con memoization per performance
 * Fornisce accesso type-safe alle traduzioni
 */
export function useTranslations() {
  const { locale, setLocale, t } = useLanguage();

  // Memoize helper functions per evitare re-render inutili
  const translations = useMemo(() => ({
    // Core functions
    locale,
    setLocale,
    t,
    
    // Structured helpers con memoization
    nav: {
      methodology: t('nav.methodology'),
      verify: t('nav.verify')
    },

    hero: {
      title: t('hero.title'),
      titleHighlight: t('hero.titleHighlight'),
      description: t('hero.description'),
      cta: t('hero.cta'),
      ctaSecondary: t('hero.ctaSecondary'),
      features: [
        t('hero.features.0'),
        t('hero.features.1'),
        t('hero.features.2')
      ],
      trustBadges: {
        verified: t('hero.trustBadges.verified'),
        specs: t('hero.trustBadges.specs')
      },
      dashboard: {
        title: t('hero.dashboard.title'),
        metrics: {
          commonErrors: t('hero.dashboard.metrics.commonErrors'),
          activeRisks: t('hero.dashboard.metrics.activeRisks'),
          academicSources: t('hero.dashboard.metrics.academicSources')
        },
        alert: {
          title: t('hero.dashboard.alert.title'),
          description: t('hero.dashboard.alert.description')
        },
        source: t('hero.dashboard.source'),
        errorFrequency: t('hero.dashboard.errorFrequency'),
        trendLabel: t('hero.dashboard.trendLabel')
      }
    },

    research: {
      eyebrow: t('research.eyebrow'),
      title: t('research.title'),
      subtitle: t('research.subtitle'),
      overconfidence: {
        title: t('research.overconfidence.title'),
        description: t('research.overconfidence.description'),
        source: t('research.overconfidence.source')
      },
      disposition: {
        title: t('research.disposition.title'),
        description: t('research.disposition.description'),
        source: t('research.disposition.source')
      },
      herding: {
        title: t('research.herding.title'),
        description: t('research.herding.description'),
        source: t('research.herding.source')
      }
    },

    academicBanner: {
      text: t('academicBanner.text')
    },

    howItWorks: {
      title: t('howItWorks.title'),
      subtitle: t('howItWorks.subtitle'),
      steps: [
        {
          title: t('howItWorks.step1.title'),
          description: t('howItWorks.step1.description')
        },
        {
          title: t('howItWorks.step2.title'),
          description: t('howItWorks.step2.description')
        },
        {
          title: t('howItWorks.step3.title'),
          description: t('howItWorks.step3.description')
        }
      ]
    },

    differentiator: {
      title: t('differentiator.title'),
      subtitle: t('differentiator.subtitle')
    },

    trust: {
      title: t('trust.title'),
      subtitle: t('trust.subtitle'),
      badges: [
        t('trust.badges.0'),
        t('trust.badges.1'),
        t('trust.badges.2'),
        t('trust.badges.3'),
        t('trust.badges.4')
      ]
    },

    finalCta: {
      title: t('finalCta.title'),
      button: t('finalCta.button'),
      disclaimer: t('finalCta.disclaimer')
    },

    footer: {
      description: t('footer.description'),
      methodology: t('footer.methodology'),
      disclaimer: t('footer.disclaimer'),
      links: {
        privacy: t('footer.links.privacy'),
        terms: t('footer.links.terms'),
        methodology: t('footer.links.methodology')
      },
      copyright: t('footer.copyright')
    }
  }), [locale, t, setLocale]);

  return translations;
}

/**
 * Type-safe translation key checker
 */
export function isValidTranslationKey(key: string, locale: string): boolean {
  try {
    const { translations } = require('../lib/translations');
    const keys = key.split('.');
    let value: any = translations[locale as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value !== undefined && value !== key;
  } catch {
    return false;
  }
}