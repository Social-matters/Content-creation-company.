'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { usePageTransition } from '@/components/providers/PageTransition';

type Props = ComponentProps<typeof Link> & { href: string };

/** next/link that plays the orange page wipe for internal routes. */
export function TLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const internal = href.startsWith('/') || href.startsWith('#');

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !internal || target === '_blank') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} target={target} onClick={handle} {...rest} />;
}
