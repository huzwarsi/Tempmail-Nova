'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';
import { ShieldAlert, Globe, Server, Activity, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAdminData = async () => {
      try {
        const statsRes = await API.get('/analytics/overview');
        setStats(statsRes.data);

        const domainRes = await API.get('/domain/all');
        setDomains(domainRes.data.domains || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      }
    };

    fetchAdminData();
  }, [user]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    setLoading(true);
    try {
      const { data } = await API.post('/domain/add', { name: newDomain });
      setDomains((prev) => [data.domain, ...prev]);
      setNewDomain('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add domain');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    try {
      await API.delete(`/domain/${id}`);
      setDomains((prev) => prev.filter((d) => d._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete domain');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-[#080d16]/90 backdrop-blur-xl rounded-3xl text-center space-y-4 border border-rose-200 dark:border-rose-500/30 shadow-xl font-manrope">
        <ShieldAlert className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Restricted</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Admin privileges are required to view system analytics and manage domain pools.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-manrope">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Administration</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage public domain extensions and inspect real-time system metrics.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-400 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-2 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Active Domains</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{domains.length}</p>
        </div>

        <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-2 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Server className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Total Inboxes</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats?.totalInboxes || 0}</p>
        </div>

        <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-2 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Messages Received</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats?.totalEmails || 0}</p>
        </div>
      </div>

      {/* Domain Management */}
      <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Domain Pool Management</span>
        </h3>

        <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3">
          <input
            id="new-domain-input"
            name="newDomain"
            aria-label="New Domain Name"
            type="text"
            placeholder="New Domain (e.g. mailboxnova.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-code"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-bold text-white dark:text-slate-950 transition text-xs shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Domain</span>
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-400/80 font-mono uppercase">
                <th className="pb-3">Domain Name</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-emerald-500/10 text-slate-700 dark:text-slate-300">
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-slate-500">
                    No active domain extensions found in pool.
                  </td>
                </tr>
              ) : (
                domains.map((d) => (
                  <tr key={d._id}>
                    <td className="py-3 font-bold text-slate-900 dark:text-white font-mono-code">@{d.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 font-mono text-[10px] border border-emerald-300 dark:border-emerald-500/30">
                        {d.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteDomain(d._id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete Domain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
