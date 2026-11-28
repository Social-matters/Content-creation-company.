#!/usr/bin/env node
/**
 * Interaction smoke test against a running server (BASE_URL, default http://localhost:3000).
 * Exercises the entrance, a modal (validation, submit, Esc), route changes, the "Join the network"
 * button and "Contact for pricing" links, old addresses, the mobile menu, keyboard focus, reduced
 * motion, and crawls every internal link and anchor. Saves frames to shots/smoke/.
 *
 *   pnpm smoke
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.BASE_URL ?? 'http://localhost:3000';
/** With a real destination in .env.local, submitting would send the team a fake lead: skip unless SMOKE_SEND=1. */
const envFile = path.resolve(import.meta.dirname, '../.env.local');
const hasRealKey = fs.existsSync(envFile) && /^[ \t]*(RESEND_API_KEY|SHEETS_WEBHOOK_URL)[ \t]*=[ \t]*[^\s#]/m.test(fs.readFileSync(envFile, 'utf8'));
const maySend = !hasRealKey || process.env.SMOKE_SEND === '1';
const out = path.resolve(import.meta.dirname, '../shots/smoke');
fs.mkdirSync(out, { recursive: true });
const shot = (page, name) => page.screenshot({ path: path.join(out, `${name}.png`) });
const results = [];
const check = (name, ok, extra = '') => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${extra ? ` (${extra})` : ''}`);
};

const browser = await chromium.launch();
const errors = [];
const watch = (page) => {
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && errors.push(m.text().slice(0, 200)));
};
async function open(route, { seen = true, ...options } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  if (seen) await ctx.addInitScript(() => sessionStorage.setItem('ccc:entrance-played', '1'));
  const page = await ctx.newPage();
  watch(page);
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(seen ? 1600 : 0);
  return { ctx, page };
}
/** Where the visitor ended up. Forms below the fold fade in on scroll, so "open" means laid out. */
const where = (page) =>
  page.evaluate(() => ({
    url: location.pathname + location.search + location.hash,
    headingFocused: document.activeElement?.matches('#join-the-network [data-focus-target]') ?? false,
    tab: [...document.querySelectorAll('[role="tab"][aria-selected="true"]')].filter((e) => e.offsetParent).map((e) => e.textContent).join(),
    ticked: [...document.querySelectorAll('input[name="needs"]:checked')].filter((e) => e.closest('[role="tabpanel"]')?.offsetParent).map((e) => e.value).join(),
  }));

// ---------- First visit, modal, routes ----------
{
  const { ctx, page } = await open('/', { seen: false });
  await page.waitForTimeout(700);
  await shot(page, 'entrance-0.7s');
  await page.waitForTimeout(2800);
  check('entrance finishes and hides', await page.$eval('[data-preloader]', (el) => getComputedStyle(el).display === 'none'));
  await shot(page, 'entrance-done');

  await page.getByRole('button', { name: 'Start a campaign' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await page.waitForTimeout(600);
  check('campaign modal opens', await dialog.isVisible());
  check('focus moves into modal', await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));
  await dialog.getByRole('button', { name: /apply as a brand/i }).click();
  await page.waitForTimeout(400);
  const alerts = await dialog.getByRole('alert').count();
  check('empty submit shows validation errors', alerts >= 5, `${alerts} errors`);
  check('brand form still asks for a budget range', await dialog.getByLabel('Budget', { exact: true }).isVisible());
  await shot(page, 'modal-errors');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  check('Esc closes modal', (await page.getByRole('dialog').count()) === 0);

  if (maySend) {
    await page.getByRole('button', { name: 'Start a campaign' }).first().click();
    await dialog.waitFor();
    await page.waitForTimeout(500);
    await dialog.getByLabel('Your name').fill('Smoke Test');
    await dialog.getByLabel('Brand name').fill('Smoke Brew Co');
    await dialog.getByLabel('Work email').fill('smoke@example.com');
    await dialog.getByLabel('Phone').fill('98765 43210');
    await dialog.getByLabel('Category').selectOption('Food & Beverage');
    await dialog.getByLabel('City').fill('Mumbai');
    await dialog.locator('label', { hasText: 'Influencer campaign' }).click();
    await dialog.getByLabel('Budget', { exact: true }).selectOption('unsure');
    await dialog.getByLabel('Timeline', { exact: true }).selectOption('exploring');
    await dialog.getByLabel('Tell us about your brand').fill('Cold brew in cans, launching in two cities.');
    await dialog.getByRole('checkbox', { name: /by submitting/i }).check();
    await dialog.getByRole('button', { name: /apply as a brand/i }).click();
    const success = dialog.getByRole('status');
    await success.waitFor({ timeout: 20000 }).catch(() => {});
    check('valid brand lead submits and shows success', await success.isVisible().catch(() => false));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  } else console.log('- brand lead submission skipped: .env.local has a real destination (SMOKE_SEND=1 sends it; pnpm test:forms uses a mock)');

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Celebrities' }).click();
  await page.waitForTimeout(450);
  await shot(page, 'wipe-mid');
  await page.waitForURL('**/celebrities', { timeout: 10000 });
  await page.waitForTimeout(1500);
  check('nav link navigates with wipe', page.url().endsWith('/celebrities'));

  await page.locator('header').getByRole('link', { name: 'Join the network' }).click();
  await page.waitForURL('**/contact#join-the-network', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(3000);
  let at = await where(page);
  check('"Join the network" reaches the section and focuses its heading', at.url === '/contact#join-the-network' && at.headingFocused && at.tab === 'Join the network', JSON.stringify(at));
  check('network form still asks for a base rate', (await page.locator('input[name="basePrice"]').count()) === 1);
  await shot(page, 'join-section');

  await page.locator('header a[aria-label$="home"]').click();
  await page.waitForURL(base + '/', { timeout: 10000 });
  await page.waitForTimeout(1800);
  await page.locator('#services a[href*="service=model-shoots"]').evaluate((a) => a.click());
  await page.waitForURL('**/contact?service=model-shoots**', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(3000);
  at = await where(page);
  check('"Contact for pricing" opens the brand form with the need ticked', at.tab === "I'm a brand" && at.ticked === 'models' && at.headingFocused, JSON.stringify(at));
  await ctx.close();
}

// ---------- Old addresses ----------
for (const [from, to, tab] of [
  ['/pricing', '/contact#join-the-network', 'Join the network'],
  ['/start-a-campaign', '/contact?apply=brand#join-the-network', "I'm a brand"],
  ['/join-as-creator', '/contact#join-the-network', 'Join the network'],
  ['/v2/contact', '/contact', 'Join the network'],
  ['/v2', '/', ''],
  ['/creators', '/', ''],
]) {
  const { ctx, page } = await open(from);
  await page.waitForTimeout(600);
  const at = await where(page);
  check(`${from} redirects to ${to}`, at.url === to && at.tab === tab, JSON.stringify(at));
  await ctx.close();
}

// ---------- Crawl every internal link and anchor ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  watch(page);
  const missing = [];
  page.on('response', (r) => r.status() >= 400 && missing.push(`${r.status()} ${r.url()}`));
  const queue = ['/'];
  const ids = new Map();
  const anchors = new Set();
  while (queue.length) {
    const route = queue.shift();
    if (ids.has(route)) continue;
    const res = await page.goto(base + route, { waitUntil: 'networkidle' });
    if (!res || res.status() >= 400) missing.push(`${res?.status()} ${route}`);
    for (let y = 0; y < 60; y++) {
      const done = await page.evaluate(() => (window.scrollBy(0, innerHeight), scrollY + innerHeight >= document.body.scrollHeight - 2));
      await page.waitForTimeout(90);
      if (done) break;
    }
    await page.waitForTimeout(600);
    ids.set(route, new Set(await page.$$eval('[id]', (els) => els.map((e) => e.id))));
    for (const href of await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))) {
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const url = new URL(href, base + route);
      if (url.hash) anchors.add(`${url.pathname}${url.hash}`);
      if (!ids.has(url.pathname)) queue.push(url.pathname);
    }
  }
  check('crawl: no broken pages or files', missing.length === 0, missing.slice(0, 4).join(' | ') || `${ids.size} pages`);
  const dead = [...anchors].filter((a) => !ids.get(a.split('#')[0])?.has(a.split('#')[1]));
  check('crawl: every anchor exists', dead.length === 0, dead.join(' ') || `${anchors.size} anchors`);
  const removed = [...ids.keys()].filter((r) => /^\/(pricing|creators|start-a-campaign|join-as-creator|v2)\b/.test(r));
  check('crawl: nothing links to a removed page', removed.length === 0, removed.join(' '));
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  check('sitemap lists no removed pages', !/pricing|creators|start-a-campaign|join-as-creator|\/v2/.test(sitemap));
  await ctx.close();
}

// ---------- Keyboard ----------
{
  const { ctx, page } = await open('/about');
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check('first Tab focuses skip link', /skip/i.test(first ?? ''), first);
  await ctx.close();
}

// ---------- Mobile menu ----------
{
  const { ctx, page } = await open('/', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.waitForTimeout(1200);
  const menu = page.getByRole('dialog', { name: 'Menu' });
  check('mobile menu opens', await menu.isVisible());
  await shot(page, 'mobile-menu');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  check('mobile menu closes on Esc', (await menu.count()) === 0);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.waitForTimeout(1200);
  await menu.getByRole('link', { name: 'Join the network' }).click();
  await page.waitForURL('**/contact#join-the-network', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const at = await where(page);
  check('mobile "Join the network" closes the menu and focuses the heading, not a field', at.headingFocused && (await menu.count()) === 0, JSON.stringify(at));
  await ctx.close();
}

// ---------- Reduced motion ----------
{
  const { ctx, page } = await open('/', { seen: false, reducedMotion: 'reduce' });
  await page.waitForTimeout(800);
  const lenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
  check('reduced motion: no Lenis, no entrance', !lenis && (await page.$eval('[data-preloader]', (el) => getComputedStyle(el).display === 'none')));
  await page.mouse.wheel(0, 2600);
  await page.waitForTimeout(800);
  check('reduced motion: no pinning', (await page.$$eval('.pin-spacer', (els) => els.length)) === 0);
  await shot(page, 'reduced-motion');
  await ctx.close();
}

await browser.close();
check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} check(s) failed` : '\nAll smoke checks passed');
process.exit(failed ? 1 : 0);
