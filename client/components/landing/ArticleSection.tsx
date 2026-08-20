import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export default function ArticleSection() {
  return (
    <section className="py-16 bg-white dark:bg-[#06090e] border-y border-slate-200 dark:border-emerald-500/20 transition-colors font-manrope">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold mb-3 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>EDUCATIONAL GUIDE & PRIVACY RESOURCES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            The Ultimate Guide to Disposable Email & Online Privacy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Learn how temporary email addresses keep your personal mailbox safe from spam, data leaks, and intrusive web tracking.
          </p>
        </div>

        {/* Article Grid / Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-4 shadow-sm dark:shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                What is Temporary Mail and Why Do You Need It?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every time you register on a new website, forum, or online service, your personal email address is stored in central databases. These databases are frequently targeted by advertisers, spammers, and malicious hackers.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A temporary disposable email address acts as an instant protective shield. It provides a real mailbox where verification links and OTPs arrive instantly, allowing you to complete signups without ever exposing your primary email.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/blog/what-is-temporary-email"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Read complete guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-4 shadow-sm dark:shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Preventing Email Spam and Phishing Attacks
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Spam emails account for over 45% of global email traffic. Once your email address gets added to a marketing list, stopping the influx of junk mail becomes nearly impossible.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                By using TempMail Nova for one-off registrations, wifi logins, and ebook downloads, your personal inbox remains clean and protected from promotional spam and unsolicited newsletters.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/blog/protect-inbox-from-spam"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Learn 10 spam protection habits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-4 shadow-sm dark:shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Automated 24-Hour Purge & Security
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our infrastructure automatically purges received messages, headers, and attachments 24 hours after arrival. This guarantees that no residual data is left stored on servers indefinitely.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Additionally, HTML content is automatically sanitized before display to prevent malicious tracking pixels and cross-site scripting vulnerabilities.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/blog/how-temporary-email-works"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Explore security architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-4 shadow-sm dark:shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Instant Web Testing & Free Mailbox Generation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether you are testing web forms, registering for trial offers, or verifying account signups, TempMail Nova delivers instant temporary addresses with zero configuration.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                With real-time WebSockets integration, incoming messages and attachments appear right in your browser list the moment they are sent.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/blog/temporary-email-vs-permanent-email"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Compare temporary vs permanent mail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
