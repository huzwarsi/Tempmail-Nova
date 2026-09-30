import Link from 'next/link';
import { SITE_URL } from '../../lib/seo';
import { BreadcrumbListJsonLd } from '../../lib/structured-data';

export type Crumb = { name: string; path: string };

/** Visual breadcrumb + matching BreadcrumbList JSON-LD, so both always agree. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ name: 'Home', path: '' }, ...items];
  return <>
    <BreadcrumbListJsonLd items={trail.map(c => ({ name: c.name, item: SITE_URL + c.path }))} />
    <nav aria-label="Breadcrumb" className="nova-breadcrumbs">
      <ol>{trail.map((c, i) => <li key={c.path}>{i === trail.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.path || '/'}>{c.name}</Link>}</li>)}</ol>
    </nav>
  </>;
}

export default function PageHeader({ crumbs, kicker, title, lede, children, narrow = false }: {
  crumbs: Crumb[]; kicker?: string; title: string; lede?: React.ReactNode; children?: React.ReactNode; narrow?: boolean;
}) {
  return (
    <header className="page-hero">
      <div className={narrow ? 'nova-container page-hero-inner narrow' : 'nova-container page-hero-inner'}>
        <Breadcrumbs items={crumbs} />
        {kicker && <span className="section-kicker">{kicker}</span>}
        <h1>{title}</h1>
        {lede && <p className="page-lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
