#!/usr/bin/env node
/**
 * Interaction smoke test against a running server (BASE_URL, default http://localhost:3000).
 * Exercises the entrance, modal + form validation + submission, Esc to close,
 * route wipe, plan toggle, FAQ, mobile menu and keyboard focus. Saves frames to shots/smoke/.
 *
 *   pnpm smoke
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.BASE_URL ?? 'http://localhost:3000';
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
  await dialog.getByRole('button', { name: /apply as a brand/i }).click();
  const success = dialog.getByRole('status');
  await success.waitFor({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(900);
  check('valid brand lead submits and shows success', await success.isVisible().catch(() => false));
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

await browser.close();
check('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} check(s) failed` : '\nAll smoke checks passed');
process.exit(failed ? 1 : 0);
