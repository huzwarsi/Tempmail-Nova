import React from 'react';
import { Zap, ShieldCheck, Clock, RefreshCw, QrCode, Lock } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Instant WebSockets Delivery',
      desc: 'Incoming messages arrive in your inbox in real-time with zero manual page reloads required.',
    },
    {
      icon: ShieldCheck,
      title: '100% Anonymous & Private',
      desc: 'No personal details, phone numbers, or passwords are ever required to generate a temporary email.',
    },
    {
      icon: Clock,
      title: 'Automated 24h Purge',
      desc: 'All messages, headers, and attachments are automatically deleted after 24 hours to safeguard your data.',
    },
    {
      icon: RefreshCw,
      title: 'Custom Email Aliases',
      desc: 'Create personalized usernames and switch between public domains to bypass restrictive registration forms.',
    },
    {
      icon: QrCode,
      title: 'Mobile QR Code Scan',
      desc: 'Scan the instant QR code to transfer your temporary mailbox directly to any mobile smartphone or tablet.',
    },
    {
      icon: Lock,
      title: 'HTML & Script Sanitization',
      desc: 'Built-in security blocks tracking pixels, malware links, and cross-site scripting vulnerabilities.',
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-[#05080d] transition-colors font-manrope">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Choose TempMail Nova?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Designed for high-speed temporary email ingestion, robust privacy protection, and seamless user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-3 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
