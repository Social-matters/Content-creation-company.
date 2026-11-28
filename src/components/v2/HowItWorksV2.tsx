'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { mq } from '@/lib/motion';
import { howItWorks } from '@/content/home';
import { howV2 } from '@/content/v2/home';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Eyebrow } from '@/components/ui/Badge';
import { Headline } from '@/components/ui/Headline';
import { buildTimeline } from '@/components/sections/HowItWorks';
import { HowItWorksScreens } from '@/components/sections/HowItWorksScreens';
import { Sheet } from './flow';

const STEPS = howItWorks.steps.length;
const CHIP_ICONS: IconName[] = ['doc', 'sparkle', 'check', 'trend'];
const CHIP_POS = ['-left-36 top-[10%]', '-right-32 top-[30%]', '-left-40 top-[58%]', '-right-36 top-[78%]'];

/** One step on stage at a time; the rail fills as the scene scrubs. */
function setStep(root: HTMLElement, p: number) {
  const pos = p * STEPS;
  const active = Math.min(STEPS - 1, Math.floor(pos));
  root.querySelectorAll<HTMLElement>('[data-stage-step]').forEach((el, i) => {
    el.dataset.state = i === active ? 'active' : i < active ? 'before' : 'after';
  });
  root.querySelectorAll<HTMLElement>('[data-rail]').forEach((el, i) => {
    el.style.transform = `scaleX(${gsap.utils.clamp(0, 1, pos - i)})`;
    el.parentElement!.parentElement!.dataset.on = String(i <= active);
  });
}

export function HowItWorksV2() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !pin.current) return;
      const mm = gsap.matchMedia();
      mm.add(`${mq.motionOK} and ${mq.desktop}`, () => {
        const tl = buildTimeline(el);
        setStep(el, 0);
        const st = ScrollTrigger.create({
          trigger: pin.current,
          pin: pin.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3.4}`,
          scrub: 1.4,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: (self) => setStep(el, self.progress),
        });
        return () => st.kill();
      });
      mm.add(`${mq.motionOK} and ${mq.mobile}`, () => {
        const tl = buildTimeline(el);
        tl.eventCallback('onUpdate', () => setStep(el, tl.progress()));
        tl.timeScale(0.4).repeat(-1).repeatDelay(1.4);
        setStep(el, 0);
        const st = ScrollTrigger.create({ trigger: pin.current, start: 'top 75%', end: 'bottom 25%', onToggle: (self) => (self.isActive ? tl.play() : tl.pause()) });
        return () => st.kill();
      });
      mm.add(mq.reduced, () => {
        gsap.set(el.querySelectorAll('[data-screen]'), { autoAlpha: 0 });
        gsap.set(el.querySelector('[data-screen="live"]'), { autoAlpha: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={howItWorks.id} className="relative isolate bg-ink text-ink">
      <Sheet tone="cream" />
      <div ref={pin} className="relative overflow-hidden lg:h-dvh">
        <div aria-hidden className="pointer-events-none absolute right-[6%] top-1/2 size-[40rem] -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(255_129_42/0.32),transparent)]" />
        <div className="container-x relative grid h-full items-center gap-20 py-[var(--section-y)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-0 lg:pt-[var(--nav-h)]">
          <div className="flex flex-col">
            <Eyebrow tone="light">{howItWorks.label}</Eyebrow>
            <Headline lines={howItWorks.headline} size="d3" className="mt-6" />

            {/* Rail */}
            <div aria-hidden className="mt-14 grid max-w-[30rem] grid-cols-4 gap-3 motion-reduce:hidden lg:mt-20">
              {howItWorks.steps.map((s) => (
                <div key={s.key} data-on="false" className="group flex flex-col gap-3">
                  <span className="relative h-[3px] overflow-hidden rounded-full bg-black/10">
                    <span data-rail className="absolute inset-0 origin-left rounded-full bg-orange" style={{ transform: 'scaleX(0)' }} />
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink/60 transition-colors duration-500 group-data-[on=true]:text-ink">
                    {s.n} {s.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Stage: one step visible, the others waiting above/below */}
            <div aria-hidden className="mt-10 grid motion-reduce:hidden lg:mt-12">
              {howItWorks.steps.map((s, i) => (
                <div
                  key={s.key}
                  data-stage-step
                  data-state={i === 0 ? 'active' : 'after'}
                  className="flex max-w-[30rem] flex-col gap-4 transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] [grid-area:1/1] data-[state=active]:translate-y-0 data-[state=active]:opacity-100 data-[state=active]:delay-[280ms] data-[state=active]:duration-[1000ms] data-[state=after]:translate-y-6 data-[state=after]:opacity-0 data-[state=before]:-translate-y-6 data-[state=before]:opacity-0"
                >
                  <span className="font-mono text-sm text-orange-text">
                    {s.n} {howV2.stepOf} {String(STEPS).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-d4">{s.title}</h3>
                  <p className="text-lead text-ink/75">{s.body}</p>
                </div>
              ))}
            </div>

            {/* Accessible list (visible under reduced motion) */}
            <ol className="sr-only motion-reduce:not-sr-only motion-reduce:mt-12 motion-reduce:flex motion-reduce:flex-col motion-reduce:gap-6">
              {howItWorks.steps.map((s) => (
                <li key={s.key}>
                  <h3 className="font-display text-d4">
                    <span className="mr-3 font-mono text-sm text-orange-text">{s.n}</span>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-ink/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mx-auto w-[min(76vw,18.5rem)] lg:w-[clamp(16.5rem,20vw,19.5rem)]">
            <PhoneFrame>
              <HowItWorksScreens />
            </PhoneFrame>
            {howItWorks.chips.map((t, i) => (
              <div
                key={t}
                data-chip-float={i}
                aria-hidden
                className={`absolute ${CHIP_POS[i]} z-10 flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-black bg-white px-3.5 py-2 text-[0.8rem] font-semibold shadow-[4px_4px_0_0_#000] max-lg:hidden`}
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
