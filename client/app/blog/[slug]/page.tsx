import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS } from '../../../lib/blog-posts';
import { ArticleJsonLd, FAQPageJsonLd, BreadcrumbListJsonLd } from '../../../lib/structured-data';
import { Clock, Calendar, User, ArrowLeft, ArrowRight, Shield, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import ShareButtons from '../../../components/blog/ShareButtons';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};

  const url = `https://tempmailnova.com/blog/${post.slug}`;
  const pageTitle = post.seoTitle ? `${post.seoTitle} | TempMail Nova` : `${post.title} | TempMail Nova`;

  return {
    title: pageTitle,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url: url,
      title: pageTitle,
      description: post.description,
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      siteName: 'TempMail Nova',
      images: [
        {
          url: 'https://tempmailnova.com/logo.png',
          width: 512,
          height: 512,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: post.description,
      images: ['https://tempmailnova.com/logo.png'],
    },
  };
}

function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match;
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push(renderBoldAndCode(text.substring(lastIndex, matchIndex), `text-${lastIndex}`));
    }

    parts.push(
      <Link
        key={`link-${matchIndex}`}
        href={url}
        className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline underline-offset-2 transition"
      >
        {linkText}
      </Link>
    );

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(renderBoldAndCode(text.substring(lastIndex), `text-${lastIndex}`));
  }

  return <>{parts}</>;
}

function renderBoldAndCode(str: string, keyPrefix: string): React.ReactNode {
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const tokens = str.split(regex);

  return (
    <React.Fragment key={keyPrefix}>
      {tokens.map((token, idx) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={idx} className="font-extrabold text-slate-900 dark:text-white">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-mono text-xs border border-slate-200 dark:border-emerald-500/20"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        return token;
      })}
    </React.Fragment>
  );
}

export default function BlogPostPage({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => post.relatedSlugs.includes(p.slug));
  const articleUrl = `https://tempmailnova.com/blog/${post.slug}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        url={articleUrl}
        datePublished={post.date}
        authorName={post.author}
      />

      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', item: 'https://tempmailnova.com' },
          { name: 'Blog', item: 'https://tempmailnova.com/blog' },
          { name: post.title, item: articleUrl },
        ]}
      />

      {post.faqs && post.faqs.length > 0 && <FAQPageJsonLd faqs={post.faqs} />}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-manrope">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition bg-white dark:bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-200 dark:border-emerald-500/30 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Back to Blog Index</span>
          </Link>

          <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[160px] sm:max-w-xs">
              {post.category}
            </span>
          </nav>
        </div>

        {/* Header Block */}
        <header className="space-y-4 border-b border-slate-200 dark:border-emerald-500/20 pb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold font-mono">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{post.category.toUpperCase()}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {post.h1}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono pt-2">
            <span className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{post.author}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{post.readTime}</span>
            </span>
          </div>

          <ShareButtons url={articleUrl} title={post.title} />
        </header>

        {/* Article Body Content */}
        <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-8 shadow-xl text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* Intro Paragraphs */}
          <div className="space-y-4 border-l-4 border-emerald-500 pl-4 py-1 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-r-2xl">
            {post.content.intro.map((introP, idx) => (
              <p key={idx} className="text-base sm:text-lg font-medium text-slate-900 dark:text-emerald-200/90 leading-relaxed">
                <FormattedText text={introP} />
              </p>
            ))}
          </div>

          {/* Main Content Sections */}
          {post.content.sections.map((section, idx) => (
            <section key={idx} className="space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-emerald-500/10">
                {section.title}
              </h2>

              {section.paragraphs && section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <FormattedText text={p} />
                </p>
              ))}

              {section.listItems && (
                <ul className="space-y-2.5 pt-1">
                  {section.listItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                      <span className="text-slate-700 dark:text-slate-300">
                        <FormattedText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {section.paragraphsAfter && section.paragraphsAfter.map((pa, paIdx) => (
                <p key={paIdx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <FormattedText text={pa} />
                </p>
              ))}

              {/* Subsections (H3) */}
              {section.subsections && (
                <div className="space-y-5 pt-3">
                  {section.subsections.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-emerald-500/30">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {sub.title}
                      </h3>
                      {sub.paragraphs && sub.paragraphs.map((subP, spIdx) => (
                        <p key={spIdx} className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                          <FormattedText text={subP} />
                        </p>
                      ))}
                      {sub.listItems && (
                        <ul className="space-y-2 pt-1">
                          {sub.listItems.map((subItem, siIdx) => (
                            <li key={siIdx} className="flex items-start space-x-2 text-xs sm:text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                              <span className="text-slate-700 dark:text-slate-300">
                                <FormattedText text={subItem} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Data Table */}
              {section.table && (
                <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 dark:border-emerald-500/30 shadow-md">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead className="bg-slate-100 dark:bg-emerald-950/80 text-slate-900 dark:text-emerald-300 font-mono border-b border-slate-200 dark:border-emerald-500/30">
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3 sm:p-4 font-extrabold uppercase text-[11px] tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-emerald-500/10">
                      {section.table.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? 'bg-white dark:bg-[#080d16]' : 'bg-slate-50/50 dark:bg-slate-900/40'}
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 sm:p-4 text-slate-700 dark:text-slate-300">
                              <FormattedText text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          {/* Key Takeaway Banner */}
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 space-y-2">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Key Takeaway</span>
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200/90 font-medium">
              <FormattedText text={post.content.conclusion} />
            </p>
          </div>

          {/* Embedded FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-emerald-500/20 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Frequently Asked Questions</span>
              </h3>
              <div className="space-y-3">
                {post.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#04070d] border border-slate-200 dark:border-emerald-500/20 space-y-2"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {faq.question}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <FormattedText text={faq.answer} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Article Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-emerald-500/20">
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Internal Platform Links */}
          <div className="pt-6 border-t border-slate-200 dark:border-emerald-500/20 space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Essential Platform Links & Resources
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 transition"
              >
                Free Temporary Email Generator
              </Link>
              <Link
                href="/how-it-works"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 transition"
              >
                How It Works
              </Link>
              <Link
                href="/faq"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 transition"
              >
                Platform FAQ
              </Link>
              <Link
                href="/privacy"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/about"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 transition"
              >
                About TempMail Nova
              </Link>
              <Link
                href="/contact"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-emerald-500/20 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Action CTA Banner */}
          <div className="bg-gradient-to-r from-emerald-900/40 via-slate-900 to-teal-900/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Need a Temporary Email Address Right Now?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Generate an instant disposable inbox with zero registration, 24-hour auto-purge, and real-time WebSocket delivery. Shield your primary inbox from spam.
            </p>
            <div>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-black text-slate-950 transition text-xs shadow-lg shadow-emerald-500/30"
              >
                <span>Create Free Temporary Email</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-emerald-500/20">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Related Privacy Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.slug}
                  className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-3 shadow-md hover:border-emerald-500/50 transition duration-300 group"
                >
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30">
                    {rel.category}
                  </span>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-emerald-500 transition">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
