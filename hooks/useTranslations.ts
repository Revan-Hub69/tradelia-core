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
      errorFrequency: t('research.errorFrequency'),
      behavioralTrend: t('research.behavioralTrend'),
      behavioralStudies: t('research.behavioralStudies'),
      sourceLabel: t('research.sourceLabel'),
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
      logoText: t('howItWorks.logoText'),
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
      academicMethodology: t('trust.academicMethodology'),
      primaryGuarantees: t('trust.primaryGuarantees'),
      methodologyTransparency: t('trust.methodologyTransparency'),
      verifiableMethodology: t('trust.verifiableMethodology'),
      frameworkDescription: t('trust.frameworkDescription'),
      badges: {
        educationalOnly: t('trust.badges.educationalOnly'),
        noCustody: t('trust.badges.noCustody'),
        academicResearch: t('trust.badges.academicResearch'),
        commissionTransparency: t('trust.badges.commissionTransparency'),
        openMethodology: t('trust.badges.openMethodology')
      },
      badgeDescriptions: {
        educationalOnly: t('trust.badgeDescriptions.educationalOnly'),
        noCustody: t('trust.badgeDescriptions.noCustody'),
        academicResearch: t('trust.badgeDescriptions.academicResearch'),
        commissionTransparency: t('trust.badgeDescriptions.commissionTransparency'),
        openMethodology: t('trust.badgeDescriptions.openMethodology')
      },
      metrics: {
        cost: t('trust.metrics.cost'),
        costDescription: t('trust.metrics.costDescription'),
        custody: t('trust.metrics.custody'),
        custodyDescription: t('trust.metrics.custodyDescription'),
        educational: t('trust.metrics.educational'),
        educationalDescription: t('trust.metrics.educationalDescription'),
        studies: t('trust.metrics.studies'),
        studiesDescription: t('trust.metrics.studiesDescription')
      },
      academicSections: {
        sources: t('trust.academicSections.sources'),
        sourcesDescription: t('trust.academicSections.sourcesDescription'),
        method: t('trust.academicSections.method'),
        methodDescription: t('trust.academicSections.methodDescription'),
        conflicts: t('trust.academicSections.conflicts'),
        conflictsDescription: t('trust.academicSections.conflictsDescription')
      }
    },

    finalCta: {
      title: t('finalCta.title'),
      button: t('finalCta.button'),
      disclaimer: t('finalCta.disclaimer')
    },

    header: {
      dashboardButton: t('header.dashboardButton')
    },

    footer: {
      description: t('footer.description'),
      methodology: t('footer.methodology'),
      disclaimer: t('footer.disclaimer'),
      disclaimerTitle: t('footer.disclaimerTitle'),
      methodologyTitle: t('footer.methodologyTitle'),
      version: t('footer.version'),
      lastUpdate: t('footer.lastUpdate'),
      changelogLink: t('footer.changelogLink'),
      legalInfo: t('footer.legalInfo'),
      links: {
        privacy: t('footer.links.privacy'),
        terms: t('footer.links.terms'),
        methodology: t('footer.links.methodology'),
        contact: t('footer.links.contact')
      },
      copyright: t('footer.copyright')
    },

    modal: {
      title: t('modal.title'),
      step: t('modal.step'),
      of: t('modal.of'),
      disclaimer: {
        title: t('modal.disclaimer.title'),
        educational: {
          title: t('modal.disclaimer.educational.title'),
          description: t('modal.disclaimer.educational.description')
        },
        responsibility: t('modal.disclaimer.responsibility')
      },
      actions: {
        cancel: t('modal.actions.cancel'),
        back: t('modal.actions.back'),
        continue: t('modal.actions.continue'),
        finish: t('modal.actions.finish')
      }
    },

    faq: {
      questions: t('faq.questions')
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
    let value: unknown = translations[locale as keyof typeof translations];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        return false;
      }
    }
    
    return value !== undefined && value !== key;
  } catch {
    return false;
  }
}