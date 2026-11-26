'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useId, useRef, useState } from 'react';
import { uiEase } from '@/lib/motion';
import { cn } from '@/lib/cn';
import type { Headline } from '@/content/types';
import { useRevealChildren } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import { SectionIntro } from './SectionIntro';

type Props = { id?: string; label: string; headline: Headline; items: readonly { q: string; a: string }[] };

/** Accessible accordion (button + region), one open at a time. */
export function Faq({ id, label, headline, items }: Props) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  useRevealChildren(root);

  return (
    <section ref={root} id={id} className="bg-cream py-[var(--section-y)] text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionIntro label={label} headline={headline} size="d3" />
        <ul className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal className={cn('rounded-[1.4rem] border-2 border-black bg-white transition-shadow duration-300', isOpen ? 'shadow-[6px_6px_0_0_var(--ccc-orange)]' : 'shadow-[4px_4px_0_0_#000]')}>
                <h3>
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[1.1rem] font-semibold"
                  >
                    {item.q}
                    <span className={cn('grid size-9 shrink-0 place-items-center rounded-full border-2 border-black transition-[transform,background-color] duration-300', isOpen ? 'rotate-45 bg-orange' : 'bg-cream')}>
                      <Icon name="plus" size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${base}-a${i}`}
                      role="region"
                      aria-labelledby={`${base}-q${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: uiEase }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-ink/75">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
