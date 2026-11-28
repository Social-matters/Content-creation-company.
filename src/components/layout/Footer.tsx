'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { mq } from '@/lib/motion';
import { footer, site, socials } from '@/content/site';
import { useUIActions } from '@/components/providers/UIProvider';
import { Logo } from '@/components/brand/Logo';
import { TLink } from '@/components/ui/TLink';
import { Icon } from '@/components/ui/Icon';
import { useRevealChildren } from '@/components/ui/Reveal';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { openModal } = useUIActions();
  useRevealChildren(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motionOK, () => {
        gsap.fromTo(
          '[data-wordmark-char]',
          { yPercent: 105, rotate: 6 },
          {
            yPercent: 0,
            rotate: 0,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: { trigger: '[data-wordmark]', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
          },
        );
        gsap.fromTo('[data-footer-inner]', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink text-cream">
      <div className="grain pointer-events-none absolute inset-0" />
      <div data-footer-inner className="container-x relative z-[2] pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div data-reveal className="flex flex-col gap-6">
            <TLink href="/" aria-label="Content Creation Company, home" className="w-fit">
              <Logo className="h-14 w-auto" />
            </TLink>
            <p className="max-w-sm text-lg text-cream/70">{footer.tagline}</p>
            {/* Quiet second path for influencers, creators and models. */}
            <button type="button" onClick={() => openModal(footer.join.modal)} className="group inline-flex w-fit items-center gap-2 text-[0.95rem] font-semibold text-cream/80 underline decoration-orange decoration-2 underline-offset-4 transition-colors hover:text-orange">
              {footer.join.label}
              <Icon name="arrow" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <div>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-cream/50">{footer.contactTitle}</p>
              <a href={`mailto:${site.email}`} className="group mt-2 inline-flex items-center gap-2 text-xl font-semibold text-cream transition-colors hover:text-orange sm:text-2xl">
                {site.email}
                <Icon name="arrowUpRight" size={22} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
              <p className="mt-1 text-sm text-cream/50">{site.replyNote}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} data-reveal>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-orange">{col.title}</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <TLink href={l.href} className="text-cream/75 transition-colors hover:text-cream">
                        {l.label}
                      </TLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div data-reveal>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-orange">{footer.socialTitle}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-cream/75 transition-colors hover:text-cream">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-cream/10 pt-6 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {footer.copyright} <span className="text-orange">{site.credit}</span>
          </p>
          <div className="flex items-center gap-6">
            {footer.legal.map((l) => (
              <TLink key={l.href} href={l.href} className="hover:text-cream">
                {l.label}
              </TLink>
            ))}
            <SocialLinks items={socials} className="hidden md:flex" />
          </div>
        </div>
      </div>

      <div data-wordmark aria-hidden className="relative z-[1] mt-6 select-none overflow-hidden px-[var(--gutter)] leading-[0.78]">
        <p className="flex justify-between font-display text-[clamp(7rem,33vw,34rem)] text-orange">
          {[...footer.wordmark].map((c, i) => (
            <span key={i} data-wordmark-char className="inline-block will-change-transform">
              {c}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
