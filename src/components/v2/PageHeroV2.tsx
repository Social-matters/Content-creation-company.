'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { focusSectionHeading } from '@/lib/focus-section';
import type { Cta, Headline as HeadlineContent, MediaSlot } from '@/content/types';
import { useUI } from '@/components/providers/UIProvider';
import { Headline } from '@/components/ui/Headline';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Video } from '@/components/ui/Video';
import { useShownOnView, useStackedReveal } from './flow';

type Props = {
  badge?: string;
  headline: HeadlineContent;
  lead?: string;
  ctas?: readonly Cta[];
  media?: MediaSlot;
  mobileMedia?: MediaSlot;
  size?: 'd1' | 'd2';
  /** Makes this hero a link target; its heading takes focus when someone lands on it. */
  id?: string;
  children?: ReactNode;
};

/**
 * v2 inner-page hero: content with room around it, media in a frame beside it (if any).
 * Curtain + zoom entrance; on scroll the content drifts up and the film drifts slower.
 */
export function PageHeroV2({ badge, headline, lead, ctas, media, mobileMedia, size = 'd1', id, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const { entranceDone } = useUI();
  /** Stacked layouts: the film paints once 60% of the frame is in view (desktop: at once). */
  const filmShown = useShownOnView(frame);
  useStackedReveal(root, filmShown, '[data-zoom]');

  // A direct visit to the anchor (redirect, shared link). The heading is hidden until the entrance ends.
  useEffect(() => {
    if (!id || !entranceDone || window.location.hash !== `#${id}`) return;
    const frame = requestAnimationFrame(() => focusSectionHeading(id));
    return () => cancelAnimationFrame(frame);
  }, [id, entranceDone]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q('[data-in]');
      if (!entranceDone) {
        gsap.set(items, { autoAlpha: 0 });
        return;
      }
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        const framed = q('[data-curtain]').length > 0;
        if (ctx.conditions?.reduced) {
          if (framed) gsap.set(q('[data-curtain]'), { autoAlpha: 0 });
          gsap.to(items, { autoAlpha: 1, duration: 0.5 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: flow.ease } });
        if (framed && window.matchMedia(mq.desktop).matches) {
          tl.fromTo(q('[data-curtain]'), { scaleY: 1 }, { scaleY: 0, duration: 1.6, ease: 'expo.inOut' }, 0.05).fromTo(q('[data-zoom]'), { scale: 1.25 }, { scale: 1, duration: 2.4 }, 0.15);
        }
        tl.fromTo(items, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: flow.dur, stagger: 0.1 }, framed ? 0.55 : 0.4);
        const leave = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('[data-copy]'), { y: -70, autoAlpha: 0.2, ease: 'none', scrollTrigger: leave });
        if (framed) gsap.fromTo(q('[data-par]'), { yPercent: 0 }, { yPercent: 10, ease: 'none', scrollTrigger: leave });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [entranceDone], revertOnUpdate: true },
  );

  return (
    <section ref={root} id={id} className="relative isolate overflow-hidden bg-ink text-cream">
      <div aria-hidden className="pointer-events-none absolute -left-[15%] top-[10%] -z-10 size-[42rem] bg-[radial-gradient(closest-side,rgb(255_129_42/0.26),transparent)]" />
      <div
        className={cn(
          'container-x grid gap-16 pb-[clamp(5rem,9vw,8rem)] pt-[calc(var(--nav-h)+clamp(4.5rem,9vw,8.5rem))]',
          media && 'lg:min-h-[max(92svh,44rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-[clamp(4rem,7vw,8rem)]',
        )}
      >
        <div data-copy className={cn('flex flex-col gap-8', media ? 'max-w-[46rem]' : 'max-w-[72rem]')}>
          {badge && (
            <div data-in>
              <Badge tone="glass">{badge}</Badge>
            </div>
          )}
          <Headline as="h1" lines={headline} size={size} tone="dark" play={entranceDone} delay={0.3} className={media ? 'lg:text-[min(5.4vw,10.5vh)]' : undefined} focusTarget={Boolean(id)} />
          {lead && (
            <p data-in className="text-lead max-w-xl text-cream/75">
              {lead}
            </p>
          )}
          {ctas && (
            <div data-in className="mt-2 flex flex-wrap gap-3">
              {ctas.map((c, i) => (
                <Button key={c.label} cta={c} variant={i === 0 ? 'primary' : 'outline-dark'} />
              ))}
            </div>
          )}
          {children}
        </div>

        {media && (
          <div className="relative mx-auto w-full max-w-[34rem]">
            <div ref={frame} className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-ink-2 ring-1 ring-cream/10">
              <div data-par className="absolute -inset-y-[6%] inset-x-0">
                <div data-zoom className={cn('absolute inset-0', !filmShown && 'max-lg:invisible')}>
                  <Video media={mobileMedia ?? media} eager sizes="(min-width: 1024px) 34rem, 92vw" className="absolute inset-0" />
                </div>
              </div>
              <div data-curtain className="absolute inset-0 origin-top bg-ink" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
