import Link from 'next/link';
import LegalPage from '../../components/common/LegalPage';
import { publicMetadata } from '../../lib/seo';

export const metadata = publicMetadata('/privacy', 'Privacy Policy', 'What TempMail Nova collects when you use a temporary inbox or contact us, how long mailbox data is kept, which third parties are involved, and your choices.');

const ext = (href: string, label: string) => <a href={href} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (opens in a new tab)</span></a>;

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      path="/privacy"
      crumb="Privacy policy"
      title="Privacy policy"
      lede="This policy explains what information TempMail Nova handles, why, and for how long. It covers the website at tempmailnova.com and its temporary inboxes."
      updated="2026-09-30"
      summary={<ul>
        <li>You do not need an account to use a temporary inbox.</li>
        <li>Mailboxes and their messages expire 24 hours after creation and are then removed by automatic cleanup.</li>
        <li>Temporary inboxes are not password-protected. Anyone who knows an address may be able to read its messages.</li>
        <li>Our servers keep operational logs, including IP addresses, for security and troubleshooting.</li>
        <li>We use Google Analytics to understand how the site is used. We do not send mailbox addresses or message content to it.</li>
        <li>The site does not currently show advertising.</li>
      </ul>}
      sections={[
        { id: 'who', title: 'Who we are', body: <>
          <p>TempMail Nova (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this website. You can contact us about privacy at <a href="mailto:helptempmailnova@gmail.com">helptempmailnova@gmail.com</a> or through the <Link href="/contact">contact form</Link>.</p>
        </> },
        { id: 'mailbox', title: 'Temporary mailboxes and received email', body: <>
          <p>When you open the site, we create a temporary address. When someone sends email to an address on our domains, we store the message so it can be shown to you: its headers (such as sender, recipients, subject and routing lines), its text and HTML content, and any attachments.</p>
          <p>Each mailbox expires 24 hours after it is created. After expiry the messages are no longer shown, and an automatic process deletes expired mailboxes, messages and attachments. This process runs in the background, so deletion may happen shortly after the expiry time rather than at that exact second. You can also choose <strong>Delete</strong> to remove the current mailbox and its messages sooner.</p>
          <p>Mail is delivered by address, and there is no password. <strong>Anyone who knows or guesses an address may be able to read the messages sent to it.</strong> Do not use temporary inboxes for sensitive information.</p>
          <p>Received HTML is sanitized to remove scripts and displayed in an isolated frame. Emails can contain remote images; when your browser loads them, the sender&apos;s servers may receive your IP address and learn that the message was opened. Images are requested without sending our page address as the referrer.</p>
        </> },
        { id: 'logs', title: 'Server and security logs', body: <>
          <p>Like most websites, our servers and hosting infrastructure record technical information about requests, such as IP address, date and time, the page or API path requested, response status and browser type. We use IP addresses to apply rate limits and to protect the service from abuse, and logs to diagnose problems.</p>
          <p>We keep logs only as long as needed for these purposes and do not use them to build advertising profiles.</p>
        </> },
        { id: 'browser', title: 'Information stored in your browser', body: <>
          <p>The site uses your browser&apos;s local storage, not cookies, for its own features:</p>
          <ul>
            <li><code>tempmail_current_address</code>: your current temporary address, so it reopens after a page refresh.</li>
            <li><code>tempmail_theme</code>: your light or dark display preference, if set.</li>
            <li><code>tempmail_token</code>: a sign-in token, only for administrators and registered users of account areas.</li>
          </ul>
          <p>You can remove these by clearing site data in your browser. See the <Link href="/cookies">cookie policy</Link> for more.</p>
        </> },
        { id: 'analytics', title: 'Analytics', body: <>
          <p>On tempmailnova.com we use Google Analytics 4 to measure visits and a small set of product events, such as an address being generated or copied, the inbox being refreshed, a message arriving, or a guide being opened. We do not send email addresses, subjects, message content or message identifiers to Google Analytics.</p>
          <p>For visitors in the European Economic Area, the United Kingdom and Switzerland, analytics cookies are switched off by default using Google Consent Mode, and Google Analytics receives only limited, cookieless measurements. Advertising-related signals are switched off for everyone.</p>
          <p>Where cookies are used, Google Analytics processes information such as your IP address, device and browser details, and pages viewed. Google describes this in {ext('https://policies.google.com/technologies/partner-sites', 'How Google uses information from sites or apps that use its services')} and {ext('https://support.google.com/analytics/answer/11397207', 'Google Analytics cookie usage')}. You can block analytics with browser settings, content blockers, or the {ext('https://tools.google.com/dlpage/gaoptout', 'Google Analytics opt-out add-on')}.</p>
        </> },
        { id: 'contact-form', title: 'Contact form and emails to us', body: <>
          <p>If you use the contact form, the name, email address, subject and message you enter are sent to our support inbox through EmailJS, a third-party form delivery service. See the {ext('https://www.emailjs.com/legal/privacy-policy/', 'EmailJS privacy policy')}. If you email us directly, we receive the message in our email account.</p>
          <p>We use this information only to reply and to deal with your request, and keep it as long as needed for that and for our records.</p>
        </> },
        { id: 'advertising', title: 'Advertising', body: <>
          <p>TempMail Nova does not currently display advertising or use advertising cookies. If we introduce advertising, we will update this policy and the cookie policy before ads appear, including any choices or consent required where you live.</p>
        </> },
        { id: 'sharing', title: 'When information is shared', body: <>
          <p>We do not sell personal information. We share information only with service providers that help run the site (such as hosting, analytics and form delivery), when required by law, or when necessary to investigate abuse or protect the service and its users.</p>
        </> },
        { id: 'rights', title: 'Your choices and rights', body: <>
          <p>You can delete your current mailbox at any time with the Delete button, clear the site&apos;s local storage in your browser, and block analytics as described above.</p>
          <p>Depending on where you live, you may have rights to access, correct or delete personal information, or to object to certain processing. Contact us to make a request. Because temporary inboxes have no accounts, we may be unable to link a request to a particular mailbox, and data from expired mailboxes will already have been deleted.</p>
        </> },
        { id: 'changes', title: 'Changes to this policy', body: <>
          <p>We will update this page when our practices change and revise the date at the top. Significant changes will be reflected here before they take effect where practical.</p>
        </> },
      ]}
    />
  );
}
