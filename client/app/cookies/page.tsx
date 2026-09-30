import Link from 'next/link';
import LegalPage from '../../components/common/LegalPage';
import { publicMetadata } from '../../lib/seo';

export const metadata = publicMetadata('/cookies', 'Cookie Policy', 'Which cookies and browser storage TempMail Nova uses, what each is for, and how to remove or block them.');

const ext = (href: string, label: string) => <a href={href} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (opens in a new tab)</span></a>;

export default function CookiePolicyPage() {
  return (
    <LegalPage
      path="/cookies"
      crumb="Cookie policy"
      title="Cookie policy"
      lede="Which cookies and browser storage TempMail Nova uses, and how you can control them."
      updated="2026-09-30"
      summary={<ul>
        <li>Our own features use your browser&apos;s local storage, not cookies.</li>
        <li>Google Analytics sets cookies on tempmailnova.com to measure how the site is used, except for visitors in the EEA, UK and Switzerland, where they are off by default.</li>
        <li>We do not currently use advertising cookies.</li>
      </ul>}
      sections={[
        { id: 'what', title: 'Cookies and local storage', body: <>
          <p>Cookies are small files a website stores in your browser. Local storage is a similar browser feature that keeps information on your device and is not sent to our server automatically. This page covers both.</p>
        </> },
        { id: 'ours', title: 'Storage used by TempMail Nova', body: <>
          <div className="table-scroll" role="region" aria-label="Local storage used by TempMail Nova" tabIndex={0}>
            <table>
              <caption>Local storage keys set by this site</caption>
              <thead><tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">How long</th></tr></thead>
              <tbody>
                <tr><th scope="row"><code>tempmail_current_address</code></th><td>Reopens your current temporary address after a refresh</td><td>Until replaced or cleared</td></tr>
                <tr><th scope="row"><code>tempmail_theme</code></th><td>Remembers light or dark display, if you change it</td><td>Until cleared</td></tr>
                <tr><th scope="row"><code>tempmail_token</code></th><td>Keeps administrators and registered users signed in</td><td>Until sign-out or expiry</td></tr>
              </tbody>
            </table>
          </div>
          <p>These are needed for the features they support. Removing them resets those features; for example, the site will create a new temporary address.</p>
        </> },
        { id: 'analytics', title: 'Analytics cookies', body: <>
          <p>On tempmailnova.com, Google Analytics 4 sets first-party cookies whose names begin with <code>_ga</code>. They distinguish visits and sessions so we can see, in aggregate, how the site is used. Google explains these cookies in {ext('https://support.google.com/analytics/answer/11397207', 'Google Analytics cookie usage on websites')}. Measurement is only switched on for the tempmailnova.com domain, not for development or preview copies of the site.</p>
          <p>For visitors in the European Economic Area, the United Kingdom and Switzerland, these cookies are not set by default: Google Consent Mode keeps analytics storage off, and only limited cookieless measurements are sent.</p>
        </> },
        { id: 'ads', title: 'Advertising cookies', body: <>
          <p>We do not currently show ads or use advertising cookies. If that changes, we will update this page and the <Link href="/privacy">privacy policy</Link> before ads appear.</p>
        </> },
        { id: 'control', title: 'Controlling cookies and storage', body: <>
          <ul>
            <li>Clear cookies and site data for tempmailnova.com in your browser settings.</li>
            <li>Block third-party or all cookies in your browser, or use a content blocker.</li>
            <li>Install the {ext('https://tools.google.com/dlpage/gaoptout', 'Google Analytics opt-out add-on')} to stop Google Analytics measurement.</li>
          </ul>
          <p>Blocking analytics does not affect how the temporary inbox works.</p>
        </> },
        { id: 'contact', title: 'Questions', body: <>
          <p>Contact us at <a href="mailto:helptempmailnova@gmail.com">helptempmailnova@gmail.com</a> or through the <Link href="/contact">contact form</Link>.</p>
        </> },
      ]}
    />
  );
}
