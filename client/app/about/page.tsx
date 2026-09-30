import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { publicMetadata } from '../../lib/seo';

export const metadata = publicMetadata('/about', 'About TempMail Nova', 'What TempMail Nova is for, how the service works, the limits we are open about, how our guides are edited, and how to contact us.');

export default function AboutPage() {
  return (
    <div className="nova-public">
      <PageHeader
        crumbs={[{ name: 'About', path: '/about' }]}
        kicker="ABOUT"
        title="A temporary inbox for the sign-ups that do not need your real address"
        lede="TempMail Nova gives you a free, receive-only email address that lasts 24 hours. It exists so you can get a code, a link or a file without adding your personal address to one more mailing list."
      />
      <div className="nova-container page-body">
        <section className="split-section" aria-labelledby="why-heading">
          <div><h2 id="why-heading">Why it exists</h2></div>
          <div className="prose-nova">
            <p>Almost every website asks for an email address, even when you only need one message from it. Each time you hand over your personal address, it can end up in marketing sequences, partner lists and, occasionally, data breaches.</p>
            <p>A temporary inbox is a simple way to say no to that for low-stakes tasks. You get a working address instantly, use it once, and let it expire. Your personal inbox stays for the people and accounts that matter.</p>
          </div>
        </section>

        <section className="split-section" aria-labelledby="how-heading">
          <div><h2 id="how-heading">How the service works</h2><p>The short version. The details are on <Link href="/how-it-works" className="text-link">How it works</Link>.</p></div>
          <ul className="info-grid">
            <li className="info-card"><h3>No signup</h3><p>An address is created when you open the site. You can switch to a new random address or choose a custom one.</p></li>
            <li className="info-card"><h3>Receive only</h3><p>Messages to your address appear on the page automatically. You cannot send or reply from TempMail Nova.</p></li>
            <li className="info-card"><h3>24-hour mailboxes</h3><p>Each mailbox expires 24 hours after it is created. An automatic cleanup removes expired mailboxes and their messages.</p></li>
            <li className="info-card"><h3>Cleaned HTML</h3><p>Received HTML is sanitized to remove scripts before it is shown. Attachments download only when you choose.</p></li>
          </ul>
        </section>

        <section className="split-section" aria-labelledby="limits-heading">
          <div><h2 id="limits-heading">Limits we want you to know</h2><p>A temporary inbox is useful because it is simple. That simplicity has trade-offs.</p></div>
          <div className="prose-nova">
            <ul>
              <li><strong>It is not password-protected.</strong> Anyone who knows or guesses an address may be able to read what arrives there.</li>
              <li><strong>It cannot recover accounts.</strong> After a mailbox expires, password resets and security emails sent to it will not reach you.</li>
              <li><strong>Some websites do not accept it.</strong> Whether a site sends to a disposable address is the site&apos;s decision.</li>
              <li><strong>It is not anonymity.</strong> It keeps your email address from a website, not your IP address or other details.</li>
            </ul>
            <p>Please do not use it for banking, healthcare, government services, work, or anything you need to keep. Our <Link href="/blog/are-temporary-email-addresses-safe">safety guide</Link> explains why.</p>
          </div>
        </section>

        <section className="split-section" aria-labelledby="guides-heading">
          <div><h2 id="guides-heading">About our guides</h2></div>
          <div className="prose-nova">
            <p>The <Link href="/blog">guides</Link> answer practical questions about temporary email, privacy and email testing. They are published under the TempMail Nova editorial team byline rather than individual names.</p>
            <p>Statements about our own service are checked against how it actually works. Claims about other companies, standards or policies link to their sources, and each guide shows when it was published and when it was last substantially updated. If you spot something wrong or out of date, please tell us.</p>
          </div>
        </section>

        <section className="split-section" aria-labelledby="contact-heading">
          <div><h2 id="contact-heading">Get in touch</h2></div>
          <div className="prose-nova">
            <p>Questions, bug reports, abuse reports and corrections are welcome. Use the <Link href="/contact">contact form</Link> or email <a href="mailto:helptempmailnova@gmail.com">helptempmailnova@gmail.com</a>.</p>
            <div className="button-row">
              <Link href="/#generator" className="primary-link">Get free email <ArrowUpRight size={16} aria-hidden="true" /></Link>
              <Link href="/privacy" className="secondary-link">Read the privacy policy</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
