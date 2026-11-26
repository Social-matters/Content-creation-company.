'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { dur, ease, ENTRANCE_MIN_WIDTH, mq, stagger } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { Cta, Headline as HeadlineContent, MediaSlot } from '@/content/types';
import { useUI } from '@/components/providers/UIProvider';
import { Headline } from '@/components/ui/Headline';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Video } from '@/components/ui/Video';
import { NotificationCard, floatVars } from './NotificationCard';

type Props = {
  badge?: string;
  headline: HeadlineContent;
  lead?: string;
  ctas?: readonly Cta[];
  media?: MediaSlot;
  mobileMedia?: MediaSlot;
  notifications?: readonly { app: string; time: string; text: string; tone: 'ig' | 'ccc' | 'match' }[];
  size?: 'd1' | 'd2';
  children?: ReactNode;
};

/** Ink page hero used by every inner page. Waits for the entrance sequence, like the home hero. */
export function PageHero({ badge, headline, lead, ctas, media, mobileMedia, notifications, size = 'd1', children }: Props) {
  const root = useRef<HTMLElement>(null);
  const { entranceDone } = useUI();

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
        if (ctx.conditions?.reduced) return void gsap.to(items, { autoAlpha: 1, duration: 0.5 });
        gsap.fromTo(items, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: dur.reveal, stagger: stagger.base, ease: ease.reveal, delay: 0.5 });
        if (media) {
          if (window.innerWidth >= ENTRANCE_MIN_WIDTH) gsap.fromTo(q('[data-media]'), { clipPath: 'inset(10% 8% 10% 8% round 2rem)', scale: 1.15 }, { clipPath: 'inset(0% 0% 0% 0% round 0rem)', scale: 1, duration: 1.5, ease: 'expo.inOut' });
          gsap.to(q('[data-media-wrap]'), { yPercent: 16, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
        }
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [entranceDone], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={cn('relative isolate flex flex-col overflow-hidden bg-ink text-cream', media ? 'min-h-[max(92svh,40rem)]' : 'min-h-[34rem]')}>
      {media && (
        <div data-media-wrap className="absolute inset-0 -z-10">
          <div data-media className="absolute inset-0">
            <Video media={media} mobile={mobileMedia} eager sizes="100vw" className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
          </div>
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/4 -z-10 size-[38rem] bg-[radial-gradient(closest-side,rgb(255_129_42/0.55),transparent)]" />
      <div className="grain pointer-events-none absolute inset-0 -z-10" />

      {notifications && (
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          {notifications.map((n, i) => (
            <div key={n.text} data-in className={cn('absolute', i === 0 ? 'right-[6%] top-[22%]' : 'right-[16%] top-[44%]')}>
              <div className="float-loop" style={floatVars(i)}>
                <NotificationCard {...n} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="container-x mt-auto flex flex-col gap-7 pb-14 pt-[calc(var(--nav-h)+4rem)] sm:pb-20">
        {badge && (
          <div data-in>
            <Badge tone="glass">{badge}</Badge>
          </div>
        )}
        <Headline as="h1" lines={headline} size={size} tone="dark" play={entranceDone} delay={0.3} />
        {(lead || ctas) && (
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            {lead && (
              <p data-in className="text-lead max-w-xl text-cream/80">
                {lead}
              </p>
            )}
            {ctas && (
              <div data-in className="flex flex-wrap gap-3">
                {ctas.map((c, i) => (
                  <Button key={c.label} cta={c} variant={i === 0 ? 'primary' : 'outline-dark'} />
                ))}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
