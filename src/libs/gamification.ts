// Simplified gamification system for production build
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type LearningApproach = 'analogical' | 'procedural' | 'conceptual' | 'visual' | 'kinesthetic';

export type ProfessionalBadge = {
  id: string;
  name: { it: string; en: string };
  description: { it: string; en: string };
  rarity: BadgeRarity;
  xpReward: number;
  icon?: { content: string };
};

export type XPTier = {
  level: number;
  minXP: number;
  maxXP: number;
  title: { it: string; en: string };
  color: string;
  benefits: string[];
};

export type StreakMilestone = {
  days: number;
  title: { it: string; en: string };
  description: { it: string; en: string };
  xpBonus: number;
};

export const PROFESSIONAL_BADGES: Record<string, ProfessionalBadge> = {
  foundation_specialist: {
    id: 'foundation_specialist',
    name: { it: 'Specialista Fondamenti', en: 'Foundation Specialist' },
    description: { it: 'Competenza nei fondamenti blockchain', en: 'Blockchain fundamentals competency' },
    rarity: 'common',
    xpReward: 25,
    icon: { content: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="3" fill="currentColor"/></svg>' },
  },
  methodology_expert: {
    id: 'methodology_expert',
    name: { it: 'Esperto Metodologico', en: 'Methodology Expert' },
    description: { it: 'Padronanza metodologie avanzate', en: 'Advanced methodology mastery' },
    rarity: 'rare',
    xpReward: 50,
    icon: { content: '<svg viewBox="0 0 24 24"><path d="M12 2L15 9L22 9L17 14L19 21L12 17L5 21L7 14L2 9L9 9L12 2Z" fill="currentColor"/></svg>' },
  },
  consistency_professional: {
    id: 'consistency_professional',
    name: { it: 'Professionista Costanza', en: 'Consistency Professional' },
    description: { it: 'Disciplina professionale continuativa', en: 'Continuous professional discipline' },
    rarity: 'epic',
    xpReward: 100,
    icon: { content: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" fill="none"/></svg>' },
  },
};

export const XP_TIERS: XPTier[] = [
  { level: 1, minXP: 0, maxXP: 99, title: { it: 'Principiante', en: 'Beginner' }, color: 'hsl(215 16% 47%)', benefits: [] },
  { level: 2, minXP: 100, maxXP: 249, title: { it: 'Studente', en: 'Student' }, color: 'hsl(213 94% 68%)', benefits: [] },
  { level: 3, minXP: 250, maxXP: 499, title: { it: 'Praticante', en: 'Practitioner' }, color: 'hsl(160 84% 39%)', benefits: [] },
];

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: { it: 'Impegno Iniziale', en: 'Initial Commitment' }, description: { it: 'Tre giorni', en: 'Three days' }, xpBonus: 25 },
  { days: 7, title: { it: 'Disciplina Settimanale', en: 'Weekly Discipline' }, description: { it: 'Una settimana', en: 'One week' }, xpBonus: 75 },
];

export const RARITY_COLORS = {
  common: { primary: 'hsl(215 16% 47%)', secondary: 'hsl(215 16% 35%)', accent: 'hsl(215 16% 55%)', glow: 'hsl(215 16% 47%)' },
  rare: { primary: 'hsl(213 94% 68%)', secondary: 'hsl(224 76% 48%)', accent: 'hsl(213 94% 78%)', glow: 'hsl(213 94% 68%)' },
  epic: { primary: 'hsl(160 84% 39%)', secondary: 'hsl(160 84% 29%)', accent: 'hsl(160 84% 49%)', glow: 'hsl(160 84% 39%)' },
  legendary: { primary: 'hsl(38 92% 50%)', secondary: 'hsl(38 92% 40%)', accent: 'hsl(38 92% 60%)', glow: 'hsl(38 92% 50%)' },
  mythic: { primary: 'hsl(222 47% 11%)', secondary: 'hsl(217 33% 17%)', accent: 'hsl(217 33% 25%)', glow: 'hsl(222 47% 11%)' },
};

export class ProfessionalGamificationEngine {
  static calculateLessonXP(params: {
    baseXP: number;
    timeSpent: number;
    targetTime: number;
    quizScore: number;
    approachesUsed: LearningApproach[];
    isFirstCompletion: boolean;
    currentStreak: number;
  }) {
    return { totalXP: params.baseXP, bonuses: [] };
  }

  static getUserTier(totalXP: number): XPTier {
    return XP_TIERS.find(t => totalXP >= t.minXP && totalXP <= t.maxXP) || XP_TIERS[0]!;
  }

  static getTierProgress(totalXP: number) {
    const current = this.getUserTier(totalXP);
    const nextTierIndex = XP_TIERS.findIndex(tier => tier.level === current.level) + 1;
    const next = nextTierIndex < XP_TIERS.length ? XP_TIERS[nextTierIndex] || null : null;
    const progress = next ? Math.min(100, ((totalXP - current.minXP) / (current.maxXP - current.minXP + 1)) * 100) : 100;
    return { current, next, progress };
  }
}