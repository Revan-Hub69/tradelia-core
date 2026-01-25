export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  keywords?: string[]; // For search
};

export type FAQCategory =
  | 'general'
  | 'account'
  | 'learning'
  | 'technical'
  | 'billing'
  | 'privacy';

export type FAQCategoryInfo = {
  id: FAQCategory;
  label: string;
  icon?: string;
};
