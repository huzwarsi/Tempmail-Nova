import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

const guides = [
  { slug: 'what-is-temporary-email', category: 'THE BASICS', title: 'What is temporary email?', text: 'Understand disposable inboxes, how they work, and when to use one.' },
  { slug: 'email-privacy-in-2026', category: 'PRIVACY', title: 'Email privacy in 2026', text: 'Practical ways to share less of your personal email online.' },
  { slug: 'best-temporary-email-services', category: 'CHOOSING A SERVICE', title: 'Choosing a temporary email service', text: 'Compare retention, access, and delivery before choosing a provider.' },
];

export default function LandingDetails() {
  return <>
    <section id="how-it-works" className="nova-container steps-section" aria-labelledby="steps-heading">
      <div className="section-heading"><div><span className="section-kicker">FROM ADDRESS TO INBOX</span><h2 id="steps-heading">Three steps. Then get on with your day.</h2></div><Link href="/how-it-works" data-track="click_how_it_works">How temporary email works <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      <ol className="steps-grid">{[
        { title: 'Create your address', text: 'Your free address is created when you arrive. Choose New address if you need a fresh one.' },
        { title: 'Copy and use it', text: 'Tap Copy email and paste it into a signup or download form that accepts disposable email.' },
        { title: 'Receive your email', text: 'Keep this page open. New messages appear automatically, ready for you to read.' },
      ].map(({ title, text }, i) => <li key={title} className="step"><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </section>
    <section className="use-cases nova-container" aria-labelledby="uses-heading">
      <div><span className="section-kicker">FOR THE MOMENTS IN BETWEEN</span><h2 id="uses-heading">Not every signup needs<br />your everyday email.</h2><p>A disposable email address is a short-lived inbox for receiving mail online. It keeps one-time messages separate from the conversations you want to keep.</p><Link href="/blog/temporary-email-vs-permanent-email" className="text-link" data-track="click_guide">When to use temporary email <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <dl className="use-list"><div><dt>Website signups</dt><dd>Try a site without adding another stream of promotions to your main inbox.</dd></div><div><dt>Verification emails</dt><dd>Receive a confirmation link or code for a one-time registration. Some sites do not accept disposable addresses.</dd></div><div><dt>Downloads & resources</dt><dd>Access an emailed resource without giving out your permanent address.</dd></div><div><dt>Testing your own product</dt><dd>Check signup and notification emails during manual QA, using non-sensitive test data.</dd></div></dl>
    </section>
    <section className="privacy-section" aria-labelledby="privacy-heading"><div className="nova-container privacy-grid">
      <div><span className="section-kicker">PRIVACY, WITHOUT THE BIG CLAIMS</span><h2 id="privacy-heading">Keep your personal<br />inbox private.</h2><p>Share a temporary address instead of your primary one. The website you use it with receives that address, so your personal inbox stays out of that signup.</p><Link href="/privacy" className="text-link">Read our privacy policy <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <div className="privacy-note"><ShieldCheck size={25} aria-hidden="true" /><h3>Made for short-term messages.</h3><p>Mailboxes expire after 24 hours, with expired data removed by automatic cleanup. The timer shows the expiry of your current address when available.</p><p>This is a receive-only inbox, not a password-protected personal email account. Anyone who knows an address may be able to access its messages. Avoid banking, medical information, private documents, and accounts you need to recover later.</p><Link href="/about" className="text-link">About TempMail Nova <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </div></section>
    <section className="comparison nova-container" aria-labelledby="comparison-heading">
      <div className="section-heading"><div><span className="section-kicker">THE RIGHT INBOX FOR THE JOB</span><h2 id="comparison-heading">Temporary email or personal email?</h2></div><p>Use each for what it does best.</p></div>
      <div className="comparison-scroll"><table><caption className="sr-only">Compare TempMail Nova with a personal email account</caption><thead><tr><th scope="col">What you need</th><th scope="col">TempMail Nova</th><th scope="col">Your personal email</th></tr></thead><tbody>
        <tr><th scope="row">Getting started</th><td>No signup required</td><td>An account with your provider</td></tr>
        <tr><th scope="row">Best for</th><td>One-time messages and testing</td><td>Conversations and important accounts</td></tr>
        <tr><th scope="row">Keeping messages</th><td>Temporary; 24-hour mailbox</td><td>Long-term, subject to provider limits</td></tr>
        <tr><th scope="row">Sending email</th><td>Receive only</td><td>Send and receive</td></tr>
        <tr><th scope="row">Account recovery</th><td>Not a suitable recovery address</td><td>Use an account you control long-term</td></tr>
      </tbody></table></div>
      <p className="section-footnote">Need receipts, ongoing access, or password resets? Use a permanent address or a managed email alias.</p>
    </section>
    <section className="resources nova-container" aria-labelledby="guides-heading">
      <div className="section-heading"><div><span className="section-kicker">A LITTLE KNOWLEDGE GOES A LONG WAY</span><h2 id="guides-heading">Make more informed inbox choices.</h2></div><Link href="/blog" data-track="click_guide">All email & privacy guides <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      <div className="guide-grid">{guides.map(guide => <article key={guide.slug}><span className="section-kicker">{guide.category}</span><h3><Link href={'/blog/' + guide.slug} data-track="click_guide">{guide.title}<ArrowUpRight size={18} aria-hidden="true" /></Link></h3><p>{guide.text}</p></article>)}</div>
    </section>
  </>;
}

