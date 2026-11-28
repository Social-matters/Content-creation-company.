#!/usr/bin/env node
/**
 * Interaction smoke test against a running server (BASE_URL, default http://localhost:3000).
 * Exercises the entrance, modal + form validation + submission, Esc to close,
 * route wipe, plan toggle, FAQ, mobile menu, keyboard focus, and the /v2 design (links,
 * scroll scenes, route changes). Saves frames to shots/smoke/.
 *
 *   pnpm smoke
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.BASE_URL ?? 'http://localhost:3000';
/** With a real key in .env.local, submitting would email the team a fake lead: skip unless SMOKE_SEND=1. */
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

// ---------- Desktop ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && errors.push(m.text().slice(0, 200)));

  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  await shot(page, 'entrance-0.7s');
  await page.waitForTimeout(800);
  await shot(page, 'entrance-1.5s');
  await page.waitForTimeout(1800);
  const preloaderGone = await page.$eval('[data-preloader]', (el) => getComputedStyle(el).display === 'none');
  check('entrance finishes and hides', preloaderGone);
  await shot(page, 'entrance-done');

  // Modal: open, validate, Esc
  await page.getByRole('button', { name: 'Start a campaign' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await page.waitForTimeout(600);
  check('campaign modal opens', await dialog.isVisible());
  const focusedInModal = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
  check('focus moves into modal', focusedInModal);
  await dialog.getByRole('button', { name: /apply as a brand/i }).click();
  await page.waitForTimeout(400);
  const alerts = await dialog.getByRole('alert').count();
  check('empty submit shows validation errors', alerts >= 5, `${alerts} errors`);
  await shot(page, 'modal-errors');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  check('Esc closes modal', (await page.getByRole('dialog').count()) === 0);

  // Modal: valid submission
  await page.getByRole('button', { name: 'Start a campaign' }).first().click();
  await dialog.waitFor();
  await page.waitForTimeout(500);
  await dialog.getByLabel('Your name').fill('Smoke Test');
  await dialog.getByLabel('Brand name').fill('Smoke Brew Co');
  await dialog.getByLabel('Work email').fill('smoke@example.com');
  await dialog.getByLabel('Phone').fill('98765 43210');
  await dialog.getByLabel('Category').selectOption('Food & Beverage');
  await dialog.getByLabel('City').fill('Mumbai');
  await dialog.getByLabel('Tell us about your brand').fill('Cold brew in cans, launching in two cities.');
  await dialog.getByRole('checkbox', { name: /by submitting/i }).check();
  if (maySend) {
    await dialog.getByRole('button', { name: /apply as a brand/i }).click();
    const success = dialog.getByRole('status');
    await success.waitFor({ timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(900);
    check('valid brand lead submits and shows success', await success.isVisible().catch(() => false));
  } else console.log('- brand lead submission skipped: .env.local has a Resend key (SMOKE_SEND=1 sends a real test email; pnpm test:forms uses a mock)');
  await shot(page, 'modal-success');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // Route wipe
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Pricing' }).click();
  await page.waitForTimeout(450);
  await shot(page, 'wipe-mid');
  await page.waitForURL('**/pricing', { timeout: 10000 });
  await page.waitForTimeout(1400);
  check('nav link navigates with wipe', page.url().endsWith('/pricing'));
  await shot(page, 'pricing-after-wipe');

  // Plans toggle (Flip)
  await page.getByRole('radio', { name: 'Managed' }).click();
  await page.waitForTimeout(300);
  await shot(page, 'plans-flip-mid');
  await page.waitForTimeout(900);
  check('plan toggle selects Managed', (await page.getByRole('radio', { name: 'Managed' }).getAttribute('aria-checked')) === 'true');
  await shot(page, 'plans-managed');

  // Keyboard: skip link is first focusable
  await page.goto(base + '/about', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  check('first Tab focuses skip link', /skip/i.test(firstFocus ?? ''), firstFocus);
  await shot(page, 'skip-link');
  await page.close();
}

// ---------- Mobile ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => sessionStorage.setItem('ccc:entrance-played', '1'));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/creators', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.waitForTimeout(1100);
  check('mobile menu opens', await page.getByRole('dialog', { name: 'Menu' }).isVisible());
  await shot(page, 'mobile-menu');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  check('mobile menu closes on Esc', (await page.getByRole('dialog', { name: 'Menu' }).count()) === 0);
  await page.evaluate(() => document.getElementById('faq')?.scrollIntoView());
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /how and when do i get paid/i }).click();
  await page.waitForTimeout(600);
  check('FAQ item expands', (await page.getByRole('button', { name: /how and when do i get paid/i }).getAttribute('aria-expanded')) === 'true');
  await ctx.close();
}

// ---------- Reduced motion ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const lenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
  check('reduced motion: no Lenis, no entrance', !lenis && (await page.$eval('[data-preloader]', (el) => getComputedStyle(el).display === 'none')));
  await page.mouse.wheel(0, 2600);
  await page.waitForTimeout(800);
  const pinned = await page.$$eval('.pin-spacer', (els) => els.length);
  check('reduced motion: no pinning', pinned === 0);
  await shot(page, 'reduced-motion');
  await ctx.close();
}

// ---------- v2 (/v2/*) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => sessionStorage.setItem('ccc:entrance-played', '1'));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`v2: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && errors.push(`v2: ${m.text().slice(0, 200)}`));
  await page.goto(base + '/v2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  const bar = page.locator('header');
  check('v2: no login in the header', (await bar.getByRole('button', { name: 'Log in' }).count()) === 0);
  check('v2: header Apply links to contact', (await bar.getByRole('link', { name: 'Apply', exact: true }).getAttribute('href')) === '/v2/contact');
  check('v2: hero content visible', (await page.locator('[data-hero-in]').first().evaluate((e) => getComputedStyle(e).opacity)) === '1');
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  const stray = hrefs.filter((h) => !h.startsWith('/v2') && !/^\/(_next|media|brand)\//.test(h));
  check('v2: internal links stay in /v2', stray.length === 0, stray.slice(0, 3).join(', '));
  // Scroll every scene, then navigate away (v2 home stays mounted) and back.
  for (let i = 0; i < 36; i++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(110);
  }
  // Scroll back up with the wheel (an upward scroll is what reveals the hidden nav).
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, -900);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1500);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Celebrities' }).click();
  await page.waitForURL('**/v2/celebrities', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1500);
  check('v2: route wipe stays in /v2', new URL(page.url()).pathname === '/v2/celebrities');
  check('v2: no audience toggle', (await page.locator('[aria-label="Audience"]').count()) === 0);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'How it works' }).click();
  await page.waitForURL(/\/v2(#how)?$/, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1800);
  check('v2: back to home', new URL(page.url()).pathname === '/v2');
  await shot(page, 'v2-how');
  await ctx.close();
}

// ---------- v2 mobile menu ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => sessionStorage.setItem('ccc:entrance-played', '1'));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`v2 menu: ${e.message}`));
  await page.goto(base + '/v2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.waitForTimeout(1200);
  const menu = page.getByRole('dialog', { name: 'Menu' });
  check('v2: no login in the mobile menu', (await menu.getByText('Log in').count()) === 0);
  await menu.getByRole('link', { name: 'Apply', exact: true }).click();
  await page.waitForURL('**/v2/contact', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1500);
  check('v2: mobile Apply opens contact and closes the menu', new URL(page.url()).pathname === '/v2/contact' && (await page.getByRole('dialog', { name: 'Menu' }).count()) === 0);
  await ctx.close();
}

await browser.close();
check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} check(s) failed` : '\nAll smoke checks passed');
process.exit(failed ? 1 : 0);
