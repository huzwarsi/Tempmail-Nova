import React from 'react';
import Link from 'next/link';
import { Mail, Shield, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-emerald-500/20 bg-slate-100 dark:bg-[#04060b] py-12 text-slate-600 dark:text-slate-400 transition-colors font-manrope">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                TempMail <span className="text-emerald-600 dark:text-emerald-400">Nova</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Modern next-gen disposable email platform. Protect your privacy and keep spam away from your personal inbox.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Free & Unlimited Mailboxes</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Temp Mail Generator
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Blog & Articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  FAQ Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">
              Security & Auto-Purge
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              All received emails are automatically purged after 24 hours. Your privacy and security remain strictly protected.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400/80 font-mono">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>HTTPS Secured Connection</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-emerald-500/20 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TempMail Nova. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <span className="text-emerald-700 dark:text-emerald-400/80 font-mono">Free & Privacy Focused</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
