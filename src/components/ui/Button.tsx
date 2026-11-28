'use client';

import type { ReactNode } from 'react';
import { useUIActions } from '@/components/providers/UIProvider';
import { TLink } from './TLink';
import { Magnetic } from './Magnetic';
import { Icon, type IconName } from './Icon';
import { cn } from '@/lib/cn';
import type { Cta } from '@/content/types';

type Variant = 'primary' | 'ink' | 'outline-dark' | 'outline-light' | 'link-dark' | 'link-light';

const base =
  'group relative inline-flex items-center gap-3 rounded-full font-mono text-[0.8rem] font-semibold uppercase tracking-[0.06em] transition-[transform,box-shadow,background-color,color] duration-[250ms] ease-[cubic-bezier(.16,1,.3,1)] select-none';

const variants: Record<Variant, string> = {
  primary:
    'border-2 border-black bg-orange py-2 pl-6 pr-2 text-black shadow-[4px_4px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none',
  ink: 'border-2 border-black bg-ink py-2 pl-6 pr-2 text-cream shadow-[4px_4px_0_0_var(--ccc-orange)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--ccc-orange)] active:translate-x-1 active:translate-y-1 active:shadow-none',
  'outline-dark': 'border-2 border-cream/25 py-2 pl-6 pr-2 bg-ink/30 text-cream hover:border-cream hover:bg-cream hover:text-ink',
  'outline-light': 'border-2 border-black py-2 pl-6 pr-2 text-black hover:bg-black hover:text-cream',
  'link-dark': 'py-2 text-cream',
  'link-light': 'py-2 text-black',
};

const iconWrap: Record<Variant, string> = {
  primary: 'bg-black text-orange',
  ink: 'bg-orange text-black',
  'outline-dark': 'bg-cream/10 text-cream group-hover:bg-ink group-hover:text-orange',
  'outline-light': 'bg-black text-cream group-hover:bg-orange group-hover:text-black',
  'link-dark': '',
  'link-light': '',
};

type Props = {
  cta: Cta;
  variant?: Variant;
  icon?: IconName;
  className?: string;
  magnetic?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  children?: ReactNode;
};

/** Brand button. Renders a route link, a modal trigger or a form button from a `Cta`. */
export function Button({ cta, variant = 'primary', icon = 'arrow', className, magnetic = true, onClick, type = 'button', disabled }: Props) {
  const { openModal } = useUIActions();
  const isLink = variant === 'link-dark' || variant === 'link-light';

  const inner = isLink ? (
    <>
      <span className="relative">
        {cta.label}
        {cta.context && <span className="sr-only">: {cta.context}</span>}
        <span className="absolute inset-x-0 -bottom-1 h-[2px] origin-right scale-x-100 bg-current transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:origin-left group-hover:animate-[underline_.7s_cubic-bezier(.16,1,.3,1)]" />
      </span>
      <Icon name={icon} size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </>
  ) : (
    <>
      <span className="whitespace-nowrap">{cta.label}</span>
      {cta.meta && <span className="border-l border-current/30 pl-3 font-normal normal-case tracking-normal opacity-70">{cta.meta}</span>}
      <span className={cn('relative grid size-9 place-items-center overflow-hidden rounded-full', iconWrap[variant])}>
        <Icon name={icon} size={17} className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-[150%]" />
        <Icon name={icon} size={17} className="absolute -translate-x-[150%] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0" />
      </span>
    </>
  );

  const cls = cn(base, variants[variant], disabled && 'pointer-events-none opacity-60', className);
  let el: ReactNode;
  if (cta.href && !cta.modal && type !== 'submit') {
    el = (
      <TLink href={cta.href} className={cls} data-cursor="hide" onClick={() => onClick?.()}>
        {inner}
      </TLink>
    );
  } else {
    el = (
      <button
        type={type}
        disabled={disabled}
        className={cls}
        data-cursor="hide"
        onClick={() => {
          onClick?.();
          if (cta.modal) openModal(cta.modal);
        }}
      >
        {inner}
      </button>
    );
  }
  return magnetic && !isLink ? <Magnetic>{el}</Magnetic> : el;
}
