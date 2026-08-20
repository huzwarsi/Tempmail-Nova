import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  Clock,
  Cpu,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Smartphone,
  Shield,
  ArrowUp,
} from 'lucide-react';

export default function EducationalContent() {
  const scrollToGenerator = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featureCards = [
    {
      title: 'Instant Mailbox Creation',
      description: 'Generate a temporary email address instantly without creating an account, setting passwords, or providing personal phone numbers.',
      icon: Zap,
    },
    {
      title: 'Real-Time Email Delivery',
      description: 'Incoming emails appear in your browser automatically through WebSocket connections without requiring manual page refreshes.',
      icon: Mail,
    },
    {
      title: 'Automatic 24-Hour Cleanup',
      description: 'Received messages, headers, and attachments are automatically purged from database storage after 24 hours to prevent data retention.',
      icon: Clock,
    },
    {
      title: 'Privacy-Focused',
      description: 'No personal identification or registration details are collected to generate a disposable mailbox session.',
      icon: ShieldCheck,
    },
    {
      title: 'Mobile & Desktop Support',
      description: 'Access your disposable inbox on desktop browsers or scan a QR code to view incoming messages on mobile devices.',
      icon: Smartphone,
    },
    {
      title: 'HTML Email Sanitization',
      description: 'Received HTML emails are sanitized to strip inline scripts before rendering in the browser message viewer.',
      icon: Shield,
    },
  ];

  const comparisonRows = [
    { feature: 'Account Registration', temp: 'Not Required', regular: 'Required' },
    { feature: 'Personal Email Required', temp: 'No', regular: 'Yes' },
    { feature: 'Mailbox Lifetime', temp: 'Temporary (24h Auto-Purge)', regular: 'Permanent' },
    { feature: 'Long-Term Communication', temp: 'Not Recommended', regular: 'Supported' },
    { feature: 'One-Time Registrations', temp: 'Designed for One-Time Registrations', regular: 'Adds to Primary Inbox Marketing Lists' },
    { feature: 'Automatic Data Expiration', temp: 'Automated 24 Hours', regular: 'Manual Deletion' },
    { feature: 'Privacy Protection Use Case', temp: 'Helps Keep Primary Email Separate', regular: 'Uses Primary Personal Email Account' },
    { feature: 'Account Recovery Support', temp: 'Not Supported', regular: 'Fully Supported' },
  ];

  return (
    <section className="py-12 bg-white dark:bg-[#06090e] border-y border-slate-200 dark:border-emerald-500/20 font-manrope">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* H2: Why Choose TempMail Nova? */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Choose TempMail Nova?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Fast, zero-registration disposable email infrastructure built for instant message reception and privacy protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-200 dark:border-emerald-500/25 space-y-2.5 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{card.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* H2: What Is Temporary Email? */}
        <div className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-4 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            What Is Temporary Email?
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              A <strong>temporary email address</strong> (also referred to as disposable email, temp mail, or throwaway email) is a short-lived email inbox created without personal registration. It allows you to receive messages, verification links, and one-time passwords (OTPs) without revealing your primary email account.
            </p>
            <p>
              When signing up for online services, Wi-Fi access, or digital downloads, companies often add your email address to promotional lists or share it with third-party advertisers. Using a disposable temporary mailbox isolates your permanent inbox from marketing clutter and spam accumulation.
            </p>
          </div>
        </div>

        {/* H2: How Does TempMail Nova Work? */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Does TempMail Nova Work?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Our automated intake pipeline processes incoming emails in four straightforward steps.
            </p>
          </div>

          {/* 4-Step Process Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-[#080d16]/90 p-5 rounded-2xl border border-slate-200 dark:border-emerald-500/25 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold font-mono">
                Step 1
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Generate</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Open TempMail Nova to receive an automatically generated disposable email address or choose a custom alias.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#080d16]/90 p-5 rounded-2xl border border-slate-200 dark:border-emerald-500/25 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold font-mono">
                Step 2
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Receive</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Provide your temporary address during online registration. Incoming messages land on our Haraka SMTP intake server.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#080d16]/90 p-5 rounded-2xl border border-slate-200 dark:border-emerald-500/25 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold font-mono">
                Step 3
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Read</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Socket.io pushes incoming emails directly to your browser window so you can read messages and access verification codes instantly.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#080d16]/90 p-5 rounded-2xl border border-slate-200 dark:border-emerald-500/25 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold font-mono">
                Step 4
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Automatic Cleanup</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                All received messages, headers, and attachments are automatically deleted from server storage 24 hours after arrival.
              </p>
            </div>
          </div>

          {/* Technical Architecture Pipeline Overview */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-[#04060b] border border-slate-200 dark:border-emerald-500/20 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-x-auto text-center">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Architecture Flow:</span> External Sender &rarr; Haraka SMTP &rarr; Express Backend &rarr; Database &rarr; Socket.io WebSockets &rarr; Browser Inbox
          </div>
        </div>

        {/* H2: When Should You Use Temporary Email? */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            When Should You Use Temporary Email?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Use Cases */}
            <div className="bg-slate-50 dark:bg-[#080d16]/90 p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-3">
              <h3 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recommended Use Cases</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>One-time website signups and public Wi-Fi logins.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Downloading ebooks, whitepapers, or software trials.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Testing email signups, templates, and webhooks in development environments.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Avoiding unwanted marketing newsletters and spam lists.</span>
                </li>
              </ul>
            </div>

            {/* When NOT to Use Temporary Email */}
            <div className="bg-slate-50 dark:bg-[#080d16]/90 p-6 rounded-3xl border border-slate-200 dark:border-rose-500/25 space-y-3">
              <h3 className="text-sm font-extrabold text-rose-600 dark:text-rose-400 flex items-center space-x-2">
                <XCircle className="w-4 h-4" />
                <span>When NOT to Use Temporary Email</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Banking, credit cards, or financial accounts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Government portals, healthcare, or official documentation.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Primary social media or accounts requiring long-term recovery access.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Important personal or business communications.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* H2: Temporary Email vs Regular Email */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Temporary Email vs Regular Email
          </h2>
          <div className="overflow-x-auto border border-slate-200 dark:border-emerald-500/20 rounded-2xl bg-slate-50 dark:bg-[#080d16]/90">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-emerald-500/20 bg-slate-100 dark:bg-[#04060b]">
                  <th className="p-3.5 font-extrabold text-slate-900 dark:text-white">Feature</th>
                  <th className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">TempMail Nova</th>
                  <th className="p-3.5 font-extrabold text-slate-700 dark:text-slate-300">Regular Email (Gmail/Outlook)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-emerald-500/10">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="p-3.5 text-emerald-700 dark:text-emerald-300 font-medium">{row.temp}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{row.regular}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* H2: Privacy & Security */}
        <div className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Privacy & Security Architecture
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            TempMail Nova is built around minimal data retention principles. We do not require passwords, personal names, or user registration to generate a temporary email address. Incoming email content and file attachments are stored temporarily and automatically purged from our database after 24 hours. Received HTML contents are sanitized before display to strip executable script tags.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Link href="/privacy" className="hover:underline flex items-center space-x-1">
              <span>Read Privacy Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/terms" className="hover:underline flex items-center space-x-1">
              <span>Read Terms of Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/cookies" className="hover:underline flex items-center space-x-1">
              <span>Read Cookie Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* H2: Temporary Email Guides & Resources */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Temporary Email Guides & Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/how-it-works"
              className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500 transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <span>Learn How Temporary Email Works</span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
            </Link>
            <Link
              href="/faq"
              className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500 transition flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <span>Frequently Asked Questions</span>
              <ArrowRight className="w-4 h-4 text-emerald-500" />
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-6 bg-slate-100 dark:bg-[#04060b] rounded-3xl border border-slate-200 dark:border-emerald-500/20 space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Need a Quick Disposable Email?
          </h3>
          <button
            onClick={scrollToGenerator}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 dark:hover:from-emerald-400 dark:hover:to-teal-300 font-extrabold text-white dark:text-slate-950 text-xs transition shadow-lg shadow-emerald-500/20"
          >
            <span>Create a Free Temporary Email</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
