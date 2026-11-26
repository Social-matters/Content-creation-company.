import type { SVGProps } from 'react';

/**
 * Geometric CCC mark: three concentric "C" arcs + superscript 3 (C³),
 * a simplified echo of the favicon. Stroke-based so it can be drawn in.
 */
export const MARK_ARCS = [
  'M82.2 23 A42 42 0 1 0 82.2 77',
  'M72.2 31.4 A29 29 0 1 0 72.2 68.6',
  'M62.3 39.7 A16 16 0 1 0 62.3 60.3',
] as const;

export function LogoMark({ strokeWidth = 8, ...props }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden {...props}>
      {MARK_ARCS.map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="butt" data-arc />
      ))}
      <text x="85" y="17" fill="currentColor" fontSize="18" fontFamily="var(--font-display)" data-sup>
        3
      </text>
    </svg>
  );
}
