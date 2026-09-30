/* Run against a local production build. Set PLAYWRIGHT_MODULE to an installed playwright-core module. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const out = path.resolve(__dirname, '../../artifacts');
fs.mkdirSync(out, { recursive: true });
const report = { checks: [], pages: [], widths: [], errors: [], limitations: ['Lab timings are not field Core Web Vitals.', 'Inbound delivery is tested with a local API fixture; no external SMTP message is sent.', 'Local source changes have not been deployed to production.'] };
function check(name, condition, details) { report.checks.push({ name, pass: !!condition, details }); if (!condition) report.errors.push(name); }
(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
 try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  // Never send QA hits to the production analytics property.
  await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.fulfill({ status: 200, body: '' }));
  await context.addInitScript(() => {
   window.__vitals = { lcp: 0, cls: 0 };
   new PerformanceObserver(list => { for(const entry of list.getEntries()) window.__vitals.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
   new PerformanceObserver(list => { for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.__vitals.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  const page = await context.newPage();
  const jsErrors = [];
  page.on('pageerror', error => jsErrors.push(error.message));
  const pollRequests = [];
  page.on('request', request => { if(request.url().includes('/email/inbox/')) pollRequests.push(Date.now()); });
  let generation;
  page.on('response', async response => { if(response.url().endsWith('/inbox/random') && response.status() === 201) { try { generation = await response.json(); } catch {} } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#temp-email-address').waitFor();
  await page.waitForFunction(() => document.querySelector('#temp-email-address')?.value.includes('@'), { timeout: 30000 });
  const address = await page.locator('#temp-email-address').inputValue();
  check('Deployed API creates a real address', address.includes('@'));
  if(generation) check('Backend mailbox lifetime is 24 hours', Math.abs((Date.parse(generation.inbox.expiresAt) - Date.parse(generation.inbox.createdAt)) / 3600000 - 24) < .1);
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  check('Copy writes the generated address to clipboard', await page.evaluate(() => navigator.clipboard.readText()) === address);
  check('Copy gives visible success feedback', await page.getByRole('button', { name: 'Copied!', exact: true }).isVisible());
  const refreshed = page.waitForResponse(r => r.url().includes('/email/inbox/') && r.status() === 200);
  await page.getByRole('button', { name: 'Refresh inbox', exact: true }).first().click(); await refreshed;
  check('Manual refresh succeeds against deployed API', true);
  const before = pollRequests.length;
  await page.waitForTimeout(11000);
  check('Background polling continues every five seconds', pollRequests.length - before >= 2, { requests: pollRequests.length - before });
  await page.getByRole('button', { name: 'New address', exact: true }).click();
  await page.waitForFunction(previous => { const value=document.querySelector('#temp-email-address')?.value;return value?.includes('@') && value!==previous; }, address);
  check('New address replaces the current address', true);
  await page.getByRole('button', { name: 'Custom address', exact: true }).click();
  check('Custom address dialog opens and focuses inside', await page.getByRole('dialog').evaluate(dialog => dialog.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  check('Escape closes dialog and restores focus', await page.getByRole('dialog').count() === 0 && await page.getByRole('button', { name: 'Custom address', exact: true }).evaluate(el => el === document.activeElement));
  await page.getByRole('button', { name: 'Scan email QR code' }).click();
  await page.getByRole('dialog').locator('svg').last().waitFor();
  check('QR dialog renders', await page.getByRole('dialog').isVisible()); await page.keyboard.press('Escape');
  await page.locator('details summary').first().click();
  check('FAQ works with native accessible disclosure', await page.locator('details').first().getAttribute('open') !== null);
  await page.locator('details summary').first().click();
  const events = await page.evaluate(() => (window.dataLayer || []).filter(e=>e[0]==='event').map(e=>({name:e[1],params:e[2]})));
  report.analytics = events;
  for(const event of ['generate_email','copy_email','refresh_inbox','create_new_address','faq_open']) check('Analytics event: '+event, events.some(e=>e.name===event));
  check('Analytics excludes email content and addresses', !JSON.stringify(events).includes('@') && !JSON.stringify(events).includes(address));
  for (const width of [320,375,390,430,768,1024,1440]) {
   await page.setViewportSize({ width, height: 1000 }); await page.evaluate(() => document.fonts.ready); await page.evaluate(() => scrollTo(0,0));
   const layout = await page.evaluate(() => ({ viewport:innerWidth, content:document.documentElement.scrollWidth, copyHeight:document.querySelector('.mail-copy').getBoundingClientRect().height, h1:document.querySelectorAll('h1').length }));
   report.widths.push({ width, ...layout }); check('No overflow and usable copy target at '+width+'px', layout.content <= width && layout.copyHeight >= 44 && layout.h1===1);
   if (width===390 || width===1440) await page.screenshot({ path: path.join(out, 'final-'+width+'.png'), fullPage:true });
   if(width===390) {
    await page.getByRole('button',{name:'Open navigation'}).click();
    check('Mobile navigation opens', await page.getByRole('navigation',{name:'Mobile navigation'}).isVisible());
    await page.keyboard.press('Escape'); check('Mobile navigation closes on Escape', await page.getByRole('navigation',{name:'Mobile navigation'}).count()===0);
   }
  }
  report.lab = await page.evaluate(() => window.__vitals);
  check('No browser JavaScript exceptions', jsErrors.length===0, jsErrors);
  const xml = await (await context.request.get(base+'/sitemap.xml')).text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
  check('Sitemap contains only canonical public routes', urls.length>0 && urls.every(url => url.startsWith('https://tempmailnova.com') && !/admin|dashboard|@|\/api\//.test(url)) && new Set(urls).size===urls.length);
  const links = new Set(); const titles = new Set();
  for(const url of urls) {
   const pathname = new URL(url).pathname;
   const response = await context.request.get(base+pathname);
   const html = await response.text();
   const data=await page.evaluate(html=>{
    const doc=new DOMParser().parseFromString(html,'text/html');
    return {title:doc.title,description:doc.querySelector('meta[name="description"]')?.content,canonical:doc.querySelector('link[rel="canonical"]')?.href,h1:doc.querySelectorAll('h1').length,og:doc.querySelector('meta[property="og:url"]')?.content,ogImage:doc.querySelector('meta[property="og:image"]')?.content,twitter:doc.querySelector('meta[name="twitter:card"]')?.content,robots:doc.querySelector('meta[name="robots"]')?.content,schemas:[...doc.querySelectorAll('script[type="application/ld+json"]')].map(node=>JSON.parse(node.textContent)),links:[...doc.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),missingAlt:[...doc.querySelectorAll('img')].filter(img=>!img.hasAttribute('alt')).length};
   },html);
   report.pages.push({path:pathname,status:response.status(),...data,links:undefined,schemas:data.schemas.map(s=>s['@type'])});
   check('Public metadata and H1: '+pathname, response.status()===200 && data.h1===1 && !!data.description && new URL(data.canonical).pathname===pathname && new URL(data.og).pathname===pathname && data.twitter==='summary_large_image' && !data.robots?.includes('noindex') && data.missingAlt===0 && !titles.has(data.title));
   titles.add(data.title);
   for(const link of data.links) if(link.startsWith('/') && !link.startsWith('//')) links.add(link.split('#')[0]||'/');
   check('JSON-LD parseable: '+pathname, data.schemas.length>0 && data.schemas.every(s=>s['@context']==='https://schema.org'));
  }
  const publicPaths = new Set(urls.map(url=>new URL(url).pathname));
  for(const link of links) { if(publicPaths.has(link)) continue; const r=await context.request.get(base+link);check('Internal link resolves: '+link,r.status()===200); }
  for(const privatePath of ['/admin','/dashboard']) {
   const r=await context.request.get(base+privatePath); const html=await r.text();
   check('Private HTML noindex: '+privatePath, /name="robots" content="[^"]*noindex/.test(html) && r.headers()['x-robots-tag']?.includes('noindex') && !html.includes('rel="canonical" href="https://tempmailnova.com"'));
  }
  const api = await context.request.get(base+'/api/v1/domain/public');
  check('Proxied API sends noindex', api.headers()['x-robots-tag']?.includes('noindex'));
  const robots=await (await context.request.get(base+'/robots.txt')).text();
  report.robots=robots;check('Public pages and assets are crawlable', robots.includes('Allow: /') && !robots.includes('Disallow: /_next') && robots.includes('Sitemap: https://tempmailnova.com/sitemap.xml'));
  const notFound=await context.request.get(base+'/qa-page-that-does-not-exist');check('Unknown URL returns 404',notFound.status()===404);
  for(const [from,to] of [['/privacy-policy','/privacy'],['/cookie-policy','/cookies'],['/about/','/about']]) { const r=await context.request.get(base+from,{maxRedirects:0});check('Single canonical redirect: '+from,[307,308,301].includes(r.status()) && r.headers().location?.endsWith(to)); }
  await context.close();

  // Local network fixture exercises incoming-message rendering without sending mail externally.
  const fixture = await browser.newContext({ viewport:{width:390,height:900} });
  await fixture.route(/googletagmanager\.com|google-analytics\.com|socket\.io/,r=>r.abort());
  let messages=[];let seed=1;
  const message={_id:'qa-message',inboxAddress:'qa1@tempmailnova.com',sender:{name:'QA Sender',address:'qa@example.test'},subject:'Your test verification code',snippet:'Your code is 123456',bodyText:'Your code is 123456',bodyHtml:'<p>Your code is <strong>123456</strong></p>',attachments:[],attachmentsCount:0,createdAt:new Date().toISOString()};
  await fixture.route('**/api/v1/**',async route=>{
   const url=new URL(route.request().url());let body={success:true};
   if(url.pathname.endsWith('/domain/public'))body.domains=[{name:'tempmailnova.com'}];
   if(url.pathname.endsWith('/inbox/random') || url.pathname.endsWith('/inbox/custom')) { body.inbox={address:'qa'+seed+++'@tempmailnova.com',expiresAt:new Date(Date.now()+86400000).toISOString()};messages=[]; }
   if(url.pathname.includes('/email/inbox/'))body.emails=messages;
   if(url.pathname.includes('/email/message/'))body.email=message;
   if(route.request().method()==='DELETE') messages=[];
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  const test=await fixture.newPage();await test.goto(base);await test.waitForFunction(()=>document.querySelector('#temp-email-address')?.value.includes('@'));
  messages=[message];await test.getByRole('button',{name:/QA Sender/}).waitFor({timeout:12000});
  check('Polling renders an incoming message (fixture)',true);
  await test.getByRole('button',{name:/QA Sender/}).click();await test.frameLocator('iframe.mail-viewer-frame').getByText('123456',{exact:true}).waitFor();
  check('Message viewer displays incoming HTML (fixture)',true);
  check('Message viewer fits mobile',await test.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await test.getByRole('button',{name:'Back to Inbox'}).click();
  await test.waitForTimeout(5500);
  const received=await test.evaluate(()=>(window.dataLayer||[]).filter(e=>e[0]==='event'&&e[1]==='receive_email').length);
  check('Receive event is not duplicated by polling',received===1,{count:received});
  await test.getByRole('button',{name:'Custom address',exact:true}).click();await test.getByLabel('Username / Alias').fill('test-user');await test.getByRole('button',{name:'Create Address',exact:true}).click();await test.getByRole('dialog').waitFor({state:'hidden'});
  check('Custom address submission preserves API flow (fixture)',true);
  const current=await test.locator('#temp-email-address').inputValue();await test.getByRole('button',{name:'Delete',exact:true}).click();await test.waitForFunction(previous=>document.querySelector('#temp-email-address')?.value.includes('@')&&document.querySelector('#temp-email-address').value!==previous,current);
  check('Delete creates a replacement inbox (fixture)',true);
  await fixture.close();
 } catch(error) { report.errors.push(error.stack); }
 finally { await browser.close(); fs.writeFileSync(path.join(out,'qa-report.json'),JSON.stringify(report,null,2)); }
 console.log(JSON.stringify({checks:report.checks.length,passed:report.checks.filter(c=>c.pass).length,pages:report.pages.length,widths:report.widths.length,errors:report.errors,lab:report.lab},null,2));
 if(report.errors.length)process.exitCode=1;
})();
