'use client';

import React, { useState } from 'react';
import { Copy, RefreshCw, Trash2, Edit3, QrCode, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useInbox } from '../../context/InboxContext';
import Modal from '../common/Modal';
import ExpirationTimer from './ExpirationTimer';

export default function GeneratorCard() {
  const {
    currentAddress,
    inboxDetails,
    availableDomains,
    generateRandomInbox,
    createCustomInbox,
    deleteCurrentInbox,
    fetchEmails,
    loading,
  } = useInbox();

  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [customError, setCustomError] = useState('');

  const handleCopy = () => {
    if (!currentAddress) return;
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');
    try {
      await createCustomInbox(customUsername, selectedDomain);
      setCustomModalOpen(false);
      setCustomUsername('');
    } catch (err: any) {
      setCustomError(err.response?.data?.message || 'Failed to create custom email address');
    }
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto cyber-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300">
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Status Bar */}
      <div className="flex flex-row items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-200 dark:border-emerald-500/20">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-md shadow-emerald-500/50"></span>
          </span>
          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase font-mono">
            Live Mailbox Active
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCustomModalOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 transition shadow-sm"
          >
            <Edit3 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Custom Address</span>
          </button>
          <button
            onClick={() => setQrModalOpen(true)}
            className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 transition shadow-sm"
            title="Scan QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Email Box Container */}
      <div className="space-y-2 mb-4">
        <label className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400/90 uppercase tracking-widest font-mono">
          YOUR TEMPORARY EMAIL ADDRESS:
        </label>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1 group">
            <input
              type="text"
              readOnly
              value={currentAddress || 'Generating email address...'}
              className="w-full bg-white dark:bg-[#04070d] border-2 border-emerald-500/50 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono-code text-slate-900 dark:text-emerald-300 font-bold tracking-wide shadow-inner truncate transition-all duration-200 group-hover:border-emerald-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl font-bold text-white dark:text-slate-950 shadow-lg transition transform active:scale-95 text-xs tracking-wide ${copied
                ? 'bg-emerald-700 dark:bg-emerald-400 shadow-emerald-500/40'
                : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:via-emerald-400 dark:to-teal-400 dark:hover:from-emerald-400 dark:hover:to-teal-300 shadow-emerald-500/30'
              }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Buttons & Expiration Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={generateRandomInbox}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-emerald-500/25 transition shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Random Address</span>
          </button>

          <button
            onClick={() => fetchEmails(currentAddress)}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-emerald-500/25 transition shadow-sm"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-600 dark:text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={deleteCurrentInbox}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 transition shadow-sm"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>

        <div className="w-full sm:w-52 mt-1 sm:mt-0">
          <ExpirationTimer expiresAt={inboxDetails?.expiresAt} />
        </div>
      </div>

      {/* QR Modal */}
      <Modal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} title="Scan Email QR Code">
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-200">
            <QRCodeSVG value={currentAddress || ''} size={190} />
          </div>
          <p className="text-xs font-mono-code text-emerald-700 dark:text-emerald-400 text-center font-bold">{currentAddress}</p>
        </div>
      </Modal>

      {/* Custom Address Modal */}
      <Modal isOpen={customModalOpen} onClose={() => setCustomModalOpen(false)} title="Create Custom Email Address">
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          {customError && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-400 rounded-xl">
              {customError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-400 mb-1.5 uppercase">
              Username / Alias
            </label>
            <input
              type="text"
              required
              placeholder="e.g. john.doe"
              value={customUsername}
              onChange={(e) => setCustomUsername(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono-code"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-emerald-400 mb-1.5 uppercase">
              Select Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Default Domain</option>
              {availableDomains.map((d) => (
                <option key={d.name} value={d.name}>
                  @{d.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 dark:hover:from-emerald-400 dark:hover:to-teal-300 font-extrabold text-white dark:text-slate-950 transition shadow-lg shadow-emerald-500/25 text-sm"
          >
            Create Address
          </button>
        </form>
      </Modal>
    </div>
  );
}
