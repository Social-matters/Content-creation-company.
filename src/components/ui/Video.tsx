'use client';

import { getImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { mq } from '@/lib/motion';
import type { MediaSlot } from '@/content/types';

const MOBILE = '(max-width: 767px)';

type Props = {
  media: MediaSlot;
  /** Optional art-directed slot for phones (<768px): poster via <picture>, video picked on the client. */
  mobile?: MediaSlot;
  className?: string;
  /** 'inview' plays while visible; 'hover' plays while `active` is true. */
  mode?: 'inview' | 'hover';
  active?: boolean;
  /** LCP media: load the poster eagerly with high fetch priority. */
  eager?: boolean;
  sizes?: string;
  objectPosition?: string;
  /** Decorative media is hidden from assistive tech. */
  decorative?: boolean;
};

/**
 * Muted, looping, inline video over an optimised poster. The file is only
 * requested near the viewport, plays only while visible (or hovered) and
 * pauses off-screen. Poster only under reduced motion or Save-Data.
 * Wrapper is position-agnostic: pass `relative` or `absolute inset-0` in className.
 */
export function Video({ media, mobile, className, mode = 'inview', active = false, eager, sizes = '100vw', objectPosition, decorative }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [src, setSrc] = useState(media.src);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only preferences, read after mount
    setAllowed(!saveData && !window.matchMedia(mq.reduced).matches);
    if (mobile && window.matchMedia(MOBILE).matches) setSrc(mobile.src);
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
  }, [mobile]);

  const shouldPlay = allowed && near && visible && (mode === 'inview' || active);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (shouldPlay) v.play().catch(() => {});
    else v.pause();
  }, [shouldPlay]);

  const common = { alt: decorative ? '' : media.alt, sizes, ...(eager ? { loading: 'eager' as const, fetchPriority: 'high' as const } : {}) };
  const { props: img } = getImageProps({ ...common, src: media.poster, width: media.width, height: media.height });
  const mobileSet = mobile ? getImageProps({ ...common, src: mobile.poster, width: mobile.width, height: mobile.height }).props.srcSet : undefined;
  const fill = { objectPosition };

  return (
    <div ref={wrap} className={cn('overflow-hidden bg-ink-2', className)} aria-hidden={decorative || undefined}>
      <picture>
        {mobileSet && <source media={MOBILE} srcSet={mobileSet} sizes={sizes} />}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- props (incl. alt) come from getImageProps */}
        <img {...img} className="absolute inset-0 h-full w-full object-cover" style={fill} />
      </picture>
      {src && allowed && near && (
        <video
          key={src}
          ref={video}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', playing ? 'opacity-100' : 'opacity-0')}
          style={fill}
        />
      )}
    </div>
  );
}
