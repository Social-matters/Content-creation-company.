'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, type ReactNode } from 'react';

/**
 * Which design version a subtree belongs to. v1 lives at `/`, v2 at `/v2/*`.
 * Shared components read this to prefix internal links and to pick their motion profile,
 * so v1 behaves exactly as before (base '' + 'v1' is the default).
 */
export type SiteVersion = 'v1' | 'v2';
type Value = { version: SiteVersion; base: string };

const VersionContext = createContext<Value>({ version: 'v1', base: '' });

export function SiteVersionProvider({ version, base, children }: Value & { children: ReactNode }) {
  return <VersionContext.Provider value={{ version, base }}>{children}</VersionContext.Provider>;
}

export const useSiteVersion = () => useContext(VersionContext);

/** Prefixes internal routes (`/pricing`, `/#how`) with the version base. Files and external URLs pass through. */
export function withBase(base: string, href: string) {
  if (!base || !href.startsWith('/') || href.startsWith('//')) return href;
  if (href === base || href.startsWith(`${base}/`) || href.startsWith(`${base}#`)) return href;
  if (/^\/(media|brand|_next)\//.test(href)) return href;
  if (href === '/') return base;
  if (href.startsWith('/#')) return `${base}${href.slice(1)}`;
  return `${base}${href}`;
}

/** Current pathname without the version base, e.g. `/v2/creators` → `/creators`. */
export function useLocalPath() {
  const pathname = usePathname();
  const { base } = useSiteVersion();
  if (!base || !pathname.startsWith(base)) return pathname;
  return pathname.slice(base.length) || '/';
}
