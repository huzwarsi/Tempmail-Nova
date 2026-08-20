import React from 'react';
import { Shield, Zap, Lock, Mail, Clock, RefreshCw } from 'lucide-react';

export default function Testimonials() {
  const capabilities = [
    {
      title: 'Instant Mailbox Creation',
      description: 'Generate temporary email addresses on demand without filling out forms, creating passwords, or providing personal phone numbers.',
      icon: Zap,
    },
    {
      title: 'Real-Time Message Delivery',
      description: 'Incoming emails land in your browser instantly via WebSocket connections without needing manual page refreshes.',
      icon: Mail,
    },
    {
      title: '24-Hour Automated Cleanup',
      description: 'Received messages, headers, and attachments are automatically deleted after 24 hours to prevent data accumulation.',
      icon: Clock,
    },
  ];

  return (
    <section className="py-12 bg-slate-50/50 dark:bg-[#06090e] transition-colors font-manrope">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold mb-3 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>CORE PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Privacy & Speed
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{c.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {c.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
