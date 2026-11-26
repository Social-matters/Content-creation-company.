import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = { children: ReactNode; tone?: 'black' | 'cream' | 'orange' | 'glass'; dot?: boolean; pulse?: boolean; className?: string };

const tones = {
  black: 'bg-black text-cream',
  cream: 'bg-cream text-ink border-2 border-black',
  orange: 'bg-orange text-black border-2 border-black',
  glass: 'bg-cream/10 text-cream border border-cream/15 backdrop-blur-md',
} as const;

/** Pill badge with the brand's orange status dot ("COMING SOON" style). */
export function Badge({ children, tone = 'black', dot = true, pulse = true, className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.08em]', tones[tone], className)}>
      {dot && (
        <span className="relative flex size-2.5">
          {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-orange opacity-60 motion-reduce:hidden" />}
          <span className={cn('relative size-2.5 rounded-full', tone === 'orange' ? 'bg-black' : 'bg-orange')} />
        </span>
      )}
      {children}
    </span>
  );
}

/** Small mono section label, e.g. "// How it works". */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('font-mono text-[0.78rem] uppercase tracking-[0.1em] text-orange', className)}>{children}</p>;
}
