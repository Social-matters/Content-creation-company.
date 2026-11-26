#!/usr/bin/env node
/**
 * Visual check: scrolls each route at 1440 / 768 / 390 and saves viewport
 * screenshots to shots/<route>/<width>-NN.png. Prints console errors/warnings.
 *
 *   pnpm shots                       all routes, all widths
 *   pnpm shots / --w=1440            one route, one width
 *   pnpm shots / --entrance          keep the entrance sequence (first visit)
 *   pnpm shots / --reduced           emulate prefers-reduced-motion
 *   BASE_URL=http://localhost:3000   (default)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (n) => args.find((a) => a.startsWith(`--${n}`));
const base = process.env.BASE_URL ?? 'http://localhost:3000';
const routes = args.filter((a) => !a.startsWith('--'));
const all = ['/', '/creators', '/pricing', '/about', '/contact', '/privacy', '/terms', '/start-a-campaign', '/join-as-creator', '/styleguide'];
const widths = flag('w') ? flag('w').split('=')[1].split(',').map(Number) : [1440, 768, 390];
const max = Number(flag('max')?.split('=')[1] ?? 40);
const outRoot = path.resolve(import.meta.dirname, '../shots');

const browser = await chromium.launch();
let problems = 0;
for (const route of routes.length ? routes : all) {
  for (const w of widths) {
    const h = w >= 1024 ? 900 : w >= 768 ? 1024 : 844;
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      reducedMotion: flag('reduced') ? 'reduce' : 'no-preference',
      hasTouch: w < 1024,
      isMobile: w < 768,
    });
    if (!flag('entrance')) await ctx.addInitScript(() => sessionStorage.setItem('ccc:entrance-played', '1'));
    const page = await ctx.newPage();
    page.on('console', (m) => {
      if (['error', 'warning'].includes(m.type())) {
        problems++;
        console.log(`  [${m.type()}] ${route} @${w}: ${m.text().slice(0, 300)}`);
      }
    });
    page.on('pageerror', (e) => {
      problems++;
      console.log(`  [pageerror] ${route} @${w}: ${e.message}`);
    });
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 120000 }).catch(() => {});
    await page.waitForTimeout(flag('entrance') ? 3200 : 1600);
    const dir = path.join(outRoot, route === '/' ? 'home' : route.slice(1).replace(/\//g, '_'));
    fs.mkdirSync(dir, { recursive: true });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    let i = 0;
    for (let y = 0; y < total && i < max; y += h * 0.9, i++) {
      if (i > 0) {
        await page.mouse.move(w / 2, h / 2);
        await page.mouse.wheel(0, h * 0.9);
        await page.waitForTimeout(1300);
      }
      await page.screenshot({ path: path.join(dir, `${w}-${String(i).padStart(2, '0')}.png`) });
    }
    console.log(`✓ ${route} @${w}: ${i} shots (${total}px)`);
    await ctx.close();
  }
}
await browser.close();
console.log(problems ? `\n${problems} console problem(s)` : '\nNo console errors or warnings');
