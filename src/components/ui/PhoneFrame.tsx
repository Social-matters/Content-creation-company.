import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Neo-brutalist phone shell for mock UIs. The screen is a 9:19.5 rounded viewport. */
export function PhoneFrame({ children, className, screenClassName }: { children: ReactNode; className?: string; screenClassName?: string }) {
  return (
    <div className={cn('relative rounded-[2.7rem] border-2 border-black bg-black p-[0.6rem] shadow-[10px_10px_0_0_var(--ccc-orange)]', className)}>
      <div className={cn('relative aspect-[9/19] overflow-hidden rounded-[2.15rem] bg-cream', screenClassName)}>
        <div aria-hidden className="absolute left-1/2 top-2.5 z-30 h-[1.4rem] w-[32%] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

/** Abstract avatar for mock UI (no real faces). */
export function AbstractAvatar({ seed, className }: { seed: number; className?: string }) {
  const palettes = [
    ['#FF812A', '#141210'],
    ['#141210', '#FF812A'],
    ['#C4BFB8', '#141210'],
    ['#FFB37A', '#2A2623'],
    ['#2A2623', '#F1EDE4'],
  ];
  const [bg, fg] = palettes[seed % palettes.length];
  const shape = seed % 3;
  return (
    <svg viewBox="0 0 40 40" className={cn('size-10 shrink-0 rounded-full border-2 border-black', className)} aria-hidden>
      <rect width="40" height="40" fill={bg} />
      {shape === 0 && <circle cx="20" cy="26" r="13" fill={fg} />}
      {shape === 1 && <path d="M0 40 20 14l20 26Z" fill={fg} />}
      {shape === 2 && <rect x="9" y="17" width="22" height="22" rx="6" fill={fg} />}
      <circle cx="20" cy="14" r="6" fill={fg} opacity={shape === 0 ? 1 : 0.85} />
    </svg>
  );
}
