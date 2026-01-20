// Types for Tradelia Learning System
// Based on Duolingo Method + Khan Academy Mastery + Brilliant Interactive

export type ApproachType = 'analogical' | 'procedural' | 'conceptual';

export type LessonContent = {
  id: string;
  title: string;
  subtitle: string;
  estimatedTime: number; // minutes
  xpReward: number;
  approaches: {
    analogical: ApproachContent;
    procedural: ApproachContent;
    conceptual: ApproachContent;
  };
  quiz: QuizQuestion[];
};

export type ApproachContent = {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji for now, SVG later
  content: {
    sections: ContentSection[];
    keyTakeaways: string[];
    interactiveElements?: InteractiveElement[];
  };
};

export type ContentSection = {
  id: string;
  type: 'text' | 'highlight' | 'example' | 'warning' | 'visual';
  content: string;
  metadata?: {
    bgColor?: string;
    icon?: string;
    emphasis?: boolean;
  };
};

export type InteractiveElement = {
  id: string;
  type: 'drag-drop' | 'click-reveal' | 'step-by-step' | 'comparison';
  prompt: string;
  feedback: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  approach: ApproachType; // which approach this tests
};

export type UserProgress = {
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  completedLessons: string[];
  approachesExplored: Set<ApproachType>;
  lastActivity: Date;
  badges: Badge[];
  totalStudyTime?: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

// Learning Analytics
export type LessonAnalytics = {
  lessonId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  approachesVisited: ApproachType[];
  timePerApproach: Record<ApproachType, number>;
  quizScore: number;
  completed: boolean;
  feedbackGiven?: string;
};
