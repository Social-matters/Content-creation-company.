'use client';

import { Fragment, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { proofV2 as proof } from '@/content/v2/home';
import { useSmoothScroll } from '@/components/providers/SmoothScroll';
import { Eyebrow } from '@/components/ui/Badge';
import { Headline } from '@/components/ui/Headline';
import { Video } from '@/components/ui/Video';
import { RosterPanel } from './ServicesV2';

function IntroBlock() {
  return (
    <div className="flex flex-col gap-7">
      <Eyebrow>{proof.label}</Eyebrow>
      <Headline lines={proof.headline} size="d2" tone="dark" />
      <p className="text-lead max-w-sm text-cream/70">{proof.body}</p>
    </div>
  );
}

/**
 * Proof grouped by talent type: Influencers, Celebrities & actors, Model shoots. Desktop: a pinned
 * film strip; each group opens with a title card and the "Jump to" chips follow along (and glide
 * the strip to a group on click). Phones / reduced motion: native swipe with the same chips.
 */
export function ProofV2() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const pinned = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const track = q('[data-track]')[0];
      const heads = q('[data-group]') as HTMLElement[];
      const mm = gsap.matchMedia();
      mm.add(`${mq.motionOK} and ${mq.desktop}`, () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            pin: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: flow.scrub,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const x = self.progress * distance() + window.innerWidth * 0.55;
              let g = 0;
              heads.forEach((h, i) => h.offsetLeft <= x && (g = i));
              setActive((a) => (a === g ? a : g));
            },
          },
        });
        pinned.current = move.scrollTrigger ?? null;
        gsap.fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: flow.scrub, invalidateOnRefresh: true } });
        q('[data-card]').forEach((card) => {
          const st = { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true };
          const par = card.querySelector('[data-par]');
          if (par) gsap.fromTo(par, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: st });
          gsap.fromTo(card.querySelector('[data-lift]'), { y: 50, rotate: 2 }, { y: 0, rotate: 0, ease: 'power2.out', scrollTrigger: { ...st, end: 'center 60%' } });
        });
        return () => {
          pinned.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /** Native-scroll mode (phones, reduced motion): track the group under the viewport's left third. */
  const onNativeScroll = () => {
    const vp = viewport.current;
    if (!vp || pinned.current) return;
    const heads = Array.from(vp.querySelectorAll<HTMLElement>('[data-group]'));
    let g = 0;
    heads.forEach((h, i) => h.offsetLeft <= vp.scrollLeft + vp.clientWidth * 0.4 && (g = i));
    setActive((a) => (a === g ? a : g));
  };

  const jump = (i: number) => {
    const head = root.current?.querySelectorAll<HTMLElement>('[data-group]')[i];
    if (!head) return;
    const st = pinned.current;
    if (st) {
      const track = root.current!.querySelector<HTMLElement>('[data-track]')!;
      const distance = track.scrollWidth - window.innerWidth;
      const p = gsap.utils.clamp(0, 1, (head.offsetLeft - window.innerWidth * 0.08) / distance);
      scrollTo(st.start + p * (st.end - st.start));
    } else {
      viewport.current?.scrollTo({ left: head.offsetLeft - 20, behavior: window.matchMedia(mq.reduced).matches ? 'auto' : 'smooth' });
    }
  };

  return (
    // Own wrapper: the pinned section gets wrapped in a spacer, so React must never insert beside it.
    <div>
      <section ref={root} id={proof.id} className="relative overflow-hidden bg-ink text-cream">
        <div className="flex flex-col justify-center py-[var(--section-y)] lg:motion-safe:h-dvh lg:motion-safe:pb-12 lg:motion-safe:pt-[calc(var(--nav-h)+1.5rem)]">
          <div className="container-x lg:motion-safe:hidden">
            <IntroBlock />
          </div>
          <div ref={viewport} onScroll={onNativeScroll} className="mt-14 overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:motion-safe:mt-0 lg:motion-safe:overflow-visible [&::-webkit-scrollbar]:hidden">
            <ul data-track className="flex w-max snap-x snap-mandatory items-center gap-4 px-[var(--gutter)] sm:gap-6 lg:gap-7">
              <li className="hidden w-[min(32rem,34vw)] shrink-0 pr-[3vw] lg:motion-safe:block">
                <IntroBlock />
              </li>
              {proof.groups.map((g, gi) => (
                <Fragment key={g.key}>
                  <li data-group className="flex w-[64vw] shrink-0 snap-start flex-col gap-4 self-stretch border-l border-cream/15 py-2 pl-5 pr-2 sm:w-[34vw] lg:w-[clamp(14rem,17vw,18rem)] lg:pl-7">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-orange">0{gi + 1}</span>
                    <h3 className="font-display text-d4">{g.title}</h3>
                    <p className="text-[0.95rem] text-cream/70">{g.line}</p>
                    {g.categories.length > 0 && (
                      <ul aria-label={`${g.title} categories`} className="mt-auto flex flex-wrap gap-1.5">
                        {g.categories.map((c) => (
                          <li key={c} className="rounded-full border border-cream/20 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.06em] text-cream/75">
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  {g.items.map((item) => (
                    <li key={item.caption} data-card className="w-[62vw] shrink-0 snap-start sm:w-[36vw] lg:w-[clamp(14rem,19vw,20rem)]">
                      <figure data-lift>
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-ink-2 ring-1 ring-cream/10">
                          {item.media ? (
                            <div data-par className="absolute -inset-x-[9%] inset-y-0">
                              <Video media={item.media} sizes="(min-width: 1024px) 21vw, 64vw" className="absolute inset-0" />
                            </div>
                          ) : (
                            <RosterPanel label={proof.rosterPlaceholder} />
                          )}
                        </div>
                        <figcaption className="mt-4 font-display text-[clamp(1rem,1.3vw,1.2rem)] leading-tight">{item.caption}</figcaption>
                      </figure>
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
          </div>
          <div className="container-x mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
            <nav aria-label={proof.jumpLabel} className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cream/60">{proof.jumpLabel}</span>
              {proof.groups.map((g, i) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => jump(i)}
                  aria-pressed={active === i}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] transition-colors duration-300',
                    active === i ? 'border-orange bg-orange text-ink' : 'border-cream/20 text-cream/75 hover:border-cream/50 hover:text-cream',
                  )}
                >
                  {g.title}
                </button>
              ))}
            </nav>
            <p aria-hidden className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-cream/65 lg:motion-safe:hidden">{proof.hint} →</p>
            <span aria-hidden className="relative hidden h-px flex-1 bg-cream/15 lg:motion-safe:block">
              <span data-progress className="absolute inset-0 origin-left bg-orange" style={{ transform: 'scaleX(0)' }} />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
