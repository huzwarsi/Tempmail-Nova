import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbListJsonLd } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'Privacy Policy | TempMail Nova',
  description:
    'Read the official TempMail Nova Privacy Policy detailing GDPR, CCPA, log files, cookie usage, and automated 24-hour mail deletion.',
  alternates: {
    canonical: 'https://tempmailnova.com/privacy',
  },
  openGraph: {
    type: 'website',
    url: 'https://tempmailnova.com/privacy',
    title: 'Privacy Policy | TempMail Nova',
    description:
      'Read the official TempMail Nova Privacy Policy detailing GDPR, CCPA, log files, cookie usage, and automated 24-hour mail deletion.',
    siteName: 'TempMail Nova',
    images: [
      {
        url: 'https://tempmailnova.com/logo.png',
        width: 512,
        height: 512,
        alt: 'TempMail Nova Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | TempMail Nova',
    description: 'Read the official TempMail Nova Privacy Policy.',
    images: ['https://tempmailnova.com/logo.png'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', item: 'https://tempmailnova.com' },
          { name: 'Privacy Policy', item: 'https://tempmailnova.com/privacy' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12 text-slate-700 dark:text-slate-300 space-y-6 font-manrope">
        {/* Visual Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">Privacy Policy</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono-code font-bold">Effective Date: August 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 shadow-xl">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Introduction & Overview</h3>
            <p>
              At TempMail Nova, protecting your privacy is our core priority. This Privacy Policy document contains types of information that is collected and recorded by TempMail Nova and how we use it.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Log Files & Automated Purging</h3>
            <p>
              TempMail Nova follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
            </p>
            <p className="font-bold text-emerald-700 dark:text-emerald-400">
              Note on Mail Privacy: All incoming email messages, header details, plain text, HTML bodies, and parsed file attachments are stored temporarily and automatically purged from our servers after 24 hours.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Cookies & Google AdSense DoubleClick DART Cookies</h3>
            <p>
              Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to tempmailnova.com and other sites on the internet.
            </p>
            <p>
              Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-emerald-700 dark:text-emerald-400 underline font-bold">https://policies.google.com/technologies/ads</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Third-Party Advertising Partners</h3>
            <p>
              Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on TempMail Nova.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">5. GDPR & CCPA Data Protection Rights</h3>
            <p>
              We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>The right to access – You have the right to request copies of your personal data.</li>
              <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
              <li>The right to erasure – You have the right to request that we erase your personal data under certain conditions.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-200 dark:border-emerald-500/20">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">6. Contact Information</h3>
            <p className="text-xs">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <span className="font-mono-code text-emerald-700 dark:text-emerald-400 font-bold">tempmailnova@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

