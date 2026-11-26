#!/usr/bin/env node
/**
 * Download and compress every media slot listed in scripts/asset-sources.mjs
 * into public/media/. Requires ffmpeg on PATH.
 *
 *   pnpm assets            fetch missing outputs only
 *   pnpm assets --force    rebuild everything
 *   pnpm assets hero       rebuild only slots whose name contains "hero"
 *
 * Outputs: public/media/<slot>.mp4 + <slot>.webp (videos), <slot>.webp (images),
 * and public/media/manifest.json (sizes + credits) which ASSETS.md is checked against.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { sources } from './asset-sources.mjs';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public/media');
const cache = path.join(root, '.cache/asset-src');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(cache, { recursive: true });

loadEnv(path.join(root, '.env.local'));
const args = process.argv.slice(2);
const force = args.includes('--force');
const filter = args.find((a) => !a.startsWith('--'));

const ffmpeg = (a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: 'inherit' });

const manifestPath = path.join(out, 'manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const missing = [];

for (const s of sources) {
  if (filter && !s.slot.includes(filter)) continue;
  const poster = path.join(out, `${s.slot}.webp`);
  const video = path.join(out, `${s.slot}.mp4`);
  const done = s.kind === 'video' ? fs.existsSync(video) && fs.existsSync(poster) : fs.existsSync(poster);
  if (done && !force) continue;

  let src;
  try {
    src = await resolveSource(s);
  } catch (e) {
    console.warn(`✗ ${s.slot}: ${e.message}`);
    missing.push(s.slot);
    continue;
  }

  const fx = s.fx ?? 0.5;
  const fy = s.fy ?? 0.5;
  const z = s.zoom ?? (s.kind === 'image' && s.w === s.h ? 2.2 : 1);
  const vf = [
    `scale=${Math.round(s.w * z)}:${Math.round(s.h * z)}:force_original_aspect_ratio=increase`,
    `crop=${s.w}:${s.h}:(iw-${s.w})*${fx}:(ih-${s.h})*${fy}`,
    'setsar=1',
  ].join(',');
  const ss = String(s.ss ?? 0);

  if (s.kind === 'video') {
    ffmpeg(['-ss', ss, '-i', src, '-t', String(s.t ?? 8), '-vf', `${vf},fps=30`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(s.crf ?? 28), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', video]);
  }
  ffmpeg(['-ss', String(Number(ss) + 0.4), '-i', src, '-frames:v', '1', '-vf', vf, '-c:v', 'libwebp', '-quality', '78', poster]);

  const kb = (f) => (fs.existsSync(f) ? Math.round(fs.statSync(f).size / 1024) : 0);
  manifest[s.slot] = {
    kind: s.kind,
    width: s.w,
    height: s.h,
    alt: s.alt ?? '',
    source: sourceUrl(s),
    license: licenseFor(s),
    kb: { video: s.kind === 'video' ? kb(video) : 0, poster: kb(poster) },
  };
  console.log(`✓ ${s.slot.padEnd(22)} ${s.kind === 'video' ? `${kb(video)}KB mp4 · ` : ''}${kb(poster)}KB webp`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
if (missing.length) {
  console.warn(`\nMissing (placeholders will render): ${missing.join(', ')}. Add them to docs/TODO-real-content.md.`);
}

// ---------------------------------------------------------------------------

async function resolveSource(s) {
  if (s.provider === 'local') {
    const f = path.join(root, s.file);
    if (!fs.existsSync(f)) throw new Error(`local file not found: ${s.file}`);
    return f;
  }
  if (s.provider === 'mixkit') {
    const res = s.res ?? 720;
    const f = path.join(cache, `mixkit-${s.id}-${res}.mp4`);
    if (!fs.existsSync(f)) await download(`https://assets.mixkit.co/videos/${s.id}/${s.id}-${res}.mp4`, f);
    return f;
  }
  if (s.provider === 'pexels') {
    const key = process.env.PEXELS_API_KEY;
    if (!key) throw new Error('PEXELS_API_KEY not set (see .env.example)');
    const f = path.join(cache, `pexels-${s.slot}.mp4`);
    if (fs.existsSync(f)) return f;
    const orientation = s.h > s.w ? 'portrait' : 'landscape';
    const r = await fetch(`https://api.pexels.com/videos/search?per_page=1&orientation=${orientation}&query=${encodeURIComponent(s.query)}`, { headers: { Authorization: key } });
    if (!r.ok) throw new Error(`Pexels ${r.status}`);
    const v = (await r.json()).videos?.[0];
    const file = v?.video_files?.filter((x) => x.file_type === 'video/mp4').sort((a, b) => Math.abs(a.height - 1080) - Math.abs(b.height - 1080))[0];
    if (!file) throw new Error(`no Pexels result for "${s.query}"`);
    s.resolvedUrl = v.url;
    s.author = v.user?.name;
    await download(file.link, f);
    return f;
  }
  throw new Error(`unknown provider ${s.provider}`);
}

async function download(url, dest) {
  const r = await fetch(url, { headers: { 'User-Agent': 'ccc-asset-fetch/1.0' } });
  if (!r.ok) throw new Error(`${r.status} for ${url}`);
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}

function sourceUrl(s) {
  if (s.provider === 'mixkit') return `https://mixkit.co/free-stock-video/${s.id}/`;
  if (s.provider === 'pexels') return s.resolvedUrl ?? `pexels: ${s.query}`;
  return s.file;
}

function licenseFor(s) {
  if (s.provider === 'mixkit') return 'Mixkit Stock Video Free License';
  if (s.provider === 'pexels') return `Pexels License${s.author ? ` · ${s.author}` : ''}`;
  return 'Owned by Content Creation Company';
}

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
