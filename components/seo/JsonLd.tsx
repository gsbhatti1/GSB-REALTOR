// components/seo/JsonLd.tsx
// ─── Structured Data for Google Rich Results ──────────────────────────
// Drop this into layout.tsx or individual pages for rich snippets

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ─── Pre-built schemas ─────────────────────────────────────────────────

export function RealEstateAgentSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Gurpreet Bhatti',
    alternateName: 'GSB Realtor',
    description:
      'Utah REALTOR® and USMC Veteran specializing in residential and commercial real estate across Utah, Nevada, and Wyoming. Expert in NNN leases, luxury homes, land development, and property management.',
    url: 'https://gsbrealtor.com',
    logo: 'https://gsbrealtor.com/images/gurpreet-headshot-pro.jpg',
    image: 'https://gsbrealtor.com/images/gurpreet-headshot-pro.jpg',
    telephone: '+1-801-635-8462',
    email: 'Gsbhatti1@yahoo.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'West Jordan',
      addressRegion: 'UT',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.6097,
      longitude: -111.9391,
    },
    areaServed: [
      {
        '@type': 'State',
        name: 'Utah',
        sameAs: 'https://en.wikipedia.org/wiki/Utah',
      },
      {
        '@type': 'State',
        name: 'Nevada',
        sameAs: 'https://en.wikipedia.org/wiki/Nevada',
      },
      {
        '@type': 'State',
        name: 'Wyoming',
        sameAs: 'https://en.wikipedia.org/wiki/Wyoming',
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Real Estate License',
        recognizedBy: { '@type': 'Organization', name: 'Utah Division of Real Estate' },
        identifier: '12907042-SA00',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Real Estate License',
        recognizedBy: { '@type': 'Organization', name: 'Nevada Real Estate Division' },
        identifier: 'S.0201351',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Real Estate License',
        recognizedBy: { '@type': 'Organization', name: 'Wyoming Real Estate Commission' },
        identifier: 'RE-17041',
      },
    ],
    knowsLanguage: ['en', 'es', 'pa', 'ar', 'zh', 'vi'],
    sameAs: [
      'https://www.facebook.com/61573733562846',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '21:00',
    },
    priceRange: '$$',
  }

  return <JsonLd data={data} />
}

export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://gsbrealtor.com/#business',
    name: 'Bhatti Real Estate & Management',
    url: 'https://gsbrealtor.com',
    telephone: '+1-801-635-8462',
    email: 'Gsbhatti1@yahoo.com',
    image: 'https://gsbrealtor.com/images/gurpreet-headshot-pro.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'West Jordan',
      addressRegion: 'UT',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'State',
      name: 'Utah',
    },
    founder: {
      '@type': 'Person',
      name: 'Gurpreet Bhatti',
      jobTitle: 'REALTOR®',
    },
  }

  return <JsonLd data={data} />
}

export function WebsiteSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GSB Realtor',
    url: 'https://gsbrealtor.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://gsbrealtor.com/search?city={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return <JsonLd data={data} />
}

export function BlogPostSchema({
  title,
  datePublished,
  description,
  slug,
  tag,
}: {
  title: string
  datePublished: string
  description: string
  slug: string
  tag: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Person',
      name: 'Gurpreet Bhatti',
      url: 'https://gsbrealtor.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GSB Realtor',
      url: 'https://gsbrealtor.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gsbrealtor.com/images/gurpreet-headshot-pro.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gsbrealtor.com/blog/${slug}`,
    },
    articleSection: tag,
    inLanguage: 'en-US',
  }

  return <JsonLd data={data} />
}

export function FAQSchema({ questions }: { questions: { q: string; a: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }

  return <JsonLd data={data} />
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={data} />
}

export function PropertyListingSchema({
  address,
  city,
  price,
  beds,
  baths,
  sqft,
  url,
  image,
}: {
  address: string
  city: string
  price: number
  beds?: number
  baths?: number
  sqft?: number
  url: string
  image?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: `${address}, ${city}`,
    url,
    ...(image && { image }),
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city.split(',')[0],
      addressRegion: 'UT',
      addressCountry: 'US',
    },
    ...(beds && { numberOfRooms: beds }),
    ...(sqft && { floorSize: { '@type': 'QuantitativeValue', value: sqft, unitCode: 'FTK' } }),
  }

  return <JsonLd data={data} />
}
