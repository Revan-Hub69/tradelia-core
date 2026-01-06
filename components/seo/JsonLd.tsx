/**
 * JSON-LD Structured Data Component
 * Supports multiple schema types for SEO optimization
 * 
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

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

// Educational Organization schema
export interface EducationalOrganizationSchema extends BaseSchema {
  '@type': 'EducationalOrganization';
  name: string;
  url: string;
  description?: string;
  areaServed?: string;
  educationalCredentialAwarded?: string;
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

// WebPage schema
export interface WebPageSchema extends BaseSchema {
  '@type': 'WebPage';
  name: string;
  description?: string;
  url: string;
  inLanguage?: string;
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
  | EducationalOrganizationSchema
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
    description: 'Strumento educativo per identificare incompatibilità tra obiettivi di investimento e strumenti crypto, basato su ricerca accademica peer-reviewed.',
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
    description: 'Dashboard educativa basata su ricerca comportamentale peer-reviewed per identificare incompatibilità tra obiettivi di investimento e strumenti crypto.',
    inLanguage: 'it-IT',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tradelia.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getEducationalOrganizationSchema(): EducationalOrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Tradelia Research',
    url: 'https://tradelia.com',
    description: 'Ricerca accademica applicata alla finanza comportamentale nel settore crypto.',
    areaServed: 'Worldwide'
  };
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
