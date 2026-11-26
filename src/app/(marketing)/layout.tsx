import { SmoothScrollProvider } from '@/components/providers/SmoothScroll';
import { UIProvider } from '@/components/providers/UIProvider';
import { PageTransitionProvider } from '@/components/providers/PageTransition';
import { Preloader } from '@/components/layout/Preloader';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ModalHost } from '@/components/forms/ModalHost';
import { Cursor } from '@/components/ui/Cursor';
import { nav } from '@/content/site';

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
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
          <ModalHost />
          <Cursor />
        </PageTransitionProvider>
      </SmoothScrollProvider>
    </UIProvider>
  );
}
