import React from 'react';
import { ShieldCheck, Zap, Clock, Sparkles } from 'lucide-react';
import GeneratorCard from '../inbox/GeneratorCard';

export default function Hero() {
  return (
    <div className="relative pt-4 sm:pt-6 pb-6 overflow-hidden font-manrope">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold font-mono mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>INSTANT DISPOSABLE MAILBOX</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 mb-3 leading-tight max-w-4xl mx-auto">
          Free <span className="text-emerald-600 dark:text-emerald-400">Temp Mail</span> & Temporary Email Generator
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-semibold leading-relaxed">
          Get a free temporary email address instantly. Use a disposable inbox to receive verification emails, OTPs, notifications, and other one-time messages without exposing your primary email address.
        </p>

        {/* Generator Card Widget */}
        <div className="mt-4 mb-5">
          <GeneratorCard />
        </div>

        {/* Factual Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-[11px] text-slate-600 dark:text-slate-400 font-semibold font-mono">
          <div className="flex items-center space-x-1.5 bg-slate-200/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-300 dark:border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Free & Privacy-Focused</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-200/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-300 dark:border-emerald-500/20">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Real-Time Live Inbox</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-200/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-300 dark:border-emerald-500/20">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>24h Auto-Purge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
