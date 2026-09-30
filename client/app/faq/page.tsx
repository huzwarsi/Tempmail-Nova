import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { publicMetadata } from '../../lib/seo';
import { FAQ_LIST } from '../../lib/faq-data';

export const metadata = publicMetadata('/faq', 'Temporary Email FAQ', 'Answers about free disposable email, verification codes, 24-hour mailbox expiry, mobile access, and the privacy limits of a temporary inbox.');

export default function FAQPage() {
  return (
    <div className="nova-public">
      <PageHeader
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
        kicker="FAQ"
        title="Temporary email FAQs"
        lede="Short answers about your inbox, how long it lasts, and when to use it. For longer explanations, see the guides."
      />
      <div className="nova-container page-body">
        <div className="split-section">
          <div>
            <h2>Can&apos;t find your answer?</h2>
            <p>Read <Link href="/how-it-works" className="text-link">how it works</Link>, browse the <Link href="/blog" className="text-link">guides</Link>, or <Link href="/contact" className="text-link">contact us</Link>.</p>
          </div>
          <div className="faq-list">
            {FAQ_LIST.map((item, index) => <details key={item.q} data-faq={index + 1}><summary>{item.q}<Plus size={17} aria-hidden="true" /></summary><p>{item.a}</p></details>)}
          </div>
        </div>
      </div>
    </div>
  );
}
