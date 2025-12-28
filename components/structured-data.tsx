import Script from 'next/script'

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Tradelia",
    "description": "Piattaforma educativa per educazione finanziaria antifuffa",
    "url": "https://tradelia.com",
    "logo": "https://tradelia.com/logo.png",
    "sameAs": [
      "https://twitter.com/tradelia"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Italian"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tradelia",
    "description": "Educazione finanziaria antifuffa con micro-lezioni e spiegazioni guidate",
    "url": "https://tradelia.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://tradelia.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  const educationalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Financial Education",
    "name": "Tradelia Educational Platform",
    "description": "Micro-lezioni di educazione finanziaria, spiegazioni guidate su crypto e indicatori, zero consigli operativi",
    "provider": {
      "@type": "Organization",
      "name": "Tradelia"
    },
    "areaServed": "IT",
    "availableLanguage": "Italian",
    "category": "Education",
    "audience": {
      "@type": "Audience",
      "audienceType": "Investors and traders seeking education"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tradelia.com"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Dashboard",
        "item": "https://tradelia.com/dashboard"
      }
    ]
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalServiceSchema)
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  )
}