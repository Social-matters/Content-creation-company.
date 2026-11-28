'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { uiEase, uiSpring } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { contact } from '@/content/pages';
import { useRevealChildren } from '@/components/ui/Reveal';
import { BrandForm, ContactForm, CreatorForm } from '@/components/forms/LeadForms';
import { brandNeeds, formCopyV2, serviceNeeds } from '@/content/v2/forms';
import { Eyebrow } from '@/components/ui/Badge';

/** Tab order matches `formCopyV2.contactTabs`. `?apply=` picks one. */
const TAB = { message: 0, brand: 1, creator: 2 } as const;
type Need = (typeof brandNeeds)[number]['value'];

/** Tells the tabs what the link asked for. Its own Suspense boundary keeps the page prerendered. */
function FromLink({ onLink }: { onLink: (apply: string | null, service: string | null) => void }) {
  const params = useSearchParams();
  const apply = params.get('apply');
  const service = params.get('service');
  useEffect(() => onLink(apply, service), [apply, service, onLink]);
  return null;
}

/** Tabbed forms: a message, a brand application and the network application (open by default). */
export function ContactTabs() {
  const tabs = formCopyV2.contactTabs;
  const [tab, setTab] = useState<number>(TAB.creator);
  const [need, setNeed] = useState<Need>();
  const onLink = useCallback((apply: string | null, service: string | null) => {
    const wanted = service ? serviceNeeds[service as keyof typeof serviceNeeds] : undefined;
    if (wanted) {
      setNeed(wanted);
      setTab(TAB.brand);
    } else setTab(apply && apply in TAB ? TAB[apply as keyof typeof TAB] : TAB.creator);
  }, []);
  const forms = [
    <ContactForm key="message" titleId="contact-message" />,
    <BrandForm key={`brand-${need ?? ''}`} titleId="contact-brand" need={need} />,
    <CreatorForm key="creator" titleId="contact-creator" />,
  ];
  const root = useRef<HTMLElement>(null);
  useRevealChildren(root);

  return (
    <section ref={root} className="bg-cream py-[var(--section-y)] text-ink">
      <Suspense fallback={null}>
        <FromLink onLink={onLink} />
      </Suspense>
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
