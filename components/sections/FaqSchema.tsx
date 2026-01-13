'use client';

/* eslint-disable react/no-danger */
import { useLanguage } from '@/components/LanguageSelector';
import { translations } from '@/lib/translations';

export default function FaqSchema() {
  const { locale } = useLanguage();
  
  const faqQuestions = translations[locale as keyof typeof translations].faq.questions;
  
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqQuestions.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}