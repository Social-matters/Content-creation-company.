import { gsap } from '@/lib/gsap';

/** Builds the four-step morph. One unit of timeline time per step. `total` = the live screen's final view count. */
export function buildTimeline(root: HTMLElement, total: number) {
  const q = gsap.utils.selector(root);
  const screens = ['brief', 'match', 'review', 'live'].map((s) => q(`[data-screen="${s}"]`)[0]);
  const views = q('[data-views]')[0];
  const line = root.querySelector<SVGPathElement>('[data-line]')!;
  const len = line.getTotalLength();
  const counter = { v: 0 };

  gsap.set(screens.slice(1), { autoAlpha: 0 });
  const swap = (from: Element, to: Element, at: number) =>
    tl.to(from, { autoAlpha: 0, yPercent: -6, duration: 0.25, ease: 'power2.in' }, at).fromTo(to, { autoAlpha: 0, yPercent: 8 }, { autoAlpha: 1, yPercent: 0, duration: 0.3, ease: 'power3.out' }, at + 0.2);

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  // 01 Brief: values type in, chips fill, slider moves, button presses.
  tl.fromTo(q('[data-type]'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.3, stagger: 0.15, ease: 'steps(14)' }, 0.02)
    .fromTo(q('[data-chip-fill]'), { scaleX: 0 }, { scaleX: 1, duration: 0.12, stagger: 0.06 }, 0.42)
    .fromTo(q('[data-slider-fill]'), { scaleX: 0.05 }, { scaleX: 0.4, duration: 0.25 }, 0.62)
    .fromTo(q('[data-send]'), { scale: 1 }, { scale: 0.94, duration: 0.06, yoyo: true, repeat: 1 }, 0.86)
    .fromTo(q('[data-chip-float="0"]'), { autoAlpha: 0, y: 20, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.15 }, 0.88);
  // 02 Match
  swap(screens[0], screens[1], 1);
  tl.fromTo(q('[data-match-card]'), { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.08 }, 1.3)
    .fromTo(q('[data-accept]'), { scaleX: 0 }, { scaleX: 1, duration: 0.14, stagger: 0.12 }, 1.62)
    .fromTo(q('[data-chip-float="1"]'), { autoAlpha: 0, y: 20, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.15 }, 1.86);
  // 03 Review
  swap(screens[1], screens[2], 2);
  tl.fromTo(q('[data-thumb]'), { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.22, stagger: 0.06 }, 2.28)
    .fromTo(q('[data-stamp]'), { autoAlpha: 0, scale: 1.8, rotate: -14 }, { autoAlpha: 1, scale: 1, rotate: -4, duration: 0.14, stagger: 0.1, ease: 'back.out(2)' }, 2.52)
    .fromTo(q('[data-chip-float="2"]'), { autoAlpha: 0, y: 20, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.15 }, 2.86);
  // 04 Live
  swap(screens[2], screens[3], 3);
  tl.fromTo(counter, { v: 0 }, { v: total, duration: 0.6, ease: 'power2.out', onUpdate: () => (views.textContent = Math.round(counter.v).toLocaleString('en-IN')) }, 3.25)
    .fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 3.25)
    .fromTo(q('[data-area]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 3.45)
    .fromTo(q('[data-feed]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.15, stagger: 0.08 }, 3.5)
    .fromTo(q('[data-chip-float="3"]'), { autoAlpha: 0, y: 20, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.15 }, 3.78)
    .to({}, { duration: 0.12 }, 3.88);
  return tl;
}
