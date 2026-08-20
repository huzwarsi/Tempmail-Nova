import React from 'react';
import { Check, Zap } from 'lucide-react';

export default function Pricing() {
  return (
    <section className="py-12 bg-white dark:bg-[#05080d] transition-colors font-manrope">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            100% Free Forever
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            No credit card, no registration, no hidden costs.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-emerald-500/40 shadow-xl space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Free Anonymous Mailbox</h3>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            $0 <span className="text-xs text-slate-500 font-sans font-bold">/ forever</span>
          </div>
          <ul className="space-y-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Unlimited Temporary Email Addresses</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Instant Real-time WebSockets Inbox</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Custom Username & Domain Selection</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>File Attachments Support & Downloading</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>24-Hour Automated Message Purge</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
