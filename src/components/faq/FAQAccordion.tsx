'use client';

import type { FAQItem as FAQItemType } from '@/types/faq';

import { FAQItem } from './FAQItem';

interface FAQAccordionProps {
  items: FAQItemType[];
  defaultOpenFirst?: boolean;
}

export function FAQAccordion({
  items,
  defaultOpenFirst = false,
}: FAQAccordionProps) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No FAQs found. Try a different search or category.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border bg-card">
      {items.map((item, index) => (
        <FAQItem
          key={item.id}
          item={item}
          defaultOpen={defaultOpenFirst && index === 0}
        />
      ))}
    </div>
  );
}
