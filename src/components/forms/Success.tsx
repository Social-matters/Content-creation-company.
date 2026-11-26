'use client';

import { motion } from 'motion/react';
import { uiEase } from '@/lib/motion';
import { Button } from '@/components/ui/Button';

const BITS = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * Math.PI * 2,
  dist: 90 + (i % 3) * 34,
  size: 8 + (i % 4) * 4,
  orange: i % 2 === 0,
}));

/** Animated success state: stamped tick, a burst of brutal confetti, the message. */
export function Success({ title, body, cta, onDone }: { title: string; body: string; cta: string; onDone?: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center px-6 py-14 text-center sm:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-10 grid size-28 place-items-center">
        {BITS.map((b, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute border-2 border-black"
            style={{ width: b.size, height: b.size, background: b.orange ? 'var(--ccc-orange)' : 'var(--ccc-ink)' }}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{ x: Math.cos(b.angle) * b.dist, y: Math.sin(b.angle) * b.dist, scale: [0, 1, 0], rotate: 180 }}
            transition={{ duration: 1.3, ease: uiEase, delay: 0.25 }}
          />
        ))}
        <motion.div
          className="grid size-28 place-items-center rounded-full border-2 border-black bg-orange shadow-[6px_6px_0_0_#000]"
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        >
          <svg viewBox="0 0 24 24" className="size-14" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <motion.path d="m5 12.5 4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.25, ease: uiEase }} />
          </svg>
        </motion.div>
      </div>
      <motion.h2 className="font-display text-d4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.7, ease: uiEase }}>
        {title}
      </motion.h2>
      <motion.p className="mt-4 max-w-sm text-lg text-ink/75" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.7, ease: uiEase }}>
        {body}
      </motion.p>
      {onDone && (
        <motion.div className="mt-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55, duration: 0.7, ease: uiEase }}>
          <Button cta={{ label: cta }} onClick={onDone} icon="check" magnetic={false} />
        </motion.div>
      )}
    </motion.div>
  );
}
