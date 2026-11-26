import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'cream' | 'ink' | 'orange' | 'white';

const tones: Record<Tone, string> = {
  cream: 'bg-cream text-ink border-black shadow-[6px_6px_0_0_#000] [--card-shadow:#000]',
  white: 'bg-white text-ink border-black shadow-[6px_6px_0_0_#000] [--card-shadow:#000]',
  orange: 'bg-orange text-black border-black shadow-[6px_6px_0_0_#000] [--card-shadow:#000]',
  ink: 'bg-ink-2 text-cream border-cream/15 shadow-[6px_6px_0_0_var(--ccc-orange)] [--card-shadow:var(--ccc-orange)]',
};

/** Neo-brutalist card: 2px border, hard offset shadow, lifts on hover when `interactive`. */
export function Card({ tone = 'cream', interactive, className, ...props }: { tone?: Tone; interactive?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative rounded-[1.75rem] border-2',
        tones[tone],
        interactive &&
          'transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-x-1 hover:-translate-y-1.5 hover:shadow-[10px_12px_0_0_var(--card-shadow)]',
        className,
      )}
      {...props}
    />
  );
}
