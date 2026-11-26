'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { mq } from '@/lib/motion';

/**
 * Custom cursor (fine pointer + motion allowed only): an orange dot and a ring
 * that lags behind. Over elements with data-cursor="Label" the ring grows into a
 * labelled disc; data-cursor="hide" tucks it away (buttons have their own hover).
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`${mq.finePointer} and ${mq.motionOK}`);
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    document.documentElement.classList.add('has-cursor');
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(r, { scale: 0.42 });
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3.out' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3.out' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3.out' });
    let shown = false;
    let state = '';

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        shown = true;
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest<HTMLElement>('[data-cursor]');
      const interactive = t?.closest('a,button,[role="button"],label,select');
      const next = tagged ? tagged.dataset.cursor ?? '' : interactive ? 'link' : '';
      if (next === state) return;
      state = next;
      if (next === 'hide') {
        gsap.to(r, { scale: 0, duration: 0.35, ease: 'power3.out' });
        gsap.to(d, { scale: 0.5, duration: 0.3 });
        setLabel('');
      } else if (next === 'link') {
        gsap.to(r, { scale: 0.6, duration: 0.4, ease: 'power3.out' });
        gsap.to(d, { scale: 0, duration: 0.3 });
        setLabel('');
      } else if (next) {
        setLabel(next);
        gsap.to(r, { scale: 1, duration: 0.55, ease: 'expo.out' });
        gsap.to(d, { scale: 0, duration: 0.3 });
      } else {
        setLabel('');
        gsap.to(r, { scale: 0.42, duration: 0.5, ease: 'expo.out' });
        gsap.to(d, { scale: 1, duration: 0.3 });
      }
    };
    const leaveWindow = () => {
      shown = false;
      gsap.to([d, r], { autoAlpha: 0, duration: 0.3 });
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leaveWindow);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leaveWindow);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] grid size-[5.5rem] place-items-center rounded-full border-2 border-orange will-change-transform"
        style={{ backgroundColor: label ? 'var(--ccc-orange)' : 'transparent' }}
      >
        <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-black">{label}</span>
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] size-2 rounded-full bg-orange will-change-transform" />
    </>
  );
}
