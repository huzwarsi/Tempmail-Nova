'use client';

import React, { useState } from 'react';
import { Mail, Search, Paperclip, AlertTriangle, RefreshCw, Inbox as InboxIcon, RotateCw, Sparkles } from 'lucide-react';
import { useInbox } from '../../context/InboxContext';

const getAvatarGradient = (str = 'S') => {
  const gradients = [
    'from-emerald-500 to-teal-600',
    'from-green-500 to-emerald-600',
    'from-teal-500 to-cyan-600',
    'from-emerald-400 to-green-600',
  ];
  let charCodeSum = 0;
  for (let i = 0; i < str.length; i++) charCodeSum += str.charCodeAt(i);
  return gradients[charCodeSum % gradients.length];
};

export default function InboxList() {
  const { emails, selectedEmail, setSelectedEmail, loading, fetchEmails, currentAddress, newEmailNotice } = useInbox();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmails = emails.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.subject?.toLowerCase().includes(term) ||
      e.sender?.address?.toLowerCase().includes(term) ||
      e.sender?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full bg-white/95 dark:bg-[#080d16]/90 backdrop-blur-xl rounded-2xl border-2 border-emerald-500/30 overflow-hidden flex flex-col h-[600px] shadow-xl shadow-slate-200/50 dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-300">
      {/* Top Header Controls */}
      <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 dark:border-emerald-500/20 bg-slate-100/90 dark:bg-[#05080e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <InboxIcon className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-wide">Live Messages</h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-extrabold border border-emerald-500/30 font-mono">
            {emails.length}
          </span>
          {newEmailNotice && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold animate-bounce border border-emerald-500/40 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>New Mail Arrived!</span>
            </span>
          )}
        </div>

        {/* Search & Refresh Actions */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="inbox-search-input"
              name="searchInbox"
              aria-label="Search inbox messages"
              type="text"
              placeholder="Search inbox..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-[#030509] border border-slate-300 dark:border-emerald-500/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>
          <button
            onClick={() => fetchEmails(currentAddress)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-300 dark:border-emerald-500/30 transition shadow-sm"
            title="Refresh Inbox"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Modern Header Row */}
      <div className="bg-slate-200/80 dark:bg-[#04060b] text-emerald-800 dark:text-emerald-400/80 px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-widest flex items-center justify-between border-b border-slate-300 dark:border-emerald-500/20 font-mono">
        <div className="w-1/3 truncate">SENDER</div>
        <div className="w-1/2 truncate px-2">SUBJECT</div>
        <div className="w-1/6 text-right truncate">TIME</div>
      </div>

      {/* Mail List Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-emerald-500/10 bg-white/60 dark:bg-[#060a12]/60">
        {loading && emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-slate-500 dark:text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400/80">Syncing with mail server...</p>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl border border-slate-200 dark:border-emerald-500/30 bg-slate-100/80 dark:bg-slate-950/80 flex items-center justify-center relative shadow-inner">
              <RotateCw
                className="w-14 h-14 text-emerald-500/20 absolute animate-spin"
                style={{ animationDuration: '10s' }}
              />
              <Mail className="w-7 h-7 text-emerald-600 dark:text-emerald-400 z-10" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-800 dark:text-white text-base tracking-tight">
                Your inbox is empty
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Waiting for incoming emails, verification codes, or messages...
              </p>
            </div>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isSelected = selectedEmail?._id === email._id;
            const senderName = email.sender?.name || email.sender?.address || 'Unknown';
            const initial = senderName.charAt(0).toUpperCase();
            const avatarGrad = getAvatarGradient(senderName);

            return (
              <div
                key={email._id}
                onClick={() => setSelectedEmail(email)}
                className={`px-5 py-3.5 transition duration-200 cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-emerald-50 border-l-4 border-emerald-600 dark:bg-emerald-500/15 dark:border-emerald-400'
                    : !email.isRead
                    ? 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900/90'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                {/* Sender Column */}
                <div className="w-1/3 flex items-center space-x-3 overflow-hidden pr-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${avatarGrad} flex items-center justify-center text-white dark:text-slate-950 text-xs font-black shadow-md flex-shrink-0`}
                  >
                    {initial}
                  </div>
                  <div className="truncate">
                    <span
                      className={`text-xs truncate block ${
                        !email.isRead
                          ? 'text-slate-900 dark:text-white font-black'
                          : 'text-slate-600 dark:text-slate-300 font-medium'
                      }`}
                    >
                      {senderName}
                    </span>
                  </div>
                </div>

                {/* Subject & Snippet */}
                <div className="w-1/2 overflow-hidden px-2">
                  <div className="flex items-center space-x-2">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {email.subject || '(No Subject)'}
                    </h5>
                    {email.isSpam && (
                      <span className="flex items-center text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 px-1.5 py-0.5 rounded font-extrabold border border-rose-300 dark:border-rose-500/30">
                        <AlertTriangle className="w-3 h-3 mr-0.5" /> SPAM
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {email.snippet}
                  </p>
                </div>

                {/* Time & Attachments */}
                <div className="w-1/6 text-right flex flex-col items-end space-y-1">
                  <span className="text-[11px] font-mono-code text-slate-500 dark:text-slate-400">
                    {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {email.attachmentsCount > 0 && (
                    <span className="flex items-center text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-500/30">
                      <Paperclip className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                      {email.attachmentsCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
