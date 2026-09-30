import Link from 'next/link';
import { Plus } from 'lucide-react';
import { FAQ_LIST } from '../../lib/faq-data';

export default function FAQ({ compact = false }: { compact?: boolean }) {
  const items = compact ? FAQ_LIST.slice(0, 6) : FAQ_LIST;
  return (
    <section className="nova-faq nova-container" aria-labelledby="faq-heading">
      <div className="faq-intro"><span className="section-kicker">GOOD QUESTIONS. CLEAR ANSWERS.</span><h2 id="faq-heading">Before you copy.</h2><p>A few useful things to know about your temporary inbox.</p>{compact && <Link href="/faq" className="text-link">All frequently asked questions &rarr;</Link>}</div>
      <div className="faq-list">{items.map((item, index) => <details key={item.q} data-faq={index + 1}><summary>{item.q}<Plus size={17} aria-hidden="true" /></summary><p>{item.a}</p></details>)}</div>
    </section>
  );
}
