'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { dur, ease, ENTRANCE_MIN_WIDTH, mq, stagger } from '@/lib/motion';
import { hero } from '@/content/home';
import { assets } from '@/content/assets';
import { useUI } from '@/components/providers/UIProvider';
import { Headline } from '@/components/ui/Headline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Counter } from '@/components/ui/Counter';
import { Video } from '@/components/ui/Video';
import { TLink } from '@/components/ui/TLink';
import { NotificationCard, floatVars } from './NotificationCard';

/** Card positions (desktop). Mobile shows the first card only. */
const CARD_POS = ['left-[42%] top-[21%]', 'right-[4%] top-[13%]', 'left-[var(--gutter)] top-[36%]'];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { entranceDone } = useUI();

  // Entrance choreography, gated on the preloader.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const items = q('[data-hero-in]');
      const cards = q('[data-card]');
      const avatars = q('[data-avatar]');
      if (!entranceDone) {
        gsap.set([...items, ...cards, ...avatars], { autoAlpha: 0 });
        return;
      }
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        if (ctx.conditions?.reduced) {
          gsap.to([...items, ...cards, ...avatars], { autoAlpha: 1, duration: 0.6 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: ease.reveal } });
        // The media intro only runs behind the entrance (desktop); on phones the poster shows full-size at once (it's the LCP).
        if (window.innerWidth >= ENTRANCE_MIN_WIDTH) {
          tl.fromTo(q('[data-hero-media]'), { clipPath: 'inset(14% 10% 14% 10% round 2.5rem)', scale: 1.18 }, { clipPath: 'inset(0% 0% 0% 0% round 0rem)', scale: 1, duration: 1.6, ease: 'expo.inOut' }, 0);
        }
        tl.fromTo(items, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: dur.reveal, stagger: stagger.base }, 0.7)
          .fromTo(avatars, { autoAlpha: 0, scale: 0.3, x: -14 }, { autoAlpha: 1, scale: 1, x: 0, duration: 0.7, stagger: 0.07, ease: 'back.out(2.2)' }, 0.95)
          .fromTo(cards, { autoAlpha: 0, y: 60, scale: 0.86, rotate: (i) => (i % 2 ? 6 : -6) }, { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 1.2, stagger: 0.18 }, 1.05);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [entranceDone], revertOnUpdate: true },
  );

  // Scroll: media parallax + scale, content drifts up and fades.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-parallax]', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: st });
        gsap.to('[data-hero-content]', { yPercent: -12, autoAlpha: 0.15, ease: 'none', scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate flex min-h-[max(100svh,44rem)] flex-col overflow-hidden bg-ink text-cream">
      {/* Media */}
      <div data-parallax className="absolute inset-0 -z-10">
        <div data-hero-media className="absolute inset-0 will-change-transform">
          <Video media={assets.hero} mobile={assets.heroMobile} eager sizes="100vw" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute -bottom-40 right-[-10%] -z-10 size-[42rem] bg-[radial-gradient(closest-side,rgb(255_129_42/0.60),transparent)]" />
      <div className="grain pointer-events-none absolute inset-0 -z-10" />

      {/* Floating notifications */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {hero.notifications.map((n, i) => (
          <div key={n.text} data-card className={`absolute ${CARD_POS[i]} ${i === 0 ? 'max-md:left-auto max-md:right-[var(--gutter)] max-md:top-[6.5rem]' : 'hidden lg:block'}`}>
            <div className="float-loop" style={floatVars(i)}>
              <NotificationCard {...n} className={i === 0 ? 'max-md:w-[16.5rem]' : undefined} />
            </div>
          </div>
        ))}
      </div>

      <div data-hero-content className="container-x relative flex flex-1 flex-col pb-10 pt-[calc(var(--nav-h)+1.5rem)] sm:pb-14">
        {/* Top row: stat + creator link */}
        <div className="flex items-start justify-between gap-8 max-md:mt-24">
          <div data-hero-in className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <Counter value={hero.stat.value} suffix={hero.stat.suffix} play={entranceDone} delay={0.9} className="font-display text-[clamp(2.4rem,4.4vw,4rem)] leading-none" />
              <span className="max-w-[7rem] text-sm leading-tight text-cream/70">{hero.stat.label}</span>
            </div>
            <div className="flex -space-x-3">
              {assets.avatars.map((a, i) => (
                <span key={a.poster} data-avatar className="relative size-11 overflow-hidden rounded-full border-2 border-ink ring-2 ring-orange/0" style={{ zIndex: 10 - i }}>
                  <Image src={a.poster} alt="" width={44} height={44} className="size-full object-cover" />
                </span>
              ))}
            </div>
          </div>
          <div data-hero-in className="absolute right-[var(--gutter)] top-[38%] hidden max-w-[21rem] flex-col gap-4 lg:flex">
            <p className="text-lead text-cream/90">{hero.lead}</p>
            <p className="text-[0.95rem] text-cream/60">
              {hero.creatorLink.prefix}{' '}
              <TLink href={hero.creatorLink.href} className="font-semibold text-cream underline decoration-orange decoration-2 underline-offset-4 hover:text-orange">
                {hero.creatorLink.label}
              </TLink>
            </p>
          </div>
        </div>

        {/* Bottom: headline + CTAs */}
        <div className="mt-auto flex flex-col gap-8 pt-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <div data-hero-in>
              <Badge tone="glass">{hero.badge}</Badge>
            </div>
            <Headline as="h1" lines={hero.headline} size="d1" tone="dark" play={entranceDone} delay={0.45} className="lg:text-[min(10.2vw,14.5vh)]" />
          </div>
          <div className="flex flex-col gap-5 lg:items-end lg:pb-3">
            <p data-hero-in className="font-display text-d4 text-orange">
              {hero.sub}
            </p>
            <p data-hero-in className="max-w-md text-cream/80 lg:hidden">
              {hero.lead}
            </p>
            <div data-hero-in className="flex flex-wrap gap-3">
              <Button cta={hero.ctas[0]} />
              <Button cta={hero.ctas[1]} variant="outline-dark" icon="calendar" />
            </div>
            <p data-hero-in className="text-[0.95rem] text-cream/60 lg:hidden">
              {hero.creatorLink.prefix}{' '}
              <TLink href={hero.creatorLink.href} className="font-semibold text-cream underline decoration-orange decoration-2 underline-offset-4">
                {hero.creatorLink.label}
              </TLink>
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
