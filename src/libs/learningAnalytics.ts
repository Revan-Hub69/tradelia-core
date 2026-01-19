/**
 * Tradelia Professional Learning Analytics System
 * Competency-based progression with real-value rewards
 */

export type CompetencyLevel = 'foundation' | 'developing' | 'proficient' | 'advanced' | 'expert';
export type CertificationType = 'foundation' | 'intermediate' | 'advanced' | 'professional' | 'expert';
export type LearningApproach = 'conceptual' | 'practical' | 'analytical' | 'visual' | 'case_study';

export type ProfessionalCertification = {
  id: string;
  name: {
    it: string;
    en: string;
  };
  description: {
    it: string;
    en: string;
  };
  type: CertificationType;
  competencyArea: string;
  requirements: {
    lessonsCompleted: number;
    minimumScore: number;
    practicalApplications: number;
    timeInvestment: number; // hours
  };
  tradeliaCoinsReward: number;
  credentialValue: {
    it: string;
    en: string;
  };
  unlockMessage: {
    it: string;
    en: string;
  };
};

export type CompetencyTier = {
  level: CompetencyLevel;
  title: {
    it: string;
    en: string;
  };
  description: {
    it: string;
    en: string;
  };
  minCompetencyScore: number;
  maxCompetencyScore: number;
  benefits: string[];
  color: string;
};

export type LearningMilestone = {
  id: string;
  title: {
    it: string;
    en: string;
  };
  description: {
    it: string;
    en: string;
  };
  competencyThreshold: number;
  tradeliaCoinsBonus: number;
  unlocksBenefits: string[];
};

export const PROFESSIONAL_CERTIFICATIONS: Record<string, ProfessionalCertification> = {
  blockchain_foundations: {
    id: 'blockchain_foundations',
    name: { 
      it: 'Certificazione Fondamenti Blockchain', 
      en: 'Blockchain Foundations Certification' 
    },
    description: { 
      it: 'Competenza certificata nei principi fondamentali della tecnologia blockchain', 
      en: 'Certified competency in fundamental blockchain technology principles' 
    },
    type: 'foundation',
    competencyArea: 'blockchain_technology',
    requirements: {
      lessonsCompleted: 5,
      minimumScore: 80,
      practicalApplications: 2,
      timeInvestment: 3,
    },
    tradeliaCoinsReward: 50,
    credentialValue: {
      it: 'Dimostra comprensione solida dei concetti blockchain essenziali',
      en: 'Demonstrates solid understanding of essential blockchain concepts'
    },
    unlockMessage: {
      it: '🎓 Certificazione ottenuta: Hai acquisito competenza professionale nei fondamenti blockchain.',
      en: '🎓 Certification earned: You have acquired professional competency in blockchain foundations.'
    },
  },
  crypto_analysis: {
    id: 'crypto_analysis',
    name: { 
      it: 'Certificazione Analisi Crypto', 
      en: 'Crypto Analysis Certification' 
    },
    description: { 
      it: 'Competenza avanzata nell\'analisi e valutazione delle criptovalute', 
      en: 'Advanced competency in cryptocurrency analysis and evaluation' 
    },
    type: 'intermediate',
    competencyArea: 'market_analysis',
    requirements: {
      lessonsCompleted: 12,
      minimumScore: 85,
      practicalApplications: 5,
      timeInvestment: 8,
    },
    tradeliaCoinsReward: 100,
    credentialValue: {
      it: 'Capacità di analizzare mercati crypto con metodologie professionali',
      en: 'Ability to analyze crypto markets with professional methodologies'
    },
    unlockMessage: {
      it: '📊 Certificazione ottenuta: Hai sviluppato competenze analitiche professionali nel settore crypto.',
      en: '📊 Certification earned: You have developed professional analytical skills in the crypto sector.'
    },
  },
  risk_management: {
    id: 'risk_management',
    name: { 
      it: 'Certificazione Gestione Rischi', 
      en: 'Risk Management Certification' 
    },
    description: { 
      it: 'Competenza professionale nella gestione dei rischi negli investimenti crypto', 
      en: 'Professional competency in crypto investment risk management' 
    },
    type: 'advanced',
    competencyArea: 'risk_assessment',
    requirements: {
      lessonsCompleted: 20,
      minimumScore: 90,
      practicalApplications: 8,
      timeInvestment: 15,
    },
    tradeliaCoinsReward: 200,
    credentialValue: {
      it: 'Padronanza delle strategie di gestione del rischio per investimenti crypto',
      en: 'Mastery of risk management strategies for crypto investments'
    },
    unlockMessage: {
      it: '🛡️ Certificazione ottenuta: Hai acquisito expertise nella gestione professionale dei rischi.',
      en: '🛡️ Certification earned: You have acquired expertise in professional risk management.'
    },
  },
};

export const COMPETENCY_TIERS: CompetencyTier[] = [
  {
    level: 'foundation',
    title: { it: 'Livello Base', en: 'Foundation Level' },
    description: { it: 'Comprensione dei concetti fondamentali', en: 'Understanding of fundamental concepts' },
    minCompetencyScore: 0,
    maxCompetencyScore: 199,
    color: 'hsl(215 16% 47%)',
    benefits: ['Accesso contenuti base', 'Certificazioni fondamentali'],
  },
  {
    level: 'developing',
    title: { it: 'Livello Sviluppo', en: 'Developing Level' },
    description: { it: 'Applicazione pratica delle conoscenze', en: 'Practical application of knowledge' },
    minCompetencyScore: 200,
    maxCompetencyScore: 499,
    color: 'hsl(213 94% 68%)',
    benefits: ['Contenuti intermedi', 'Strumenti di analisi'],
  },
  {
    level: 'proficient',
    title: { it: 'Livello Competente', en: 'Proficient Level' },
    description: { it: 'Competenza consolidata e autonoma', en: 'Consolidated and autonomous competency' },
    minCompetencyScore: 500,
    maxCompetencyScore: 999,
    color: 'hsl(160 84% 39%)',
    benefits: ['Contenuti avanzati', 'Certificazioni professionali'],
  },
  {
    level: 'advanced',
    title: { it: 'Livello Avanzato', en: 'Advanced Level' },
    description: { it: 'Expertise specialistica nel settore', en: 'Specialized expertise in the sector' },
    minCompetencyScore: 1000,
    maxCompetencyScore: 1999,
    color: 'hsl(38 92% 50%)',
    benefits: ['Contenuti specialistici', 'Accesso community esperti'],
  },
  {
    level: 'expert',
    title: { it: 'Livello Esperto', en: 'Expert Level' },
    description: { it: 'Competenza di livello professionale', en: 'Professional-level competency' },
    minCompetencyScore: 2000,
    maxCompetencyScore: Infinity,
    color: 'hsl(222 47% 11%)',
    benefits: ['Tutti i contenuti', 'Mentorship', 'Riconoscimento professionale'],
  },
];

export const LEARNING_MILESTONES: LearningMilestone[] = [
  {
    id: 'first_competency',
    title: { it: 'Prima Competenza', en: 'First Competency' },
    description: { it: 'Completamento del primo modulo formativo', en: 'Completion of first learning module' },
    competencyThreshold: 50,
    tradeliaCoinsBonus: 25,
    unlocksBenefits: ['Accesso dashboard avanzata'],
  },
  {
    id: 'consistent_learner',
    title: { it: 'Apprendimento Costante', en: 'Consistent Learning' },
    description: { it: 'Sette giorni di formazione continuativa', en: 'Seven days of continuous learning' },
    competencyThreshold: 150,
    tradeliaCoinsBonus: 75,
    unlocksBenefits: ['Contenuti bonus', 'Tracking avanzato'],
  },
  {
    id: 'competency_milestone',
    title: { it: 'Traguardo Competenze', en: 'Competency Milestone' },
    description: { it: 'Raggiungimento livello competente', en: 'Achievement of proficient level' },
    competencyThreshold: 500,
    tradeliaCoinsBonus: 150,
    unlocksBenefits: ['Certificazioni professionali', 'Strumenti premium'],
  },
];

/**
 * Professional Learning Analytics Engine
 * Handles competency tracking, certification logic, and Tradelia Coins
 */
export class ProfessionalLearningEngine {
  /**
   * Calculate Tradelia Coins for lesson completion
   */
  static calculateTradeliaCoins(params: {
    baseCoins: number;
    completionScore: number;
    timeEfficiency: number;
    practicalApplication: boolean;
    isFirstAttempt: boolean;
    consistencyBonus: number;
  }): { totalCoins: number; bonuses: Array<{ type: string; amount: number; reason: string }> } {
    const { baseCoins, completionScore, timeEfficiency, practicalApplication, isFirstAttempt, consistencyBonus } = params;
    const bonuses: Array<{ type: string; amount: number; reason: string }> = [];
    let totalCoins = baseCoins;

    // Excellence bonus (high score)
    if (completionScore >= 95) {
      const excellenceBonus = Math.floor(baseCoins * 0.5);
      bonuses.push({ type: 'excellence', amount: excellenceBonus, reason: 'Eccellenza dimostrata' });
      totalCoins += excellenceBonus;
    } else if (completionScore >= 85) {
      const qualityBonus = Math.floor(baseCoins * 0.25);
      bonuses.push({ type: 'quality', amount: qualityBonus, reason: 'Alta qualità' });
      totalCoins += qualityBonus;
    }

    // Efficiency bonus
    if (timeEfficiency > 1.2) {
      const efficiencyBonus = Math.floor(baseCoins * 0.3);
      bonuses.push({ type: 'efficiency', amount: efficiencyBonus, reason: 'Apprendimento efficiente' });
      totalCoins += efficiencyBonus;
    }

    // Practical application bonus
    if (practicalApplication) {
      const practicalBonus = Math.floor(baseCoins * 0.4);
      bonuses.push({ type: 'practical', amount: practicalBonus, reason: 'Applicazione pratica' });
      totalCoins += practicalBonus;
    }

    // First attempt bonus
    if (isFirstAttempt) {
      const firstAttemptBonus = Math.floor(baseCoins * 0.2);
      bonuses.push({ type: 'first_attempt', amount: firstAttemptBonus, reason: 'Primo tentativo' });
      totalCoins += firstAttemptBonus;
    }

    // Consistency bonus
    if (consistencyBonus > 0) {
      bonuses.push({ type: 'consistency', amount: consistencyBonus, reason: 'Apprendimento costante' });
      totalCoins += consistencyBonus;
    }

    return { totalCoins, bonuses };
  }

  /**
   * Check certification eligibility
   */
  static checkCertificationEligibility(userProgress: {
    lessonsCompleted: number;
    averageScore: number;
    practicalApplications: number;
    totalTimeInvested: number;
    competencyScore: number;
  }): ProfessionalCertification[] {
    const eligibleCertifications: ProfessionalCertification[] = [];

    Object.values(PROFESSIONAL_CERTIFICATIONS).forEach((cert) => {
      const { requirements } = cert;
      const isEligible = 
        userProgress.lessonsCompleted >= requirements.lessonsCompleted &&
        userProgress.averageScore >= requirements.minimumScore &&
        userProgress.practicalApplications >= requirements.practicalApplications &&
        userProgress.totalTimeInvested >= requirements.timeInvestment;

      if (isEligible) {
        eligibleCertifications.push(cert);
      }
    });

    return eligibleCertifications;
  }

  /**
   * Get user's competency tier
   */
  static getCompetencyTier(competencyScore: number): CompetencyTier {
    const tier = COMPETENCY_TIERS.find(t => 
      competencyScore >= t.minCompetencyScore && competencyScore <= t.maxCompetencyScore
    );
    
    if (!tier) {
      return COMPETENCY_TIERS[0]!; // Return foundation level as fallback
    }
    
    return tier;
  }

  /**
   * Calculate competency progress
   */
  static getCompetencyProgress(competencyScore: number): { 
    current: CompetencyTier; 
    next: CompetencyTier | null; 
    progress: number;
    coinsToNext: number;
  } {
    const current = this.getCompetencyTier(competencyScore);
    const currentIndex = COMPETENCY_TIERS.findIndex(tier => tier.level === current.level);
    const next = currentIndex < COMPETENCY_TIERS.length - 1 ? (COMPETENCY_TIERS[currentIndex + 1] ?? null) : null;

    let progress = 0;
    let coinsToNext = 0;

    if (next) {
      const tierRange = current.maxCompetencyScore - current.minCompetencyScore + 1;
      const currentProgress = competencyScore - current.minCompetencyScore;
      progress = Math.min(100, (currentProgress / tierRange) * 100);
      coinsToNext = next.minCompetencyScore - competencyScore;
    } else {
      progress = 100; // Max tier reached
    }

    return { current, next, progress, coinsToNext };
  }

  /**
   * Get milestone rewards
   */
  static getMilestoneRewards(competencyScore: number): LearningMilestone[] {
    return LEARNING_MILESTONES.filter(milestone => competencyScore >= milestone.competencyThreshold);
  }

  /**
   * Calculate learning efficiency score
   */
  static calculateLearningEfficiency(params: {
    timeSpent: number;
    targetTime: number;
    retentionScore: number;
    practicalApplicationScore: number;
  }): number {
    const { timeSpent, targetTime, retentionScore, practicalApplicationScore } = params;
    
    // Time efficiency (0.4 weight)
    const timeEfficiency = Math.min(1, targetTime / timeSpent);
    
    // Knowledge retention (0.3 weight)
    const retention = retentionScore / 100;
    
    // Practical application (0.3 weight)
    const application = practicalApplicationScore / 100;
    
    return Math.round((timeEfficiency * 0.4 + retention * 0.3 + application * 0.3) * 100);
  }
}