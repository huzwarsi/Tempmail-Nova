'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Client-only CTA button that scrolls to top (generator).
 * Extracted so EducationalContent can remain a Server Component.
 */
export default function ScrollToTopCTA() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 dark:hover:from-emerald-400 dark:hover:to-teal-300 font-extrabold text-white dark:text-slate-950 text-xs transition shadow-lg shadow-emerald-500/20"
    >
      <span>Create a Free Temporary Email</span>
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
