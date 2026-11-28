'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { uiEase } from '@/lib/motion';
import { NotificationCard, type NotificationTone } from '@/components/sections/NotificationCard';

type Item = { app: string; time: string; text: string; tone: NotificationTone };

/** One notification at a time, softly replaced every few seconds (pauses under reduced motion). */
export function NotificationCycle({ items, className, interval = 3800, play = true }: { items: readonly Item[]; className?: string; interval?: number; play?: boolean }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!play || reduced || items.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % items.length), interval);
    return () => window.clearInterval(id);
  }, [play, reduced, items.length, interval]);

  const item = items[i];
  return (
    <div className={className}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={item.text}
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.9, ease: uiEase }}
        >
          <NotificationCard {...item} className="w-[17.5rem] sm:w-[19rem]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
