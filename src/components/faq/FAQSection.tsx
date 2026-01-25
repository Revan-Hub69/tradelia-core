'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { faqCategories, faqItems } from '@/data/faq';
import type { FAQCategory } from '@/types/faq';

import { FAQAccordion } from './FAQAccordion';
import { FAQCategories } from './FAQCategories';
import { FAQSearch } from './FAQSearch';

interface FAQSectionProps {
  variant?: 'landing' | 'dashboard';
  showSearch?: boolean;
  showCategories?: boolean;
  defaultCategory?: FAQCategory | 'all';
}

export function FAQSection({
  variant = 'landing',
  showSearch = true,
  showCategories = true,
  defaultCategory = 'all',
}: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] =
    useState<FAQCategory | 'all'>(defaultCategory);

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqItems;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          item.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(query),
          ),
      );
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  return (
    <section className={variant === 'landing' ? 'py-20' : 'space-y-6'}>
      {/* Header */}
      <div className="space-y-2">
        <h2
          className={
            variant === 'landing' ? 'text-3xl font-bold' : 'text-2xl font-semibold'
          }
        >
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Find answers to common questions about Tradelia
        </p>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="max-w-2xl">
          <FAQSearch onSearch={setSearchQuery} />
        </div>
      )}

      {/* Categories */}
      {showCategories && (
        <FAQCategories
          categories={faqCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Results count */}
      {(searchQuery || activeCategory !== 'all') && (
        <p className="text-sm text-muted-foreground">
          {filteredFAQs.length}{' '}
          {filteredFAQs.length === 1 ? 'result' : 'results'} found
        </p>
      )}

      {/* FAQ Accordion */}
      <FAQAccordion
        items={filteredFAQs}
        defaultOpenFirst={variant === 'landing'}
      />

      {/* Contact CTA */}
      {variant === 'landing' && (
        <div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">Still have questions?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Can't find the answer you're looking for? Contact our support team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Contact Support
          </Link>
        </div>
      )}
    </section>
  );
}
