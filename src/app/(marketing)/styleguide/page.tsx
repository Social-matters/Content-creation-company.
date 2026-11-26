import type { Metadata } from 'next';
import { Styleguide } from './Styleguide';

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

/** Hidden design-system reference. Not linked anywhere, excluded from the sitemap. */
export default function StyleguidePage() {
  return <Styleguide />;
}
