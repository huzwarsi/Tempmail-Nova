import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbListJsonLd } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'Terms of Service | TempMail Nova',
  description:
    'Terms of Service governing the use of TempMail Nova temporary email services, retention rules, and acceptable use policy.',
  alternates: {
    canonical: 'https://tempmailnova.com/terms',
  },
  openGraph: {
    type: 'website',
    url: 'https://tempmailnova.com/terms',
    title: 'Terms of Service | TempMail Nova',
    description:
      'Terms of Service governing the use of TempMail Nova temporary email services, retention rules, and acceptable use policy.',
    siteName: 'TempMail Nova',
    images: [
      {
        url: 'https://tempmailnova.com/logo.png',
        width: 512,
        height: 512,
        alt: 'TempMail Nova Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | TempMail Nova',
    description: 'Terms of Service governing the use of TempMail Nova.',
    images: ['https://tempmailnova.com/logo.png'],
  },
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', item: 'https://tempmailnova.com' },
          { name: 'Terms of Service', item: 'https://tempmailnova.com/terms' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-12 text-slate-700 dark:text-slate-300 space-y-6 font-manrope">
        {/* Visual Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">Terms of Service</span>
        </nav>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono-code font-bold">Last Updated: August 2026</p>

        <div className="space-y-6 text-sm leading-relaxed bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-emerald-500/25 shadow-xl">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h3>
            <p>
              By accessing or using TempMail Nova, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Acceptable Use Policy</h3>
            <p>
              You agree to use TempMail Nova solely for lawful purposes. You must not use the service to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <li>Engage in any fraudulent or illegal activity.</li>
              <li>Receive or distribute illegal content or malware.</li>
              <li>Interfere with or disrupt the security or integrity of our network infrastructure.</li>
              <li>Attempt to bypass rate limits or system security measures.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Disclaimer of Warranties & Retention</h3>
            <p>
              TempMail Nova is provided on an "AS IS" and "AS AVAILABLE" basis. Received emails and attachments automatically expire after 24 hours. We do not guarantee permanent storage or receipt of critical financial or legal communications.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">4. Intellectual Property Rights</h3>
            <p>
              The service, including its original content, features, layout, and visual styling, is and will remain the exclusive property of TempMail Nova.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-slate-200 dark:border-emerald-500/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">5. Governing Law</h3>
            <p className="text-xs">
              These Terms shall be governed and construed in accordance with applicable laws without regard to conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

