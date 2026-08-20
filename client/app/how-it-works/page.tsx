import React from 'react';
import type { Metadata } from 'next';
import { Mail, Zap, Shield, Lock, Server, Cpu, RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbListJsonLd } from '../../lib/structured-data';

export const metadata: Metadata = {
  title: 'How It Works | TempMail Nova Disposable Mail Engine',
  description:
    'Understand the technical workflow behind real-time Haraka MX intake, WebSockets delivery, HTML sanitization, and automated 24-hour message purges.',
  alternates: {
    canonical: 'https://tempmailnova.com/how-it-works',
  },
  openGraph: {
    type: 'website',
    url: 'https://tempmailnova.com/how-it-works',
    title: 'How It Works | TempMail Nova Disposable Mail Engine',
    description:
      'Understand the technical workflow behind real-time Haraka MX intake, WebSockets delivery, HTML sanitization, and automated 24-hour message purges.',
    siteName: 'TempMail Nova',
    images: [
      {
        url: 'https://tempmailnova.com/logo.png',
        width: 512,
        height: 512,
        alt: 'How TempMail Nova Works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | TempMail Nova Disposable Mail Engine',
    description: 'Technical workflow of TempMail Nova high-throughput disposable email engine.',
    images: ['https://tempmailnova.com/logo.png'],
  },
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Instant Mailbox Generation',
      desc: 'When you open TempMail Nova, our client automatically generates a randomized temporary email address alias. No name, password, or registration is required.',
      icon: Mail,
    },
    {
      step: '02',
      title: 'High-Speed Haraka SMTP Ingestion',
      desc: 'When a third-party sender transmits an email, our dedicated Haraka SMTP mail servers process the incoming DNS MX traffic within milliseconds.',
      icon: Server,
    },
    {
      step: '03',
      title: 'Sanitization & Security Parsing',
      desc: 'The incoming MIME payload is stripped of malicious scripts, tracking pixels, and cross-site scripting risks before being saved to temporary encrypted storage.',
      icon: Shield,
    },
    {
      step: '04',
      title: 'Real-Time WebSockets Push',
      desc: 'Our backend uses Socket.io to push the new message payload directly into your active browser tab instantly with zero page reloads required.',
      icon: Zap,
    },
    {
      step: '05',
      title: 'Automated 24-Hour Destruction',
      desc: 'To protect your identity and minimize digital footprint, all emails, headers, and attachments are permanently purged after 24 hours.',
      icon: Lock,
    },
  ];

  return (
    <>
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', item: 'https://tempmailnova.com' },
          { name: 'How It Works', item: 'https://tempmailnova.com/how-it-works' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-manrope">
        {/* Visual Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">How It Works</span>
        </nav>

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>TECHNICAL WORKFLOW</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How TempMail Nova Works Under the Hood
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
            Discover how our high-throughput SMTP engines and WebSockets push technology deliver real-time disposable inboxes securely.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 shadow-xl"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-xs">
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span>{s.step}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 font-bold text-white dark:text-slate-950 transition text-xs shadow-lg shadow-emerald-500/25"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Your Free Temporary Email Now</span>
          </Link>
        </div>
      </div>
    </>
  );
}
