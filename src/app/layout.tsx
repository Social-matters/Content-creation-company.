import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';
import { site, socials } from '@/content/site';
import { PLACEHOLDER_CONTENT } from '@/content/status';
import { ENTRANCE_KEY, ENTRANCE_MIN_WIDTH } from '@/lib/motion';
import './globals.css';

const display = Archivo_Black({ weight: '400', subsets: ['latin'], variable: '--font-archivo-black', display: 'swap' });
const body = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: Creators. Content. Results.`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: 'website', locale: site.locale, siteName: site.name, url: site.url },
  twitter: { card: 'summary_large_image' },
  other: PLACEHOLDER_CONTENT ? { 'ccc-content': 'placeholder' } : {},
};

export const viewport: Viewport = {
  themeColor: '#141210',
  colorScheme: 'light dark',
};

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  alternateName: site.short,
  url: site.url,
  logo: `${site.url}/brand/ccc-logo.png`,
  email: site.email,
  description: site.description,
  areaServed: 'IN',
  sameAs: socials.map((s) => s.href),
  parentOrganization: { '@type': 'Organization', name: 'Social Matters' },
};

/** Runs before paint: skip the entrance sequence on repeat visits in this session. */
const entranceScript = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem('${ENTRANCE_KEY}')||innerWidth<${ENTRANCE_MIN_WIDTH}||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('entrance-skip')}else{d.classList.add('is-loading')}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: entranceScript }} />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} />
      </body>
    </html>
  );
}
