import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Page Not Found | TempMail Nova',
  description: 'The requested page could not be found on TempMail Nova.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 font-manrope">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-emerald-500/25 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            ERROR 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 font-bold text-white dark:text-slate-950 transition text-xs shadow-lg shadow-emerald-500/25"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold transition text-xs border border-slate-200 dark:border-slate-800"
          >
            <Mail className="w-4 h-4" />
            <span>Read Privacy Guides</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
