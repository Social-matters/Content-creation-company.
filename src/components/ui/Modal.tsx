'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';
import { uiEase } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
};

/** Accessible dialog: scale+fade, blurred backdrop, focus trap, Esc to close, scroll lock. */
export function Modal({ open, onClose, labelledBy, children, className, closeLabel = 'Close' }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';

    const focusFirst = window.setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>('input:not([type="hidden"]):not([tabindex="-1"]),select,textarea') ?? panel.current;
      first?.focus({ preventScroll: true });
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      lenis?.start();
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.1 } }}
          transition={{ duration: 0.35, ease: uiEase }}
        >
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            data-lenis-prevent
            className={cn(
              'relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[2rem] border-2 border-black bg-cream text-ink shadow-[10px_10px_0_0_var(--ccc-orange)] outline-none sm:rounded-[2rem]',
              className,
            )}
            initial={{ opacity: 0, scale: 0.94, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.55, ease: uiEase }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border-2 border-black bg-cream transition-colors hover:bg-orange"
              aria-label={closeLabel}
            >
              <Icon name="x" size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
