'use client';

import React, { useState } from 'react';
import { Copy, RefreshCw, Trash2, Edit3, QrCode, Check, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { trackEvent } from '../../lib/analytics';
const QRCodeSVG = dynamic(() => import('qrcode.react').then(module => module.QRCodeSVG), { ssr: false });
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
    isGenerating,
    inboxError,
  } = useInbox();

  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [customError, setCustomError] = useState('');

  const handleCopy = async () => {
    if (!currentAddress) return;
    setCustomError('');
    try { await navigator.clipboard.writeText(currentAddress); } catch { setCustomError('Could not copy. Select the address and copy it manually.'); return; }
    setCopied(true);
    trackEvent('copy_email');
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
    <div className="mail-studio">
      <div className="mail-studio-heading">
        <div className="mail-studio-title"><span className="mail-studio-icon"><Mail size={21} /></span><div><h2>Your temporary email</h2><p>A fresh start for your inbox.</p></div></div>
        <span className="mail-studio-status"><span className={currentAddress && !isGenerating ? 'ready' : ''} />{isGenerating ? 'Creating' : inboxError ? 'Check connection' : currentAddress ? 'Ready to receive' : 'Connecting'}</span>
      </div>
      {inboxError && <p role="alert" className="mail-studio-error">{inboxError}</p>}
      {customError && !customModalOpen && <p role="alert" className="mail-studio-error">{customError}</p>}
      <div className="mail-address-panel">
        <div className="mail-address-caption"><label htmlFor="temp-email-address">YOUR TEMPORARY EMAIL ADDRESS</label><ShieldCheck size={16} /></div>
        <div className="mail-address-row">
          <input id="temp-email-address" name="tempEmailAddress" type="text" readOnly spellCheck={false} aria-label="Your temporary email address" onFocus={event => event.target.select()} value={isGenerating ? 'Creating your address...' : currentAddress || (inboxError ? 'Connection unavailable' : 'Creating your address...')} />
          <button className="mail-copy" onClick={handleCopy} disabled={!currentAddress || isGenerating} aria-live="polite">{copied ? <Check size={18} /> : <Copy size={18} />}<span>{copied ? 'Copied!' : 'Copy email'}</span></button>
        </div>
        <div className="mail-address-bottom"><span>Copy it into a one-time signup.</span><button onClick={() => setQrModalOpen(true)} disabled={!currentAddress || isGenerating} aria-label="Scan email QR code"><QrCode size={15} /><span>QR code</span></button></div>
      </div>
      <div className="mail-actions">
        <button onClick={() => generateRandomInbox('new_address')} disabled={loading || isGenerating}><RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} /><span>{currentAddress ? 'New address' : 'Create free email'}</span></button>
        <button onClick={() => { setCustomError(''); setCustomModalOpen(true); }} disabled={loading || isGenerating}><Edit3 size={16} /><span>Custom address</span><ArrowUpRight size={13} className="action-arrow" /></button>
        <button onClick={() => fetchEmails(currentAddress, true)} disabled={loading || !currentAddress}><RefreshCw size={16} className={loading && !isGenerating ? 'animate-spin' : ''} /><span>Refresh inbox</span></button>
        <button className="mail-delete" onClick={deleteCurrentInbox} disabled={loading || !currentAddress}><Trash2 size={16} /><span>Delete</span></button>
      </div>
      <div className="mail-studio-footer"><span><ShieldCheck size={14} /> No signup required.</span><div className="mail-lifetime">{inboxDetails?.expiresAt ? <ExpirationTimer expiresAt={inboxDetails.expiresAt} /> : <span>Auto-deletes after 24 hours</span>}</div></div>

      {/* QR Modal */}
      <Modal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} title="Share this email address">
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-200">
            {qrModalOpen && <QRCodeSVG value={currentAddress || ''} size={190} />}
          </div>
          <p className="text-xs text-slate-600 text-center">Scan to copy the address. This does not open the inbox on another device.</p>
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
            <label htmlFor="custom-username" className="block text-xs font-bold text-slate-700 dark:text-emerald-400 mb-1.5 uppercase">
              Username / Alias
            </label>
            <input
              id="custom-username"
              name="customUsername"
              type="text"
              required
              placeholder="e.g. john.doe"
              value={customUsername}
              onChange={(e) => setCustomUsername(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono-code"
            />
          </div>
          <div>
            <label htmlFor="custom-domain" className="block text-xs font-bold text-slate-700 dark:text-emerald-400 mb-1.5 uppercase">
              Select Domain
            </label>
            <select
              id="custom-domain"
              name="selectedDomain"
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
