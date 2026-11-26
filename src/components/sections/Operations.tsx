'use client';

import { useRef, type PointerEvent } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq, playOnce } from '@/lib/motion';
import { marquees, operations } from '@/content/home';
import { Marquee, Star } from '@/components/ui/Marquee';
import { SectionIntro } from './SectionIntro';

/** 3D tilt + cursor-following highlight. Pointer only; GSAP drives the tilt layer. */
function TiltCard({ item }: { item: (typeof operations.items)[number] }) {
  const tilt = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = tilt.current;
    if (!el || e.pointerType !== 'mouse' || window.matchMedia(mq.reduced).matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    gsap.to(el, { rotateY: (px - 0.5) * 14, rotateX: (0.5 - py) * 12, duration: 0.6, ease: 'power3.out', transformPerspective: 900 });
  };
  const leave = () => gsap.to(tilt.current, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });

  return (
    <div data-op className="[perspective:900px]">
      <div
        ref={tilt}
        onPointerMove={move}
        onPointerLeave={leave}
        data-cursor="hide"
        className="group relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-[1.6rem] border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] [transform-style:preserve-3d]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(22rem circle at var(--mx,50%) var(--my,50%), rgb(255 129 42 / 0.28), transparent 60%)' }}
        />
        <div className="relative flex items-start justify-between [transform:translateZ(30px)]">
          <span className="font-display text-[3.4rem] leading-none text-orange-display">{item.n}</span>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-cream">{item.tag}</span>
        </div>
        <div className="relative mt-auto pt-10 [transform:translateZ(20px)]">
          <h3 className="font-display text-[1.6rem] leading-none">{item.title}</h3>
          <p className="mt-3 text-[0.98rem] text-ink/70">{item.body}</p>
        </div>
      </div>
    </div>
  );
}

export function Operations() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-op]', root.current);
        gsap.from(cards, {
          autoAlpha: 0,
          y: ctx.conditions?.reduced ? 0 : 80,
          rotate: ctx.conditions?.reduced ? 0 : (i) => (i % 2 ? 3 : -3),
          duration: 1.1,
          ease: 'expo.out',
          stagger: { each: 0.08, grid: 'auto', from: 'start' },
          scrollTrigger: { trigger: '[data-op-grid]', start: 'top 80%', ...playOnce },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-cream text-ink">
      <div className="pt-16">
        <Marquee items={marquees.formats} speed={80} className="-mx-[4vw] w-[108vw] -rotate-[2.2deg] border-y-2 border-black bg-orange py-3 sm:py-4" itemClassName="font-display text-d3 text-black" />
      </div>
      <div className="container-x py-[var(--section-y)]">
        <SectionIntro label={operations.label} headline={operations.headline} body={operations.body} layout="split" />
        <div data-op-grid className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {operations.items.map((item) => (
            <TiltCard key={item.n} item={item} />
          ))}
        </div>
      </div>
      <div className="pb-20">
        <Marquee
          items={marquees.cities}
          direction={-1}
          speed={60}
          className="-mx-[4vw] w-[108vw] rotate-[1.6deg] border-y-2 border-black bg-ink py-3 sm:py-4"
          itemClassName="font-display text-d3 text-cream"
          separator={<Star className="text-orange" />}
        />
      </div>
    </section>
  );
}
