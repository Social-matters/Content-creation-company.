import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/content/site';
import { heroV2 as hero } from '@/content/v2/home';

export const alt = `${site.name}: Influence. Content. Results.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const display = await readFile(join(process.cwd(), 'assets/ArchivoBlack-Regular.ttf'));
const logo = await readFile(join(process.cwd(), 'public/brand/ccc-logo.png'), 'base64');

/** Default social card for every route: ink, orange glow, the hero line with the tilted block. */
export default async function Image() {
  const lines = hero.headline.map((l) => (typeof l === 'string' ? l : l.accent));
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#141210', padding: 64, position: 'relative', fontFamily: 'Archivo Black' }}>
        <div style={{ position: 'absolute', right: -160, bottom: -200, width: 720, height: 720, borderRadius: 720, background: 'radial-gradient(circle, rgba(255,129,42,0.55), rgba(255,129,42,0) 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={`data:image/png;base64,${logo}`} width={220} height={101} alt="" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#000', color: '#F1EDE4', borderRadius: 999, padding: '10px 22px', fontSize: 20, textTransform: 'uppercase' }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: '#FF812A' }} />
            {hero.badge}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', color: '#F1EDE4', fontSize: 112, lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: -2 }}>
          <span>{lines[0]}</span>
          <span>{lines[1]}</span>
          <span style={{ display: 'flex', marginTop: 8 }}>
            <span style={{ display: 'flex', background: '#FF812A', color: '#141210', border: '5px solid #000', boxShadow: '10px 10px 0 #000', padding: '0 18px', transform: 'rotate(-2deg)' }}>{lines[2]}</span>
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Archivo Black', data: display, style: 'normal', weight: 400 }] },
  );
}
