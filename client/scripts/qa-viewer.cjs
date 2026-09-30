/* Message viewer QA with a fully mocked API (no deployed API calls, no real email).
 * PLAYWRIGHT_MODULE=<path to playwright-core> node scripts/qa-viewer.cjs */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const out = path.resolve(__dirname, '../../artifacts');
const report = { checks: [], failures: [], notes: ['The API is mocked. The fixture HTML deliberately includes a <script> and a page-wide <style> to prove isolation even if server sanitizing missed them.'] };
const check = (name, ok, details) => { report.checks.push({ name, pass: !!ok, details }); if (!ok) report.failures.push({ name, details }); };

// Tiny PNG for the fake SendGrid CDN image; the width="1200" attribute tests responsiveness.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk2PqfAQAFAAKCzFGGnwAAAABJRU5ErkJggg==', 'base64');
const SENDGRID = 'cdn.mcauto-images-production.sendgrid.net/abc/logo.png';

const htmlEmail = {
  _id: 'qa-html', inboxAddress: 'qa1@tempmailnova.com', sender: { name: 'Acme Accounts', address: 'no-reply@acme.example' },
  subject: 'Confirm your email address for Acme', bodyText: 'Fallback text that should not be shown when HTML exists',
  bodyHtml: [
    '<style>body{background:rgb(255,0,0)} .nova-header{display:none}</style>',
    '<script>parent.__pwned = 1</script>',
    `<p><img src="http://${SENDGRID}" alt="Acme logo" width="1200" height="400"></p>`,
    '<table width="700" style="width:700px"><tr><td><h1>Welcome to Acme</h1>',
    '<p>Your verification code is <strong>482915</strong>.</p>',
    '<p><a href="https://acme.example/verify?token=abc123" target="_blank" rel="noopener noreferrer">Confirm your email</a></p>',
    '<img src="https://broken.example/missing.png" alt="Product photo">',
    '<img src="https://broken.example/spacer.gif">',
    '<ul><li>Code expires in 10 minutes</li></ul></td></tr></table>',
  ].join(''),
  rawHeaders: '[{"key":"received","line":"Received: from x"}]', messageId: '<qa@acme.example>',
  attachments: [{ attachmentId: 'att1', filename: 'welcome-guide-with-a-rather-long-file-name.pdf', size: 245760 }], createdAt: new Date().toISOString(),
};
const textEmail = { ...htmlEmail, _id: 'qa-text', subject: 'Plain text message', sender: { name: '', address: 'alerts@example.test' }, bodyText: 'Hello,\r\n\r\nYour download is ready: https://files.example/report.pdf.\r\n\r\nThanks', bodyHtml: '', attachments: [] };

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    for (const width of [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      await ctx.route(/googletagmanager\.com|google-analytics\.com|socket\.io/, r => r.abort());
      const imageRequests = [];
      await ctx.route(/sendgrid\.net/, r => { imageRequests.push({ url: r.request().url(), referer: r.request().headers().referer || '' }); r.fulfill({ status: 200, contentType: 'image/png', body: PNG }); });
      await ctx.route(/broken\.example/, r => r.fulfill({ status: 404, body: '' }));
      let messages = []; let failDetail = false;
      await ctx.route('**/api/v1/**', async route => {
        const url = new URL(route.request().url()); const body = { success: true };
        if (url.pathname.endsWith('/domain/public')) body.domains = [{ name: 'tempmailnova.com' }];
        if (url.pathname.endsWith('/inbox/random')) body.inbox = { address: 'qa1@tempmailnova.com', expiresAt: new Date(Date.now() + 86400000).toISOString() };
        if (url.pathname.includes('/email/inbox/')) body.emails = messages.map(m => ({ ...m, snippet: 'Preview' }));
        if (url.pathname.includes('/email/message/')) {
          if (failDetail) return route.fulfill({ status: 500, contentType: 'application/json', body: '{"success":false}' });
          body.email = [htmlEmail, textEmail].find(m => url.pathname.endsWith(m._id));
        }
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
      });
      const page = await ctx.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(base);
      await page.waitForFunction(() => document.querySelector('#temp-email-address')?.value.includes('@'));
      messages = [htmlEmail, textEmail];
      await page.getByRole('button', { name: /Acme Accounts/ }).waitFor({ timeout: 15000 });

      // HTML email renders as HTML with images
      await page.getByRole('button', { name: /Acme Accounts/ }).click();
      const frameEl = page.locator('iframe.mail-viewer-frame');
      await frameEl.waitFor();
      const frame = page.frameLocator('iframe.mail-viewer-frame');
      await frame.getByText('Welcome to Acme').waitFor();
      await page.waitForTimeout(800);
      const inFrame = await frameEl.evaluate(el => {
        const doc = el.contentDocument; const win = el.contentWindow;
        const logo = doc.querySelector('img[alt="Acme logo"]');
        return {
          sandbox: el.getAttribute('sandbox'),
          logo: logo && { src: logo.currentSrc, loaded: logo.complete && logo.naturalWidth > 0, width: logo.getBoundingClientRect().width, visible: getComputedStyle(logo).display !== 'none' },
          bodyWidth: doc.documentElement.clientWidth,
          fallback: doc.querySelector('.tmn-img-fallback')?.textContent || '',
          spacerHidden: [...doc.querySelectorAll('img')].filter(i => i.src.includes('spacer')).every(i => getComputedStyle(i).display === 'none'),
          strong: getComputedStyle(doc.querySelector('strong')).fontWeight,
          h1: !!doc.querySelector('h1'),
          link: (() => { const a = doc.querySelector('a[href*="verify"]'); return a && { href: a.href, target: a.target || doc.querySelector('base')?.target }; })(),
          text: doc.body.innerText,
          iframeHeight: el.getBoundingClientRect().height, docHeight: doc.documentElement.scrollHeight,
          scriptRan: win.__pwned === 1,
        };
      });
      const pageState = await page.evaluate(() => {
        const v = document.querySelector('.mail-viewer');
        return {
          pwned: window.__pwned === 1, pageBg: getComputedStyle(document.body).backgroundColor, headerVisible: getComputedStyle(document.querySelector('.nova-header')).display !== 'none',
          whole: v.innerText, border: getComputedStyle(v).borderTopWidth, radius: getComputedStyle(v).borderTopLeftRadius,
          overflow: document.documentElement.scrollWidth - innerWidth, viewerOverflow: v.scrollWidth - v.clientWidth,
        };
      });
      check(`@${width} HTML email is rendered as HTML (not text)`, inFrame.h1 && Number(inFrame.strong) >= 600 && inFrame.text.includes('482915'), inFrame.text.slice(0, 80));
      check(`@${width} image renders as an image, not a URL`, inFrame.logo?.loaded && inFrame.logo.visible && !inFrame.text.includes('sendgrid'), inFrame.logo);
      check(`@${width} SendGrid http image requested over https`, imageRequests.length > 0 && imageRequests.every(r => r.url.startsWith('https://')), imageRequests);
      check(`@${width} images sent without referrer`, imageRequests.every(r => !r.referer), imageRequests);
      check(`@${width} image is responsive within the message`, inFrame.logo && inFrame.logo.width <= inFrame.bodyWidth, { img: inFrame.logo?.width, body: inFrame.bodyWidth });
      check(`@${width} broken image with alt shows its alt text`, inFrame.fallback === 'Product photo', inFrame.fallback);
      check(`@${width} broken image without alt is hidden`, inFrame.spacerHidden);
      check(`@${width} link works and opens in a new tab`, inFrame.link?.href.startsWith('https://acme.example/verify?token=abc123') && inFrame.link.target === '_blank', inFrame.link);
      check(`@${width} scripts in the email cannot run`, !inFrame.scriptRan && !pageState.pwned);
      check(`@${width} email CSS cannot restyle the site`, pageState.pageBg !== 'rgb(255, 0, 0)' && pageState.headerVisible, pageState.pageBg);
      check(`@${width} iframe is sandboxed without allow-scripts`, !/allow-scripts/.test(inFrame.sandbox || '') && /allow-same-origin/.test(inFrame.sandbox || ''), inFrame.sandbox);
      check(`@${width} frame height fits its content`, Math.abs(inFrame.iframeHeight - inFrame.docHeight) <= 2, inFrame);
      check(`@${width} no header JSON or tabs shown`, !/rawHeaders|"key"|Raw Headers|Message ID|Headers/.test(pageState.whole + inFrame.text));
      check(`@${width} new card style (1px border, 14px radius)`, pageState.border === '1px' && pageState.radius === '14px', pageState);
      check(`@${width} no page or viewer horizontal overflow`, pageState.overflow <= 0 && pageState.viewerOverflow <= 0, pageState);
      check(`@${width} attachment listed with size`, await page.locator('.mail-viewer-attachments a').first().innerText().then(t => t.includes('240 KB')));
      await page.screenshot({ path: path.join(out, `viewer-${width}.png`) });
      await page.locator('.mail-viewer').screenshot({ path: path.join(out, `viewer-card-${width}.png`) });

      await page.getByRole('button', { name: 'Back to inbox' }).click();
      check(`@${width} Back returns to inbox`, await page.getByRole('button', { name: /Acme Accounts/ }).isVisible());

      // Plain-text email
      await page.getByRole('button', { name: /alerts@example\.test/ }).click();
      await page.locator('.mail-viewer-text').waitFor();
      const plain = await page.locator('.mail-viewer-text').innerText();
      check(`@${width} plain-text email keeps paragraphs`, /Hello,\n\nYour download is ready/.test(plain), plain);
      check(`@${width} plain-text links are clickable`, await page.locator('.mail-viewer-text a').first().getAttribute('href') === 'https://files.example/report.pdf');
      await page.getByRole('button', { name: 'Back to inbox' }).click();

      // Load failure
      failDetail = true;
      await page.getByRole('button', { name: /Acme Accounts/ }).click();
      await page.getByText('This message could not be loaded.').waitFor({ timeout: 8000 });
      check(`@${width} load error is shown with a way back`, await page.getByRole('button', { name: 'Back to inbox' }).isVisible());
      await page.getByRole('button', { name: 'Back to inbox' }).click();
      failDetail = false;

      check(`@${width} no JavaScript errors`, errors.length === 0, errors);
      await ctx.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(out, 'qa-viewer-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checks: report.checks.length, passed: report.checks.filter(c => c.pass).length, failures: report.failures }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
