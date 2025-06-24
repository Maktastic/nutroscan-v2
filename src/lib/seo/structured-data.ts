export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NutroScan Pro',
  url: 'https://nutroscanpro.com',
  logo: 'https://nutroscanpro.com/logo.png',
  description: 'AI-powered meal planning platform for personalized nutrition',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-NUTRO-SCAN',
    contactType: 'customer service',
    areaServed: 'US',
    availableLanguage: ['English', 'Spanish'],
  },
  sameAs: [
    'https://twitter.com/nutroscanpro',
    'https://facebook.com/nutroscanpro',
    'https://linkedin.com/company/nutroscanpro',
  ],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NutroScan Pro',
  url: 'https://nutroscanpro.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://nutroscanpro.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NutroScan Pro Subscription',
  description: 'AI-powered personalized meal planning for health conditions',
  brand: {
    '@type': 'Brand',
    name: 'NutroScan Pro',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter Plan',
      price: '9.00',
      priceCurrency: 'USD',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Professional Plan',
      price: '29.00',
      priceCurrency: 'USD',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1247',
  },
}
