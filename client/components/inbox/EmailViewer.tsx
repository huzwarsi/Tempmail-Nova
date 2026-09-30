'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Download, Paperclip } from 'lucide-react';
import API from '../../lib/api';

interface EmailViewerProps {
  email: any;
  onBack: () => void;
  onDelete: (id: string) => void;
}

/* Base styles for the email document. The email's own <style> tags stay inside the frame. */
const FRAME_CSS = `
html,body{margin:0;padding:0;background:#fff}
body{padding:16px 20px 22px;color:#2c4337;font:15px/1.6 Manrope,Arial,sans-serif;overflow-wrap:anywhere;word-break:break-word;overflow-x:auto}
img{max-width:100%!important;height:auto!important;border:0}
table{max-width:100%!important}
pre{white-space:pre-wrap}
a{color:#286648}
.tmn-img-fallback{display:inline-block;padding:2px 6px;border:1px dashed #cfd9cc;border-radius:4px;color:#5f705a;font-size:12px}`;

/**
 * Renders the server-sanitized HTML in a sandboxed iframe. There is no `allow-scripts`, so nothing in
 * the email can run even if sanitizing missed something, and the email's CSS cannot restyle the site.
 * `allow-same-origin` only lets this page measure the frame's height and handle broken images.
 */
function HtmlBody({ html }: { html: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(240);
  const srcDoc = useMemo(() => {
    // Many templates (e.g. SendGrid) link images over http; request them over https on this https page.
    const body = html.replace(/(<img\b[^>]*?\bsrc\s*=\s*["']?)http:\/\//gi, '$1https://');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><base target="_blank"><style>${FRAME_CSS}</style></head><body>${body}</body></html>`;
  }, [html]);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let observer: ResizeObserver | undefined;
    const fit = () => { const doc = iframe.contentDocument; if (doc?.documentElement) setHeight(Math.max(120, doc.documentElement.scrollHeight)); };
    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.querySelectorAll('img').forEach(img => {
        const fail = () => {
          const alt = img.getAttribute('alt')?.trim();
          if (alt) { const span = doc.createElement('span'); span.className = 'tmn-img-fallback'; span.textContent = alt; img.replaceWith(span); }
          else img.style.display = 'none';
          fit();
        };
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
        else { img.addEventListener('error', fail, { once: true }); img.addEventListener('load', fit, { once: true }); }
        if (!img.getAttribute('src')) img.style.display = 'none';
      });
      observer = new ResizeObserver(fit);
      observer.observe(doc.body);
      fit();
    };
    iframe.addEventListener('load', onLoad);
    if (iframe.contentDocument?.readyState === 'complete' && iframe.contentDocument.body?.childNodes.length) onLoad();
    return () => { iframe.removeEventListener('load', onLoad); observer?.disconnect(); };
  }, [srcDoc]);

  return (
    <iframe
      ref={frame}
      className="mail-viewer-frame"
      title="Email message"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
      srcDoc={srcDoc}
      style={{ height }}
    />
  );
}

const URL_RE = /(https?:\/\/[^\s<>()"']+[^\s<>()"'.,;:!?])/g;

/** Plain text with web links made clickable. */
function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return <>{parts.map((part, i) => i % 2 === 1
    ? <a key={i} href={part} target="_blank" rel="noopener noreferrer nofollow">{part}</a>
    : <React.Fragment key={i}>{part}</React.Fragment>)}</>;
}

function formatSize(bytes: number) {
  if (!bytes) return '';
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function EmailViewer({ email, onBack }: EmailViewerProps) {
  const [fullEmail, setFullEmail] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!email?._id) return;
    let cancelled = false;
    setStatus('loading');
    API.get(`/email/message/${email._id}`)
      .then(({ data }) => { if (!cancelled) { setFullEmail(data.email); setStatus('ready'); } })
      .catch(err => { console.error('Failed to load email details:', err); if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [email]);

  const bodyHtml: string = (fullEmail?.bodyHtml || '').trim();
  const bodyText = useMemo(() => (fullEmail?.bodyText || '').trim().replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n'), [fullEmail]);

  const backButton = (
    <button type="button" onClick={onBack} className="mail-viewer-back">
      <ArrowLeft size={16} aria-hidden="true" />Back to inbox
    </button>
  );

  if (status !== 'ready' || !fullEmail) {
    return (
      <div className="mail-viewer">
        <div className="mail-viewer-toolbar">{backButton}</div>
        <div className="mail-viewer-state" role="status">
          {status === 'error'
            ? <><p>This message could not be loaded.</p><span>Check your connection and open it again. Messages are removed when the mailbox expires.</span></>
            : <><span className="mail-viewer-spinner" aria-hidden="true" /><p>Opening message…</p></>}
        </div>
      </div>
    );
  }

  const senderName = fullEmail.sender?.name || fullEmail.sender?.address || 'Unknown sender';
  const senderAddress = fullEmail.sender?.name ? fullEmail.sender?.address : '';
  const received = new Date(fullEmail.createdAt);
  const attachments: any[] = fullEmail.attachments || [];

  return (
    <article className="mail-viewer" aria-labelledby="mail-viewer-subject">
      <div className="mail-viewer-toolbar">{backButton}</div>

      <div className="mail-viewer-scroll" tabIndex={0} aria-label="Message">
      <header className="mail-viewer-head">
        <h2 id="mail-viewer-subject">{fullEmail.subject || '(No subject)'}</h2>
        <div className="mail-viewer-meta">
          <span className="mail-viewer-avatar" aria-hidden="true">{senderName.charAt(0).toUpperCase()}</span>
          <div className="mail-viewer-from">
            <strong>{senderName}</strong>
            {senderAddress && <span>{senderAddress}</span>}
          </div>
          <time dateTime={received.toISOString()}>{received.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time>
        </div>
      </header>

      {attachments.length > 0 && (
        <div className="mail-viewer-attachments">
          <span><Paperclip size={14} aria-hidden="true" />{attachments.length === 1 ? '1 attachment' : `${attachments.length} attachments`}<em>Only open files you were expecting.</em></span>
          <ul>
            {attachments.map((att: any) => (
              <li key={att.attachmentId}>
                <a href={`/api/v1/email/attachment/${att.attachmentId}`} download={att.filename} rel="nofollow">
                  <Download size={14} aria-hidden="true" />
                  <span className="mail-viewer-filename">{att.filename}</span>
                  {att.size ? <small>{formatSize(att.size)}</small> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={bodyHtml ? 'mail-viewer-body is-html' : 'mail-viewer-body'}>
        {bodyHtml
          ? <HtmlBody html={bodyHtml} />
          : bodyText
            ? <p className="mail-viewer-text"><LinkifiedText text={bodyText} /></p>
            : <p className="mail-viewer-empty">This message has no content.</p>}
      </div>
      </div>
    </article>
  );
}
