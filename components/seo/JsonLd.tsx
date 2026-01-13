/**
 * JSON-LD Structured Data Component
 * SEO + AI SEO optimized for 2026
 * 
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

/* eslint-disable react/no-danger */
import { type ReactNode } from 'react';

// Base schema types
interface BaseSchema {
  '@context': 'https://schema.org';
  '@type': string;
}

// Organization schema
export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    availableLanguage?: string[];
  };
}

// WebSite schema with search action
export interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

// FAQ schema
export interface FAQPageSchema extends BaseSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// LearningResource schema (for educational content)
export interface LearningResourceSchema extends BaseSchema {
  '@type': 'LearningResource';
  name: string;
  description: string;
  url: string;
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  educationalLevel: string;
  learningResourceType: string;
  audience: {
    '@type': 'Audience';
    audienceType: string;
  };
  about: Array<{
    '@type': 'Thing';
    name: string;
  }>;
  teaches: string[];
  inLanguage: string;
  isAccessibleForFree: boolean;
  citation?: Array<{
    '@type': 'ScholarlyArticle';
    name: string;
    author: string;
    datePublished?: string;
  }>;
}

// Course schema (for the 4 learning paths)
export interface CourseSchema extends BaseSchema {
  '@type': 'Course';
  name: string;
  description: string;
  url: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  educationalLevel: string;
  courseCode?: string;
  hasCourseInstance?: Array<{
    '@type': 'CourseInstance';
    courseMode: string;
    courseWorkload: string;
  }>;
}

// BreadcrumbList schema
export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

// WebPage schema with speakable (for voice search / AI)
export interface WebPageSchema extends BaseSchema {
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  inLanguage?: string;
  speakable?: {
    '@type': 'SpeakableSpecification';
    cssSelector: string[];
  };
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

// Union type for all supported schemas
type SchemaType = 
  | OrganizationSchema 
  | WebSiteSchema 
  | FAQPageSchema 
  | LearningResourceSchema
  | CourseSchema
  | BreadcrumbListSchema
  | WebPageSchema;

interface JsonLdProps {
  data: SchemaType | SchemaType[];
}

/**
 * Renders JSON-LD structured data in a script tag
 * Can accept single schema or array of schemas
 */
export function JsonLd({ data }: JsonLdProps): ReactNode {
  const jsonLd = Array.isArray(data) 
    ? data.map(schema => ({ ...schema, '@context': 'https://schema.org' }))
    : { ...data, '@context': 'https://schema.org' };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  );
}

// Pre-configured schemas for Tradelia

export function getOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tradelia',
    url: 'https://tradelia.com',
    logo: 'https://tradelia.com/logo.png',
    description: 'Dashboard educativa per evitare gli errori più costosi nelle crypto. Basata su ricerca accademica peer-reviewed.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Italian', 'English']
    }
  };
}

export function getWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tradelia',
    url: 'https://tradelia.com',
    description: 'Dashboard educativa per evitare gli errori più costosi nelle crypto. 4 percorsi personalizzati basati su ricerca accademica.',
    inLanguage: 'it-IT'
  };
}

export function getLearningResourceSchema(): LearningResourceSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Tradelia - Educazione Crypto Basata su Ricerca',
    description: 'Dashboard educativa che ti aiuta a evitare gli errori più comuni di chi inizia con le crypto. 4 percorsi personalizzati: Investimento, Asset di emergenza, Rendite passive, Speculazione.',
    url: 'https://tradelia.com',
    provider: {
      '@type': 'Organization',
      name: 'Tradelia',
      url: 'https://tradelia.com'
    },
    educationalLevel: 'Beginner',
    learningResourceType: 'Interactive Dashboard',
    audience: {
      '@type': 'Audience',
      audienceType: 'Crypto Beginners'
    },
    about: [
      { '@type': 'Thing', name: 'Cryptocurrency' },
      { '@type': 'Thing', name: 'Behavioral Finance' },
      { '@type': 'Thing', name: 'Investment Risk' },
      { '@type': 'Thing', name: 'Financial Literacy' }
    ],
    teaches: [
      'Come evitare errori crypto comuni',
      'Bias cognitivi negli investimenti',
      'Gestione del rischio nelle criptovalute',
      'Finanza comportamentale applicata'
    ],
    inLanguage: 'it',
    isAccessibleForFree: true,
    citation: [
      {
        '@type': 'ScholarlyArticle',
        name: 'Boys will be boys: Gender, overconfidence, and common stock investment',
        author: 'Barber, B. M., & Odean, T.',
        datePublished: '2001'
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'Prospect theory: An analysis of decision under risk',
        author: 'Kahneman, D., & Tversky, A.',
        datePublished: '1979'
      },
      {
        '@type': 'ScholarlyArticle',
        name: 'The disposition to sell winners too early and ride losers too long',
        author: 'Shefrin, H., & Statman, M.',
        datePublished: '1985'
      }
    ]
  };
}

export function getCourseSchemas(): CourseSchema[] {
  const courses = [
    {
      name: 'Percorso Investimento Crypto',
      description: 'Impara a investire in crypto per il lungo termine evitando gli errori più costosi. Strategie di hodling basate su ricerca accademica.',
      code: 'investment'
    },
    {
      name: 'Percorso Asset di Emergenza',
      description: 'Scopri come usare le crypto come riserva di valore alternativa. Rischi e opportunità documentati dalla ricerca.',
      code: 'emergency'
    },
    {
      name: 'Percorso Rendite Passive',
      description: 'Esplora staking, lending e altre forme di rendita passiva crypto. Errori da evitare e rischi specifici.',
      code: 'passive'
    },
    {
      name: 'Percorso Speculazione',
      description: 'Comprendi i rischi del trading a breve termine. Bias comportamentali e errori comuni nella speculazione crypto.',
      code: 'speculation'
    }
  ];

  return courses.map(course => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    url: `https://tradelia.com/dashboard/${course.code}`,
    provider: {
      '@type': 'Organization',
      name: 'Tradelia'
    },
    educationalLevel: 'Beginner',
    courseCode: course.code,
    hasCourseInstance: [{
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT15M'
    }]
  }));
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };
}

export function getWebPageSchema(name: string, description: string, url: string): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: 'it',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.speakable']
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tradelia',
      url: 'https://tradelia.com'
    }
  };
}
