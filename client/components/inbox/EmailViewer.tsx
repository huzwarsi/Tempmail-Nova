'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Download, Paperclip, Code, Eye, FileText, Clock } from 'lucide-react';
import API from '../../lib/api';

interface EmailViewerProps {
  email: any;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export default function EmailViewer({ email, onBack, onDelete }: EmailViewerProps) {
  const [fullEmail, setFullEmail] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'raw'>('html');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email?._id) return;
    const fetchEmailDetail = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/email/message/${email._id}`);
        setFullEmail(data.email);
      } catch (err) {
        console.error('Failed to load email details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmailDetail();
  }, [email]);

  if (loading || !fullEmail) {
    return (
      <div className="w-full bg-white dark:bg-[#080d16]/90 backdrop-blur-xl rounded-2xl border-2 border-emerald-500/30 p-8 h-[600px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Loading email content...</p>
        </div>
      </div>
    );
  }

  const senderName = fullEmail.sender?.name || fullEmail.sender?.address || 'Sender';
  const initial = senderName.charAt(0).toUpperCase();

  return (
    <div className="w-full bg-white dark:bg-[#080d16]/90 backdrop-blur-xl rounded-2xl border-2 border-emerald-500/30 overflow-hidden flex flex-col h-[600px] shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-300 font-manrope">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-emerald-500/20 bg-slate-100 dark:bg-[#05080e] flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Back to Inbox</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Tab Selector */}
          <div className="flex items-center bg-slate-200 dark:bg-[#030509] p-1 rounded-xl border border-slate-300 dark:border-emerald-500/30 text-xs font-bold">
            <button
              onClick={() => setActiveTab('html')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition ${
                activeTab === 'html'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-black shadow-md'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition ${
                activeTab === 'text'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-black shadow-md'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition ${
                activeTab === 'raw'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-black shadow-md'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Headers</span>
            </button>
          </div>

          <button
            onClick={() => onDelete(fullEmail._id)}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 transition shadow-sm"
            title="Delete Message"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sender & Subject Information Block */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-emerald-500/20 bg-slate-50 dark:bg-[#060a12]/80 space-y-3">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
          {fullEmail.subject || '(No Subject)'}
        </h2>

        <div className="flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white dark:text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              {initial}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {fullEmail.sender?.name || 'Sender'}
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-mono-code text-[11px]">
                {fullEmail.sender?.address}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 font-mono-code text-xs bg-slate-200 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-emerald-500/25">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{new Date(fullEmail.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      {fullEmail.attachments && fullEmail.attachments.length > 0 && (
        <div className="px-6 py-3 bg-slate-100 dark:bg-[#04060b] border-b border-slate-200 dark:border-emerald-500/20 flex items-center space-x-3 overflow-x-auto">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center flex-shrink-0">
            <Paperclip className="w-4 h-4 mr-1.5" />
            Attachments ({fullEmail.attachments.length}):
          </span>
          {fullEmail.attachments.map((att: any) => (
            <a
              key={att.attachmentId}
              href={`/api/v1/email/attachment/${att.attachmentId}`}
              download={att.filename}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 text-xs font-semibold text-slate-800 dark:text-slate-200 transition flex-shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[150px]">{att.filename}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-code">({Math.round(att.size / 1024)} KB)</span>
            </a>
          ))}
        </div>
      )}

      {/* Body Renderer */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 dark:bg-[#04070d]/60">
        {activeTab === 'html' && (
          <div
            className="prose max-w-none text-slate-900 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: fullEmail.bodyHtml || fullEmail.bodyText }}
          />
        )}

        {activeTab === 'text' && (
          <pre className="whitespace-pre-wrap font-mono-code text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-[#030509] p-5 rounded-2xl border border-slate-200 dark:border-emerald-500/30 leading-relaxed overflow-x-auto shadow-inner">
            {fullEmail.bodyText || 'No plain text content available.'}
          </pre>
        )}

        {activeTab === 'raw' && (
          <div className="space-y-4 font-mono-code text-xs">
            <div>
              <h4 className="text-emerald-700 dark:text-emerald-400 font-bold mb-1.5">Message ID:</h4>
              <div className="bg-white dark:bg-[#030509] p-3 rounded-xl border border-slate-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                {fullEmail.messageId}
              </div>
            </div>
            <div>
              <h4 className="text-emerald-700 dark:text-emerald-400 font-bold mb-1.5">Raw Headers:</h4>
              <pre className="bg-white dark:bg-[#030509] p-4 rounded-2xl border border-slate-200 dark:border-emerald-500/30 text-slate-700 dark:text-slate-300 overflow-x-auto max-h-60 leading-relaxed">
                {fullEmail.rawHeaders || 'No raw header information.'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
