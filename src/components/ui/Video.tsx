'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { mq } from '@/lib/motion';
import type { MediaSlot } from '@/content/types';

type Props = {
  media: MediaSlot;
  className?: string;
  /** 'inview' plays while visible; 'hover' plays while `active` is true. */
  mode?: 'inview' | 'hover';
  active?: boolean;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
  /** Decorative media is hidden from assistive tech. */
  decorative?: boolean;
};

/**
 * Muted, looping, inline video over a next/image poster. The file is only
 * requested once the video is near the viewport, plays only while visible
 * (or hovered) and pauses off-screen. Poster only for reduced motion / Save-Data.
 */
export function Video({ media, className, mode = 'inview', active = false, priority, sizes = '100vw', objectPosition, decorative }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only preferences after mount
    setAllowed(!saveData && !window.matchMedia(mq.reduced).matches);
    const el = wrap.current;
    if (!el) return;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '600px 0px' });
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      nearIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  const shouldPlay = allowed && near && visible && (mode === 'inview' || active);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay]);

  return (
    <div ref={wrap} className={cn('relative overflow-hidden bg-ink-2', className)} aria-hidden={decorative || undefined}>
      <Image
        src={media.poster}
        alt={decorative ? '' : media.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition }}
      />
      {media.src && allowed && near && (
        <video
          ref={video}
          src={media.src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', playing ? 'opacity-100' : 'opacity-0')}
          style={{ objectPosition }}
        />
      )}
    </div>
  );
}
