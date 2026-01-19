/**
 * Tradelia Professional Gamification System
 * Enterprise-grade learning engagement with sophisticated progression mechanics
 */

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type BadgeCategory = 'learning' | 'mastery' | 'consistency' | 'exploration' | 'achievement' | 'milestone';
export type LearningApproach = 'analogical' | 'procedural' | 'conceptual' | 'visual' | 'kinesthetic';

export type ProfessionalBadge = {
  id: string;
  name: {
    it: string;
    en: string;
  };
  description: {
    it: string;
    en: string;
  };
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: {
    type: 'svg' | 'emoji';
    content: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  requirements: {
    type: 'lesson_count' | 'streak_days' | 'xp_total' | 'approach_diversity' | 'speed_completion' | 'perfect_score' | 'milestone';
    value: number;
    metadata?: Record<string, any>;
  };
  xpReward: number;
  unlockMessage: {
    it: string;
    en: string;
  };
};

export type XPTier = {
  level: number;
  minXP: number;
  maxXP: number;
  title: {
    it: string;
    en: string;
  };
  color: string;
  benefits: string[];
};

export type StreakMilestone = {
  days: number;
  title: {
    it: string;
    en: string;
  };
  description: {
    it: string;
    en: string;
  };
  xpBonus: number;
  badgeId?: string;
};

export const PROFESSIONAL_BADGES: Record<string, ProfessionalBadge> = {
  foundation_specialist: {
    id: 'foundation_specialist',
    name: { it: 'Specialista Fondamenti', en: 'Foundation Specialist' },
    description: { it: 'Competenza nei fondamenti blockchain', en: 'Blockchain fundamentals competency' },
    category: 'learning',
    rarity: 'common',
    xpReward: 25,
    icon: { 
      type: 'svg',
      content: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="3" fill="currentColor"/></svg>' 
    },
    colors: {
      primary: '#475569',
      secondary: '#334155',
      accent: '#64748B',
      glow: '#475569',
    },
    requirements: {
      type: 'lesson_count',
      value: 1,
    },
    unlockMessage: {
      it: '📚 Competenza certificata: Hai acquisito le basi essenziali della tecnologia blockchain.',
      en: '📚 Certified competency: You have acquired essential blockchain technology foundations.',
    },
  },
  methodology_expert: {
    id: 'methodology_expert',
    name: { it: 'Esperto Metodologico', en: 'Methodology Expert' },
    description: { it: 'Padronanza metodologie avanzate', en: 'Advanced methodology mastery' },
    category: 'mastery',
    rarity: 'rare',
    xpReward: 50,
    icon: { 
      type: 'svg',
      content: '<svg viewBox="0 0 24 24"><path d="M12 2L15 9L22 9L17 14L19 21L12 17L5 21L7 14L2 9L9 9L12 2Z" fill="currentColor"/></svg>' 
    },
    colors: {
      primary: '#2563EB',
      secondary: '#1D4ED8',
      accent: '#3B82F6',
      glow: '#2563EB',
    },
    requirements: {
      type: 'approach_diversity',
      value: 3,
      metadata: { approaches: ['analogical', 'procedural', 'conceptual'] },
    },
    unlockMessage: {
      it: '🎯 Eccellenza metodologica: Hai dimostrato competenza nell\'utilizzo di approcci di apprendimento diversificati.',
      en: '🎯 Methodological excellence: You have demonstrated competency in utilizing diversified learning approaches.',
    },
  },
  consistency_professional: {
    id: 'consistency_professional',
    name: { it: 'Professionista Costanza', en: 'Consistency Professional' },
    description: { it: 'Disciplina professionale continuativa', en: 'Continuous professional discipline' },
    category: 'consistency',
    rarity: 'epic',
    xpReward: 100,
    icon: { 
      type: 'svg',
      content: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" fill="none"/></svg>' 
    },
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#EF4444',
      glow: '#DC2626',
    },
    requirements: {
      type: 'streak_days',
      value: 7,
    },
    unlockMessage: {
      it: '🏅 Disciplina certificata: Hai dimostrato impegno professionale continuativo nell\'apprendimento.',
      en: '🏅 Certified discipline: You have demonstrated continuous professional commitment to learning.',
    },
  },
};

export const XP_TIERS: XPTier[] = [
  {
    level: 1,
    minXP: 0,
    maxXP: 99,
    title: { it: 'Principiante', en: 'Beginner' },
    color: 'hsl(215 16% 47%)', // muted-foreground
    benefits: ['Accesso percorso fondamentale', 'Certificazioni base'],
  },
  {
    level: 2,
    minXP: 100,
    maxXP: 249,
    title: { it: 'Studente', en: 'Student' },
    color: 'hsl(213 94% 68%)', // primary
    benefits: ['Analytics avanzate', 'Tracking dettagliato'],
  },
  {
    level: 3,
    minXP: 250,
    maxXP: 499,
    title: { it: 'Praticante', en: 'Practitioner' },
    color: 'hsl(160 84% 39%)', // accent
    benefits: ['Contenuti supplementari', 'Certificazioni intermedie'],
  },
  {
    level: 4,
    minXP: 500,
    maxXP: 999,
    title: { it: 'Specialista', en: 'Specialist' },
    color: 'hsl(199 89% 48%)', // info
    benefits: ['Percorsi specializzati', 'Analisi comparative'],
  },
  {
    level: 5,
    minXP: 1000,
    maxXP: 1999,
    title: { it: 'Professionista', en: 'Professional' },
    color: 'hsl(0 72% 51%)', // destructive
    benefits: ['Certificazioni professionali', 'Networking premium'],
  },
  {
    level: 6,
    minXP: 2000,
    maxXP: 3999,
    title: { it: 'Esperto', en: 'Expert' },
    color: 'hsl(38 92% 50%)', // warning
    benefits: ['Accesso community esperti', 'Mentorship'],
  },
  {
    level: 7,
    minXP: 4000,
    maxXP: 7999,
    title: { it: 'Consulente', en: 'Consultant' },
    color: 'hsl(270 95% 75%)', // purple variant
    benefits: ['Tutti i percorsi sbloccati', 'Certificazioni avanzate'],
  },
  {
    level: 8,
    minXP: 8000,
    maxXP: 15999,
    title: { it: 'Analista Senior', en: 'Senior Analyst' },
    color: 'hsl(142 76% 36%)', // green variant
    benefits: ['Contenuti esclusivi', 'Riconoscimento pubblico'],
  },
  {
    level: 9,
    minXP: 16000,
    maxXP: 31999,
    title: { it: 'Strategist', en: 'Strategist' },
    color: 'hsl(217 33% 17%)', // card dark
    benefits: ['Beta features', 'Influenza roadmap'],
  },
  {
    level: 10,
    minXP: 32000,
    maxXP: Infinity,
    title: { it: 'Thought Leader', en: 'Thought Leader' },
    color: 'hsl(222 47% 11%)', // background dark
    benefits: ['Status elite', 'Accesso lifetime premium'],
  },
];

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    title: { it: 'Impegno Iniziale', en: 'Initial Commitment' },
    description: { it: 'Tre giorni di apprendimento strutturato', en: 'Three days of structured learning' },
    xpBonus: 25,
  },
  {
    days: 7,
    title: { it: 'Disciplina Settimanale', en: 'Weekly Discipline' },
    description: { it: 'Una settimana di formazione continuativa', en: 'A week of continuous professional development' },
    xpBonus: 75,
    badgeId: 'consistency_professional',
  },
  {
    days: 14,
    title: { it: 'Dedizione Professionale', en: 'Professional Dedication' },
    description: { it: 'Due settimane di sviluppo competenze', en: 'Two weeks of skill development' },
    xpBonus: 150,
  },
  {
    days: 30,
    title: { it: 'Eccellenza Mensile', en: 'Monthly Excellence' },
    description: { it: 'Un mese di crescita professionale continua', en: 'A month of continuous professional growth' },
    xpBonus: 300,
  },
  {
    days: 100,
    title: { it: 'Maestria Continuativa', en: 'Continuous Mastery' },
    description: { it: 'Cento giorni di eccellenza formativa ininterrotta', en: 'One hundred days of uninterrupted educational excellence' },
    xpBonus: 1000,
  },
];

export const RARITY_COLORS = {
  common: { primary: 'hsl(215 16% 47%)', secondary: 'hsl(215 16% 35%)', accent: 'hsl(215 16% 55%)', glow: 'hsl(215 16% 47%)' },
  rare: { primary: 'hsl(213 94% 68%)', secondary: 'hsl(224 76% 48%)', accent: 'hsl(213 94% 78%)', glow: 'hsl(213 94% 68%)' },
  epic: { primary: 'hsl(160 84% 39%)', secondary: 'hsl(160 84% 29%)', accent: 'hsl(160 84% 49%)', glow: 'hsl(160 84% 39%)' },
  legendary: { primary: 'hsl(38 92% 50%)', secondary: 'hsl(38 92% 40%)', accent: 'hsl(38 92% 60%)', glow: 'hsl(38 92% 50%)' },
  mythic: { primary: 'hsl(222 47% 11%)', secondary: 'hsl(217 33% 17%)', accent: 'hsl(217 33% 25%)', glow: 'hsl(222 47% 11%)' },
};

/**
 * Professional Gamification Engine
 * Handles all badge logic, XP calculations, and progression
 */
export class ProfessionalGamificationEngine {
  /**
   * Calculate XP for lesson completion with sophisticated bonuses
   */
  static calculateLessonXP(params: {
    baseXP: number;
    timeSpent: number;
    targetTime: number;
    quizScore: number;
    approachesUsed: LearningApproach[];
    isFirstCompletion: boolean;
    currentStreak: number;
  }): { totalXP: number; bonuses: Array<{ type: string; amount: number; reason: string }> } {
    const { baseXP, timeSpent, targetTime, quizScore, approachesUsed, isFirstCompletion, currentStreak } = params;
    const bonuses: Array<{ type: string; amount: number; reason: string }> = [];
    let totalXP = baseXP;

    // Speed bonus (up to 50% extra for completing in half the target time)
    if (timeSpent < targetTime) {
      const speedRatio = Math.max(0, (targetTime - timeSpent) / targetTime);
      const speedBonus = Math.floor(baseXP * speedRatio * 0.5);
      if (speedBonus > 0) {
        bonuses.push({ type: 'speed', amount: speedBonus, reason: 'Completamento veloce' });
        totalXP += speedBonus;
      }
    }

    // Quiz performance bonus
    if (quizScore >= 90) {
      const perfectionBonus = Math.floor(baseXP * 0.3);
      bonuses.push({ type: 'perfection', amount: perfectionBonus, reason: 'Punteggio eccellente' });
      totalXP += perfectionBonus;
    } else if (quizScore >= 80) {
      const goodBonus = Math.floor(baseXP * 0.15);
      bonuses.push({ type: 'good_score', amount: goodBonus, reason: 'Buon punteggio' });
      totalXP += goodBonus;
    }

    // Cognitive diversity bonus
    if (approachesUsed.length >= 3) {
      const diversityBonus = Math.floor(baseXP * 0.25);
      bonuses.push({ type: 'diversity', amount: diversityBonus, reason: 'Approcci multipli' });
      totalXP += diversityBonus;
    }

    // First completion bonus
    if (isFirstCompletion) {
      const firstBonus = Math.floor(baseXP * 0.2);
      bonuses.push({ type: 'first', amount: firstBonus, reason: 'Prima volta' });
      totalXP += firstBonus;
    }

    // Streak bonus (increases with longer streaks)
    if (currentStreak >= 3) {
      const streakMultiplier = Math.min(0.5, currentStreak * 0.05);
      const streakBonus = Math.floor(baseXP * streakMultiplier);
      bonuses.push({ type: 'streak', amount: streakBonus, reason: `Streak di ${currentStreak} giorni` });
      totalXP += streakBonus;
    }

    return { totalXP, bonuses };
  }

  /**
   * Get user's current tier based on XP
   */
  static getUserTier(totalXP: number): XPTier {
    const tier = XP_TIERS.find(t => totalXP >= t.minXP && totalXP <= t.maxXP);
    if (!tier) {
      // Return first tier as fallback
      const firstTier = XP_TIERS[0];
      if (!firstTier) {
        throw new Error('No XP tiers defined');
      }
      return firstTier;
    }
    return tier;
  }

  /**
   * Calculate progress to next tier
   */
  static getTierProgress(totalXP: number): { current: XPTier; next: XPTier | null; progress: number } {
    const current = this.getUserTier(totalXP);
    const nextTierIndex = XP_TIERS.findIndex(tier => tier.level === current.level) + 1;
    const next = nextTierIndex < XP_TIERS.length ? (XP_TIERS[nextTierIndex] ?? null) : null;

    let progress = 0;
    if (next) {
      const tierRange = current.maxXP - current.minXP + 1;
      const currentProgress = totalXP - current.minXP;
      progress = Math.min(100, (currentProgress / tierRange) * 100);
    } else {
      progress = 100; // Max tier reached
    }

    return { current, next, progress };
  }

  /**
   * Get streak milestone rewards
   */
  static getStreakRewards(streakDays: number): StreakMilestone[] {
    return STREAK_MILESTONES.filter(milestone => streakDays >= milestone.days);
  }
}