'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { uiEase, uiSpring } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { contact } from '@/content/pages';
import { site } from '@/content/site';
import { useRevealChildren } from '@/components/ui/Reveal';
import { BrandForm, CreatorForm } from '@/components/forms/LeadForms';
import { Eyebrow } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';

/** Contact cards + tabbed brand/creator application forms. */
export function ContactTabs() {
  const [tab, setTab] = useState(0);
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} className="bg-cream py-[var(--section-y)] text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="flex flex-col gap-4">
          {contact.cards.map((c) => (
            <a
              key={c.title}
              data-reveal
              href={`mailto:${site.email}?subject=${encodeURIComponent(c.title)}`}
              className="group flex items-center justify-between gap-4 rounded-[1.4rem] border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#000] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[6px_8px_0_0_var(--ccc-orange)]"
            >
              <span>
                <span className="block font-display text-[1.4rem] leading-none">{c.title}</span>
                <span className="mt-2 block text-ink/70">{c.body}</span>
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-black bg-orange transition-transform duration-300 group-hover:rotate-45">
                <Icon name="arrowUpRight" size={18} />
              </span>
            </a>
          ))}
        </div>

        <div data-reveal>
          <Eyebrow>{`// ${contact.tabsLabel}`}</Eyebrow>
          <div role="tablist" aria-label={contact.tabsLabel} className="mt-4 inline-flex rounded-full border-2 border-black bg-white p-1 shadow-[4px_4px_0_0_#000]">
            {contact.tabs.map((t, i) => (
              <button
                key={t}
                role="tab"
                type="button"
                id={`contact-tab-${i}`}
                aria-selected={tab === i}
                aria-controls={`contact-panel-${i}`}
                onClick={() => setTab(i)}
                className="relative rounded-full px-5 py-2.5 font-mono text-[0.75rem] font-bold uppercase tracking-[0.08em]"
              >
                {tab === i && <motion.span layoutId="contact-pill" className="absolute inset-0 rounded-full bg-ink" transition={uiSpring} />}
                <span className={cn('relative', tab === i ? 'text-orange' : 'text-ink/70')}>{t}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-[2rem] border-2 border-black bg-white shadow-[10px_10px_0_0_var(--ccc-orange)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                role="tabpanel"
                id={`contact-panel-${tab}`}
                aria-labelledby={`contact-tab-${tab}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: uiEase }}
              >
                {tab === 0 ? <BrandForm titleId="contact-brand" /> : <CreatorForm titleId="contact-creator" />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
