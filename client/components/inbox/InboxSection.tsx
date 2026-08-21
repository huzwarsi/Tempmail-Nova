'use client';

import React from 'react';
import InboxList from './InboxList';
import EmailViewer from './EmailViewer';
import { useInbox } from '../../context/InboxContext';

/**
 * Client-only interactive inbox section.
 * Separated from page.tsx so the homepage can be a Server Component
 * for full SSR/SEO of static content (Hero, Educational, FAQ).
 */
export default function InboxSection() {
  const { selectedEmail, setSelectedEmail } = useInbox();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
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
  );
}
