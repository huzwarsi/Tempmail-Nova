import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Tag, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../../lib/blog-posts';
import { BreadcrumbListJsonLd } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'Disposable Email & Privacy Guides | TempMail Nova Blog',
  description: 'Articles, security guides, and technical breakdowns on disposable temporary email, online privacy protection, spam prevention, and disposable mail architecture.',
  alternates: {
    canonical: 'https://tempmailnova.com/blog',
  },
  openGraph: {
    type: 'website',
    url: 'https://tempmailnova.com/blog',
    title: 'Disposable Email & Privacy Guides | TempMail Nova Blog',
    description: 'In-depth articles, security guides, and technical breakdowns on disposable temporary email and online privacy.',
    siteName: 'TempMail Nova',
    images: [{ url: 'https://tempmailnova.com/logo.png', width: 512, height: 512, alt: 'TempMail Nova Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disposable Email & Privacy Guides | TempMail Nova Blog',
    description: 'In-depth articles, security guides, and technical breakdowns on disposable temporary email and online privacy.',
    images: ['https://tempmailnova.com/logo.png'],
  },
};

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', item: 'https://tempmailnova.com' },
          { name: 'Blog', item: 'https://tempmailnova.com/blog' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-manrope">
        {/* Visual Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">Blog Index</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold font-mono">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>PRIVACY & SECURITY KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Disposable Email & Privacy Blog
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
            In-depth guides, technical breakdowns, security best practices, and strategies to eliminate inbox spam and protect your online identity.
          </p>
        </div>

        {/* Featured Article Banner */}
        {BLOG_POSTS.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-900/30 via-slate-900 to-teal-900/20 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 font-mono">
              <Tag className="w-3.5 h-3.5" />
              <span>FEATURED GUIDE</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-snug">
              <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="hover:text-emerald-400 transition">
                {BLOG_POSTS[0].title}
              </Link>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {BLOG_POSTS[0].excerpt}
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2 font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{BLOG_POSTS[0].readTime}</span>
              </span>
              <span>•</span>
              <span>{BLOG_POSTS[0].date}</span>
            </div>
            <div>
              <Link
                href={`/blog/${BLOG_POSTS[0].slug}`}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-slate-950 transition text-xs shadow-lg shadow-emerald-500/25"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-emerald-500/25 p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-emerald-500/50 transition duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30">
                    {post.category}
                  </span>
                  <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-emerald-500/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{post.date}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
