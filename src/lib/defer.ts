'use client';

/**
 * Runs `init` once `el` comes within `margin` of the viewport (async, in its own task).
 * Used to keep SplitText/reveal setup out of the hydration commit, which keeps
 * Total Blocking Time low. Returns a disposer.
 *
 * Only use for setups that don't change layout (text reveals, counters). Pins and
 * parallax must be created eagerly so ScrollTrigger positions stay correct.
 */
export function whenNear(el: Element, init: () => void, margin = '0px 0px 120% 0px') {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      init();
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return () => io.disconnect();
}
