import { Headline } from '@/components/ui/Headline';
import { hero } from '@/content/home';

export default function HomePage() {
  return (
    <section className="grid min-h-dvh place-items-center bg-ink text-cream">
      <Headline as="h1" lines={hero.headline} size="d1" tone="dark" />
    </section>
  );
}
