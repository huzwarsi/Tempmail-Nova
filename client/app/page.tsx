import React from 'react';
import type { Metadata } from 'next';
import Hero from '../components/landing/Hero';
import EducationalContent from '../components/landing/EducationalContent';
import FAQ from '../components/landing/FAQ';
import { FAQ_LIST } from '../lib/faq-data';
import InboxSection from '../components/inbox/InboxSection';
import { FAQPageJsonLd } from '../lib/structured-data';

/**
 * Homepage — Server Component (SSR)
 *
 * Google crawler receives fully rendered HTML for:
 * - H1 title, subtitle, trust badges (Hero)
 * - 18KB educational content with H2 hierarchy (EducationalContent)
 * - 12 FAQ items with FAQPage JSON-LD schema
 *
 * Only the interactive inbox (InboxSection) is hydrated client-side.
 */

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://tempmailnova.com',
  },
};

export default function HomePage() {
  const formattedFaqs = FAQ_LIST.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <>
      <FAQPageJsonLd faqs={formattedFaqs} />

      <div className="space-y-12 pb-16">
        {/* Main Hero & Generator Section (SSR) */}
        <Hero />

        {/* Interactive Inbox — Client Component Island */}
        <InboxSection />

        {/* Complete Non-Repetitive Educational Content & H2 Hierarchy (SSR) */}
        <EducationalContent />

        {/* 12 Verified Factual FAQ Accordion (SSR + Client hydration) */}
        <FAQ />
      </div>
    </>
  );
}
