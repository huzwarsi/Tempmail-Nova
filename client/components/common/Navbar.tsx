'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Mail, Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/#how-it-works', label: 'How it works', event: 'click_how_it_works' },
  { href: '/blog', label: 'Guides', event: 'click_guide' },
  { href: '/faq', label: 'FAQ' },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <header className="nova-header">
      <nav className="nova-container nav-inner" aria-label="Main navigation">
        <Link href="/" className="nova-brand" aria-label="TempMail Nova home"><span className="brand-mark"><Mail size={21} aria-hidden="true" /></span><span>tempmail<span className="brand-nova">nova</span><span className="brand-period">.</span></span></Link>
        <div className="desktop-links">{links.map(link => <Link key={link.href} href={link.href} data-track={link.event} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}</div>
        <Link href="/#generator" className="nav-cta">Get free email <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <button ref={toggle} className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </nav>
      {open && <nav aria-label="Mobile navigation" id="mobile-navigation" className="mobile-links">{links.map(link => <Link key={link.href} href={link.href} data-track={link.event} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link href="/#generator" onClick={() => setOpen(false)}>Get free email</Link></nav>}
    </header>
  );
}
