#!/usr/bin/env node
/**
 * End-to-end test of every lead form and the email it produces. No real email is ever sent:
 * the production build runs against a local mock of the Resend API (RESEND_BASE_URL).
 *
 *   pnpm test:forms          (builds first)
 *
 * Checks payload, subject, Reply-To, HTML escaping, header sanitising, consent, honeypot,
 * server-side re-validation, rate limit, failure handling, the login box (sends nothing),
 * the optional confirmation email and the production configuration error.
 * Sample emails are saved to shots/email/ (HTML, text and a screenshot).
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'shots/email');
fs.mkdirSync(outDir, { recursive: true });

const INBOX = 'inbox@example.test';
const FROM = 'CCC Test <leads@example.test>';
const SITE_EMAIL = 'hello@contentcreationcompany.in';
const ERROR_TEXT = `Something went wrong. Please try again or email us at ${SITE_EMAIL}`;
/** Markup a hostile visitor might type. None of it may survive as markup. */
const ATTACK = '<img src=x onerror=alert(1)> <script>alert(2)</script> "quoted" & done';
const ATTACK_ESCAPED = '&lt;img src=x onerror=alert(1)&gt; &lt;script&gt;alert(2)&lt;/script&gt; &quot;quoted&quot; &amp; done';
/** A line separator and a bell character: browsers keep both in a text input. */
const NASTY_BRAND = `Brew <b>Co</b>${String.fromCharCode(0x2028)}Bcc: someone@evil.test${String.fromCharCode(7)}`;

let failed = 0;
const check = (label, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${label}${!ok && extra ? `\n    ${String(extra).slice(0, 400)}` : ''}`);
};

// ---------- Mock Resend ----------
const mail = [];
const mock = { fail: false };
const resend = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const reply = (status, json) => res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(json));
    if (req.method !== 'POST' || req.url !== '/emails') return reply(404, { name: 'not_found', message: 'unknown route' });
    if (mock.fail) return reply(500, { statusCode: 500, name: 'application_error', message: 'mock outage' });
    mail.push({ ...JSON.parse(body), authorization: req.headers.authorization });
    reply(200, { id: `mock-${mail.length}` });
  });
});
await new Promise((r) => resend.listen(0, '127.0.0.1', r));
const resendUrl = `http://127.0.0.1:${resend.address().port}`;

// ---------- Next server ----------
const servers = [];
function startNext(port, env) {
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], { cwd: root, env: { ...process.env, ...env } });
  const server = { child, log: '', url: `http://localhost:${port}` };
  child.stdout.on('data', (d) => (server.log += d));
  child.stderr.on('data', (d) => (server.log += d));
  servers.push(server);
  return server;
}
async function ready(server) {
  for (let i = 0; i < 150; i++) {
    try {
      return (await fetch(`${server.url}/v2`)).status;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error(`server did not start:\n${server.log}`);
}
const noSheet = { SHEETS_WEBHOOK_URL: '', SHEETS_WEBHOOK_SECRET: '' }; // never touch a real sheet from .env.local
const baseEnv = { ...noSheet, RESEND_API_KEY: 're_test_mock', RESEND_BASE_URL: resendUrl, LEADS_TO_EMAIL: INBOX, LEADS_FROM_EMAIL: FROM, SEND_CONFIRMATION_EMAIL: 'false' };

const browser = await chromium.launch();
const pageErrors = [];
let ipSeq = 10;
/** Each visitor gets its own IP so the rate limit only applies where a test wants it to. */
async function visit(server, route, { ip = `10.0.0.${ipSeq++}` } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', extraHTTPHeaders: { 'x-forwarded-for': ip } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => pageErrors.push(`${route}: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && !/status of (404|500)/.test(m.text()) && pageErrors.push(`${route}: ${m.text().slice(0, 200)}`));
  await page.goto(server.url + route, { waitUntil: 'networkidle' });
  return { ctx, page };
}

// ---------- Form fillers ----------
const text = async (form, label, value) => form.getByLabel(label, { exact: true }).fill(value);
const pick = async (form, label, value) => form.getByLabel(label, { exact: true }).selectOption(value);
const consent = (form) => form.getByRole('checkbox', { name: /by submitting/i });
const chip = (form, label) => form.locator('label', { hasText: label }).click();

async function fillBrand(form, { v2 = true, email, needs = [] }) {
  await text(form, 'Your name', 'Asha <i>Rao</i>');
  await text(form, 'Brand name', NASTY_BRAND);
  await text(form, 'Work email', email);
  await text(form, 'Phone', '98765 43210');
  await pick(form, 'Category', 'Food & Beverage');
  await text(form, 'City', 'Pune');
  if (v2) {
    for (const n of needs) await chip(form, n);
    await pick(form, 'Budget', '50k-2l');
    await pick(form, 'Timeline', 'month');
  }
  await text(form, 'Tell us about your brand', `${ATTACK}\nEmail: forged@evil.test`);
}

async function fillCreator(form, { v2 = true, email }) {
  if (v2) await chip(form, 'Model');
  await text(form, 'Your name', 'Rohan Mehta');
  await text(form, 'Instagram handle', '@rohan.test');
  await text(form, 'Email', email);
  await text(form, 'Phone', '9876543210');
  await pick(form, 'Niche', 'Lifestyle');
  await pick(form, 'Followers', 'micro');
  await text(form, 'City', 'Mumbai');
  await text(form, 'Languages you create in', 'Hindi, English');
  if (v2) {
    await text(form, 'Your base rate (₹)', '₹5,000');
    await pick(form, 'Rate is', 'per reel');
  }
  await text(form, 'Tell us about your content', ATTACK);
}

const fillEarly = (form, email) => text(form, 'Email', email);
const CONTROL = new RegExp('[\\u0000-\\u001f\\u007f-\\u009f\\u2028\\u2029]');
const CLEAN_BRAND = 'Brew <b>Co</b> Bcc: someone@evil.test';

/** The contact form sits below the fold and fades in on scroll, so scroll to it like a visitor would. */
async function contactForm(page) {
  const form = page.locator('#main form').first();
  await form.waitFor({ state: 'attached' });
  await form.evaluate((el) => el.scrollIntoView());
  await form.waitFor({ state: 'visible', timeout: 15000 });
  return form;
}

/** Ticks consent, submits, waits for the success state and returns the one email it produced. */
async function submitAndCapture(page, form, button, { name, subject, replyTo, includes, page: fromPage, sample }) {
  const before = mail.length;
  await consent(form).check();
  await form.getByRole('button', { name: button }).click();
  const ok = await page.getByRole('status').filter({ has: page.locator('h2') }).first().waitFor({ timeout: 15000 }).then(() => true, () => false);
  check(`${name}: success state shown`, ok, await form.innerText().catch(() => ''));
  check(`${name}: exactly one email`, mail.length === before + 1, `sent ${mail.length - before}`);
  const m = mail.at(-1);
  if (mail.length !== before + 1) return;
  check(`${name}: to, from and Reply-To`, [m.to].flat().join() === INBOX && m.from === FROM && [m.reply_to].flat().join() === replyTo, JSON.stringify({ to: m.to, from: m.from, reply_to: m.reply_to }));
  check(`${name}: subject`, m.subject === subject, `got  ${m.subject}\n    want ${subject}`);
  check(`${name}: subject has no control characters`, !CONTROL.test(m.subject));
  check(`${name}: no user markup in HTML`, !/<img src=x|<script|<b>Co|<i>Rao/i.test(m.html));
  const missing = includes.filter((v) => !m.text.includes(v));
  check(`${name}: every field in the plain text`, missing.length === 0, `missing ${missing.join(' | ')}`);
  check(`${name}: page, IST time and consent recorded`, m.text.includes(`Page: ${fromPage}`) && /Submitted: .+ IST/.test(m.text) && m.text.includes('Accepted the Privacy Policy') && m.html.includes(' IST'), m.text);
  const logo = m.attachments?.find((a) => a.content_id === 'ccc-logo');
  check(`${name}: branded HTML with inline logo`, Boolean(logo?.content) && m.html.includes('cid:ccc-logo') && m.html.includes('#FF812A') && m.html.includes('#F1EDE4'));
  check(`${name}: API key sent as a bearer token`, m.authorization === 'Bearer re_test_mock');
  if (sample) {
    fs.writeFileSync(path.join(outDir, `${sample}.html`), m.html.replace('cid:ccc-logo', `data:image/png;base64,${logo.content}`));
    fs.writeFileSync(path.join(outDir, `${sample}.txt`), `Subject: ${m.subject}\nReply-To: ${m.reply_to}\n\n${m.text}`);
  }
  return m;
}

try {
  const app = startNext(3105, baseEnv);
  await ready(app);

  // ---------- 1. Brand application (arrives with campaign tags, then moves on) ----------
  {
    const { ctx, page } = await visit(app, '/v2/about?utm_source=newsletter&utm_campaign=launch');
    await page.goto(`${app.url}/v2/start-a-campaign`, { waitUntil: 'networkidle' });
    const form = page.locator('#main form').first();
    await fillBrand(form, { email: 'Asha@Example.COM', needs: ['Influencer campaign', 'Model shoot'] });
    const m = await submitAndCapture(page, form, /apply as a brand/i, {
      name: 'brand',
      subject: `[CCC] New brand enquiry: ${CLEAN_BRAND} (Influencer campaign, Model shoot)`,
      replyTo: 'asha@example.com',
      includes: ['Name: Asha <i>Rao</i>', 'Email: asha@example.com', 'Phone: +91 9876543210', 'Needs: Influencer campaign, Model shoot', 'Budget: ₹50K – ₹2L', 'Timeline: Within a month', 'Category: Food & Beverage', 'City: Pune', ATTACK, 'Form: Brand application'],
      page: '/v2/start-a-campaign',
      sample: 'brand',
    });
    check('brand: attack text arrives escaped', Boolean(m?.html.includes(ATTACK_ESCAPED)));
    check('brand: a typed line cannot pose as another field', Boolean(m?.text.includes('\n    Email: forged@evil.test')) && !m.text.includes('\nEmail: forged@evil.test'));
    check('brand: UTM tags survive navigation', Boolean(m?.text.includes('utm_source: newsletter') && m.text.includes('utm_campaign: launch')));
    await ctx.close();
  }

  // ---------- 2 and 3. Celebrity and model shoot enquiries ----------
  for (const [name, route, subject, formName] of [
    ['celebrity', '/v2/celebrities', `[CCC] New celebrity enquiry: ${CLEAN_BRAND}`, 'Celebrity enquiry'],
    ['model shoot', '/v2/model-shoots', `[CCC] New model shoot enquiry: ${CLEAN_BRAND}`, 'Model shoot enquiry'],
  ]) {
    const { ctx, page } = await visit(app, route);
    const form = page.locator('#enquire form');
    await fillBrand(form, { email: 'asha@example.com' });
    await submitAndCapture(page, form, /apply as a brand/i, { name, subject, replyTo: 'asha@example.com', includes: [`Form: ${formName}`, name === 'celebrity' ? 'Needs: Celebrity or serial actor' : 'Needs: Model shoot', 'Budget:', 'Timeline:'], page: route, sample: name.replace(' ', '-') });
    await ctx.close();
  }

  // ---------- 4. Influencer application ----------
  {
    const { ctx, page } = await visit(app, '/v2/join-as-creator');
    const form = page.locator('#main form').first();
    await fillCreator(form, { email: 'rohan@example.com' });
    await submitAndCapture(page, form, /apply to join/i, {
      name: 'influencer',
      subject: '[CCC] New influencer application: Rohan Mehta, ₹5,000 per reel',
      replyTo: 'rohan@example.com',
      includes: ['I am a: Model', 'Instagram: @rohan.test', 'Niche: Lifestyle', 'Followers: Micro · 10K–100K', 'Base price (internal): ₹5,000', 'Rate unit (internal): per reel', 'Languages: Hindi, English', 'City: Mumbai', 'Base price is internal'],
      page: '/v2/join-as-creator',
      sample: 'influencer',
    });
    await ctx.close();
  }

  // ---------- 5. Contact message ----------
  {
    const { ctx, page } = await visit(app, '/v2/contact');
    const form = await contactForm(page);
    await text(form, 'Your name', 'Meera Iyer');
    await text(form, 'Email', 'meera@example.com');
    await text(form, 'Message', `Hello team\n${ATTACK}`);
    const m = await submitAndCapture(page, form, /send message/i, { name: 'contact', subject: '[CCC] New contact message: Meera Iyer', replyTo: 'meera@example.com', includes: ['Name: Meera Iyer', 'Message: Hello team', ATTACK], page: '/v2/contact', sample: 'contact' });
    check('contact: attack text arrives escaped, line break kept', Boolean(m?.html.includes(`Hello team<br>${ATTACK_ESCAPED}`)));
    await ctx.close();
  }

  // ---------- 6. Early-access signup ----------
  {
    const { ctx, page } = await visit(app, '/v2');
    const form = page.locator('#early-access form');
    await form.waitFor({ timeout: 15000 });
    await fillEarly(form, 'early@example.com');
    await submitAndCapture(page, form, /join the list/i, { name: 'early access', subject: '[CCC] New early-access signup: early@example.com', replyTo: 'early@example.com', includes: ['Email: early@example.com', 'Form: Early-access signup'], page: '/v2', sample: 'early-access' });
    await ctx.close();
  }

  // ---------- Modal path and the v1 forms ----------
  {
    const { ctx, page } = await visit(app, '/v2');
    await page.getByRole('button', { name: 'Start a campaign' }).first().click();
    const form = page.getByRole('dialog').locator('form');
    await form.waitFor();
    await fillBrand(form, { email: 'modal@example.com', needs: ['Creator content'] });
    await submitAndCapture(page, form, /apply as a brand/i, { name: 'brand (modal)', subject: `[CCC] New brand enquiry: ${CLEAN_BRAND} (Creator content)`, replyTo: 'modal@example.com', includes: ['Needs: Creator content'], page: '/v2' });
    await ctx.close();
  }
  for (const [name, route, fill, button, subject] of [
    ['v1 brand', '/start-a-campaign', fillBrand, /apply as a brand/i, `[CCC] New brand enquiry: ${CLEAN_BRAND}`],
    ['v1 creator', '/join-as-creator', fillCreator, /apply as a creator/i, '[CCC] New influencer application: Rohan Mehta'],
  ]) {
    const { ctx, page } = await visit(app, route);
    const form = page.locator('#main form').first();
    await fill(form, { v2: false, email: 'v1@example.com' });
    await submitAndCapture(page, form, button, { name, subject, replyTo: 'v1@example.com', includes: ['(v1 site)'], page: route });
    await ctx.close();
  }

  // ---------- Consent is required ----------
  {
    const { ctx, page } = await visit(app, '/v2/contact');
    const form = await contactForm(page);
    await text(form, 'Your name', 'No Consent');
    await text(form, 'Email', 'no@example.com');
    await text(form, 'Message', 'I did not tick the box.');
    const before = mail.length;
    await form.getByRole('button', { name: /send message/i }).click();
    await page.getByText('Please tick the box to continue').waitFor({ timeout: 5000 }).catch(() => {});
    check('consent: unticked box blocks the send', mail.length === before && (await page.getByText('Please tick the box to continue').isVisible()));
    const link = form.getByRole('link', { name: 'Privacy Policy' });
    check('consent: links to the privacy page in a new tab', (await link.getAttribute('href')) === '/v2/privacy' && (await link.getAttribute('target')) === '_blank');

    // The server must not trust the browser: tick the box, then tamper with the request.
    await consent(form).check();
    await page.route('**/*', (route) => {
      const req = route.request();
      if (req.method() === 'POST' && req.headers()['next-action']) return route.continue({ postData: req.postData().replace('"consent":true', '"consent":false') });
      return route.continue();
    });
    await form.getByRole('button', { name: /send message/i }).click();
    await page.getByText('Please tick the box to continue').waitFor({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);
    check('server re-validates: a tampered request sends nothing', mail.length === before && (await page.getByRole('status').count()) === 0);
    await ctx.close();
  }

  // ---------- Failure keeps the data, then a retry works ----------
  {
    const { ctx, page } = await visit(app, '/v2/contact');
    const form = await contactForm(page);
    await text(form, 'Your name', 'Retry Rani');
    await text(form, 'Email', 'retry@example.com');
    await text(form, 'Message', 'Please keep what I typed.');
    await consent(form).check();
    mock.fail = true;
    const before = mail.length;
    await form.getByRole('button', { name: /send message/i }).click();
    const alert = form.getByRole('alert');
    await alert.waitFor({ timeout: 15000 }).catch(() => {});
    check('failure: friendly error shown', (await alert.innerText().catch(() => '')).trim() === ERROR_TEXT, await alert.innerText().catch(() => 'no alert'));
    check('failure: no success state', (await page.getByRole('status').count()) === 0 && mail.length === before);
    check('failure: typed details are still there', (await form.getByLabel('Message', { exact: true }).inputValue()) === 'Please keep what I typed.' && (await consent(form).isChecked()));
    check('failure: full error logged on the server', app.log.includes('[lead] delivery failed') && app.log.includes('mock outage'), app.log.slice(-600));
    mock.fail = false;
    await form.getByRole('button', { name: /send message/i }).click();
    check('failure: retry succeeds', await page.getByRole('status').first().waitFor({ timeout: 15000 }).then(() => mail.length === before + 1, () => false));
    await ctx.close();
  }

  // ---------- Honeypot ----------
  {
    const { ctx, page } = await visit(app, '/v2/contact');
    const form = await contactForm(page);
    await text(form, 'Your name', 'Spam Bot');
    await text(form, 'Email', 'bot@example.com');
    await text(form, 'Message', 'Buy cheap followers now.');
    await form.locator('input[name="website"]').fill('http://spam.test');
    await consent(form).check();
    const before = mail.length;
    await form.getByRole('button', { name: /send message/i }).click();
    await page.waitForTimeout(2500);
    check('honeypot: nothing is sent', mail.length === before);
    await ctx.close();
  }

  // ---------- Rate limit: 5 per IP per 10 minutes ----------
  {
    const before = mail.length;
    let lastAlert = '';
    for (let i = 1; i <= 6; i++) {
      const { ctx, page } = await visit(app, '/v2', { ip: '10.9.9.9' });
      const form = page.locator('#early-access form');
      await form.waitFor({ timeout: 15000 });
      await fillEarly(form, `limit${i}@example.com`);
      await consent(form).check();
      await form.getByRole('button', { name: /join the list/i }).click();
      if (i < 6) await page.getByRole('status').first().waitFor({ timeout: 15000 }).catch(() => {});
      else {
        await form.getByRole('alert').waitFor({ timeout: 15000 }).catch(() => {});
        lastAlert = await form.getByRole('alert').innerText().catch(() => '');
      }
      await ctx.close();
    }
    check('rate limit: five go through, the sixth is refused', mail.length === before + 5 && lastAlert.startsWith('Too many submissions'), `sent ${mail.length - before}; alert "${lastAlert}"`);
  }

  // ---------- Login is UI-only ----------
  {
    const { ctx, page } = await visit(app, '/'); // only v1 still has a login button
    let posts = 0;
    page.on('request', (r) => r.method() === 'POST' && r.headers()['next-action'] && posts++);
    await page.getByRole('button', { name: 'Log in' }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Email', { exact: true }).fill('login@example.com');
    const before = mail.length;
    await dialog.getByRole('button', { name: 'Continue' }).click();
    await dialog.getByText('Not open yet.').waitFor({ timeout: 8000 }).catch(() => {});
    check('login: UI only, nothing sent', posts === 0 && mail.length === before && (await dialog.getByText('Not open yet.').isVisible()));
    await ctx.close();
  }

  // ---------- Optional confirmation email ----------
  {
    const confirm = startNext(3106, { ...baseEnv, SEND_CONFIRMATION_EMAIL: 'true' });
    await ready(confirm);
    const { ctx, page } = await visit(confirm, '/v2');
    const form = page.locator('#early-access form');
    await form.waitFor({ timeout: 15000 });
    await fillEarly(form, 'confirm@example.com');
    await consent(form).check();
    const before = mail.length;
    await form.getByRole('button', { name: /join the list/i }).click();
    await page.getByRole('status').first().waitFor({ timeout: 15000 }).catch(() => {});
    const [team, courtesy] = mail.slice(before);
    check('confirmation (flag on): team email plus one to the sender', mail.length === before + 2 && [team.to].flat()[0] === INBOX && [courtesy.to].flat()[0] === 'confirm@example.com' && courtesy.text.includes('We reply within 24 hours'));
    check('confirmation carries no submitted text', Boolean(courtesy) && !courtesy.html.includes('confirm@example.com'));
    if (courtesy) fs.writeFileSync(path.join(outDir, 'confirmation.txt'), `Subject: ${courtesy.subject}\n\n${courtesy.text}`);
    await ctx.close();
    confirm.child.kill();
  }

  // ---------- Google Sheet destination ----------
  {
    const rows = [];
    const sheetMock = { mode: 'ok' };
    const web = http.createServer((req, res) => {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        if (sheetMock.mode === 'signin') return res.writeHead(200, { 'Content-Type': 'text/html' }).end('<html>Sign in</html>');
        const data = JSON.parse(body);
        if (sheetMock.mode === 'ok') rows.push(data);
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: sheetMock.mode === 'ok' }));
      });
    });
    await new Promise((r) => web.listen(0, '127.0.0.1', r));
    const sheetEnv = { SHEETS_WEBHOOK_URL: `http://127.0.0.1:${web.address().port}/exec`, SHEETS_WEBHOOK_SECRET: 'test-secret-0123456789' };
    const send = async (server, message) => {
      const { ctx, page } = await visit(server, '/v2/contact');
      const form = await contactForm(page);
      await text(form, 'Your name', '=HYPERLINK("http://evil.test","x")');
      await text(form, 'Email', 'sheet@example.com');
      await text(form, 'Message', message);
      await consent(form).check();
      await form.getByRole('button', { name: /send message/i }).click();
      const ok = await page.getByRole('status').first().waitFor({ timeout: 12000 }).then(() => true, () => false);
      await ctx.close();
      return ok;
    };

    const only = startNext(3108, { ...baseEnv, ...sheetEnv, RESEND_API_KEY: '', LEADS_TO_EMAIL: '', LEADS_FROM_EMAIL: '' });
    await ready(only);
    const emails = mail.length;
    const ok = await send(only, '+SUM(1,1) and the rest of the message');
    const row = rows.at(-1);
    const cell = (name) => row?.row[row.headers.indexOf(name)];
    check('sheet only: success after the sheet confirms, no email', ok && rows.length === 1 && mail.length === emails);
    check('sheet: secret sent, columns line up', row?.secret === sheetEnv.SHEETS_WEBHOOK_SECRET && row.headers.length === row.row.length && cell('Email') === 'sheet@example.com' && cell('Form') === 'Contact form' && cell('Page') === '/v2/contact' && cell('Submitted').endsWith(' IST') && cell('Brand') === '');
    check('sheet: formulas are forced to text', cell('Name')?.startsWith("'=HYPERLINK") && cell('Message')?.startsWith("'+SUM"), `${cell('Name')} | ${cell('Message')}`);
    for (const mode of ['reject', 'signin']) {
      sheetMock.mode = mode;
      check(`sheet ${mode === 'reject' ? 'refuses the row' : 'answers with a sign-in page'}: no success shown`, !(await send(only, 'This one must not look saved.')));
    }
    only.child.kill();

    const both = startNext(3109, { ...baseEnv, ...sheetEnv });
    await ready(both);
    sheetMock.mode = 'reject';
    const before = mail.length;
    check('email + sheet, sheet down: email still counts, failure logged', (await send(both, 'Email should still arrive.')) && mail.length === before + 1 && both.log.includes('saved, but not everywhere'));
    both.child.kill();
    web.close();
  }

  // ---------- Production with nowhere to send ----------
  {
    const bare = startNext(3107, { ...baseEnv, RESEND_API_KEY: '', LEADS_TO_EMAIL: '', LEADS_FROM_EMAIL: '' });
    const status = await ready(bare);
    check('production without settings: clear configuration error', status === 500 && bare.log.includes('Lead delivery configuration error: nowhere to send submissions'), `HTTP ${status}\n${bare.log.slice(0, 400)}`);
    bare.child.kill();
  }

  check('no page or console errors', pageErrors.length === 0, pageErrors.slice(0, 4).join('\n    '));

  // ---------- Screenshots of the sample emails ----------
  const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
  for (const name of ['brand', 'influencer', 'contact']) {
    const file = path.join(outDir, `${name}.html`);
    if (!fs.existsSync(file)) continue;
    await page.setContent(fs.readFileSync(file, 'utf8'));
    await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  }
} finally {
  await browser.close();
  for (const s of servers) s.child.kill();
  resend.close();
}

console.log(failed ? `\n${failed} check(s) failed` : `\nAll form checks passed (${mail.length} mock emails, none sent for real)`);
process.exit(failed ? 1 : 0);
