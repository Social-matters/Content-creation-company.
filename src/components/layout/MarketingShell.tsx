import type { ReactNode } from 'react';
import { SmoothScrollProvider } from '@/components/providers/SmoothScroll';
import { UIProvider } from '@/components/providers/UIProvider';
import { PageTransitionProvider } from '@/components/providers/PageTransition';
import { Preloader } from '@/components/layout/Preloader';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { LazyChrome } from '@/components/layout/LazyChrome';
import { nav } from '@/content/site';
import { SiteVersionProvider, type SiteVersion } from '@/lib/site-version';

const BASE: Record<SiteVersion, string> = { v1: '', v2: '/v2' };

/**
 * Providers + chrome shared by every marketing route and the 404 page.
 * `version="v2"` scopes the /v2 design: link base, spacing/type tokens (.v2) and motion profile.
 */
export function MarketingShell({ children, version = 'v1' }: { children: ReactNode; version?: SiteVersion }) {
  return (
    <SiteVersionProvider version={version} base={BASE[version]}>
      <div className={version === 'v2' ? 'v2 contents' : 'contents'}>
        <UIProvider>
          <SmoothScrollProvider>
            <PageTransitionProvider>
              <a
                href="#main"
                className="fixed left-4 top-4 z-[130] -translate-y-24 rounded-full border-2 border-black bg-orange px-5 py-2.5 font-mono text-sm uppercase text-black transition-transform focus:translate-y-0"
              >
                {nav.skip}
              </a>
              <Preloader />
              <Nav />
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
              <LazyChrome />
            </PageTransitionProvider>
          </SmoothScrollProvider>
        </UIProvider>
      </div>
    </SiteVersionProvider>
  );
}
