'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { FAQItem as FAQItemType } from '@/types/faq';

interface FAQItemProps {
  item: FAQItemType;
  defaultOpen?: boolean;
}

export function FAQItem({ item, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const headerId = `faq-header-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <div className="border-b border-border p-4 last:border-0">
      {/* Header (button) */}
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="text-base font-medium">{item.question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Panel (content) */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'mt-3' : 'h-0'
        }`}
      >
        <div className="text-sm text-muted-foreground">{item.answer}</div>
      </div>
    </div>
  );
}
