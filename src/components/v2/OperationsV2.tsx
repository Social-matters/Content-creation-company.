'use client';

import { Fragment, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { flow, mq } from '@/lib/motion';
import { operations } from '@/content/home';
import { Eyebrow } from '@/components/ui/Badge';
import { RevealText } from '@/components/ui/Reveal';
import { TiltedBlock } from '@/components/ui/Headline';
import { Sheet, useNearGSAP } from './flow';

/** Statement lines (as words) from the content headline; the accent phrase gets the tilted block. */
function statement() {
  const lines: string[][] = [];
  let accent = '';
  for (const line of operations.headline) {
    if (typeof line === 'string') lines.push(line.split(' '));
    else {
      lines.push(line.before ? line.before.trim().split(' ') : []);
      accent = line.accent;
    }
  }
  return { lines, accent };
}

/**
 * "You brief. We run the rest." builds word by word with the scroll; the eight jobs follow as
 * an editorial list whose hairlines draw in. Rows lift a little on hover.
 */
export function OperationsV2() {
  const root = useRef<HTMLElement>(null);
  const { lines, accent } = statement();

  useNearGSAP(root, (el) => {
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add(mq.motionOK, () => {
      const st = { trigger: q('[data-statement]')[0], start: 'top 85%', end: 'top 30%', scrub: flow.scrub };
      gsap.fromTo(q('[data-w]'), { yPercent: 70, rotate: 4, autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, stagger: 0.12, ease: 'power2.out', scrollTrigger: st });
      gsap.fromTo(q('[data-accent-bg]'), { scaleX: 0 }, { scaleX: 1, ease: 'power2.inOut', scrollTrigger: { ...st, start: 'top 60%', end: 'top 25%' } });
      q('[data-row]').forEach((row) => {
        gsap.fromTo(row.querySelector('[data-hair]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 95%', end: 'top 65%', scrub: flow.scrub } });
        gsap.fromTo(row.querySelectorAll('[data-row-in]'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: flow.dur, ease: flow.ease, scrollTrigger: { trigger: row, start: 'top 88%', ...flow.toggle } });
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} className="relative isolate bg-ink py-[var(--section-y)] text-ink">
      <Sheet tone="cream" />
      <div className="container-x">
        <Eyebrow tone="light">{operations.label}</Eyebrow>
        <h2 data-statement className="mt-8 font-display text-d1">
          {lines.map((words, l) => (
            <span key={l} className="block">
              {words.map((w, i) => (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <span data-w className="inline-block origin-bottom-left">
                      {w}
                    </span>
                  </span>{' '}
                </Fragment>
              ))}
              {l === lines.length - 1 && (
                <span className="inline-block pt-[0.1em]">
                  <span data-w className="inline-block">
                    <TiltedBlock tone="light">{accent}</TiltedBlock>
                  </span>
                </span>
              )}
            </span>
          ))}
        </h2>
        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
          <RevealText className="text-lead max-w-sm text-ink/75">{operations.body}</RevealText>
          <ol className="grid gap-x-12 sm:grid-cols-2">
            {operations.items.map((it) => (
              <li key={it.n} data-row className="group relative py-7">
                <span data-hair aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-black/20" />
                <div className="flex items-start gap-5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1">
                  <span data-row-in className="mt-1 font-mono text-sm text-orange-text">
                    {it.n}
                  </span>
                  <div className="flex-1">
                    <div data-row-in className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-[clamp(1.15rem,1.6vw,1.45rem)] leading-none">{it.title}</h3>
                      <span className="rounded-full border border-black/20 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink/70 transition-colors duration-300 group-hover:border-black group-hover:bg-black group-hover:text-orange">
                        {it.tag}
                      </span>
                    </div>
                    <p data-row-in className="mt-3 text-ink/70">
                      {it.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
