'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { mq } from '@/lib/motion';
import { howItWorks } from '@/content/home';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SectionIntro } from './SectionIntro';
import { HowItWorksScreens } from './HowItWorksScreens';

const STEPS = howItWorks.steps.length;
const CHIP_ICONS: IconName[] = ['doc', 'sparkle', 'check', 'trend'];
const CHIP_POS = ['-left-6 top-[14%] lg:-left-40', '-right-6 top-[30%] lg:-right-36', '-left-6 top-[56%] lg:-left-44', '-right-6 top-[74%] lg:-right-40'];

/** Builds the four-step morph. One unit of timeline time per step. */
function buildTimeline(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const screens = ['brief', 'match', 'review', 'live'].map((s) => q(`[data-screen="${s}"]`)[0]);
  const views = q('[data-views]')[0];
  const line = root.querySelector<SVGPathElement>('[data-line]')!;
  const len = line.getTotalLength();
  const total = howItWorks.mock.live.total;
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

/** Highlights the active step and fills each step's progress bar. */
function setProgress(root: HTMLElement, p: number) {
  const pos = p * STEPS;
  const active = Math.min(STEPS - 1, Math.floor(pos));
  root.querySelectorAll<HTMLElement>('[data-step]').forEach((el, i) => {
    el.dataset.active = String(i === active);
    const bar = el.querySelector<HTMLElement>('[data-bar]');
    if (bar) bar.style.transform = `scaleX(${gsap.utils.clamp(0, 1, pos - i)})`;
  });
}

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !pin.current) return;
      const mm = gsap.matchMedia();

      mm.add(`${mq.motionOK} and ${mq.desktop}`, () => {
        const tl = buildTimeline(el);
        const st = ScrollTrigger.create({
          trigger: pin.current,
          pin: pin.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3.2}`,
          scrub: 1,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(el, self.progress),
        });
        setProgress(el, 0);
        return () => st.kill();
      });

      mm.add(`${mq.motionOK} and ${mq.mobile}`, () => {
        const tl = buildTimeline(el);
        tl.eventCallback('onUpdate', () => setProgress(el, tl.progress()));
        tl.timeScale(0.42).repeat(-1).repeatDelay(1.2);
        setProgress(el, 0);
        const st = ScrollTrigger.create({ trigger: pin.current, start: 'top 75%', end: 'bottom 25%', onToggle: (self) => (self.isActive ? tl.play() : tl.pause()) });
        return () => st.kill();
      });

      mm.add(mq.reduced, () => {
        el.querySelectorAll<HTMLElement>('[data-step]').forEach((s) => (s.dataset.active = 'true'));
        // Static final state: only the Live screen.
        gsap.set(el.querySelectorAll('[data-screen]'), { autoAlpha: 0 });
        gsap.set(el.querySelector('[data-screen="live"]'), { autoAlpha: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={howItWorks.id} className="relative bg-cream text-ink">
      <div ref={pin} className="relative overflow-hidden lg:h-dvh">
        <div aria-hidden className="pointer-events-none absolute right-[8%] top-1/2 size-[36rem] -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(255_129_42/0.55),transparent)]" />
        <div className="container-x relative grid h-full items-center gap-14 py-[var(--section-y)] lg:grid-cols-[1fr_1fr] lg:py-0 lg:pt-[var(--nav-h)]">
          <div className="flex flex-col gap-10">
            <SectionIntro label={howItWorks.label} headline={howItWorks.headline} size="d3" />
            <ol className="flex flex-col">
              {howItWorks.steps.map((s, i) => (
                <li
                  key={s.key}
                  data-step
                  data-active={i === 0}
                  className="group relative border-t-2 border-black/15 py-4 transition-opacity duration-500 data-[active=false]:opacity-60"
                >
                  <span data-bar aria-hidden className="absolute -top-[2px] left-0 h-[2px] w-full origin-left scale-x-0 bg-orange" />
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-sm text-orange-text group-data-[active=false]:text-ink">{s.n}</span>
                    <div>
                      <h3 className="font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-none">{s.title}</h3>
                      <p className="mt-2 max-w-md text-ink">{s.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mx-auto w-[min(78vw,19rem)] lg:w-[clamp(17rem,22vw,20.5rem)]">
            <PhoneFrame>
              <HowItWorksScreens />
            </PhoneFrame>
            {howItWorks.chips.map((t, i) => (
              <div
                key={t}
                data-chip-float={i}
                aria-hidden
                className={`absolute ${CHIP_POS[i]} z-10 flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-black bg-white px-3.5 py-2 text-[0.8rem] font-semibold shadow-[4px_4px_0_0_#000]`}
              >
                <span className="grid size-6 place-items-center rounded-full bg-orange">
                  <Icon name={CHIP_ICONS[i]} size={13} />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
