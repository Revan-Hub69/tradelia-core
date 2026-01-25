import type { FAQCategoryInfo, FAQItem } from '@/types/faq';

export const faqCategories: FAQCategoryInfo[] = [
  { id: 'general', label: 'General', icon: '❓' },
  { id: 'account', label: 'Account', icon: '👤' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'technical', label: 'Technical', icon: '⚙️' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
];

export const faqItems: FAQItem[] = [
  // General
  {
    id: 'what-is-tradelia',
    question: 'What is Tradelia?',
    answer:
      'Tradelia is an interactive learning platform that helps you master cryptocurrency trading through gamified lessons, real-time simulations, and personalized progress tracking.',
    category: 'general',
    keywords: ['about', 'platform', 'what', 'crypto', 'trading'],
  },
  {
    id: 'how-it-works',
    question: 'How does Tradelia work?',
    answer:
      'Tradelia uses a step-by-step learning approach with interactive lessons, quizzes, and simulations. You earn XP points as you progress, unlock new content, and track your learning journey through a personalized dashboard.',
    category: 'general',
    keywords: ['how', 'works', 'process', 'learn'],
  },
  {
    id: 'is-free',
    question: 'Is Tradelia free?',
    answer:
      'Yes! Tradelia offers a free plan with access to core lessons and features. Premium plans with advanced content and features are also available.',
    category: 'general',
    keywords: ['free', 'cost', 'price', 'premium'],
  },

  // Account
  {
    id: 'create-account',
    question: 'How do I create an account?',
    answer:
      'Click "Sign Up" in the header, then choose to sign up with email or use OAuth providers (Google, GitHub). Verify your email and you\'re ready to start learning!',
    category: 'account',
    keywords: ['signup', 'register', 'create', 'account', 'new'],
  },
  {
    id: 'reset-password',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox. The reset link expires after 24 hours.',
    category: 'account',
    keywords: ['password', 'reset', 'forgot', 'recover'],
  },
  {
    id: 'delete-account',
    question: 'How do I delete my account?',
    answer:
      'Go to Dashboard → Settings → Account → Delete Account. This action is permanent and will delete all your data including progress, achievements, and personal information.',
    category: 'account',
    keywords: ['delete', 'remove', 'close', 'account', 'gdpr'],
  },

  // Learning
  {
    id: 'track-progress',
    question: 'How do I track my progress?',
    answer:
      'Your dashboard shows your learning progress, XP points, completed lessons, and achievements. You can also view detailed statistics for each lesson category.',
    category: 'learning',
    keywords: ['progress', 'track', 'stats', 'dashboard'],
  },
  {
    id: 'earn-xp',
    question: 'How do I earn XP points?',
    answer:
      'You earn XP by completing lessons, passing quizzes, and achieving milestones. Each lesson has a specific XP value shown before you start.',
    category: 'learning',
    keywords: ['xp', 'points', 'earn', 'gamification'],
  },
  {
    id: 'lesson-order',
    question: 'Do I need to complete lessons in order?',
    answer:
      'Some lessons have prerequisites, but many can be completed in any order. Locked lessons will show what you need to complete first.',
    category: 'learning',
    keywords: ['order', 'sequence', 'prerequisites', 'locked'],
  },

  // Technical
  {
    id: 'change-language',
    question: 'How do I change the language?',
    answer:
      'Click the language switcher in the header (🌐 icon) and select your preferred language. Currently supported: English and Italian.',
    category: 'technical',
    keywords: ['language', 'translate', 'i18n', 'locale'],
  },
  {
    id: 'change-theme',
    question: 'How do I switch between light and dark mode?',
    answer:
      'Click the theme switcher in the header (☀️/🌙 icon). You can choose Light, Dark, or System (follows your device preference).',
    category: 'technical',
    keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
  },
  {
    id: 'mobile-support',
    question: 'Does Tradelia work on mobile?',
    answer:
      'Yes! Tradelia is fully responsive and optimized for mobile devices. You can access all features on phones and tablets.',
    category: 'technical',
    keywords: ['mobile', 'responsive', 'phone', 'tablet'],
  },

  // Billing
  {
    id: 'premium-features',
    question: 'What do I get with Premium?',
    answer:
      'Premium includes advanced lessons, exclusive content, priority support, detailed analytics, and ad-free experience.',
    category: 'billing',
    keywords: ['premium', 'paid', 'features', 'subscription'],
  },
  {
    id: 'cancel-subscription',
    question: 'How do I cancel my subscription?',
    answer:
      'Go to Dashboard → Settings → Billing → Cancel Subscription. You\'ll retain access until the end of your billing period.',
    category: 'billing',
    keywords: ['cancel', 'subscription', 'refund', 'billing'],
  },

  // Privacy
  {
    id: 'data-privacy',
    question: 'How is my data protected?',
    answer:
      'We use industry-standard encryption, secure authentication, and follow GDPR compliance. Your data is never sold to third parties. See our Privacy Policy for details.',
    category: 'privacy',
    keywords: ['privacy', 'data', 'security', 'gdpr', 'protection'],
  },
  {
    id: 'cookies',
    question: 'What cookies does Tradelia use?',
    answer:
      'We use essential cookies for authentication and preferences, and optional analytics cookies (with your consent). See our Cookie Policy for details.',
    category: 'privacy',
    keywords: ['cookies', 'tracking', 'analytics'],
  },
];
