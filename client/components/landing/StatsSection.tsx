'use client';

import React, { useState, useEffect } from 'react';
import API from '../../lib/api';
import { Mail, ShieldCheck, Zap, Server, Clock } from 'lucide-react';

export default function StatsSection() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const { data } = await API.get('/analytics/public');
        if (data && (data.activeMailboxes || data.messagesProcessed)) {
          setStats(data);
        }
      } catch (err) {
        // Leave stats null to display factual architecture metrics
      }
    };
    fetchPublicStats();
  }, []);

  return (
    <section className="py-10 bg-slate-100/80 dark:bg-[#05080e] border-y border-slate-200 dark:border-emerald-500/20 font-manrope">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#080d16] border border-slate-200 dark:border-emerald-500/25 shadow-sm space-y-1">
            <div className="inline-flex p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats?.activeMailboxes ? stats.activeMailboxes.toLocaleString() : 'Instant'}
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {stats?.activeMailboxes ? 'Active Temporary Mailboxes' : 'Disposable Inbox Generation'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#080d16] border border-slate-200 dark:border-emerald-500/25 shadow-sm space-y-1">
            <div className="inline-flex p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats?.messagesProcessed ? `${stats.messagesProcessed.toLocaleString()}+` : 'WebSocket Push'}
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {stats?.messagesProcessed ? 'Messages Processed' : 'Real-Time Live Email Delivery'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#080d16] border border-slate-200 dark:border-emerald-500/25 shadow-sm space-y-1">
            <div className="inline-flex p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              24-Hour Purge
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Automated Data Expiration</p>
          </div>
        </div>
      </div>
    </section>
  );
}
