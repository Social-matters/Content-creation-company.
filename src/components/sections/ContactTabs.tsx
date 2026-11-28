'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { uiEase, uiSpring } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { contact } from '@/content/pages';
import { useRevealChildren } from '@/components/ui/Reveal';
import { BrandForm, ContactForm, CreatorForm } from '@/components/forms/LeadForms';
import { formCopyV2 } from '@/content/v2/forms';
import { Eyebrow } from '@/components/ui/Badge';

/** Tabbed application forms. `withMessage` (v2) adds a plain contact message as the first tab. */
export function ContactTabs({ withMessage = false }: { withMessage?: boolean }) {
  const tabs: readonly string[] = withMessage ? formCopyV2.contactTabs : contact.tabs;
  const forms = [
    ...(withMessage ? [<ContactForm key="message" titleId="contact-message" />] : []),
    <BrandForm key="brand" titleId="contact-brand" />,
    <CreatorForm key="creator" titleId="contact-creator" />,
  ];
  const [tab, setTab] = useState(0);
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} className="bg-cream py-[var(--section-y)] text-ink">
      <div className="container-x">
        <div data-reveal className="mx-auto max-w-[54rem]">
          <Eyebrow tone="light">{`// ${contact.tabsLabel}`}</Eyebrow>
          <div role="tablist" aria-label={contact.tabsLabel} className="mt-4 inline-flex flex-wrap rounded-[1.6rem] border-2 border-black bg-white p-1 shadow-[4px_4px_0_0_#000]">
            {tabs.map((t, i) => (
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
                {forms[tab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
