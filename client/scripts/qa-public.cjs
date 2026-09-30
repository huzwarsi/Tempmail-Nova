/* QA for public content pages. Run against a local production build.
 * PLAYWRIGHT_MODULE=<path to playwright-core> node scripts/qa-public.cjs
 * The contact form is exercised with EmailJS mocked; no real message is sent. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const SITE = 'https://tempmailnova.com';
const out = path.resolve(__dirname, '../../artifacts');
fs.mkdirSync(out, { recursive: true });
const report = { checks: [], failures: [], pages: [], links: {}, notes: ['EmailJS requests were intercepted; no contact message was sent.', 'Contrast is computed for key text styles against their rendered background colour.'] };
const check = (name, ok, details) => { report.checks.push({ name, pass: !!ok, details }); if (!ok) report.failures.push({ name, details }); };
const widths = [320, 375, 390, 430, 768, 1024, 1440];
const samplePages = ['/blog', '/blog/what-is-temporary-email', '/blog/how-temporary-email-works', '/blog/email-headers-temporary-email', '/blog/temporary-email-qa-automation', '/about', '/how-it-works', '/faq', '/contact', '/privacy', '/terms', '/cookies', '/this-page-does-not-exist', '/'];

function lum([r, g, b]) { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); }
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); }

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const context = await browser.newContext();
    await context.route(/googletagmanager\.com|google-analytics\.com/, r => r.fulfill({ status: 200, body: '' }));
    const page = await context.newPage();
    const jsErrors = [];
    page.on('pageerror', e => jsErrors.push(e.message));

    // Sitemap-driven metadata checks
    const sitemap = await (await page.request.get(base + '/sitemap.xml')).text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
    check('Sitemap lists 9 static pages and 23 guides', urls.length === 32, urls.length);
    check('Sitemap lastmod values are real hand-set dates, not build time', lastmods.every(d => d.startsWith('2026-08-16') || d.startsWith('2026-09-30')), [...new Set(lastmods)]);
    const titles = new Map(); const descs = new Map(); const internal = new Set();
    for (const url of urls) {
      const p = url.replace(SITE, '') || '/';
      const res = await page.goto(base + p, { waitUntil: 'domcontentloaded' });
      const info = await page.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        ogUrl: document.querySelector('meta[property="og:url"]')?.content || '',
        robots: document.querySelector('meta[name="robots"]')?.content || '',
        h1: document.querySelectorAll('h1').length,
        jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent)['@type']; } catch { return 'INVALID'; } }),
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h.startsWith('/') && !h.startsWith('//')),
        ids: [...document.querySelectorAll('[id]')].map(e => e.id),
        anchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)),
        emptyLinks: [...document.querySelectorAll('a, button')].filter(e => !(e.textContent.trim() || e.getAttribute('aria-label'))).length,
      }));
      info.links.forEach(l => internal.add(l.split('#')[0] || '/'));
      titles.set(info.title, (titles.get(info.title) || 0) + 1);
      descs.set(info.desc, (descs.get(info.desc) || 0) + 1);
      report.pages.push({ path: p, status: res.status(), title: info.title, h1: info.h1, jsonld: info.jsonld });
      check(`${p}: 200`, res.status() === 200, res.status());
      check(`${p}: one H1`, info.h1 === 1, info.h1);
      check(`${p}: self canonical`, info.canonical === url || (p === '/' && info.canonical === SITE + '/'), info.canonical);
      check(`${p}: og:url matches`, info.ogUrl === url || (p === '/' && [SITE, SITE + '/'].includes(info.ogUrl)), info.ogUrl);
      check(`${p}: indexable`, !/noindex/.test(info.robots), info.robots);
      check(`${p}: description 70-170 chars`, info.desc.length >= 70 && info.desc.length <= 170, info.desc.length);
      check(`${p}: valid JSON-LD`, info.jsonld.length > 0 && !info.jsonld.includes('INVALID'), info.jsonld);
      check(`${p}: in-page anchors resolve`, info.anchors.every(a => info.ids.includes(a)), info.anchors.filter(a => !info.ids.includes(a)));
      check(`${p}: every link/button has a name`, info.emptyLinks === 0, info.emptyLinks);
      if (p.startsWith('/blog/')) {
        check(`${p}: BlogPosting + BreadcrumbList`, info.jsonld.includes('BlogPosting') && info.jsonld.includes('BreadcrumbList'), info.jsonld);
        check(`${p}: no FAQPage markup`, !info.jsonld.includes('FAQPage'));
      }
    }
    check('Titles are unique', [...titles.values()].every(n => n === 1), [...titles].filter(([, n]) => n > 1));
    check('Descriptions are unique', [...descs.values()].every(n => n === 1), [...descs].filter(([, n]) => n > 1));

    // Internal link crawl
    for (const link of internal) {
      const r = await page.request.get(base + link, { maxRedirects: 0 });
      report.links[link] = r.status();
    }
    const broken = Object.entries(report.links).filter(([, s]) => s >= 400);
    check('No broken internal links', broken.length === 0, broken);
    await page.goto(base + '/blog');
    const listed = await page.$$eval('a[href^="/blog/"]', as => [...new Set(as.map(a => a.getAttribute('href')))]);
    check('Every guide is linked from the guides index (no orphans)', urls.filter(u => u.includes('/blog/')).every(u => listed.includes(u.replace(SITE, ''))), listed.length);

    // 404
    const nf = await page.goto(base + '/this-page-does-not-exist');
    check('Unknown URL returns real 404', nf.status() === 404, nf.status());
    check('404 page is noindex', /noindex/.test(await page.getAttribute('meta[name="robots"]', 'content') || ''));

    // Layout at each width
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const p of samplePages) {
        await page.goto(base + p, { waitUntil: p === '/' ? 'domcontentloaded' : 'networkidle' });
        const m = await page.evaluate(() => {
          const prose = document.querySelector('.prose-nova p');
          const small = [...document.querySelectorAll('.nova-public p, .nova-public li')].filter(e => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 13).length;
          const smallTargets = [...document.querySelectorAll('.nova-public a, .nova-public button, .nova-public summary')].filter(e => {
            const r = e.getBoundingClientRect(); if (!r.width || getComputedStyle(e).display === 'inline') return false; return r.height < 24;
          }).length;
          return { overflow: document.documentElement.scrollWidth - window.innerWidth, proseSize: prose ? parseFloat(getComputedStyle(prose).fontSize) : null, measure: prose ? prose.getBoundingClientRect().width : null, small, smallTargets };
        });
        check(`${p} @${width}: no horizontal overflow`, m.overflow <= 0, m.overflow);
        if (p !== '/') check(`${p} @${width}: no text under 13px`, m.small === 0, m.small);
        if (p !== '/') check(`${p} @${width}: block targets at least 24px tall`, m.smallTargets === 0, m.smallTargets);
        if (m.proseSize) check(`${p} @${width}: body text 16px+`, m.proseSize >= 16, m.proseSize);
        if (m.measure && width >= 1024) check(`${p} @${width}: line length at most 720px`, m.measure <= 720, m.measure);
      }
      if (width === 1440 || width === 390) {
        for (const [p, name] of [['/blog', 'guides'], ['/blog/how-temporary-email-works', 'article'], ['/about', 'about'], ['/privacy', 'privacy'], ['/contact', 'contact']]) {
          await page.goto(base + p, { waitUntil: 'networkidle' });
          await page.screenshot({ path: path.join(out, `public-${name}-${width}.png`), fullPage: true });
        }
      }
    }

    // Contrast for key text styles
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/blog/how-temporary-email-works');
    const contrast = await page.evaluate(() => {
      const rgb = s => s.match(/\d+/g).slice(0, 3).map(Number);
      const bg = el => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && !c.endsWith(', 0)') && c !== 'transparent') return rgb(c); } return [255, 255, 255]; };
      return ['.page-meta', '.nova-breadcrumbs a', '.section-kicker', '.prose-nova p', '.prose-nova a', '.row-meta', '.toc a', '.callout', '.aside-cta p', '.nova-footer p', 'caption'].map(sel => {
        const el = document.querySelector(sel); if (!el) return { sel, missing: true };
        return { sel, fg: rgb(getComputedStyle(el).color), bg: bg(el), size: parseFloat(getComputedStyle(el).fontSize) };
      });
    });
    for (const c of contrast) if (!c.missing) { const r = ratio(c.fg, c.bg); check(`Contrast ${c.sel} ≥ 4.5:1`, r >= 4.5, r.toFixed(2)); }

    // Keyboard: skip link, then breadcrumb
    await page.goto(base + '/blog/how-temporary-email-works');
    await page.keyboard.press('Tab');
    check('First Tab reaches skip link', await page.evaluate(() => document.activeElement?.classList.contains('skip-link')));
    await page.keyboard.press('Enter');
    check('Skip link moves focus to main content', await page.evaluate(() => document.activeElement?.id === 'main-content'));
    const tocHref = await page.getAttribute('.toc a', 'href');
    await page.click('.toc a'); await page.waitForTimeout(1200);
    check('TOC link scrolls to its section', await page.evaluate(h => { const el = document.getElementById(h.slice(1)); return el && Math.abs(el.getBoundingClientRect().top) < 200; }, tocHref), tocHref);
    const faq = page.locator('.article-faq summary').first();
    await faq.focus(); await page.keyboard.press('Enter');
    check('Article FAQ opens with keyboard', await page.locator('.article-faq details').first().evaluate(d => d.open));

    // Mobile menu on a content page
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/privacy');
    await page.click('.mobile-toggle');
    check('Mobile menu opens on content pages', await page.locator('#mobile-navigation').isVisible());
    await page.keyboard.press('Escape');
    check('Mobile menu closes on Escape and returns focus', !(await page.locator('#mobile-navigation').count()) && await page.evaluate(() => document.activeElement?.classList.contains('mobile-toggle')));

    // Contact form (EmailJS mocked)
    let emailjsCalls = 0; let mode = 500;
    await context.route(/api\.emailjs\.com/, r => { emailjsCalls++; r.fulfill({ status: mode, body: mode === 200 ? 'OK' : 'Mocked failure' }); });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + '/contact', { waitUntil: 'networkidle' });
    await page.click('button[type="submit"]');
    check('Empty submit shows field errors without sending', (await page.locator('.field-error').count()) === 4 && emailjsCalls === 0);
    check('Invalid fields are marked aria-invalid', (await page.locator('[aria-invalid="true"]').count()) === 4);
    check('Focus moves to first invalid field', await page.evaluate(() => document.activeElement?.id === 'contact-name'));
    await page.fill('#contact-name', 'QA Test'); await page.fill('#contact-email', 'qa@example.test');
    await page.fill('#contact-subject', 'QA only'); await page.fill('#contact-message', 'Automated QA message. Not sent anywhere.');
    await page.click('button[type="submit"]');
    await page.locator('.form-status').waitFor();
    check('Failed send shows an error, not a success message', await page.locator('.form-status.error').isVisible() && !(await page.locator('.form-status.success').count()));
    check('Failed send keeps the typed message', (await page.inputValue('#contact-message')).startsWith('Automated'));
    mode = 200;
    await page.click('button[type="submit"]');
    await page.locator('.form-status.success').waitFor();
    check('Successful send confirms and clears the form', (await page.inputValue('#contact-message')) === '');
    check('EmailJS was only called through the mock', emailjsCalls === 2, emailjsCalls);

    check('No JavaScript errors', jsErrors.length === 0, jsErrors);
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(out, 'qa-public-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checks: report.checks.length, passed: report.checks.filter(c => c.pass).length, failures: report.failures }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
