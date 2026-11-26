'use client';

import { useRef, type ElementType } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { dur, ease, mq, revealStart, stagger } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { AccentStyle, Headline as HeadlineContent, HeadlineLine } from '@/content/types';

const sizes = {
  mega: 'text-mega',
  d1: 'text-d1',
  d2: 'text-d2',
  d3: 'text-d3',
  d4: 'text-d4',
} as const;

type Tone = 'dark' | 'light';

type Props = {
  lines: HeadlineContent;
  as?: ElementType;
  size?: keyof typeof sizes;
  /** Background the headline sits on: 'dark' = ink, 'light' = cream. */
  tone?: Tone;
  className?: string;
  lineClassName?: (index: number) => string | undefined;
  /**
   * undefined: reveal when scrolled into view.
   * false: stay hidden. true: reveal now (used by orchestrated sections like the hero).
   */
  play?: boolean;
  delay?: number;
};

/** Display headline with SplitText line-mask reveal and an animated accent word. */
export function Headline({ lines, as: Tag = 'h2', size = 'd2', tone = 'light', className, lineClassName, play, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (play === false) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      const scrollTrigger = play === undefined ? { trigger: el, start: revealStart, once: true } : undefined;
      const mm = gsap.matchMedia();
      mm.add({ motion: mq.motionOK, reduced: mq.reduced }, (ctx) => {
        gsap.set(el, { autoAlpha: 1 });
        if (ctx.conditions?.reduced) {
          gsap.from(el, { autoAlpha: 0, duration: 0.6, delay, scrollTrigger });
          return;
        }
        const accents = el.querySelectorAll('[data-accent-bg]');
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'ccc-line',
          autoSplit: true,
          onSplit(self) {
            const tl = gsap.timeline({ delay, scrollTrigger });
            tl.from(self.lines, { yPercent: 118, duration: dur.reveal, stagger: stagger.base, ease: ease.reveal });
            if (accents.length) {
              tl.from(accents, { scaleX: 0, rotate: 0, duration: 0.9, ease: 'expo.inOut' }, '-=0.75');
            }
            return tl;
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [play], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={cn('font-display', sizes[size], className)}>
      {lines.map((line, i) => (
        <span key={i} className={cn('block', lineClassName?.(i))}>
          <Line line={line} tone={tone} />
        </span>
      ))}
    </Tag>
  );
}

function Line({ line, tone }: { line: HeadlineLine; tone: Tone }) {
  if (typeof line === 'string') return <>{line}</>;
  return (
    <>
      {line.before}
      <Accent text={line.accent} style={line.style ?? 'orange'} tone={tone} />
      {line.after}
    </>
  );
}

export function Accent({ text, style, tone }: { text: string; style: AccentStyle; tone: Tone }) {
  if (style === 'orange') return <span className="text-orange">{text}</span>;
  if (style === 'outline') {
    return (
      <span className="text-transparent" style={{ WebkitTextStroke: `0.035em ${tone === 'dark' ? 'var(--ccc-orange)' : 'var(--ccc-black)'}` }}>
        {text}
      </span>
    );
  }
  return <TiltedBlock tone={tone}>{text}</TiltedBlock>;
}

/**
 * Signature neo-brutalist highlight: a tilted block with a hard shadow behind a word.
 * On ink it's an orange block with ink text; on cream a black block with orange text.
 */
export function TiltedBlock({ children, tone = 'light' }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={cn('relative isolate inline-block px-[0.09em]', tone === 'dark' ? 'text-ink' : 'text-orange')}>
      <span
        data-accent-bg
        aria-hidden
        className={cn(
          'absolute inset-x-0 -top-[0.02em] -bottom-[0.06em] -z-10 origin-left -rotate-[2.2deg] border-[0.035em] border-black',
          tone === 'dark' ? 'bg-orange' : 'bg-black',
        )}
        style={{ boxShadow: `0.07em 0.07em 0 0 ${tone === 'dark' ? '#000' : 'var(--ccc-orange)'}` }}
      />
      {children}
    </span>
  );
}
