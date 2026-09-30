import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
export default function Footer() {
  return <footer className="nova-footer"><div className="nova-container"><div className="footer-top"><div><Link href="/" className="nova-brand"><span className="brand-mark"><Mail size={21} /></span><span>tempmail<span className="brand-nova">nova</span><span className="brand-period">.</span></span></Link><p>A temporary inbox. A little more peace of mind.</p></div><div className="footer-links"><Link href="/how-it-works">How it works</Link><Link href="/blog">Guides</Link><Link href="/faq">FAQ</Link><Link href="/about">About us</Link><Link href="/contact">Get in touch <ArrowUpRight size={14} /></Link></div></div><div className="footer-bottom"><span>&copy; {new Date().getFullYear()} TempMail Nova</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link></div><span>Less spam. More space.</span></div></div></footer>;
}
