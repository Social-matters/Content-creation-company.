#!/usr/bin/env node
/** Regenerates ASSETS.md from scripts/asset-sources.mjs + public/media/manifest.json. `pnpm assets:doc` */
import fs from 'node:fs';
import path from 'node:path';
import { sources } from './asset-sources.mjs';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/media/manifest.json'), 'utf8'));
const src = (s) => (s.provider === 'mixkit' ? `https://mixkit.co/free-stock-video/${s.id}/` : s.provider === 'pexels' ? `Pexels: "${s.query}"` : s.file);
const author = (s) => (s.provider === 'mixkit' ? 'Mixkit (Envato)' : s.provider === 'pexels' ? 'see Pexels page' : 'CCC');
const license = (s) => (s.provider === 'mixkit' ? '[Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree)' : s.provider === 'pexels' ? '[Pexels License](https://www.pexels.com/license/)' : 'Owned');

const rows = sources.map((s) => {
  const m = manifest[s.slot] ?? {};
  const files = s.kind === 'video' ? `media/${s.slot}.mp4 (${m.kb?.video ?? '?'} KB), .webp (${m.kb?.poster ?? '?'} KB)` : `media/${s.slot}.webp (${m.kb?.poster ?? '?'} KB)`;
  return `| \`${s.slot}\` | ${files} | ${src(s)} | ${author(s)} | ${license(s)} |`;
});

const md = `# Assets register

Every media file shipped in \`public/\`, where it came from, and its licence. **Nothing unlicensed ships.**
Regenerate after changing \`scripts/asset-sources.mjs\`: \`pnpm assets && pnpm assets:doc\`.

> All media below is **temporary royalty-free stock** standing in for CCC's own creator content (see docs/TODO-real-content.md).
> Mixkit item IDs are listed; confirm each item page still shows the Free License (not "Restricted") before launch.

## Brand

| File | Source | Licence |
|---|---|---|
| \`brand/ccc-logo.png\` | contentcreationcompany.in (CCC's own logo) | Owned by CCC |
| \`brand/ccc-logo.svg\` | Traced from the PNG above (potrace) | Owned by CCC |
| \`brand/favicon.png\`, \`app/icon.png\`, \`app/apple-icon.png\` | contentcreationcompany.in favicon | Owned by CCC |
| \`brand/noise.webp\` | Generated (ffmpeg noise) | Original |
| \`assets/ArchivoBlack-Regular.ttf\` (OG image only) | github.com/google/fonts | SIL Open Font License 1.1 |

## Media

| Slot | Files | Source | Author | Licence |
|---|---|---|---|---|
${rows.join('\n')}

Web fonts (Archivo Black, Bricolage Grotesque, JetBrains Mono) are self-hosted at build time by \`next/font/google\` under the SIL Open Font License.
`;
fs.writeFileSync(path.join(root, 'ASSETS.md'), md);
console.log(`ASSETS.md: ${rows.length} media slots`);
