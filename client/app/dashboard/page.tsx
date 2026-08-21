'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';
import { Key, Plus, Copy, Check, Shield } from 'lucide-react';

export default function DeveloperDashboardPage() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [keyName, setKeyName] = useState('');
  const [newGeneratedKey, setNewGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setApiKeys(data.apiKeys || []);
      } catch (err) {
        console.warn('Failed to load user profile');
      }
    };
    fetchUserData();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/api-keys', { name: keyName || 'My Application Key' });
      setNewGeneratedKey(data.apiKey.key);
      setApiKeys((prev) => [data.apiKey, ...prev]);
      setKeyName('');
    } catch (err) {
      console.error('Failed to create key:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    if (!newGeneratedKey) return;
    navigator.clipboard.writeText(newGeneratedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-[#080d16]/90 backdrop-blur-xl rounded-3xl text-center space-y-4 border border-slate-200 dark:border-emerald-500/30 shadow-xl font-manrope">
        <Shield className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Please sign in to access your Developer Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-manrope">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white dark:text-slate-950 text-2xl font-black shadow-lg">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono-code">{user.email}</p>
            <div className="mt-2 inline-flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 font-mono text-[10px] uppercase font-bold border border-emerald-300 dark:border-emerald-500/30">
                PLAN: {user.plan?.toUpperCase() || 'FREE'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/15 text-teal-800 dark:text-teal-400 font-mono text-[10px] uppercase font-bold border border-teal-300 dark:border-teal-500/30">
                ROLE: {user.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer API Keys Management */}
      <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Developer API Keys</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Use these keys to authenticate REST API calls.</p>
          </div>
        </div>

        {/* Generate Key Form */}
        <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-3">
          <input
            id="key-name-input"
            name="keyName"
            aria-label="API Key Name"
            type="text"
            placeholder="Key Name (e.g. Testing App)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-code"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 font-bold text-white dark:text-slate-950 transition text-xs shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Key</span>
          </button>
        </form>

        {/* Newly Generated Secret Banner */}
        {newGeneratedKey && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block uppercase">
              ⚠️ SAVE YOUR API KEY NOW (It won't be shown again):
            </span>
            <div className="flex items-center justify-between bg-white dark:bg-[#04070d] p-3 rounded-xl border border-slate-200 dark:border-emerald-500/30">
              <code className="text-xs font-mono-code text-emerald-800 dark:text-emerald-300 truncate">{newGeneratedKey}</code>
              <button
                onClick={copyKey}
                className="flex items-center space-x-1 text-xs text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 px-3 py-1.5 rounded-lg transition hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Existing Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-400/80 font-mono uppercase">
                <th className="pb-3">Name</th>
                <th className="pb-3">Key Prefix</th>
                <th className="pb-3">Created</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-emerald-500/10 text-slate-700 dark:text-slate-300">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    No active API keys found. Click "Generate New Key" above.
                  </td>
                </tr>
              ) : (
                apiKeys.map((k) => (
                  <tr key={k._id || k.id}>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{k.name}</td>
                    <td className="py-3 font-mono-code text-emerald-700 dark:text-emerald-400">{k.prefix || 'tm_****'}...</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{new Date(k.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 font-mono text-[10px] border border-emerald-300 dark:border-emerald-500/30">
                        ACTIVE
                      </span>
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
