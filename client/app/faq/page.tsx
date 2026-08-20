import React from 'react';
import type { Metadata } from 'next';
import FAQ from '../../components/landing/FAQ';
import { FAQ_LIST } from '../../lib/faq-data';
import { FAQPageJsonLd } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | TempMail Nova',
  description: 'Answers to common questions regarding disposable email addresses, 24-hour message retention, WebSockets, custom domains, and privacy.',
  alternates: {
    canonical: 'https://tempmailnova.com/faq',
  },
};

export default function FAQPage() {
  const formattedFaqs = FAQ_LIST.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <>
      <FAQPageJsonLd faqs={formattedFaqs} />
      <div className="py-8">
        <FAQ />
      </div>
    </>
  );
}
