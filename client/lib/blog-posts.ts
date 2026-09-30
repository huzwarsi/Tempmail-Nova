/*
 * Guide library. Text supports a small inline syntax: [label](/path), **bold** and `code`.
 *
 * Editorial rules (see docs/CONTENT_AUDIT.md):
 * - Product claims must match the code: 24-hour mailbox from creation, cleanup runs asynchronously,
 *   Socket.io updates plus periodic polling, receive-only, anyone who knows an address may read it,
 *   received HTML is sanitized and shown in a sandboxed frame; remote images load when a message is opened.
 * - Set `updated` by hand only when a post changes substantively. Never stamp posts automatically.
 */

export type Topic = 'getting-started' | 'privacy-safety' | 'signups-verification' | 'testing-development';

export const TOPICS: { id: Topic; label: string; description: string }[] = [
  { id: 'getting-started', label: 'Getting started', description: 'What a temporary inbox is, how it works, and how it compares with the other addresses you already use.' },
  { id: 'privacy-safety', label: 'Privacy & safety', description: 'What a disposable address protects, what it cannot protect, and habits that reduce spam and exposure.' },
  { id: 'signups-verification', label: 'Signups & verification', description: 'Using a temporary address for codes, downloads and trials, and knowing when to use your real email instead.' },
  { id: 'testing-development', label: 'Testing & development', description: 'Checking your own signup and notification emails, reading headers, and building reliable automated tests.' },
];

export const EDITORIAL_AUTHOR = 'TempMail Nova editorial team';

export interface BlogSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
  subsections?: { title: string; paragraphs?: string[]; list?: string[] }[];
  table?: { caption: string; headers: string[]; rows: string[][] };
  code?: { language: string; text: string };
  callout?: { tone: 'note' | 'caution'; title: string; text: string };
  paragraphsAfter?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  excerpt: string;
  topic: Topic;
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  updated?: string;
  intro: string[];
  sections: BlogSection[];
  takeaway?: string;
  faqs?: { question: string; answer: string }[];
  sources?: { label: string; url: string }[];
  related: string[];
}

const PUBLISHED = '2026-08-16';
const EDITED = '2026-09-30';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-temporary-email',
    title: "What is temporary email? Uses, limits and how it works",
    seoTitle: "What Is Temporary Email? Uses, Risks & How It Works",
    description: "Temporary email is a free, short-lived inbox for one-time messages. See what it is good for, its real privacy limits, and when to use your own address.",
    excerpt: 'A short-lived inbox for one-time messages: what it is good for, where it falls short, and when your real address is the better choice.',
    topic: 'getting-started',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'A temporary email address is a real, working inbox that you use for a short time and then leave behind. You do not create an account or choose a password. You open a page, an address is ready, and messages sent to it appear on that page.',
      'People use one when a website wants an email address but they do not want a long-term relationship with that website: a download form, a one-time verification code, a trial they are unsure about. The address keeps those messages out of the inbox you actually care about.',
    ],
    sections: [
      {
        title: 'Temporary email vs a normal email account',
        paragraphs: [
          'A normal email account belongs to you. It has a password, a recovery method, and it keeps your messages until you delete them. You can send mail from it.',
          'A temporary inbox is the opposite on almost every point. It exists for a limited time, it only receives, and it is not protected by a password. On TempMail Nova a mailbox lasts 24 hours from when it is created, and the page shows a countdown. After that, the mailbox and its messages are removed by an automatic cleanup job.',
        ],
        table: {
          caption: 'Temporary inbox compared with a personal email account',
          headers: ['', 'Temporary inbox', 'Personal email account'],
          rows: [
            ['Setup', 'Ready when you open the page', 'Sign-up, password, often a phone number'],
            ['How long it lasts', 'Hours (24 hours on TempMail Nova)', 'As long as you keep the account'],
            ['Sending', 'Receive only', 'Send and receive'],
            ['Who can read it', 'Anyone who knows the address may be able to', 'Only people with your login'],
            ['Account recovery', 'Not possible after it expires', 'Designed for it'],
          ],
        },
      },
      {
        title: 'What it is good for',
        list: [
          '**One-time verification.** Confirming a signup for a forum, a newsletter preview or a tool you want to try once. See [using temporary email for verification codes](/blog/temporary-email-for-otp).',
          '**Gated downloads.** A checklist, template or report that is emailed to you. Save the file and you no longer need the inbox. See [how to download free ebooks without email spam](/blog/avoid-email-spam-ebooks).',
          '**Keeping promotions separate.** A store discount pop-up, where you want the code but not the weekly sales emails that follow. More in [temporary email for online shopping](/blog/temporary-email-for-shopping).',
          '**Testing your own product.** Checking that your signup or password-reset email arrives and looks right. See [temporary email for software testing](/blog/temporary-email-for-testing).',
        ],
      },
      {
        title: 'What it is not good for',
        paragraphs: [
          'The short lifetime and lack of a password are what make a temporary inbox convenient. They are also why it is the wrong tool for anything you need to keep or protect. If you are unsure, [temporary email vs permanent email](/blog/temporary-email-vs-permanent-email) walks through the decision.',
        ],
        list: [
          'Accounts you will want to log back into or recover, including social media, gaming and AI tools you plan to keep using.',
          'Banking, payments, healthcare, government services, school or work.',
          'Anything containing personal documents, passwords, or information you would not want a stranger to read.',
          'Purchases where you may need the receipt, shipping updates or a refund conversation later.',
        ],
        callout: {
          tone: 'caution',
          title: 'Treat the inbox as readable by others',
          text: 'Mail is delivered by address, not by login. If someone else knows or guesses an address, they may be able to read what arrives there. Use random addresses and keep sensitive messages out of them. More in [are temporary email addresses safe?](/blog/are-temporary-email-addresses-safe)',
        },
      },
      {
        title: 'Is using a temporary email allowed?',
        paragraphs: [
          'Receiving email at a temporary address is ordinary and legitimate. Whether a particular website accepts one is up to that website. Some block known disposable domains, and some terms of service ask for accurate account information. Read the terms of services you rely on, and do not use temporary addresses to get around bans, repeat free trials, or deceive anyone. Our [terms of service](/terms) set out what is not allowed here.',
        ],
      },
      {
        title: 'How to get a temporary email address',
        paragraphs: [
          'Open the [TempMail Nova homepage](/). An address is created automatically. Select **Copy email**, paste it into the form you are filling in, and keep the page open. New mail appears on its own; you can also use **Refresh inbox**. If you want a different address, choose **New address** or **Custom address**. Comparing providers? Use our [checklist for choosing a temporary email service](/blog/best-temporary-email-services).',
          'If you want the technical detail behind this, read [how temporary email works](/blog/how-temporary-email-works).',
        ],
      },
    ],
    takeaway: 'Use a temporary address for short, low-stakes tasks where you only need to receive a message once. Use your own email, or an alias that forwards to it, for anything you want to keep.',
    faqs: [
      { question: 'Is temporary email the same as a "burner" or "throwaway" email?', answer: 'Yes, these terms are usually used for the same idea: an address you use briefly and then stop using. Some people also use "burner" for a free webmail account they created for a single purpose, which lasts longer and has a password.' },
      { question: 'Can I send email from a temporary address?', answer: 'Not from TempMail Nova. It is a receive-only inbox.' },
      { question: 'What happens to my messages after 24 hours?', answer: 'The mailbox expires 24 hours after it was created. An automatic cleanup removes expired mailboxes and their messages, which may happen a little after the timer reaches zero. Save anything you need before then.' },
    ],
    related: ['how-temporary-email-works', 'temporary-email-vs-permanent-email', 'are-temporary-email-addresses-safe'],
  },

  {
    slug: 'how-temporary-email-works',
    title: "How does temporary email work? From sender to your screen",
    seoTitle: "How Does Temporary Email Work? A Step-by-Step Guide",
    description: "How a temporary email inbox really works: MX lookup, SMTP delivery, HTML cleaning, 24-hour expiry and live updates, explained in plain English.",
    excerpt: 'The path a message takes into a temporary inbox: DNS lookup, SMTP delivery, parsing and sanitizing, storage with an expiry time, and live updates in your browser.',
    topic: 'getting-started',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'A [temporary inbox](/blog/what-is-temporary-email) uses the same email system as everyone else. The sending website does not know or care that your address is short-lived. What is different is what happens after the message arrives: there is no account, the message is shown on a web page, and everything has an expiry time.',
      'Here is the journey of one verification email into a TempMail Nova inbox, and the limits that follow from each step.',
    ],
    sections: [
      {
        title: '1. The sender looks up where to deliver',
        paragraphs: [
          'When a website sends to `name@tempmailnova.com`, its mail server asks DNS for the domain\'s MX (mail exchanger) record. That record names the server that accepts mail for the domain. The sender then connects to it and hands the message over using SMTP, the standard mail transfer protocol described in [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321).',
          'Nothing about this step is special to temporary email. It is also why delivery is not instant in every case: the sender may queue messages, retry later, or decide not to send to a domain it considers disposable.',
        ],
      },
      {
        title: '2. Our mail server accepts the message',
        paragraphs: [
          'TempMail Nova receives mail with Haraka, an open-source SMTP server. It checks that the recipient is on a domain we manage, applies basic connection rate limits, and passes the raw message to our application.',
          'Any address on a managed domain can receive mail, even if nobody has opened it on the website yet. That makes sign-ups simple, and it is also the reason a guessable address such as a common first name is a poor choice: someone else may be using it.',
        ],
      },
      {
        title: '3. The message is parsed and cleaned',
        paragraphs: [
          'An email is a text document with [headers](/blog/email-headers-temporary-email) (sender, subject, routing information) and one or more body parts: plain text, HTML, and attachments. The format is defined in [RFC 5322](https://www.rfc-editor.org/rfc/rfc5322) and the MIME standards.',
          'We separate those parts and run the HTML through a sanitizer that removes scripts and other active content before it is stored. Sanitizing reduces risk, but it is not a guarantee about every link or file. Messages are then displayed in an isolated frame where scripts cannot run. Images load when you open a message, which means a sender can often tell that it was opened. Attachments are stored so you can download them; only open files you expected.',
        ],
      },
      {
        title: '4. It is stored with an expiry time',
        paragraphs: [
          'Each mailbox is created with an `expiresAt` time 24 hours in the future, and its messages share that expiry. Two things remove expired data: a database time-to-live index, and a cleanup job that runs every hour. Both run in the background, so deletion happens shortly after expiry rather than at the exact second the timer shows.',
        ],
      },
      {
        title: '5. Your open page is updated',
        paragraphs: [
          'The inbox page keeps a live Socket.io connection to our server. When a new message is saved, the server notifies the page and it appears in the list. The page also checks for new mail every few seconds, which covers dropped connections and phones that pause background tabs. **Refresh inbox** triggers the same check by hand.',
        ],
      },
      {
        title: 'What this means in practice',
        table: {
          caption: 'Each stage and the practical limit it creates',
          headers: ['Stage', 'What happens', 'Practical limit'],
          rows: [
            ['Sending', 'The website\'s server delivers over SMTP', 'Some senders delay, filter or refuse disposable domains'],
            ['Receiving', 'Haraka accepts mail for managed domains', 'Any address can receive, so pick addresses that are hard to guess'],
            ['Cleaning', 'Scripts removed; shown in an isolated frame', 'Images can load; be careful with links and attachments'],
            ['Storage', 'Saved with a 24-hour expiry', 'Save anything you need before the mailbox expires'],
            ['Display', 'Live update plus periodic checks', 'Keep the page open while you wait'],
          ],
        },
        paragraphsAfter: [
          'If a message has not arrived, [our verification guide](/blog/temporary-email-for-otp) has a short troubleshooting list. For a less technical overview, see [how TempMail Nova works](/how-it-works).',
        ],
      },
    ],
    takeaway: 'A temporary inbox receives mail through the normal email system. The differences are that anyone can receive at any address on the domain, nothing is password-protected, and everything expires.',
    faqs: [
      { question: 'Do I need to refresh the page to see new mail?', answer: 'No. The page updates automatically through a live connection and also checks every few seconds. Refresh inbox is there if you want to check immediately.' },
      { question: 'Does TempMail Nova block tracking pixels?', answer: 'No. We remove scripts and show messages in an isolated frame, but images load so that emails display properly. A sender may be able to see that a message was opened.' },
    ],
    sources: [
      { label: 'RFC 5321: Simple Mail Transfer Protocol', url: 'https://www.rfc-editor.org/rfc/rfc5321' },
      { label: 'RFC 5322: Internet Message Format', url: 'https://www.rfc-editor.org/rfc/rfc5322' },
    ],
    related: ['what-is-temporary-email', 'email-headers-temporary-email', 'are-temporary-email-addresses-safe'],
  },

  {
    slug: 'protect-inbox-from-spam',
    title: "How to protect your email from spam: 9 habits that work",
    seoTitle: "How to Stop Email Spam: 9 Habits That Actually Work",
    description: "Stop spam before it reaches your main inbox. Nine practical habits: separate addresses, aliases, safe unsubscribing, smarter filters and account security.",
    excerpt: 'Nine practical habits that reduce spam in your main inbox, from separating addresses to unsubscribing safely and locking down the account itself.',
    topic: 'privacy-safety',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Most spam in a personal inbox is not random. It comes from places you gave your address to: shops, newsletters, apps, and websites that later shared or leaked their lists. The most effective defence is deciding more carefully who gets which address.',
      'These habits are ordered roughly by how much difference they make.',
    ],
    sections: [
      {
        title: '1. Give your main address to fewer places',
        paragraphs: [
          'Keep your personal address for people, and for accounts that matter: banking, work, healthcare, government services and anything you would need to recover. For everything else, use a different address. That single change stops most new marketing email from reaching the inbox you read every day.',
        ],
      },
      {
        title: '2. Use a temporary address for one-time tasks',
        paragraphs: [
          'When you only need to receive one message, such as a discount code or a download link, a [temporary email address](/) is enough. Whatever the sender does with that address later never reaches you. Do not use one for anything you will need again; see [when not to use temporary email](/blog/what-is-temporary-email).',
        ],
      },
      {
        title: '3. Use plus addressing or aliases for ongoing accounts',
        paragraphs: [
          'For accounts you want to keep, like a store you buy from regularly, you need an address that lasts but can be identified or switched off. Two common options:',
        ],
        list: [
          '**Plus addressing.** Many providers deliver `you+storename@example.com` to `you@example.com`. You can filter by the tag, and you can see which company used it. It does not hide your real address, and some forms reject the plus sign.',
          '**Forwarding aliases.** Alias services and some mail providers give you separate addresses that forward to your inbox and can be disabled one at a time. Compare the options in [temporary email vs email aliases](/blog/temporary-email-vs-email-alias).',
        ],
      },
      {
        title: '4. Unsubscribe from companies you recognise; report the rest',
        paragraphs: [
          'Legitimate senders include an unsubscribe link, and many mail apps now show an unsubscribe button based on standard headers such as the one-click method in [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058). Using it for a company you signed up with is usually the fastest fix.',
          'For messages from senders you never dealt with, do not click links inside the message. Use your mail app\'s **Report spam** or **Junk** button instead, which also helps its filter learn.',
        ],
      },
      {
        title: '5. Do not reply to spam',
        paragraphs: [
          'A reply confirms that the address is read by a person. It also exposes your full address and signature to someone who has already shown they will misuse it.',
        ],
      },
      {
        title: '6. Keep your address off public pages',
        paragraphs: [
          'Addresses posted in plain text on websites, forums, public documents and code repositories can be collected by automated tools. Use a contact form, a role address, or a code-hosting "noreply" address where one is offered. More in [why scraping bots collect email addresses](/blog/web-scraping-email-spam).',
        ],
      },
      {
        title: '7. Consider blocking remote images',
        paragraphs: [
          'Marketing emails often include small remote images that tell the sender when a message was opened. Some mail apps can block remote images or load them through a proxy. This does not stop spam arriving, but it gives senders less feedback about you. More on this in [email privacy in 2026](/blog/email-privacy-in-2026).',
        ],
      },
      {
        title: '8. Build a few filters',
        paragraphs: [
          'Filters on a plus-address tag or a known sender are more reliable than filters on keywords. Send newsletters to a folder you check weekly, so the main inbox holds only what needs a response. It also takes the edge off the [tactics that make marketing emails hard to ignore](/blog/psychology-of-email-spam).',
        ],
      },
      {
        title: '9. Secure the account itself',
        paragraphs: [
          'Spam is annoying; a compromised account is serious. Use a unique password and turn on two-step verification for your main email. If a service you use announces a breach, change that password, and anywhere you reused it. Breach notification services such as [Have I Been Pwned](https://haveibeenpwned.com/) can alert you when an address appears in a known breach. See [what a separate address does in a data breach](/blog/disposable-email-data-breach).',
        ],
      },
    ],
    takeaway: 'Share your main address sparingly, use short-lived or disposable addresses for one-off tasks, and use aliases for ongoing accounts you might want to switch off later.',
    faqs: [
      { question: 'Will a temporary email address stop the spam I already get?', answer: 'No. It only helps with future sign-ups. For existing spam, unsubscribe from companies you recognise, report the rest, and use filters.' },
      { question: 'Is it safe to click unsubscribe?', answer: 'For companies you knowingly signed up with, yes, and it is usually the quickest fix. For messages from unknown senders, use your mail app\'s report spam button rather than links in the message.' },
    ],
    sources: [
      { label: 'RFC 8058: Signaling one-click functionality for list email headers', url: 'https://www.rfc-editor.org/rfc/rfc8058' },
      { label: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/' },
    ],
    related: ['temporary-email-vs-email-alias', 'web-scraping-email-spam', 'temporary-email-for-shopping'],
  },

  {
    slug: 'temporary-email-vs-permanent-email',
    title: "Temporary email vs permanent email: which should you use?",
    seoTitle: "Temporary Email vs Permanent Email: Which to Use When",
    description: "Temporary email or your real address? One simple question, a side-by-side comparison and real examples help you pick the right inbox every time.",
    excerpt: 'One question decides most cases: will you ever need an email from this service again? A comparison table, examples and edge cases.',
    topic: 'getting-started',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Most of the time the choice comes down to one question: **will I ever need an email from this service again?** If the answer is yes, or even maybe, use a permanent address. If you only need a single message in the next few minutes, a temporary inbox is fine.',
    ],
    sections: [
      {
        title: 'Side-by-side',
        table: {
          caption: 'How a temporary inbox and a permanent address compare',
          headers: ['', 'Temporary inbox', 'Permanent address'],
          rows: [
            ['Good for', 'A single code, link or file', 'Accounts, purchases, conversations'],
            ['Lifetime', 'Hours (24 on TempMail Nova)', 'Years'],
            ['Password reset later', 'Not possible once expired', 'Yes'],
            ['Privacy from the website', 'The site never sees your real address', 'The site has your real address'],
            ['Privacy from other people', 'Weak: anyone who knows the address may read it', 'Strong: protected by your login'],
            ['Sending replies', 'No', 'Yes'],
          ],
        },
      },
      {
        title: 'Use your permanent address when…',
        list: [
          'You are creating an account you plan to keep, even a free one.',
          'Money is involved: purchases, subscriptions, refunds, warranties.',
          'The service is about your identity, health, finances, education or job.',
          'You might need to prove who you are later, or talk to customer support.',
          'The emails will contain anything personal.',
        ],
      },
      {
        title: 'A temporary inbox is reasonable when…',
        list: [
          'You need a one-time download link or a discount code.',
          'You are confirming a sign-up for something you are only trying once.',
          'You are testing your own website\'s emails with test data.',
          'You want to see what a newsletter looks like before subscribing with your real address.', 'A café, hotel or airport Wi-Fi page only asks you to type an email. See [temporary email for public Wi-Fi](/blog/temporary-email-public-wifi).',
        ],
      },
      {
        title: 'The in-between option: an alias',
        paragraphs: [
          'Many cases sit in the middle: a store you shop at twice a year, a newsletter you like but might tire of. An email alias that forwards to your inbox gives you a lasting address you can switch off later. It is the better fit whenever you need ongoing access but do not fully trust the sender. See [temporary email vs email aliases](/blog/temporary-email-vs-email-alias).',
        ],
      },
      {
        title: 'Edge cases people get wrong',
        list: [
          '**"It is just a free trial."** If you might convert to a paid plan, use a real address from the start. Changing the email on an account later is not always possible. Recorded [software demos](/blog/temporary-email-for-software-demos) are a different case.',
          '**"I will only log in once."** Many services ask you to confirm the address again on a new device, weeks later.',
          '**Order confirmations.** A temporary inbox receives them, but returns and shipping problems often happen after it has expired.',
        ],
      },
    ],
    takeaway: 'If you might need the service to reach you again, use a permanent address or an alias. Keep temporary inboxes for single messages you can act on right away.',
    faqs: [
      { question: 'Can I turn a temporary address into a permanent one?', answer: 'No. TempMail Nova mailboxes expire 24 hours after creation and cannot be extended into an account.' },
      { question: 'Can I change the email on an account I made with a temporary address?', answer: 'Sometimes, if the service allows email changes and you can still log in. Many services send a confirmation to the old address first, so do it before the temporary inbox expires.' },
    ],
    related: ['temporary-email-vs-email-alias', 'what-is-temporary-email', 'are-temporary-email-addresses-safe'],
  },

  {
    slug: 'email-privacy-in-2026',
    title: "Email privacy in 2026: what your email address reveals about you",
    seoTitle: "Email Privacy in 2026: What Your Address Reveals",
    description: "Your email address links your accounts, purchases and data across sites. How email tracking and list sharing work in 2026, and practical ways to share less.",
    excerpt: 'Your email address works as an identifier across services. Open tracking, list sharing and breaches, and what separate addresses realistically change.',
    topic: 'privacy-safety',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'An email address used to be only a way to reach you. Today it is also a durable identifier. Because most people use one address everywhere and rarely change it, it can connect your accounts, purchases and newsletter sign-ups into one picture.',
      'This guide covers the main ways that happens and the practical steps that reduce it. None of them makes you anonymous; they reduce how much any one company can link together.',
    ],
    sections: [
      {
        title: 'Why the same address everywhere is a privacy problem',
        paragraphs: [
          'When you sign up somewhere with your usual address, that company can match you with what it already knows, and with data from partners who hold the same address. Advertising and analytics systems often use a hashed (scrambled) version of an email address for this matching. Hashing hides the address from casual view, but the same address always produces the same hash, so it still works as a join key.',
        ],
      },
      {
        title: 'Open tracking',
        paragraphs: [
          'Marketing emails commonly include a small remote image unique to you. When your mail app loads it, the sender learns that the message was opened, roughly when, and details such as your IP address and mail client. Some mail apps block remote images or load them through a proxy, which reduces what the sender learns.',
          'A temporary inbox does not solve this by itself. On TempMail Nova, received HTML is sanitized to remove scripts, but images load when you open a message.',
        ],
      },
      {
        title: 'Lists get shared and leaked',
        paragraphs: [
          'Addresses end up with companies you never dealt with directly: through partner programmes, data brokers, acquisitions, and security breaches. Once an address is on those lists, you cannot take it back. You can only filter it, or stop using it. See [what a disposable address protects in a data breach](/blog/disposable-email-data-breach).',
        ],
      },
      {
        title: 'What different addresses change',
        table: {
          caption: 'Effect of each approach on common privacy problems',
          headers: ['Approach', 'Stops cross-site matching?', 'Stops open tracking?', 'Good for ongoing accounts?'],
          rows: [
            ['Same address everywhere', 'No', 'No', 'Yes'],
            ['Plus addressing (you+shop@)', 'No, the real address is visible', 'No', 'Yes'],
            ['Forwarding alias per service', 'Mostly', 'No', 'Yes'],
            ['Temporary inbox', 'For that sign-up, yes', 'No', 'No'],
          ],
        },
      },
      {
        title: 'A realistic checklist',
        list: [
          'Keep one primary address for people and important accounts, and protect it with a strong unique password and two-step verification.',
          'Use a forwarding alias for accounts you keep but do not fully trust.',
          'Use a [temporary inbox](/) for one-off codes and downloads.',
          'Turn on remote-image blocking or protection in your mail app if it offers it.',
          'Read how the services you use handle data. Ours is in the [privacy policy](/privacy).',
        ],
      },
      {
        title: 'What none of this does',
        paragraphs: [
          'Separate addresses do not hide your IP address, your device, or your browsing. They do not make a website forget you if you log in with the same phone number or payment card. They reduce one kind of linking, which is useful, but they are one layer rather than a complete privacy setup. On shared networks, see [public Wi-Fi safety tips](/blog/temporary-email-public-wifi).',
        ],
      },
    ],
    takeaway: 'Your address is an identifier. Using different addresses for different kinds of relationships limits how much can be linked to you, but it is not anonymity.',
    faqs: [
      { question: 'Does a temporary email hide my IP address?', answer: 'No. The website you sign up on still sees your connection, and a sender may learn your IP address if you click a link in their message.' },
      { question: 'Is a temporary inbox more private than Gmail or Outlook?', answer: 'In one way it is: the website never gets your real address. In another it is less private: the inbox has no password, so anyone who knows the address may read it. Use each for what it does well.' },
    ],
    related: ['protect-inbox-from-spam', 'temporary-email-vs-email-alias', 'are-temporary-email-addresses-safe'],
  },

  {
    slug: 'best-temporary-email-services',
    title: "Best temporary email services: 8 things to check before you choose",
    seoTitle: "Best Temporary Email Services: 8 Things to Check First",
    description: "Looking for the best temporary email service? Compare what matters: mailbox lifetime, inbox privacy, attachments, honest claims, ads and clear policies.",
    excerpt: 'A checklist for comparing disposable inbox services on the things that affect you: lifetime, who can read the inbox, attachments, honesty and ads.',
    topic: 'getting-started',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Temporary email services look alike, but they differ in ways that matter: how long mail is kept, whether someone else can read your inbox, and how honest they are about both. This is a checklist you can apply to any service, including ours.',
      'We have not included a ranked list of providers. Their features and domains change often, and we have not run a controlled comparison, so a ranking from us would not be reliable.',
    ],
    sections: [
      {
        title: 'What to check before choosing a temporary email service',
        subsections: [
          {
            title: 'How long does a mailbox last?',
            paragraphs: [
              'Very short lifetimes (ten minutes, for example) can expire before a slow verification email arrives. Long or unclear lifetimes mean your messages stay around longer. A visible expiry time is a good sign. TempMail Nova mailboxes last 24 hours and show a countdown.',
            ],
          },
          {
            title: 'Who else can open your inbox?',
            paragraphs: [
              'Many services, ours included, deliver by address with no password. That means anyone who knows or guesses an address may read it. Look for random addresses by default and a clear warning about this. Be wary of services that call a public inbox "private" or "encrypted" without explaining how.',
            ],
          },
          {
            title: 'Can you get a new address or delete the current one?',
            paragraphs: [
              'You should be able to switch to a fresh address, and ideally delete the current mailbox and its messages yourself.',
            ],
          },
          {
            title: 'How are HTML emails and attachments handled?',
            paragraphs: [
              'Received HTML should be sanitized so scripts do not run in your browser. If a service claims it blocks all tracking, check whether images from the email still load. Attachments should be downloadable only when you choose, never opened automatically.',
            ],
          },
          {
            title: 'Are the claims believable?',
            paragraphs: [
              'Phrases such as "100% anonymous", "military-grade encryption" or "no logs at all" are hard to verify and often not true of any web service. A service that states its limits is usually more trustworthy than one that promises everything.',
            ],
          },
          {
            title: 'How intrusive is the page?',
            paragraphs: [
              'Ads that look like download or copy buttons, pop-ups over the inbox, or ads mixed into the message list make mistakes more likely. The copy button and the inbox should be easy to find.',
            ],
          },
          {
            title: 'Is there a privacy policy and a way to contact someone?',
            paragraphs: [
              'Look for a privacy policy that describes what is logged and how long mail is kept, and a working contact route.',
            ],
          },
          {
            title: 'Does the website you are signing up on accept it?',
            paragraphs: [
              'No service can guarantee this. Some sites block known disposable domains. If a site rejects the address, that is the site\'s choice, and for accounts you want to keep a real address is the better option anyway.',
            ],
          },
        ],
      },
      {
        title: 'Quick reference',
        table: {
          caption: 'What to look for and what to be cautious about',
          headers: ['Check', 'Good sign', 'Be cautious if'],
          rows: [
            ['Lifetime', 'Stated clearly, with a timer', 'Not stated, or very short'],
            ['Inbox access', 'Random addresses; access limits explained', 'Called "private" with no explanation'],
            ['Control', 'New address and delete options', 'No way to remove messages'],
            ['HTML and files', 'Sanitized HTML; downloads on request', 'Claims to block "all" tracking'],
            ['Claims', 'Limits stated plainly', '"100% anonymous", "zero logs"'],
            ['Page design', 'Clear copy button and inbox', 'Ads that look like buttons'],
          ],
        },
      },
      {
        title: 'How TempMail Nova measures up',
        paragraphs: [
          'We aim to meet this checklist and to be clear where we do not. Mailboxes last 24 hours with a visible timer. You can create a new, custom, or deleted-and-replaced address. HTML is sanitized and shown in an isolated frame, but remote images can load. The inbox is not password-protected, and our server keeps operational logs as described in the [privacy policy](/privacy). Details are in [how temporary email works](/blog/how-temporary-email-works).',
        ],
      },
    ],
    takeaway: 'Pick a service that states its mailbox lifetime, explains who can access an inbox, gives you control over addresses, and avoids promises no web service can keep.',
    faqs: [
      { question: 'Are temporary email services free?', answer: 'Most receive-only services, including TempMail Nova, are free to use. Some offer paid plans with longer-lasting or private addresses.' },
      { question: 'Why do some websites block temporary email domains?', answer: 'Usually to reduce fake or duplicate accounts and abuse of free offers, and sometimes because they want a long-term marketing contact. It is their decision; if you need that account, use a real address.' },
    ],
    related: ['how-temporary-email-works', 'are-temporary-email-addresses-safe', 'what-is-temporary-email'],
  },

  {
    slug: 'temporary-email-for-otp',
    title: "Temporary email for OTP and verification codes (and fixes when they don't arrive)",
    seoTitle: "Temporary Email for OTP Codes: Tips & Troubleshooting",
    description: "Can a temporary email receive OTP and verification codes? Yes, if the site sends to it. When to use one, when not to, and five fixes when codes don't arrive.",
    excerpt: 'When a temporary inbox is a sensible place for a verification code, when it is not, and a checklist for codes that never arrive.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Yes, a temporary inbox can receive email verification codes and confirmation links, as long as the website is willing to send to it. Whether you *should* use one depends on what you are verifying.',
      'This guide covers both questions and ends with a troubleshooting list for codes that do not arrive.',
    ],
    sections: [
      {
        title: 'When it makes sense',
        paragraphs: [
          'Use a temporary address for verification when the account or action is genuinely one-off: confirming a download, a comment on a forum you will not return to, or a preview of a newsletter. If you would be annoyed to lose access to the account next month, it is not one-off.',
        ],
        callout: {
          tone: 'caution',
          title: 'Future codes go to the same address',
          text: 'Password resets, login confirmations on a new device and security alerts will be sent to whatever address is on the account. Once a temporary inbox expires, you will not receive them, and you may not be able to recover the account.',
        },
      },
      {
        title: 'When not to use one',
        list: [
          'Any account you plan to keep, including free ones such as [game accounts](/blog/temporary-email-for-gaming) and [AI tools](/blog/temporary-email-for-ai-tools).',
          'Banking, payments, crypto, government, health, school or work.',
          'Two-step verification or recovery codes for any account.',
          'Services whose terms require accurate contact information, when you intend to keep using the account.',
        ],
      },
      {
        title: 'How to receive a code with TempMail Nova',
        list: [
          'Open the [homepage](/) and select **Copy email**.',
          'Paste the address into the website\'s form and request the code.',
          'Keep the TempMail Nova page open. The message normally appears within a short time; the page updates on its own.',
          'Open the message, use the code or link, and close the page when you are done.',
        ],
        ordered: true,
      },
      {
        title: 'If the code does not arrive',
        paragraphs: ['Work through these in order:'],
        list: [
          '**Check the address.** Compare what you pasted with the address on the page. A missing character is the most common cause.',
          '**Give it a minute, then select Refresh inbox.** Some senders queue messages. Requesting several codes quickly can also trigger their rate limits.',
          '**Make sure the address has not changed.** If you selected New address or Delete, the old address is no longer shown on your page.',
          '**Check the expiry timer.** If the mailbox has expired, mail sent to it will not be shown to you.',
          '**Assume the site may not send to disposable domains.** Some websites silently skip them. If nothing arrives after a few minutes, that is the likely reason, and the site probably wants a permanent address.',
        ],
        ordered: true,
      },
      {
        title: 'Keep codes private',
        paragraphs: [
          'Verification codes are a small secret. Because a temporary inbox is not password-protected, choose a random address rather than a guessable custom one, and do not share it more widely than the form you are filling in. More in [are temporary email addresses safe?](/blog/are-temporary-email-addresses-safe).',
        ],
      },
    ],
    takeaway: 'Temporary inboxes are fine for one-off verification. For any account you want to keep, the address on the account needs to be one you will still control later.',
    faqs: [
      { question: 'Can I receive SMS codes with TempMail Nova?', answer: 'No. TempMail Nova only receives email. It does not provide phone numbers.' },
      { question: 'Why did the code arrive late?', answer: 'Delivery timing is controlled by the sending website. Some queue verification emails, retry after a delay, or deliver slowly to domains they have not seen before.' },
      { question: 'Can someone else see my code?', answer: 'Anyone who knows the address may be able to open the inbox. Random addresses make that unlikely, but do not use a temporary inbox for codes that protect something important.' },
    ],
    related: ['are-temporary-email-addresses-safe', 'temporary-email-vs-permanent-email', 'how-temporary-email-works'],
  },

  {
    slug: 'temporary-email-for-shopping',
    title: "Temporary email for online shopping: get the discount, skip the spam",
    seoTitle: "Temporary Email for Online Shopping: Get Codes, Skip Spam",
    description: "Use a temporary email to grab sign-up discount codes without the marketing emails, and learn why orders, deliveries and returns need a real address.",
    excerpt: 'Sign-up discount codes are a good fit for a temporary address. Orders, deliveries and returns usually are not. Here is where to draw the line.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Many online shops offer a discount in exchange for your email address, and then send marketing emails for as long as you let them. A temporary inbox is a reasonable way to receive a one-time code without joining that list.',
      'Once you actually buy something, the calculation changes. Orders produce emails you may need weeks later.',
    ],
    sections: [
      {
        title: 'Where a temporary address fits',
        list: [
          '**A sign-up code you will use now.** Receive it, copy it to checkout, and you are done.',
          '**Checking prices or stock notifications** for a shop you are unsure about, when the notification is only useful in the next day.',
        ],
        paragraphsAfter: [
          'Some shops limit welcome codes to one per customer and check more than the email address. Using many addresses to claim the same offer repeatedly may break the shop\'s terms and can get orders cancelled. Our [terms](/terms) do not allow using the service to abuse promotions.',
        ],
      },
      {
        title: 'Where it does not',
        list: [
          '**Placing an order.** Order confirmations, shipping updates, delivery problems and return labels often arrive days or weeks later, after a temporary inbox has expired.',
          '**Anything with a warranty or subscription.** You may need the receipt or account access much later.',
          '**Store accounts you will reuse.** Password resets go to the address on the account.',
        ],
        callout: {
          tone: 'note',
          title: 'A better fit for regular shops',
          text: 'Use a plus address (you+shopname@example.com) or a forwarding alias for shops you buy from. You keep receiving order emails, and you can filter or switch off marketing later. See [temporary email vs email aliases](/blog/temporary-email-vs-email-alias).',
        },
      },
      {
        title: 'A simple routine',
        list: [
          'Get the discount code with a [temporary address](/).',
          'At checkout, enter the address you want order updates sent to.',
          'Untick marketing consent boxes, if offered.',
        ],
        ordered: true,
      },
    ],
    takeaway: 'Use a temporary inbox for the code, and a lasting address for the order.',
    faqs: [
      { question: 'Will I get my order confirmation at a temporary address?', answer: 'Usually yes, if the shop sends to it, but you will lose access to it and any later shipping or return emails after 24 hours. Use a lasting address for orders.' },
    ],
    related: ['protect-inbox-from-spam', 'temporary-email-vs-email-alias', 'temporary-email-vs-permanent-email'],
  },

  {
    slug: 'temporary-email-for-testing',
    title: "Temporary email for testing: a practical QA guide for developers",
    seoTitle: "Temporary Email for Testing: QA Guide for Developers",
    description: "Test signup, verification and password-reset emails with a temporary inbox. What to check in each message, safe test rules, and when a mail catcher is better.",
    excerpt: 'Using a temporary inbox for quick manual checks of your own product\'s emails, what to look at in each message, and when a local mail catcher is the better tool.',
    topic: 'testing-development',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'If you build or test a product that sends email, you need somewhere to receive those messages. A temporary inbox is handy for quick manual checks against a staging or production environment: it takes seconds to get a fresh address, and you can see exactly what a new user would receive.',
      'It is not the right tool for everything. This guide covers what to test, how, and when to use something else.',
    ],
    sections: [
      {
        title: 'Good uses',
        list: [
          '**Sign-up and verification flows.** Does the email arrive, is the link correct for the environment, does it expire when it should?',
          '**Password reset.** Is the link single-use? What happens if it is used twice or after expiry?',
          '**Real-world delivery.** A local mail catcher never leaves your machine. Sending to a real external domain exercises your email provider, DNS and authentication setup.',
          '**Rendering checks.** Open the message and look for broken images, missing alt text and wrong links. Also check that your plain-text version makes sense on its own.',
        ],
      },
      {
        title: 'What to check in each message',
        list: [
          'Subject and sender name are what a user would expect.',
          'Links point to the right domain for the environment, not `localhost` or staging in production.',
          'The plain-text part exists and makes sense on its own.',
          'Authentication results: send a copy to a regular mailbox, use its "show original" option, and look for `spf=`, `dkim=` and `dmarc=` results. See [reading email headers](/blog/email-headers-temporary-email).',
          'Unsubscribe headers on marketing mail, if your product sends any.',
        ],
      },
      {
        title: 'Rules for testing with a public inbox',
        paragraphs: [
          'A temporary inbox is not private. Anyone who knows the address may be able to read it (see [temporary email safety](/blog/are-temporary-email-addresses-safe)). That leads to a few firm rules:',
        ],
        list: [
          'Use test accounts and fake data only. Never send real customer data, API keys, internal URLs or tokens that grant access to anything.',
          'Use random addresses rather than predictable ones like `test1@`.',
          'Expect the mailbox to vanish after 24 hours. Do not build long-lived test accounts on it.',
          'Clean up test users in your own system; the temporary inbox expiring does not remove them.',
        ],
      },
      {
        title: 'When to use a local mail catcher instead',
        paragraphs: [
          'For day-to-day development and for automated tests, a mail catcher that runs locally or in your CI is usually better. Tools such as [Mailpit](https://mailpit.axllent.org/) accept SMTP from your app and show messages in a web UI and an API. They are private, fast, and do not depend on an outside service.',
          'A reasonable split: use a mail catcher for development and automated tests, and a real external inbox for occasional end-to-end delivery checks. For automation specifically, see [temporary email for QA automation](/blog/temporary-email-qa-automation).',
        ],
      },
    ],
    takeaway: 'A temporary inbox is quick for manual, end-to-end checks with test data. Use a private mail catcher for development and automated tests.',
    faqs: [
      { question: 'Does TempMail Nova offer a public API for tests?', answer: 'Not at the moment. The website is designed for people using a browser. For automated tests, use a mail catcher you control.' },
      { question: 'Can I see the raw headers of a test email?', answer: 'Not in TempMail Nova. The viewer shows the message itself, not its headers. Use a regular mail app or a mail catcher when you need full headers.' },
    ],
    sources: [
      { label: 'Mailpit documentation', url: 'https://mailpit.axllent.org/' },
    ],
    related: ['temporary-email-qa-automation', 'email-headers-temporary-email', 'how-temporary-email-works'],
  },

  {
    slug: 'are-temporary-email-addresses-safe',
    title: "Are temporary email addresses safe? The real risks, explained",
    seoTitle: "Is Temporary Email Safe? Real Risks and How to Stay Safe",
    description: "Is temp mail safe to use? What a temporary email address protects, the real risks (public inboxes, lost accounts, tracking) and simple rules to stay safe.",
    excerpt: 'A temporary address protects your real one from a website. It does not protect the messages themselves. The benefits, the real risks and how to use one safely.',
    topic: 'privacy-safety',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'A temporary email address is safe for what it is designed for: receiving a low-stakes message without giving a website your real address. It is not safe for keeping secrets, and it becomes risky when used for accounts you will need later.',
      'The difference comes down to two facts. The website never learns your personal address. But the inbox has no password, so its contents are not private.',
    ],
    sections: [
      {
        title: 'What it protects',
        list: [
          '**Your personal address.** The website, and anyone it shares or leaks its list to, has a short-lived address instead of yours.',
          '**Your main inbox.** Marketing and spam sent to that address later never reaches you.',
          '**Some exposure in a breach.** If that website is breached, the leaked address is not linked to your real inbox. Anything else you gave the site, such as your name or password, is still exposed. Details in [disposable email and data breaches](/blog/disposable-email-data-breach).',
        ],
      },
      {
        title: 'The real risks',
        subsections: [
          {
            title: 'Other people may read the inbox',
            paragraphs: [
              'On TempMail Nova, as on most disposable inbox services, mail is delivered by address and there is no login. Anyone who knows or guesses an address may be able to read what arrives. A random address makes guessing unlikely; a short custom name like `alex@` does not.',
            ],
          },
          {
            title: 'You can lose the account you signed up for',
            paragraphs: [
              'Password resets and security checks go to the account\'s email address. After the mailbox expires, you will not receive them. For many services, that means the account cannot be recovered.',
            ],
          },
          {
            title: 'Attachments and links still need care',
            paragraphs: [
              'We sanitize HTML to remove scripts, but a temporary inbox receives whatever senders choose to send. Only download files and follow links you were expecting.',
            ],
          },
          {
            title: 'Senders may still see when you open a message',
            paragraphs: [
              'Remote images in emails can load when you open them, which can tell a sender that the message was read and reveal your IP address to their server. [Email privacy in 2026](/blog/email-privacy-in-2026) explains open tracking.',
            ],
          },
        ],
      },
      {
        title: 'Never use one for',
        list: [
          'Banking, payments, investments or crypto.',
          'Government, tax, healthcare, insurance, school or work accounts.',
          'Your main social media, gaming, cloud storage or AI accounts.',
          'Anything that sends personal documents, passwords or recovery codes.',
        ],
      },
      {
        title: 'What TempMail Nova does and does not do',
        table: {
          caption: 'Our actual safeguards and their limits',
          headers: ['Area', 'What we do', 'Limit'],
          rows: [
            ['Received messages', 'HTML sanitized; shown in an isolated frame where scripts cannot run', 'Remote images can load'],
            ['Retention', 'Mailboxes expire after 24 hours; automatic cleanup removes them', 'Cleanup runs in the background, not at the exact second'],
            ['Access', 'Random addresses by default', 'No password; anyone with the address may read it'],
            ['Sending', 'Receive only', 'You cannot reply'],
            ['Logs', 'Operational server logs and analytics', 'See the [privacy policy](/privacy) for details'],
          ],
        },
      },
      {
        title: 'Using one safely',
        list: [
          'Use the random address rather than a custom one unless you need it.',
          'Act on the message right away, and save anything you need.',
          'Choose **Delete** when you are done if you want the messages gone sooner.',
          'Switch to a permanent address or alias for anything you will return to.',
        ],
      },
    ],
    takeaway: 'Temporary addresses keep your real address away from websites. They do not keep the messages private, and they cannot help you recover an account later.',
    faqs: [
      { question: 'Is a temporary email anonymous?', answer: 'No. It hides your email address from the website, but not your IP address, device or other details you provide. The service you use also sees your connection.' },
      { question: 'Can someone else access my TempMail Nova inbox?', answer: 'Anyone who knows the exact address may be able to open it. Random addresses make that unlikely; do not rely on a temporary inbox for anything sensitive.' },
    ],
    related: ['what-is-temporary-email', 'disposable-email-data-breach', 'email-privacy-in-2026'],
  },

  {
    slug: 'disposable-email-data-breach',
    title: "Can a disposable email protect you from data breaches?",
    seoTitle: "Can Disposable Email Protect You From Data Breaches?",
    description: "What a disposable or separate email address really protects when a website is breached, what it cannot, and what to do if your email shows up in a leak.",
    excerpt: 'When a site you used is breached, a separate address limits the damage in specific ways. Passwords and personal details are a different problem.',
    topic: 'privacy-safety',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Breaches happen to large and small websites alike, and the leaked data usually includes email addresses. Using a different address for low-importance sign-ups limits what a breach can do to you, but only in specific ways.',
    ],
    sections: [
      {
        title: 'What attackers do with leaked addresses',
        list: [
          '**Try the password elsewhere.** If a breach includes passwords and you reused one, attackers try the same email and password on other sites. This is called credential stuffing.',
          '**Send targeted phishing.** Knowing you have an account with a company makes a fake "problem with your account" email more convincing.',
          '**Add you to spam lists.** Leaked lists are shared and sold.',
        ],
      },
      {
        title: 'Where a separate address helps',
        list: [
          'Phishing that mentions the breached site arrives at an address you no longer read, not your main inbox.',
          'Spam from the leaked list does not reach you.',
          'The leaked address is harder to match to your other accounts, which are under a different address.',
        ],
      },
      {
        title: 'Where it does not help',
        list: [
          '**Passwords.** If you created a password on the breached site and reused it anywhere, the email you used does not matter. Unique passwords, ideally from a password manager, are the real fix.',
          '**Other personal details.** Your name, phone number, address or payment details are exposed just the same.',
          '**Accounts you still need.** If you used a temporary inbox for an account you care about, you may be unable to reset its password after a breach.',
        ],
        callout: {
          tone: 'note',
          title: 'Aliases are better for accounts you keep',
          text: 'A forwarding alias per service gives the same separation, keeps password resets working, and lets you switch off an alias that starts receiving spam. See [temporary email vs email aliases](/blog/temporary-email-vs-email-alias).',
        },
      },
      {
        title: 'If your main address appears in a breach',
        list: [
          'Change the password on the breached service, and anywhere you reused it.',
          'Turn on two-step verification for your email account first, then other important accounts.',
          'Be suspicious of emails referring to the breached service; go to its website directly instead of using links.',
          'Consider a breach notification service such as [Have I Been Pwned](https://haveibeenpwned.com/) to hear about future incidents.',
        ],
        ordered: true,
      },
    ],
    takeaway: 'A separate address limits phishing and spam after a breach. Unique passwords and two-step verification are what protect your accounts.',
    faqs: [
      { question: 'Can a leaked temporary address be traced back to me?', answer: 'The address itself is not linked to your personal inbox. Other data you gave the breached website, and records the website kept such as your IP address, may still identify you.' },
    ],
    sources: [
      { label: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/' },
    ],
    related: ['are-temporary-email-addresses-safe', 'protect-inbox-from-spam', 'temporary-email-vs-email-alias'],
  },

  {
    slug: 'temporary-email-for-software-demos',
    title: "Temporary email for software demos: try first, talk to sales later",
    seoTitle: "Temporary Email for SaaS Demos: Try First, Talk Later",
    description: "Watch a SaaS demo or product tour before joining a sales sequence. When a temporary email is reasonable, and when to switch to your work address instead.",
    excerpt: 'A temporary address can unlock a recorded demo without starting a sales sequence. For real trials and anything involving company data, use your work email.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Software companies often put recorded demos, product tours and pricing sheets behind a form. Filling it in with your work address typically starts a sequence of follow-up emails and calls. If you are only at the "is this even relevant?" stage, a temporary address lets you see the material first.',
    ],
    sections: [
      {
        title: 'Reasonable uses',
        list: [
          'Watching a recorded demo or product tour.',
          'Downloading a feature overview or spec sheet.',
          'Seeing whether a self-serve sandbox covers what you need, using made-up data.',
        ],
      },
      {
        title: 'Use your work address instead when…',
        list: [
          '**You start a real trial.** Trials turn into accounts; billing, admin invitations and security notices go to the account address.',
          '**You would upload company data.** Anything involving your employer\'s information belongs in an account your employer can manage and recover.',
          '**Your organization has rules** about evaluating vendors or signing up for software.',
          '**You want a quote or a proof of concept.** At that point the vendor needs to reach you.',
        ],
      },
      {
        title: 'Keep it fair to the vendor',
        paragraphs: [
          'Do not create repeated trial accounts to avoid paying, and do not share demo accounts. Many vendors prohibit this, and it is the kind of misuse our [terms](/terms) do not allow. If the product looks promising, move to a real account and tell sales how you want to be contacted.',
        ],
      },
    ],
    takeaway: 'Use a temporary address to look at marketing material. Switch to your work email as soon as you start a real evaluation.',
    faqs: [
      { question: 'Will vendors block disposable addresses on demo forms?', answer: 'Some do, especially for business-to-business products. If a form rejects the address, the vendor probably expects a work email.' },
    ],
    related: ['temporary-email-for-testing', 'temporary-email-vs-permanent-email', 'avoid-email-spam-ebooks'],
  },

  {
    slug: 'avoid-email-spam-ebooks',
    title: "How to download free ebooks and PDFs without getting email spam",
    seoTitle: "How to Download Free Ebooks Without Email Spam",
    description: "Get gated ebooks, templates and PDFs without joining another mailing list. A step-by-step temporary email method, plus tips for downloading files safely.",
    excerpt: 'Free guides and templates are often emailed in exchange for your address. How to get the file without the newsletter, and how to stay safe with downloads.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Free guides, templates and reports are often "gated": you enter an email address and the file is sent to you. The file is the point; the email address is the price. A temporary inbox lets you receive the file without joining a mailing list you did not want.',
    ],
    sections: [
      {
        title: 'Step by step',
        list: [
          'Open [TempMail Nova](/) and select **Copy email**.',
          'Paste the address into the download form. Leave marketing boxes unticked.',
          'Wait on the TempMail Nova page for the message. Some forms ask you to confirm the address first; open that message and follow the confirmation link.',
          'Download the file and save it where you keep documents. The inbox expires after 24 hours, but the saved file is yours.',
        ],
        ordered: true,
      },
      {
        title: 'Download safely',
        list: [
          'Expect a PDF or a common document format. Be wary of `.exe`, `.scr`, `.js`, or archives you did not expect.',
          'If a link sends you to a different website than the one you signed up on, stop and check.',
          'Open downloads with an up-to-date viewer, and do not enable macros in documents from unknown senders.',
        ],
      },
      {
        title: 'When to use your real address instead',
        paragraphs: [
          'If you actually want the newsletter, or the download is part of a course or membership you will return to, use your real address or an alias. Updates, corrections and access links will keep arriving.',
        ],
      },
    ],
    takeaway: 'Get the file, save it, and let the temporary inbox expire. Treat unexpected file types as a warning sign.',
    faqs: [
      { question: 'Will I lose the file after 24 hours?', answer: 'Not if you downloaded it. Only the inbox and the email expire. Download links inside the email may also stop working later, so save the file right away.' },
    ],
    related: ['protect-inbox-from-spam', 'temporary-email-for-shopping', 'are-temporary-email-addresses-safe'],
  },

  {
    slug: 'web-scraping-email-spam',
    title: "Why web scraping bots harvest email addresses (and how to protect yours)",
    seoTitle: "Web Scraping and Email Spam: How to Protect Your Address",
    description: "Bots scrape email addresses from websites, forums and code to build spam lists. How email harvesting works and safer ways to share your contact details.",
    excerpt: 'Addresses published on websites, forums and in code are easy to collect automatically. Practical ways to be reachable without inviting spam.',
    topic: 'privacy-safety',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'An email address written in plain text on a public page can be found by software that reads web pages and looks for anything shaped like `name@domain`. Collected addresses end up on spam and phishing lists. If you have ever posted your address on a forum and then received more junk, this is a likely reason.',
    ],
    sections: [
      {
        title: 'Where addresses get collected',
        list: [
          'Personal websites, "contact me" pages and online CVs.',
          'Forum posts, comments and public profiles.',
          'Public documents and PDFs.',
          'Code repositories, where commit metadata can include an author\'s email address.',
        ],
      },
      {
        title: 'Ways to be reachable without publishing your main address',
        list: [
          '**A contact form** instead of a written address.',
          '**A separate address or alias** used only for public listing, which you can filter or retire.',
          '**Your code host\'s private "noreply" address** for commits, where the platform provides one.',
          '**Writing the address in an unusual way** (for example `name at domain dot com`). This deters simple collectors but not determined ones, and makes it harder for real people to copy.',
        ],
      },
      {
        title: 'Where a temporary inbox fits',
        paragraphs: [
          'A temporary address is useful for joining a forum or community once, when the only email you need is the confirmation. It is not a good contact address to publish: it expires within a day, and people may try to reach you after that. For published contact details, use an alias you control.',
        ],
      },
      {
        title: 'If your address is already out there',
        paragraphs: [
          'Removing it from pages you control helps with future collection but will not remove it from lists that already have it. Spam filtering, reporting junk, and gradually moving important accounts to a less-exposed address are the realistic options. See [protecting your inbox from spam](/blog/protect-inbox-from-spam).',
        ],
      },
    ],
    takeaway: 'Do not publish your main address in plain text. Use a form or an alias for public contact, and a temporary inbox only for one-off confirmations.',
    faqs: [
      { question: 'Does writing "name [at] domain" stop scrapers?', answer: 'It deters simple scripts, but anything a person can read can be decoded by software. Treat it as a small hurdle, not protection.' },
    ],
    related: ['protect-inbox-from-spam', 'email-privacy-in-2026', 'temporary-email-vs-email-alias'],
  },

  {
    slug: 'temporary-email-for-gaming',
    title: "Temporary email for gaming: fine for forums, risky for accounts",
    seoTitle: "Temporary Email for Gaming: When It Is Safe and When Not",
    description: "Should you use a temporary email for gaming? Fine for fan forums and newsletters, risky for game accounts with purchases, progress or friends. Here is why.",
    excerpt: 'Fan forums and one-off newsletters are fine. Any account with purchases, progress or friends needs an address you will still control.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Gamers sign up for a lot: launchers, stores, forums, beta sign-ups and newsletters. Some of these are throwaway; many are not. Losing a game account because its email expired is a common, avoidable problem.',
    ],
    sections: [
      {
        title: 'Reasonable uses',
        list: [
          'Joining a fan forum or wiki to post once.',
          'A newsletter or announcement list you want to preview.',
          'A one-time confirmation for something that has no account behind it.',
        ],
      },
      {
        title: 'Use an address you keep for',
        list: [
          'Platform accounts and launchers, and any account holding purchases, subscriptions or in-game currency.',
          'Accounts with progress, friends lists or items you would be upset to lose.',
          'Beta or playtest programmes that send keys, surveys or build updates over weeks.',
        ],
        callout: {
          tone: 'caution',
          title: 'Recovery and security emails',
          text: 'Game accounts are frequent targets for takeover. Recovery, new-device and security alerts go to the account address. If that inbox has expired, you lose the main way to get the account back.',
        },
      },
      {
        title: 'Stay within the rules',
        paragraphs: [
          'Do not use temporary addresses to create multiple accounts to get around bans, claim the same promotion repeatedly, or otherwise break a game\'s rules. It risks your accounts and is not allowed by our [terms](/terms).',
        ],
      },
    ],
    takeaway: 'Keep temporary addresses for forums and previews. Any account worth recovering needs an email you will still have next year.',
    faqs: [
      { question: 'Can I change my game account email later?', answer: 'Often, but many platforms require a code sent to the current address first. Change it before the temporary inbox expires, or you may not be able to.' },
    ],
    related: ['are-temporary-email-addresses-safe', 'temporary-email-vs-permanent-email', 'temporary-email-for-otp'],
  },

  {
    slug: 'email-headers-temporary-email',
    title: "How to read email headers: Received, SPF, DKIM and DMARC explained",
    seoTitle: "How to Read Email Headers: SPF, DKIM & DMARC Explained",
    description: "Learn to read email headers: which fields matter, how to follow Received lines, check SPF, DKIM and DMARC results, and spot phishing or delivery problems.",
    excerpt: 'Which header fields matter, how to read the delivery path and authentication results, and how to use them to spot phishing or debug your own emails.',
    topic: 'testing-development',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Every email carries headers: lines of metadata above the message body that record who sent it, where it travelled and how receiving servers judged it. Most mail apps hide them. Reading them is useful for two things: checking whether a message is genuine, and debugging emails your own product sends.',
      'To see them, use the "show original" or "view source" option in a regular mail app such as Gmail or Outlook. TempMail Nova shows the message itself, not its headers.',
    ],
    sections: [
      {
        title: 'The fields worth knowing',
        table: {
          caption: 'Common header fields and what they mean',
          headers: ['Field', 'What it shows', 'What to watch for'],
          rows: [
            ['`From`', 'The sender shown to you', 'Easily faked on its own; check authentication results'],
            ['`Reply-To`', 'Where replies would go', 'A different domain from From can be a phishing sign'],
            ['`Return-Path`', 'Where bounces go (the envelope sender)', 'Often a mailing service domain, which is normal'],
            ['`Received`', 'One line per server that handled the message', 'Read from the bottom up to follow the route'],
            ['`Authentication-Results`', 'SPF, DKIM and DMARC verdicts added by a receiving server', 'Look for pass or fail'],
            ['`DKIM-Signature`', 'A cryptographic signature from the sending domain', 'The d= value is the signing domain'],
            ['`Message-ID`', 'A unique identifier for the message', 'Useful when reporting delivery problems'],
            ['`List-Unsubscribe`', 'How to unsubscribe from a mailing', 'Present on most legitimate bulk mail'],
          ],
        },
      },
      {
        title: 'Reading Received lines',
        paragraphs: [
          'Each server that passes the message on adds a `Received` line at the top. So the bottom-most line is the earliest hop, near the sender, and the top line is the last server, near the recipient. Timestamps on each line show where delays happened.',
        ],
      },
      {
        title: 'SPF, DKIM and DMARC in one minute',
        list: [
          '**SPF** ([RFC 7208](https://www.rfc-editor.org/rfc/rfc7208)) checks whether the sending server is allowed to send for the envelope sender\'s domain.',
          '**DKIM** ([RFC 6376](https://www.rfc-editor.org/rfc/rfc6376)) checks a signature that proves the signed parts of the message were not changed and were signed by the named domain.',
          '**DMARC** ([RFC 7489](https://www.rfc-editor.org/rfc/rfc7489)) checks that SPF or DKIM passed for a domain that matches the visible From address, and tells receivers what the domain owner wants done if not.',
        ],
        paragraphsAfter: [
          'These results appear in an `Authentication-Results` header when a receiving server adds one. TempMail Nova shows the headers as delivered; our mail server does not currently add its own authentication verdicts, so you may see results from servers earlier in the path, or none.',
        ],
      },
      {
        title: 'What headers can and cannot tell you',
        paragraphs: [
          'Headers added by servers you trust are reliable; lines lower down can be invented by the sender. A message with DMARC pass for the domain you expect is very likely genuine. A failure does not always mean fraud, since forwarding can break SPF, but it is a reason for caution.',
          'Headers show information about the sender\'s side of the journey. Reading a message does not add your IP address to its headers. Remote images in the message can still reveal it to the sender when they load, in TempMail Nova as in most mail apps.',
        ],
      },
      {
        title: 'Using headers to debug your own emails',
        paragraphs: [
          'When testing your product\'s emails, check that DKIM signs with your domain, that SPF passes for your sending service, and that DMARC aligns. Receiving servers increasingly expect this, especially for bulk senders. More in [temporary email for testing](/blog/temporary-email-for-testing).',
        ],
      },
    ],
    takeaway: 'Read Received lines from the bottom up, check Authentication-Results for SPF, DKIM and DMARC, and trust only what servers you know added.',
    faqs: [
      { question: 'Can I view headers in TempMail Nova?', answer: 'No. The viewer shows the message itself, not its headers. Use a regular mail app or a mail catcher to inspect full headers.' },
    ],
    sources: [
      { label: 'RFC 7208: Sender Policy Framework (SPF)', url: 'https://www.rfc-editor.org/rfc/rfc7208' },
      { label: 'RFC 6376: DomainKeys Identified Mail (DKIM) Signatures', url: 'https://www.rfc-editor.org/rfc/rfc6376' },
      { label: 'RFC 7489: Domain-based Message Authentication, Reporting, and Conformance (DMARC)', url: 'https://www.rfc-editor.org/rfc/rfc7489' },
      { label: 'RFC 5322: Internet Message Format', url: 'https://www.rfc-editor.org/rfc/rfc5322' },
    ],
    related: ['temporary-email-for-testing', 'how-temporary-email-works', 'protect-inbox-from-spam'],
  },

  {
    slug: 'temporary-email-vs-email-alias',
    title: "Temporary email vs email aliases: which one do you need?",
    seoTitle: "Temporary Email vs Email Alias: Which One Do You Need?",
    description: "Temporary email or an email alias? Both hide your real address, but they suit different jobs. Compare lifetime, privacy, forwarding and replies.",
    excerpt: 'Both keep your real address private. A temporary inbox is for one message; an alias is for an ongoing relationship you might want to end later.',
    topic: 'getting-started',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'A [temporary inbox](/blog/what-is-temporary-email) and an email alias solve a similar problem, keeping your real address away from a website, in different ways. A temporary inbox is a separate mailbox that disappears. An alias is an extra address that forwards to your own inbox until you switch it off.',
      'The quick rule: **one message, use a temporary inbox; an ongoing account, use an alias.**',
    ],
    sections: [
      {
        title: 'How they compare',
        table: {
          caption: 'Temporary inbox compared with a forwarding alias',
          headers: ['', 'Temporary inbox', 'Forwarding alias'],
          rows: [
            ['Where mail goes', 'Stays in the temporary inbox', 'Forwarded to your real inbox'],
            ['Setup', 'None', 'An account with an alias service or mail provider'],
            ['Lifetime', 'Hours (24 on TempMail Nova)', 'Until you disable it'],
            ['Password resets later', 'No', 'Yes'],
            ['Who can read messages', 'Anyone who knows the address may be able to', 'Only you, in your own mailbox'],
            ['Replying', 'No', 'Often supported, sent from the alias'],
            ['Link to your real address', 'None', 'The alias provider knows it; the website does not'],
          ],
        },
      },
      {
        title: 'Choose a temporary inbox for',
        list: [
          'A single verification code or confirmation link.',
          'A file or discount code you will use straight away.',
          'Quick tests of your own product\'s emails with test data.',
        ],
      },
      {
        title: 'Choose an alias for',
        list: [
          'Shops you buy from, where you need order and delivery emails.',
          'Newsletters you actually read but may want to stop later.',
          'Accounts you want to keep, but where you do not want to hand over your main address.',
          'Public contact addresses you may need to retire.',
        ],
      },
      {
        title: 'What about plus addressing?',
        paragraphs: [
          'Plus addressing (`you+shop@example.com`) is free and built into many providers, and useful for filtering. It is not private: anyone can remove the `+shop` part and see your real address. Some sign-up forms also reject the plus sign.',
        ],
      },
      {
        title: 'Trust and cost',
        paragraphs: [
          'An alias service handles all mail to your aliases, so choose one you trust and read its privacy policy. Some mail providers include aliases with paid plans. A temporary inbox needs no account, but the trade-off is that its contents are not private and do not last.',
        ],
      },
    ],
    takeaway: 'Use a temporary inbox when you need one message and nothing after. Use an alias when you need the relationship to continue on your terms.',
    faqs: [
      { question: 'Does TempMail Nova forward mail to my Gmail?', answer: 'No. Messages stay in the temporary inbox and are removed when it expires. If you want forwarding, you need an alias.' },
    ],
    related: ['temporary-email-vs-permanent-email', 'protect-inbox-from-spam', 'what-is-temporary-email'],
  },

  {
    slug: 'temporary-email-public-wifi',
    title: "Temporary email for public Wi-Fi: which email to give and how to stay safe",
    seoTitle: "Temporary Email for Public Wi-Fi: Safe Sign-In Tips",
    description: "Airport, hotel or café Wi-Fi asking for your email? When a temporary email works on sign-in pages, when it will not, and simple public Wi-Fi safety tips.",
    excerpt: 'Many Wi-Fi sign-in pages ask for an email. When a temporary address is fine, why it may not work offline, and the network precautions that matter more.',
    topic: 'privacy-safety',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Airports, cafés, hotels and stations often show a sign-in page (a "captive portal") before you get online. Many ask for an email address, mainly for marketing. A temporary address can stop those emails reaching you, with one practical catch.',
    ],
    sections: [
      {
        title: 'The catch: you may not be online yet',
        paragraphs: [
          'If the portal only asks you to type an address, a temporary one works: open [TempMail Nova](/) on your phone\'s mobile data or another connection beforehand and copy an address.',
          'If the portal emails you a link or code that you must open to get online, you need a way to read that inbox before you have Wi-Fi. That usually means mobile data. Some portals allow a few minutes of access for this; many do not.',
        ],
        callout: {
          tone: 'note',
          title: 'Prepare before you travel',
          text: 'If you expect to use portals often, keep a forwarding alias just for Wi-Fi and venue sign-ups. You can read it on any connection and switch it off after the trip.',
        },
      },
      {
        title: 'Follow the venue\'s terms',
        paragraphs: [
          'Use the portal as intended. Using different addresses to get around time limits or paid tiers is not a legitimate use of this service.',
        ],
      },
      {
        title: 'Safety on the network matters more than the email',
        list: [
          'Check the network name with staff. Fake hotspots with convincing names exist.',
          'Most websites use HTTPS, which protects what you send to them. Heed browser warnings about certificates.',
          'Avoid banking and other sensitive tasks on public Wi-Fi if you can use mobile data instead.',
          'A trustworthy VPN adds protection between you and the network operator. It does not make you anonymous.',
          'Turn off automatic joining for public networks you will not use again.',
        ],
      },
    ],
    takeaway: 'A temporary address is fine for portals that only ask you to type an email. For portals that send a code, plan how you will read it before you connect.',
    faqs: [
      { question: 'Does a temporary email make public Wi-Fi safer?', answer: 'No. It only keeps the venue\'s marketing out of your inbox. Network safety depends on HTTPS, checking the network name, and optionally a VPN.' },
    ],
    related: ['email-privacy-in-2026', 'protect-inbox-from-spam', 'what-is-temporary-email'],
  },

  {
    slug: 'psychology-of-email-spam',
    title: "The psychology of email spam: why marketing emails are hard to ignore",
    seoTitle: "The Psychology of Email Spam: Why We Keep Opening It",
    description: "Countdown timers, fake urgency and personal subject lines are built to get opens. The psychology behind spam and marketing email, and how to cut the noise.",
    excerpt: 'Countdown timers, "last chance" subject lines and unread badges are designed to pull at your attention. How to spot them and quiet your inbox.',
    topic: 'privacy-safety',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Promotional emails are written to be opened. Many use the same small set of techniques, and once you recognise them they lose a lot of their pull. This guide describes the common ones and the practical steps that reduce how many reach you in the first place.',
    ],
    sections: [
      {
        title: 'Tactics you will recognise',
        list: [
          '**Deadlines and countdowns.** "Ends at midnight" subject lines push a quick decision. Many sales repeat on a regular cycle.',
          '**Scarcity.** "Only 3 left" or "almost gone" suggests you will miss out.',
          '**Personal-sounding subject lines.** A first name, "quick question", or "re:" makes a mass email look like a conversation.',
          '**Guilt and gentle pressure.** "We miss you" and "Did you forget something?" reminders after you leave items in a basket.',
          '**Hard-to-find unsubscribe links.** Tiny text, or several steps to leave a list.',
        ],
        paragraphsAfter: [
          'Phishing uses the same techniques with higher stakes: urgency about your account, a threatening deadline, a familiar brand. The [US Federal Trade Commission\'s phishing guidance](https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams) lists the warning signs.',
        ],
      },
      {
        title: 'Reduce the volume',
        list: [
          'Unsubscribe from lists you no longer read, using your mail app\'s built-in unsubscribe button where available.',
          'Send newsletters to a separate folder or tab and check it on a schedule.',
          'Turn off notifications for everything except people and important senders.',
          'For future sign-ups, give out a [temporary address](/) for one-off codes and an alias for ongoing accounts. See [protecting your inbox from spam](/blog/protect-inbox-from-spam).',
        ],
      },
      {
        title: 'When urgency is real',
        paragraphs: [
          'Some emails are genuinely time-sensitive: a verification code, a delivery problem, a security alert you triggered. Keeping promotional mail out of your main inbox makes those easier to notice.',
        ],
      },
    ],
    takeaway: 'Most promotional pressure comes from a few repeatable tactics. Recognise them, and reduce how many reach you by being choosy about which address you give out.',
    sources: [
      { label: 'FTC: How to recognize and avoid phishing scams', url: 'https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams' },
    ],
    related: ['protect-inbox-from-spam', 'email-privacy-in-2026', 'temporary-email-for-shopping'],
  },

  {
    slug: 'temporary-email-qa-automation',
    title: "Email testing in QA automation: Playwright, Cypress and CI patterns",
    seoTitle: "Email Testing in CI: Playwright, Cypress & Temp Inboxes",
    description: "How to test signup and verification emails in Playwright, Cypress and CI: why public temp inboxes are flaky, and a reliable mail-catcher pattern with code.",
    excerpt: 'Automated tests that depend on email need a private, controllable inbox. A reliable pattern for Playwright or Cypress, and why public disposable inboxes are a poor fit for CI.',
    topic: 'testing-development',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'End-to-end tests for sign-up, magic-link login or password reset need to read an email in the middle of the test. The reliable way to do this is a mailbox your test suite fully controls, usually a mail catcher running next to your app in CI.',
      'Public disposable inbox websites, including ours, are built for people, not for test runners. This guide explains why and shows a pattern that works.',
    ],
    sections: [
      {
        title: 'Why not a public temporary inbox?',
        list: [
          '**Privacy.** Anyone who knows an address may read it, and CI logs often print addresses.',
          '**Reliability.** Your tests would depend on an outside website, its rate limits and its availability.',
          '**No supported API.** TempMail Nova does not currently offer a public API for automated access. Scraping a web page makes tests brittle.',
          '**Deliverability noise.** Your email provider may treat disposable domains differently from your real users\' domains.',
        ],
      },
      {
        title: 'The pattern that works',
        list: [
          'Run a mail catcher such as [Mailpit](https://mailpit.axllent.org/) in your test environment and point your app\'s SMTP settings at it.',
          'In each test, generate a unique address, for example with a timestamp or random ID, on a domain your app accepts.',
          'Submit the form in the browser.',
          'Poll the mail catcher\'s API for a message to that address, with a timeout.',
          'Extract the link or code, continue the flow, and assert the result.',
        ],
        ordered: true,
      },
      {
        title: 'Example with Playwright',
        paragraphs: [
          '`waitForEmail` is a small helper you write against your mail catcher\'s API. Mailpit documents its REST API in the running instance and on its website.',
        ],
        code: {
          language: 'ts',
          text: [
            "import { test, expect } from '@playwright/test';",
            "import { waitForEmail } from './mail'; // your helper for the mail catcher API",
            '',
            "test('new user can verify their email', async ({ page }) => {",
            '  const address = `signup-${Date.now()}@example.test`;',
            "  await page.goto('/signup');",
            "  await page.getByLabel('Email').fill(address);",
            "  await page.getByRole('button', { name: 'Create account' }).click();",
            '',
            '  const email = await waitForEmail({ to: address, timeoutMs: 30_000 });',
            '  const link = email.text.match(/https:\\/\\/\\S+\\/verify\\S*/)?.[0];',
            '  expect(link).toBeTruthy();',
            '',
            '  await page.goto(link!);',
            "  await expect(page.getByText('Email verified')).toBeVisible();",
            '});',
          ].join('\n'),
        },
      },
      {
        title: 'Keeping the tests stable',
        list: [
          'Poll with a timeout rather than a fixed sleep. Allow enough time for your mail queue in CI.',
          'Match on the recipient address, not "latest message", so parallel tests do not read each other\'s mail.',
          'Prefer extracting from the plain-text part; HTML changes more often.',
          'Clear the mail catcher between runs, and clean up test users in your database.',
          'Keep one occasional, manual check against a real external inbox to cover DNS and authentication. [Temporary email for testing](/blog/temporary-email-for-testing) covers that side.',
        ],
      },
    ],
    takeaway: 'Automated email tests should use a private mail catcher you control, polled with a timeout and matched by recipient. Save public temporary inboxes for manual spot checks.',
    faqs: [
      { question: 'Can Playwright wait for an email by itself?', answer: 'Not directly. Your test calls your mail catcher\'s API (or your own test endpoint) and waits until the message arrives.' },
    ],
    sources: [
      { label: 'Mailpit documentation', url: 'https://mailpit.axllent.org/' },
      { label: 'Playwright documentation', url: 'https://playwright.dev/docs/intro' },
    ],
    related: ['temporary-email-for-testing', 'email-headers-temporary-email', 'how-temporary-email-works'],
  },

  {
    slug: 'temporary-email-for-chatgpt',
    title: "Can you use a temporary email for ChatGPT? Read this first",
    seoTitle: "Can You Use a Temporary Email for ChatGPT? Read This First",
    description: "Thinking of signing up for ChatGPT with a temporary email? Why it can cost you your chats and account access, what OpenAI's terms say, and better options.",
    excerpt: 'A ChatGPT account holds your chat history and settings and relies on email for recovery. Why a disposable inbox is a poor fit, and what to use instead.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Short answer: **no, not for an account you will use.** A ChatGPT account stores your conversations, settings and any subscription, and email is how you log in, confirm who you are and recover access. A mailbox that expires in 24 hours cannot do that job.',
      'OpenAI\'s [Terms of Use](https://openai.com/policies/row-terms-of-use/) also say that you must provide accurate and complete information to register for an account. Whether a particular disposable domain is accepted at a given moment is up to OpenAI and can change, so we do not make compatibility claims.',
    ],
    sections: [
      {
        title: 'What goes wrong with a temporary address',
        list: [
          'You may be asked to confirm your email again on a new device or browser, after the inbox has expired.',
          'Password resets and security notices go to an inbox you no longer have.',
          'Your chat history, uploads and saved settings are tied to an account you may not be able to recover.',
          'Billing receipts for a paid plan go to the account address.',
        ],
      },
      {
        title: 'Better options if you want privacy',
        list: [
          '**A forwarding alias** that reaches your inbox but is not your main address.',
          '**A separate email account** you keep just for AI tools. For smaller apps you only want to try once, see [temporary email for AI tools](/blog/temporary-email-for-ai-tools).',
          '**Review the account\'s data controls** in its settings, which affect what happens to your conversations regardless of the email address.',
        ],
      },
      {
        title: 'What to be careful about whatever address you use',
        paragraphs: [
          'Do not paste passwords, private documents or other people\'s personal information into any AI chat unless you understand how that service stores and uses it. Read the provider\'s privacy policy, and your employer\'s rules if it is for work.',
        ],
      },
    ],
    takeaway: 'Use an email you will still control for a ChatGPT account. If you want to keep your main address private, use an alias rather than a temporary inbox.',
    faqs: [
      { question: 'Does ChatGPT accept temporary email addresses?', answer: 'We do not test or track this, and it can change at any time. More importantly, a temporary address would make the account hard or impossible to recover.' },
    ],
    sources: [
      { label: 'OpenAI Terms of Use', url: 'https://openai.com/policies/row-terms-of-use/' },
    ],
    related: ['temporary-email-for-ai-tools', 'temporary-email-vs-email-alias', 'are-temporary-email-addresses-safe'],
  },

  {
    slug: 'temporary-email-for-claude-ai',
    title: "Temporary email for Claude AI? Which email address to use instead",
    seoTitle: "Temporary Email for Claude AI? Which Email to Use Instead",
    description: "Signing up for Claude? Why a temporary email is a poor fit, what Anthropic's terms say, and what happens if you use a work email address.",
    excerpt: 'A Claude account relies on email for sign-in and recovery. Why a disposable inbox is a poor fit, and what to know about using a work address.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'Claude accounts use your email address to sign you in and to reach you about your account. For that reason a temporary inbox that expires within a day is a poor choice: you would lose the ability to get back in.',
      'Anthropic\'s [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) ask users to provide correct, current and complete account information. As with any provider, which domains are accepted can change; we do not test or claim compatibility.',
    ],
    sections: [
      {
        title: 'Choosing between personal and work addresses',
        paragraphs: [
          'Anthropic\'s consumer terms note that if you use an email address owned by your employer or another organization, your account may be linked to that organization\'s enterprise account. If you want a personal account, use a personal address. If the account is for work, follow your organization\'s policy.',
        ],
      },
      {
        title: 'Keeping your main address private',
        list: [
          'Use a forwarding alias, so sign-in emails still reach you.',
          'Or keep a separate personal address for AI and other online tools. For a quick look at smaller apps, see [temporary email for AI tools](/blog/temporary-email-for-ai-tools).',
          'Avoid temporary inboxes for any account you intend to return to.',
        ],
      },
      {
        title: 'Think about what you share',
        paragraphs: [
          'The email address is a small part of your privacy with any AI assistant. What you type and upload matters far more. Check the provider\'s privacy settings and avoid sharing sensitive personal or work information you are not permitted to share.',
        ],
      },
    ],
    takeaway: 'Use a personal address you will keep (or an alias of one) for a personal Claude account, and your organization\'s process for work use.',
    sources: [
      { label: 'Anthropic Consumer Terms of Service', url: 'https://www.anthropic.com/legal/consumer-terms' },
    ],
    related: ['temporary-email-for-chatgpt', 'temporary-email-for-ai-tools', 'temporary-email-vs-email-alias'],
  },

  {
    slug: 'temporary-email-for-ai-tools',
    title: "Temporary email for AI tools: try new apps without your main email",
    seoTitle: "Temporary Email for AI Tools: Try New Apps Safely",
    description: "Want to test a new AI image or writing tool without handing over your main email? When a temporary email is fine, what not to upload, and when to switch.",
    excerpt: 'New AI tools appear constantly and most want an email first. When a temporary address is reasonable for a first look, what not to upload, and when to switch.',
    topic: 'signups-verification',
    published: PUBLISHED,
    updated: EDITED,
    intro: [
      'New AI image generators, writing assistants and productivity tools appear all the time, and most ask for an email before you can see whether they are any good. For a quick first look at a small tool you are unsure about, a temporary address can keep its newsletters out of your inbox.',
      'The moment the tool becomes something you use, it needs a real address.',
    ],
    sections: [
      {
        title: 'A sensible first look',
        list: [
          'Sign up with a [temporary address](/) only if the tool does not need anything personal from you.',
          'Test it with made-up inputs or public material, not your own photos, documents or client work.',
          'Download anything you want to keep straight away. The account may be unreachable after the inbox expires.',
          'Decide: if you will use the tool again, create a proper account with an address you keep. The same rule applies to [software demos and trials](/blog/temporary-email-for-software-demos).',
        ],
        ordered: true,
      },
      {
        title: 'Do not upload',
        list: [
          'Photos of yourself or others, especially for avatar or face tools.',
          'Documents with personal, financial, health or company information.',
          'Anything you are not allowed to share under an employer\'s or client\'s rules.',
        ],
        paragraphsAfter: [
          'Check the tool\'s privacy policy for how long it keeps uploads and whether it uses them to train models. Smaller tools may say little; treat that as a reason for caution.',
        ],
      },
      {
        title: 'Free credits are not a loophole',
        paragraphs: [
          'Creating several accounts to collect free credits usually breaks a tool\'s terms and can get accounts closed. It is also not an acceptable use of TempMail Nova under our [terms](/terms). If a tool is worth using regularly, it is worth one real account.',
        ],
      },
      {
        title: 'For major AI assistants',
        paragraphs: [
          'Accounts on the large assistants store your history and settings and depend on email for recovery, so use an address you will keep. See our notes on [ChatGPT](/blog/temporary-email-for-chatgpt) and [Claude](/blog/temporary-email-for-claude-ai).',
        ],
      },
    ],
    takeaway: 'A temporary address is fine for a first look at a small tool with harmless test inputs. Use a real account for anything you keep using, and never trade personal data for free credits.',
    faqs: [
      { question: 'Will I lose images I generated after the inbox expires?', answer: 'Anything you downloaded is yours to keep. Images stored only inside the tool\'s account may become unreachable if you cannot log back in.' },
    ],
    related: ['temporary-email-for-chatgpt', 'temporary-email-for-claude-ai', 'are-temporary-email-addresses-safe'],
  },
];

const POSTS_BY_SLUG = new Map(BLOG_POSTS.map(post => [post.slug, post]));
export function getPost(slug: string) { return POSTS_BY_SLUG.get(slug); }

/** Plain-text words of a post, used for reading time. */
function plainWords(post: BlogPost) {
  const parts: string[] = [...post.intro, post.takeaway ?? ''];
  for (const s of post.sections) {
    parts.push(s.title, ...(s.paragraphs ?? []), ...(s.list ?? []), ...(s.paragraphsAfter ?? []), s.callout?.text ?? '', s.code?.text ?? '');
    s.subsections?.forEach(sub => parts.push(sub.title, ...(sub.paragraphs ?? []), ...(sub.list ?? [])));
    s.table?.rows.forEach(row => parts.push(...row));
  }
  post.faqs?.forEach(f => parts.push(f.question, f.answer));
  return parts.join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length;
}

/** Reading time from actual content at ~220 words per minute. */
export function readingMinutes(post: BlogPost) { return Math.max(1, Math.round(plainWords(post) / 220)); }

export function sectionId(title: string) {
  return title.toLowerCase().replace(/[`'’"?,.:()]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
