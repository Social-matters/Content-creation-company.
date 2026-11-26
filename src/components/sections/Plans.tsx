'use client';

import { motion } from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Flip } from '@/lib/gsap';
import { mq, uiSpring } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { plans } from '@/content/home';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionIntro } from './SectionIntro';

type PlanKey = (typeof plans.toggle)[number];

/**
 * Self-serve / Managed. Choosing a plan promotes its card (wider, orange, first);
 * GSAP Flip animates the cards and their contents between layouts.
 */
export function Plans({ withIntro = true }: { withIntro?: boolean }) {
  const [active, setActive] = useState<PlanKey>(plans.toggle[0]);
  const grid = useRef<HTMLDivElement>(null);
  const state = useRef<Flip.FlipState | null>(null);

  const choose = (k: PlanKey) => {
    if (k === active || !grid.current) return;
    if (!window.matchMedia(mq.reduced).matches) state.current = Flip.getState(grid.current.querySelectorAll('[data-plan], [data-flip]'));
    setActive(k);
  };

  useLayoutEffect(() => {
    if (!state.current) return;
    Flip.from(state.current, { duration: 0.9, ease: 'power3.inOut', nested: true, stagger: 0.02 });
    state.current = null;
  }, [active]);

  const order = [active, ...plans.toggle.filter((k) => k !== active)];

  return (
    <section id={plans.id} className="relative overflow-hidden bg-cream py-[var(--section-y)] text-ink">
      <div className="container-x">
        {withIntro ? <SectionIntro label={plans.label} headline={plans.headline} /> : <h2 className="sr-only">{plans.srTitle}</h2>}
        <div role="radiogroup" aria-label={plans.label.replace('// ', '')} className="mt-10 inline-flex rounded-full border-2 border-black bg-white p-1 shadow-[4px_4px_0_0_#000]">
          {plans.toggle.map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={active === k}
              onClick={() => choose(k)}
              className="relative rounded-full px-5 py-2.5 font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em] sm:px-7"
            >
              {active === k && <motion.span layoutId="plan-pill" className="absolute inset-0 rounded-full bg-ink" transition={uiSpring} />}
              <span className={cn('relative transition-colors duration-300', active === k ? 'text-orange' : 'text-ink/70')}>{k}</span>
            </button>
          ))}
        </div>

        <div ref={grid} className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          {order.map((k) => {
            const p = plans.items[k];
            const on = k === active;
            return (
              <div key={k} data-plan data-flip-id={`plan-${k}`} className="group">
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-[2rem] border-2 border-black p-7 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 sm:p-10',
                    on ? 'bg-orange shadow-[8px_8px_0_0_#000] hover:shadow-[10px_14px_0_0_#000]' : 'bg-white shadow-[6px_6px_0_0_#000] hover:shadow-[8px_12px_0_0_#000]',
                  )}
                >
                  <div data-flip data-flip-id={`head-${k}`} className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-d4">{p.name}</h3>
                      <p className="mt-2 text-ink/85">{p.tagline}</p>
                    </div>
                    {p.popular && <span className="shrink-0 rounded-full bg-ink px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-orange">{plans.popularLabel}</span>}
                  </div>
                  <p data-flip data-flip-id={`price-${k}`} className="mt-8">
                    <span className="block font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">{p.price}</span>
                    <span className="mt-2 block text-sm text-ink/80">{p.priceNote}</span>
                  </p>
                  <ul data-flip data-flip-id={`list-${k}`} className={cn('mt-8 grid gap-3', on && 'sm:grid-cols-2')}>
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border-2 border-black', on ? 'bg-black text-orange' : 'bg-orange')}>
                          <Icon name="check" size={12} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div data-flip data-flip-id={`cta-${k}`} className="mt-auto pt-10">
                    <Button cta={p.cta} variant={on ? 'ink' : 'primary'} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
