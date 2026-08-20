import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbListJsonLd } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'Cookie Policy | TempMail Nova',
  description:
    'Detailed Cookie Policy explaining browser local storage, essential session management, and third-party Google AdSense advertising cookies.',
  alternates: {
    canonical: 'https://tempmailnova.com/cookies',
  },
  openGraph: {
    type: 'website',
    url: 'https://tempmailnova.com/cookies',
    title: 'Cookie Policy | TempMail Nova',
    description:
      'Detailed Cookie Policy explaining browser local storage, essential session management, and third-party Google AdSense advertising cookies.',
    siteName: 'TempMail Nova',
    images: [
      {
        url: 'https://tempmailnova.com/logo.png',
        width: 512,
        height: 512,
        alt: 'TempMail Nova Cookie Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | TempMail Nova',
    description: 'Cookie Policy for TempMail Nova.',
    images: ['https://tempmailnova.com/logo.png'],
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', item: 'https://tempmailnova.com' },
          { name: 'Cookie Policy', item: 'https://tempmailnova.com/cookies' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12 text-slate-700 dark:text-slate-300 space-y-6 font-manrope">
        {/* Visual Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">Cookie Policy</span>
        </nav>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Cookie Policy</h1>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono-code font-bold">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm leading-relaxed bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-emerald-500/25 shadow-xl">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. What Are Cookies?</h3>
            <p>
              Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences, active session details, and improve user experience.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Essential Browser Storage</h3>
            <p>
              TempMail Nova uses browser LocalStorage to store your currently active temporary email address, selected theme (Light/Dark mode), and authorization tokens. This allows your temporary mailbox to remain open across browser page refreshes.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party & Advertising Cookies (Google AdSense)</h3>
            <p>
              Third party vendors, including Google AdSense, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. Managing & Disabling Cookies</h3>
            <p>
              You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this may affect how you are able to interact with our site and other websites.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

