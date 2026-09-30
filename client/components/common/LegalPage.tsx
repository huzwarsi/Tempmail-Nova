import PageHeader from './PageHeader';

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function LegalPage({ path, crumb, title, lede, updated, summary, sections }: {
  path: string; crumb: string; title: string; lede: string;
  /** ISO date of the last substantive change, set by hand. */
  updated: string;
  summary: React.ReactNode; sections: LegalSection[];
}) {
  const shown = new Date(updated + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  return (
    <div className="nova-public">
      <PageHeader crumbs={[{ name: crumb, path }]} kicker="POLICIES" title={title} lede={lede}>
        <p className="page-meta"><span>Last updated <time dateTime={updated}>{shown}</time></span></p>
      </PageHeader>
      <div className="nova-container page-body">
        <div className="legal-layout">
          <nav className="toc" aria-labelledby="legal-toc">
            <h2 id="legal-toc">ON THIS PAGE</h2>
            <ol>{sections.map(s => <li key={s.id}><a href={'#' + s.id}>{s.title}</a></li>)}</ol>
          </nav>
          <div className="prose-nova">
            <div className="legal-summary"><strong>Summary</strong>{summary}</div>
            {sections.map(s => <section key={s.id} aria-labelledby={s.id}><h2 id={s.id}>{s.title}</h2>{s.body}</section>)}
          </div>
        </div>
      </div>
    </div>
  );
}
