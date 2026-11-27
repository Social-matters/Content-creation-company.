import type { Metadata } from 'next';
import { MarketingShell } from '@/components/layout/MarketingShell';
import { v2Meta } from '@/content/v2';

/** v2 design preview: same content, new layout and motion. Not indexed (see v2Meta). */
export const metadata: Metadata = { robots: v2Meta.robots };

export default function V2Layout({ children }: LayoutProps<'/v2'>) {
  return <MarketingShell version="v2">{children}</MarketingShell>;
}
