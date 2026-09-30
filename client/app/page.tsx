import Hero from '../components/landing/Hero';
import GeneratorCard from '../components/inbox/GeneratorCard';
import InboxSection from '../components/inbox/InboxSection';
import LandingDetails from '../components/landing/LandingDetails';
import FAQ from '../components/landing/FAQ';
import Link from 'next/link';
import { Check, ArrowUpRight } from 'lucide-react';
import { publicMetadata, HOME_TITLE, HOME_DESCRIPTION } from '../lib/seo';
import { WebApplicationJsonLd } from '../lib/structured-data';

export const metadata = publicMetadata('', HOME_TITLE, HOME_DESCRIPTION);

export default function HomePage() {
  return (
    <div className="nova-landing">
      <WebApplicationJsonLd />
      <section className="nova-hero" aria-labelledby="hero-heading">
        <div className="nova-container">
          <Hero />
          <div className="mail-workspace" id="generator" data-nosnippet>
            <GeneratorCard />
            <InboxSection />
          </div>
          <ul className="trust-strip" aria-label="Mailbox features">
            {['No signup required', 'Free to use', '24-hour mailbox', 'Automatic inbox updates'].map(text => <li key={text}><Check size={14} aria-hidden="true" />{text}</li>)}
          </ul>
        </div>
      </section>
      <LandingDetails />
      <FAQ compact />
      <section className="final-cta nova-container" aria-labelledby="final-cta-heading">
        <div><span className="section-kicker">ONE LESS THING IN YOUR PERSONAL INBOX</span><h2 id="final-cta-heading">A temporary address. A little more space.</h2><p>Get the email you need, without another permanent signup.</p></div>
        <Link href="#generator" className="primary-link">Get free email <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
