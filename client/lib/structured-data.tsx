import React from 'react';

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TempMail Nova',
    url: 'https://tempmailnova.com',
    description: 'Free disposable temporary email generator with real-time inbox updates and automatic 24-hour message purges.',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TempMail Nova',
    url: 'https://tempmailnova.com',
    logo: 'https://tempmailnova.com/logo.png',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function BreadcrumbListJsonLd({
  items,
}: {
  items: { name: string; item: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function FAQPageJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished,
    // A hand-maintained edit date only; never generated at build time.
    dateModified: dateModified ?? datePublished,
    image: 'https://tempmailnova.com/og-image.png',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Organization',
      name: 'TempMail Nova',
      url: 'https://tempmailnova.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TempMail Nova',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tempmailnova.com/logo.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function WebApplicationJsonLd() {
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    '@id': 'https://tempmailnova.com/#application',
    name: 'TempMail Nova', url: 'https://tempmailnova.com',
    description: 'Create a free temporary email address without signup and receive one-time messages in a 24-hour inbox.',
    applicationCategory: 'CommunicationApplication', operatingSystem: 'Web browser',
    browserRequirements: 'Requires JavaScript and an internet connection',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}
