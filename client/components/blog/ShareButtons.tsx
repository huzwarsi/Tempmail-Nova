'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [status, setStatus] = useState('');
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${t}%20${u}` },
  ];

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setStatus('Link copied'); }
    catch { setStatus('Could not copy. Copy the link from the address bar.'); }
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="share-row">
      <span>Share this guide:</span>
      <ul>
        {links.map(l => <li key={l.name}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.name}<span className="sr-only"> (opens in a new tab)</span></a></li>)}
        <li><button type="button" onClick={copy}>{status === 'Link copied' ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}Copy link</button></li>
      </ul>
      <span role="status" className="share-status">{status}</span>
    </div>
  );
}
