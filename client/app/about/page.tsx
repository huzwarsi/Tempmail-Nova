import React from 'react';
import type { Metadata } from 'next';
import { Mail, Shield, Zap, Globe, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | TempMail Nova',
  description:
    'Learn about TempMail Nova, our mission to safeguard online email privacy, and our high-speed disposable email infrastructure.',
  alternates: {
    canonical: 'https://tempmailnova.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-manrope">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold mb-3 font-mono">
          <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>ABOUT TEMPMAIL NOVA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          Empowering Online Privacy & Protection
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          TempMail Nova is a modern, high-speed disposable email platform designed to protect your personal mailbox from spam, trackers, and data breaches.
        </p>
      </div>

      <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xl">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Our Mission</h2>
        <p>
          In an era where almost every online service demands an email address before letting you view content or try a tool, personal inboxes have become overwhelmed with promotional newsletters, marketing spam, and tracking pixels.
        </p>
        <p>
          Our mission is simple: To give users full control over their digital footprint by providing instant, private, and zero-registration disposable mailboxes.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-4">Key System Capabilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#05080e] border border-slate-200 dark:border-emerald-500/20">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Real-Time Ingestion</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Incoming emails arrive instantly via WebSockets with zero page refreshes required.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#05080e] border border-slate-200 dark:border-emerald-500/20">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Automatic 24h Purge</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">All messages and parsed attachments are automatically destroyed after 24 hours.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#05080e] border border-slate-200 dark:border-emerald-500/20">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Multiple Domain Extensions</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Choose custom aliases and switch active domains to bypass email filters.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#05080e] border border-slate-200 dark:border-emerald-500/20">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">HTML Sanitization</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Built-in sanitization blocks malicious tracking scripts and phishing exploits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
