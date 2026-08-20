'use client';

import React from 'react';
import Hero from '../components/landing/Hero';
import EducationalContent from '../components/landing/EducationalContent';
import FAQ from '../components/landing/FAQ';
import { FAQ_LIST } from '../lib/faq-data';
import InboxList from '../components/inbox/InboxList';
import EmailViewer from '../components/inbox/EmailViewer';
import { useInbox } from '../context/InboxContext';
import { FAQPageJsonLd } from '../lib/structured-data';

export default function HomePage() {
  const { selectedEmail, setSelectedEmail } = useInbox();

  const formattedFaqs = FAQ_LIST.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <>
      <FAQPageJsonLd faqs={formattedFaqs} />

      <div className="space-y-12 pb-16">
        {/* Main Hero & Generator Section */}
        <Hero />

        {/* Centered Inbox Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl sm:max-w-4xl mx-auto">
            {selectedEmail ? (
              <EmailViewer
                email={selectedEmail}
                onBack={() => setSelectedEmail(null)}
                onDelete={() => setSelectedEmail(null)}
              />
            ) : (
              <InboxList />
            )}
          </div>
        </div>

        {/* Complete Non-Repetitive Educational Content & H2 Hierarchy */}
        <EducationalContent />

        {/* 12 Verified Factual FAQ Accordion */}
        <FAQ />
      </div>
    </>
  );
}
