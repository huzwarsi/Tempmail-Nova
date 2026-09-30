import Link from 'next/link';
import LegalPage from '../../components/common/LegalPage';
import { publicMetadata } from '../../lib/seo';

export const metadata = publicMetadata('/terms', 'Terms of Service', 'The terms for using TempMail Nova temporary inboxes: what the service provides, acceptable use, mailbox expiry, and the limits of our responsibility.');

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      crumb="Terms of service"
      title="Terms of service"
      lede="These terms apply when you use TempMail Nova. By using the site, you agree to them. If you do not agree, please do not use the service."
      updated="2026-09-30"
      summary={<ul>
        <li>TempMail Nova provides free, receive-only temporary inboxes that expire after 24 hours.</li>
        <li>Use it lawfully. No fraud, spam, harassment, evading bans or verification, or abusing other services&apos; free offers.</li>
        <li>Inboxes are not private or permanent, and delivery is not guaranteed. Do not use them for anything important or sensitive.</li>
      </ul>}
      sections={[
        { id: 'service', title: 'The service', body: <>
          <p>TempMail Nova gives you a temporary email address that can receive messages for 24 hours after it is created. It does not send email. We may change, limit or stop any part of the service, including available domains and mailbox lifetime, at any time.</p>
        </> },
        { id: 'use', title: 'Acceptable use', body: <>
          <p>You may use TempMail Nova only for lawful purposes and in line with the terms of other services you use it with. You must not use it to:</p>
          <ul>
            <li>commit fraud, impersonate anyone, or deceive others;</li>
            <li>send, arrange or support spam, phishing or malware;</li>
            <li>get around bans, suspensions, identity or age checks, or other restrictions set by another service;</li>
            <li>repeatedly claim free trials, credits, discounts or other offers intended to be used once;</li>
            <li>receive content that is illegal, or harass or harm anyone;</li>
            <li>overload, probe, scrape or interfere with the service, or get around its rate limits or security measures.</li>
          </ul>
          <p>We may block addresses, domains, IP addresses or access to the service to prevent misuse.</p>
        </> },
        { id: 'privacy', title: 'Inboxes are not private or permanent', body: <>
          <p>Temporary inboxes have no password. Anyone who knows an address may be able to read its messages. Messages are deleted after the mailbox expires and cannot be recovered. Do not use the service for banking, healthcare, government, work or other accounts you need to keep, or for passwords, identity documents or other sensitive information. How we handle data is described in the <Link href="/privacy">privacy policy</Link>.</p>
        </> },
        { id: 'delivery', title: 'No guarantee of delivery or availability', body: <>
          <p>Whether a message reaches a temporary inbox depends on the sender and on systems outside our control. Some websites do not accept or send to disposable addresses. The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind to the extent permitted by law, including that it will be uninterrupted, error-free, or suitable for a particular purpose.</p>
        </> },
        { id: 'content', title: 'Received content', body: <>
          <p>Messages and attachments come from third-party senders, not from us. We sanitize HTML to reduce risk but do not review or endorse message content. Only open links and files from senders you trust.</p>
        </> },
        { id: 'liability', title: 'Limitation of liability', body: <>
          <p>To the extent permitted by law, TempMail Nova is not liable for any loss arising from your use of, or inability to use, the service, including lost messages, lost access to accounts registered with a temporary address, or content sent by third parties. Nothing in these terms limits liability that cannot be limited under applicable law.</p>
        </> },
        { id: 'ip', title: 'Our content', body: <>
          <p>The site&apos;s design, text, guides and branding belong to TempMail Nova. You may link to and quote brief extracts from our guides with attribution.</p>
        </> },
        { id: 'changes', title: 'Changes to these terms', body: <>
          <p>We may update these terms. The date at the top shows the latest version. Continuing to use the service after a change means you accept the updated terms.</p>
        </> },
        { id: 'contact', title: 'Contact', body: <>
          <p>Questions about these terms, or reports of misuse, can be sent to <a href="mailto:helptempmailnova@gmail.com">helptempmailnova@gmail.com</a> or through the <Link href="/contact">contact form</Link>.</p>
        </> },
      ]}
    />
  );
}
