'use client';

import type { FAQCategory, FAQCategoryInfo } from '@/types/faq';

interface FAQCategoriesProps {
  categories: FAQCategoryInfo[];
  activeCategory: FAQCategory | 'all';
  onCategoryChange: (category: FAQCategory | 'all') => void;
}

export function FAQCategories({
  categories,
  activeCategory,
  onCategoryChange,
}: FAQCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onCategoryChange('all')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          activeCategory === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onCategoryChange(category.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {category.icon && <span className="mr-1">{category.icon}</span>}
          {category.label}
        </button>
      ))}
    </div>
  );
}
