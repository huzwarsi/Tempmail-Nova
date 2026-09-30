import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Page not found | TempMail Nova' },
  description: 'The page you requested could not be found on TempMail Nova.',
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <div className="nova-public">
      <div className="nova-container not-found">
        <span className="section-kicker">404</span>
        <h1>We couldn&apos;t find that page</h1>
        <p>The link may be out of date, or the address may have a typo. Temporary inboxes do not have their own web pages, so an old inbox link will also end up here.</p>
        <div className="button-row">
          <Link href="/" className="primary-link">Get a temporary email <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/blog" className="secondary-link">Browse the guides</Link>
          <Link href="/faq" className="secondary-link">Read the FAQ</Link>
        </div>
      </div>
    </div>
  );
}
