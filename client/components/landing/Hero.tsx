import React from 'react';
import { ShieldCheck, Zap, Clock, Sparkles } from 'lucide-react';
import GeneratorCard from '../inbox/GeneratorCard';

export default function Hero() {
  return (
    <div className="relative pt-4 sm:pt-6 pb-6 overflow-hidden font-manrope">
      {/* Ambient Green Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold font-mono mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>INSTANT DISPOSABLE MAILBOX</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mt-1 mb-3 sm:mb-4 leading-tight max-w-5xl mx-auto">
          Free <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent">Temp Mail</span> & Temporary Email Generator
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
