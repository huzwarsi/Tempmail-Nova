import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { publicMetadata } from '../../lib/seo';

export const metadata = publicMetadata('/how-it-works', 'How TempMail Nova Works', 'How to get a temporary email address, copy it, receive messages and what happens when the 24-hour mailbox expires, plus the technical details for the curious.');

export default function HowItWorksPage() {
  return (
    <div className="nova-public">
      <PageHeader
        crumbs={[{ name: 'How it works', path: '/how-it-works' }]}
        kicker="HOW IT WORKS"
        title="From a new address to your first message"
        lede="Getting a temporary inbox takes a few seconds. Here is what to do, what to expect while you wait, and what happens when the mailbox expires."
      />
      <div className="nova-container page-body">
        <section className="split-section" aria-labelledby="steps-heading">
          <div><h2 id="steps-heading">Using your inbox</h2><p>Everything happens on the <Link href="/" className="text-link">homepage</Link>.</p></div>
          <ol className="info-steps">
            <li><h3>Open the page</h3><p>A random address is created for you. Choose <strong>New address</strong> for a different one, or <strong>Custom address</strong> to pick the name and an available domain.</p></li>
            <li><h3>Copy the address</h3><p>Select <strong>Copy email</strong> and paste it into the form that asked for an email. On a phone, you can also show the address as a QR code; the code contains only the address, not access to your inbox.</p></li>
            <li><h3>Wait on the page</h3><p>New messages appear automatically. <strong>Refresh inbox</strong> checks immediately if you prefer. Most messages arrive quickly, but the timing is controlled by the website that sends them.</p></li>
            <li><h3>Read, download, move on</h3><p>Open a message to read it with its formatting and images, follow its links, or download attachments. Choose <strong>Delete</strong> to remove the mailbox and its messages and start with a new address.</p></li>
          </ol>
        </section>

        <section className="split-section" aria-labelledby="expiry-heading">
          <div><h2 id="expiry-heading">Expiry and deletion</h2></div>
          <div className="prose-nova">
            <p>Each mailbox expires <strong>24 hours after it is created</strong>, and the page shows a countdown. After that, you can no longer see its messages, and an automatic cleanup removes the mailbox, messages and attachments. The cleanup runs in the background, so removal can happen a little after the timer reaches zero.</p>
            <p>If you open the site again on the same browser before expiry, it tries to reopen your current address. Save anything you need before the timer runs out.</p>
          </div>
        </section>

        <section className="split-section" aria-labelledby="not-arrived-heading">
          <div><h2 id="not-arrived-heading">If nothing arrives</h2></div>
          <div className="prose-nova">
            <ol>
              <li>Check that the address you pasted matches the one on the page.</li>
              <li>Wait a minute and select Refresh inbox. Some senders queue messages.</li>
              <li>Make sure you have not switched to a new address since you used it.</li>
              <li>Some websites do not send to disposable addresses. If nothing arrives after a few minutes, that is the likely reason.</li>
            </ol>
            <p>More detail in <Link href="/blog/temporary-email-for-otp">using temporary email for verification codes</Link>.</p>
          </div>
        </section>

        <section className="split-section" aria-labelledby="privacy-heading">
          <div><h2 id="privacy-heading">Privacy, in plain terms</h2></div>
          <div className="prose-nova">
            <p>The website you sign up with only sees the temporary address. However, the inbox is not protected by a password: <strong>anyone who knows an address may be able to read its messages</strong>. Random addresses are hard to guess; short custom names are not.</p>
            <p>Do not use a temporary inbox for banking, healthcare, government services, work, or accounts you want to keep. See our <Link href="/privacy">privacy policy</Link> for what the service itself records.</p>
          </div>
        </section>

        <section className="split-section" aria-labelledby="tech-heading">
          <div><h2 id="tech-heading">For the technically curious</h2><p>The full walkthrough is in <Link href="/blog/how-temporary-email-works" className="text-link">how temporary email works</Link>.</p></div>
          <div className="prose-nova">
            <ul>
              <li>Mail for our domains is received by a Haraka SMTP server and passed to our application.</li>
              <li>Messages are parsed into headers, text, HTML and attachments. HTML is sanitized to remove scripts and shown in an isolated frame; remote images may load when you open a message.</li>
              <li>Data is stored with an expiry time and removed by a database time-to-live index and an hourly cleanup job.</li>
              <li>Your open page receives new-message notifications over Socket.io and also checks every few seconds.</li>
            </ul>
            <div className="button-row"><Link href="/#generator" className="primary-link">Get free email <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          </div>
        </section>
      </div>
    </div>
  );
}
