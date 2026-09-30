import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { BLOG_POSTS, EDITORIAL_AUTHOR, TOPICS, formatDate, getPost, readingMinutes, sectionId, type BlogSection } from '../../../lib/blog-posts';
import { SITE_URL } from '../../../lib/seo';
import { ArticleJsonLd } from '../../../lib/structured-data';
import { Breadcrumbs } from '../../../components/common/PageHeader';
import ShareButtons from '../../../components/blog/ShareButtons';

interface Props { params: { slug: string } }

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  // Under ~60 characters so it is not truncated; search results already show the site name.
  const title = post.seoTitle ?? post.title;
  const image = { url: SITE_URL + '/og-image.png', width: 1200, height: 630, alt: 'TempMail Nova guides' };
  return {
    title: { absolute: title },
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article', url, title, description: post.description, siteName: 'TempMail Nova', locale: 'en_US',
      publishedTime: post.published, modifiedTime: post.updated ?? post.published, images: [image],
    },
    twitter: { card: 'summary_large_image', title, description: post.description, images: [image.url] },
  };
}

/** Renders [label](href), **bold** and `code` inside plain strings. */
function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2];
      out.push(href.startsWith('/')
        ? <Link key={m.index} href={href}>{m[1]}</Link>
        : <a key={m.index} href={href} target="_blank" rel="noopener noreferrer">{m[1]}<span className="sr-only"> (opens in a new tab)</span></a>);
    } else if (m[3]) out.push(<strong key={m.index}>{m[3]}</strong>);
    else out.push(<code key={m.index}>{m[4]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const children = items.map((item, i) => <li key={i}><Inline text={item} /></li>);
  return ordered ? <ol>{children}</ol> : <ul>{children}</ul>;
}

function Section({ section }: { section: BlogSection }) {
  return <>
    <h2 id={sectionId(section.title)}>{section.title}</h2>
    {section.paragraphs?.map((p, i) => <p key={i}><Inline text={p} /></p>)}
    {section.list && <List items={section.list} ordered={section.ordered} />}
    {section.subsections?.map(sub => <React.Fragment key={sub.title}>
      <h3 id={sectionId(sub.title)}>{sub.title}</h3>
      {sub.paragraphs?.map((p, i) => <p key={i}><Inline text={p} /></p>)}
      {sub.list && <List items={sub.list} />}
    </React.Fragment>)}
    {section.table && <div className="table-scroll" role="region" aria-label={section.table.caption} tabIndex={0}>
      <table>
        <caption>{section.table.caption}</caption>
        <thead><tr>{section.table.headers.map((h, i) => <th key={i} scope="col">{h || <span className="sr-only">Item</span>}</th>)}</tr></thead>
        <tbody>{section.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => c === 0
          ? <th key={c} scope="row"><Inline text={cell} /></th>
          : <td key={c}><Inline text={cell} /></td>)}</tr>)}</tbody>
      </table>
    </div>}
    {section.code && <pre tabIndex={0} aria-label={`${section.code.language} code example`}><code>{section.code.text}</code></pre>}
    {section.callout && <aside className={'callout ' + section.callout.tone}><strong>{section.callout.title}</strong><Inline text={section.callout.text} /></aside>}
    {section.paragraphsAfter?.map((p, i) => <p key={i}><Inline text={p} /></p>)}
  </>;
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const topic = TOPICS.find(t => t.id === post.topic)!;
  const related = post.related.map(getPost).filter(Boolean) as NonNullable<ReturnType<typeof getPost>>[];
  const minutes = readingMinutes(post);
  const showToc = post.sections.length >= 4;

  return (
    <article className="nova-public">
      <ArticleJsonLd title={post.title} description={post.description} url={url} datePublished={post.published} dateModified={post.updated} />
      <header className="page-hero">
        <div className="nova-container page-hero-inner">
          <Breadcrumbs items={[{ name: 'Guides', path: '/blog' }, { name: post.title, path: '/blog/' + post.slug }]} />
          <Link href={'/blog#' + topic.id} className="section-kicker topic-link">{topic.label.toUpperCase()}</Link>
          <h1>{post.title}</h1>
          <p className="page-meta">
            <span>By <Link href="/about">{EDITORIAL_AUTHOR}</Link></span>
            <span>Published <time dateTime={post.published}>{formatDate(post.published)}</time></span>
            {post.updated && post.updated !== post.published && <span>Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></span>}
            <span>{minutes} min read</span>
          </p>
        </div>
      </header>

      <div className="nova-container page-body">
        <div className="article-layout">
          <div className="prose-nova">
            {post.intro.map((p, i) => <p key={i} className={i === 0 ? 'prose-lede' : undefined}><Inline text={p} /></p>)}
            {post.sections.map(section => <Section key={section.title} section={section} />)}

            {post.takeaway && <aside className="callout"><strong>The short version</strong><Inline text={post.takeaway} /></aside>}

            {post.faqs && post.faqs.length > 0 && <section className="article-faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" style={{ marginTop: 0 }}>Common questions</h2>
              {post.faqs.map(f => <details key={f.question}><summary>{f.question}<Plus size={17} aria-hidden="true" /></summary><p><Inline text={f.answer} /></p></details>)}
            </section>}

            {post.sources && post.sources.length > 0 && <section className="article-sources" aria-labelledby="sources-heading">
              <h2 id="sources-heading">Sources and further reading</h2>
              <ul>{post.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>
            </section>}

            <ShareButtons url={url} title={post.title} />
          </div>

          <aside className="article-aside" aria-label="Article tools">
            {showToc && <nav className="toc" aria-labelledby="toc-heading">
              <h2 id="toc-heading">ON THIS PAGE</h2>
              <ol>{post.sections.map(s => <li key={s.title}><a href={'#' + sectionId(s.title)}>{s.title}</a></li>)}</ol>
            </nav>}
            <div className="aside-cta">
              <strong>Need a temporary inbox?</strong>
              <p>Get a free address that lasts 24 hours. No signup.</p>
              <Link href="/#generator" className="primary-link">Get free email <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && <section className="related" aria-labelledby="related-heading">
          <h2 id="related-heading">Related guides</h2>
          <ul className="guide-rows">
            {related.map(r => <li key={r.slug}><Link href={'/blog/' + r.slug} data-track="click_guide"><h3>{r.title}</h3><p>{r.excerpt}</p><span className="row-meta">{readingMinutes(r)} min read</span></Link></li>)}
          </ul>
        </section>}
      </div>
    </article>
  );
}
