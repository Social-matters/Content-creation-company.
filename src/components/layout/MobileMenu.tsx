'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { uiEase } from '@/lib/motion';
import { nav, site, socials } from '@/content/site';
import type { Cta, LinkItem } from '@/content/types';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';
import { TLink } from '@/components/ui/TLink';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/brand/Logo';
import { SocialLinks } from './SocialLinks';

type Props = { open: boolean; onClose: () => void; links: readonly LinkItem[]; cta: Cta };

/** Full-screen menu (below lg) with staggered links. Esc closes; scroll is locked while open. */
export function MobileMenu({ open, onClose, links, cta }: Props) {
  const { lenis } = useSmoothScroll();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, [open, onClose, lenis]);

  // Close when the route changes.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname && open) onClose();
    lastPath.current = pathname;
  }, [pathname, open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={nav.menu}
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink text-cream lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.5, ease: uiEase, delay: 0.1 } }}
          transition={{ duration: 0.7, ease: uiEase }}
        >
          <div className="grain pointer-events-none absolute inset-0" />
          <div className="container-x relative flex h-[var(--nav-h)] items-center justify-between">
            <Logo className="h-9 w-auto" />
            <button ref={closeBtn} type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border border-cream/20 bg-cream/5">
              <Icon name="x" size={20} />
              <span className="sr-only">{nav.close}</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="container-x relative mt-8 flex flex-col">
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                className="overflow-hidden border-b border-cream/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '-110%', transition: { duration: 0.3 } }} transition={{ duration: 0.8, ease: uiEase, delay: 0.18 + i * 0.07 }}>
                  <TLink href={l.href} onClick={onClose} className="flex items-center justify-between py-4 font-display text-[2.4rem] leading-none">
                    {l.label}
                    <Icon name="arrowUpRight" size={26} className="text-orange" />
                  </TLink>
                </motion.div>
              </motion.div>
            ))}
          </nav>
          <motion.div
            className="container-x relative mt-auto flex flex-col gap-6 pb-10 pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: uiEase }}
          >
            <Button cta={cta} onClick={onClose} magnetic={false} className="self-start" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <a href={`mailto:${site.email}`} className="font-mono text-sm text-cream/70 underline-offset-4 hover:underline">
                {site.email}
              </a>
              <SocialLinks items={socials} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
