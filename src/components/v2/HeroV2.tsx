'use client';

import Image from 'next/image';
import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { heroV2 as hero } from '@/content/v2/home';
import { assets } from '@/content/assets';
import { useUI } from '@/components/providers/UIProvider';
import { Headline } from '@/components/ui/Headline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Counter } from '@/components/ui/Counter';
import { Video } from '@/components/ui/Video';
import { FlowWords, useShownOnView, useStackedReveal } from './flow';
import { NotificationCycle } from './NotificationCycle';
import { HeroClientStrip } from './Clients';

/**
 * Desktop frame geometry. The same numbers drive the CSS (first paint) and GSAP (scroll),
 * so the media never jumps when JavaScript takes over.
 */
const frameVars = {
  '--fr-top': 'calc(var(--nav-h) + 1.75rem)',
  '--fr-bottom': '2.75rem',
  '--fr-right': 'var(--gutter)',
  '--fr-w': 'min(36vw, 34rem)',
} as CSSProperties;

/**
 * v2 hero. Content breathes on the left; the film sits in a framed panel on the right.
 * Desktop scroll (pinned): the frame opens to full-bleed, the content drifts away, and the
 * manifesto inks in over the footage. Phones stack content above the frame, no pin.
 */
export function HeroV2() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const { entranceDone } = useUI();
  /** Stacked layouts: the film paints once 60% of the frame is in view (desktop ignores this; the hiding class is max-lg only). */
  const filmShown = useShownOnView(frame);
  useStackedReveal(root, filmShown);

  // Entrance, gated on the preloader.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q('[data-hero-in]');
      const pops = q('[data-pop]');
      if (!entranceDone) {
        gsap.set([...items, ...pops], { autoAlpha: 0 });
        return;
      }
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        if (ctx.conditions?.reduced) {
          gsap.set(q('[data-curtain]'), { autoAlpha: 0 });
          gsap.to([...items, ...pops], { autoAlpha: 1, duration: 0.6 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: flow.ease } });
        // Desktop reveals the film with the entrance; stacked layouts reveal it on view (below).
        if (window.matchMedia(mq.desktop).matches) {
          tl.fromTo(q('[data-curtain]'), { scaleY: 1 }, { scaleY: 0, duration: 1.7, ease: 'expo.inOut' }, 0.05).fromTo(q('[data-media-zoom]'), { scale: 1.28 }, { scale: 1, duration: 2.6 }, 0.15);
        }
        tl.fromTo(items, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: flow.dur, stagger: 0.11 }, 0.6)
          .fromTo(pops, { autoAlpha: 0, y: 34, rotate: (i) => (i ? 2.5 : -3) }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1.5, stagger: 0.18 }, 1.15);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [entranceDone], revertOnUpdate: true },
  );

  // Desktop scroll scene: frame → full-bleed → manifesto.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const ghost = q('[data-ghost]')[0];
      const mm = gsap.matchMedia();
      mm.add(`${mq.motionOK} and ${mq.desktop}`, () => {
        const frame = () => {
          const s = el.getBoundingClientRect();
          const a = ghost.getBoundingClientRect();
          return { t: a.top - s.top, r: s.right - a.right, b: s.bottom - a.bottom, l: a.left - s.left, cx: a.left - s.left + a.width / 2 - s.width / 2 };
        };
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${window.innerHeight * 1.35}`, pin: true, scrub: flow.scrub, invalidateOnRefresh: true },
        });
        tl.fromTo(q('[data-media]'), { clipPath: () => { const f = frame(); return `inset(${f.t}px ${f.r}px ${f.b}px ${f.l}px round 28px)`; } }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.55, ease: 'power2.inOut' }, 0)
          .fromTo(q('[data-media-inner]'), { x: () => frame().cx, scale: 1.12 }, { x: 0, scale: 1, duration: 0.55, ease: 'power2.inOut' }, 0)
          .to(q('[data-content]'), { y: -90, autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 0)
          .to(q('[data-anchor-inner]'), { y: -50, autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, 0)
          .fromTo(q('[data-shade]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.32)
          .fromTo(q('[data-manifesto]'), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' }, 0.5)
          .fromTo(q('[data-manifesto] [data-word]'), { opacity: 0.14 }, { opacity: 1, duration: 0.08, stagger: 0.018 }, 0.56)
          .to({}, { duration: 0.12 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <>
    {/* Own wrapper: ScrollTrigger wraps the pinned section in a spacer, so React must never insert beside it. */}
    <div>
    <section ref={root} style={frameVars} className="relative isolate flex flex-col overflow-hidden bg-ink text-cream lg:h-svh lg:min-h-[40rem]">
      <div aria-hidden className="pointer-events-none absolute -left-[18%] top-[18%] -z-10 size-[44rem] bg-[radial-gradient(closest-side,rgb(255_129_42/0.28),transparent)]" />

      {/* Content */}
      <div data-content className="container-x relative z-10 flex flex-col pt-[calc(var(--nav-h)+3.5rem)] lg:h-full lg:justify-center lg:pt-[var(--nav-h)]">
        <div className="flex max-w-[44rem] flex-col lg:max-w-[50%]">
          <div data-hero-in>
            <Badge tone="glass">{hero.badge}</Badge>
          </div>
          <Headline as="h1" lines={hero.headline} size="d1" tone="dark" play={entranceDone} delay={0.35} className="mt-8 lg:mt-10 lg:text-[min(6.5vw,11.5vh)] lg:[@media(max-height:820px)]:mt-6" />
          <p data-hero-in className="text-lead mt-8 max-w-[30rem] text-cream/75 lg:mt-10 lg:[@media(max-height:820px)]:mt-5">
            {hero.sub}
          </p>
          <div data-hero-in className="mt-9 flex flex-wrap gap-3 lg:mt-11 lg:[@media(max-height:820px)]:mt-6">
            <Button cta={hero.ctas[0]} />
            <Button cta={hero.ctas[1]} variant="outline-dark" icon="calendar" />
          </div>
          <div data-hero-in className="mt-12 max-w-[34rem] lg:mt-14 lg:[@media(max-height:820px)]:mt-7">
            <HeroClientStrip />
          </div>
        </div>
      </div>

      {/* Frame: in flow on phones; on desktop the media becomes a full-bleed layer clipped to the frame. */}
      <div ref={frame} className="relative mx-[var(--gutter)] mb-16 mt-14 aspect-[4/5] sm:aspect-[16/11] lg:contents">
        <div data-media className="absolute inset-0 overflow-hidden rounded-[1.6rem] bg-ink-2 lg:rounded-none lg:[clip-path:inset(var(--fr-top)_var(--fr-right)_var(--fr-bottom)_calc(100%_-_var(--fr-right)_-_var(--fr-w))_round_28px)]">
          <div data-media-inner className="hero-v2-inner absolute inset-0">
            <div data-media-zoom className={cn('absolute inset-0', !filmShown && 'max-lg:invisible')}>
              <Video media={assets.hero} mobile={assets.heroMobile} eager sizes="(min-width: 1024px) 100vw, 92vw" className="absolute inset-0" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
          <div data-shade className="invisible absolute inset-0 bg-ink/70" />
          <div data-curtain className="absolute inset-0 origin-top bg-ink" />
        </div>

        {/* Ghost = frame box on desktop (measured by the scroll scene); holds the floating UI. */}
        <div data-ghost className="pointer-events-none absolute inset-0 lg:inset-auto lg:bottom-[var(--fr-bottom)] lg:right-[var(--fr-right)] lg:top-[var(--fr-top)] lg:w-[var(--fr-w)]">
          <div data-anchor-inner className="absolute inset-0">
            <div data-pop className="absolute left-4 top-4 flex items-center gap-3 rounded-full border border-cream/15 bg-ink/80 py-1.5 pl-1.5 pr-4 lg:left-5 lg:top-5">
              <span className="flex -space-x-2.5">
                {assets.avatars.map((a, i) => (
                  <span key={a.poster} className="relative size-8 overflow-hidden rounded-full border-2 border-ink" style={{ zIndex: 10 - i }}>
                    <Image src={a.poster} alt="" width={32} height={32} className="size-full object-cover" />
                  </span>
                ))}
              </span>
              <span className="flex items-baseline gap-1.5">
                <Counter value={hero.stat.value} suffix={hero.stat.suffix} play={entranceDone} delay={1.3} className="font-display text-[1.05rem]" />
                <span className="text-[0.8rem] text-cream/65">{hero.stat.label}</span>
              </span>
            </div>
            <div data-pop className="absolute -bottom-7 left-4 sm:left-6 lg:-left-16 lg:bottom-[14%]" aria-hidden>
              <div className="float-loop" style={{ '--float-dur': '4.2s', '--float-y': '-7px', '--float-r': '0.6deg' } as CSSProperties}>
                <NotificationCycle items={hero.notifications} play={entranceDone} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop manifesto over the opened film (driven by the scroll scene). */}
      <div data-manifesto className="pointer-events-none invisible absolute inset-0 z-20 hidden items-center lg:flex motion-reduce:!hidden">
        <div className="container-x">
          <FlowWords driven text={hero.manifesto} className="max-w-[62rem] font-display text-[clamp(2.2rem,4.4vw,4.6rem)] leading-[0.98] text-cream" />
        </div>
      </div>

    </section>
    </div>

    {/* Phones (and reduced motion on desktop): the manifesto as its own block. */}
    <div className="bg-ink text-cream lg:hidden lg:motion-reduce:block">
      <div className="container-x pb-28 pt-4 lg:py-[var(--section-y)]">
        <FlowWords text={hero.manifesto} className="max-w-[62rem] font-display text-[clamp(1.8rem,6.4vw,4.2rem)] leading-[1] text-cream" />
      </div>
    </div>
    </>
  );
}
