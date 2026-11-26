'use client';

import type { ReactNode } from 'react';
import { colors } from '@/lib/tokens';
import { assets } from '@/content/assets';
import { marquees } from '@/content/home';
import { useUI } from '@/components/providers/UIProvider';
import { Headline, TiltedBlock } from '@/components/ui/Headline';
import { Button } from '@/components/ui/Button';
import { Badge, Eyebrow } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Counter } from '@/components/ui/Counter';
import { Marquee } from '@/components/ui/Marquee';
import { PhoneFrame, AbstractAvatar } from '@/components/ui/PhoneFrame';
import { Video } from '@/components/ui/Video';
import { Icon, type IconName } from '@/components/ui/Icon';
import { LogoMark } from '@/components/brand/LogoMark';
import { Logo } from '@/components/brand/Logo';

// Internal reference page: copy here is design-system labelling, not marketing content.
const ICONS: IconName[] = ['arrow', 'arrowUpRight', 'check', 'x', 'plus', 'menu', 'play', 'send', 'calendar', 'lock', 'bolt', 'star', 'eye', 'heart', 'sparkle', 'trend', 'doc', 'mail', 'instagram', 'linkedin', 'youtube', 'xLogo'];

function Block({ title, children, dark }: { title: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? 'bg-ink text-cream' : 'bg-cream text-ink'}>
      <div className="container-x py-16">
        <Eyebrow>{`// ${title}`}</Eyebrow>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function Styleguide() {
  const { openModal } = useUI();
  return (
    <div>
      <section className="bg-ink pb-16 pt-36 text-cream">
        <div className="container-x">
          <Badge>Design system</Badge>
          <Headline as="h1" size="d1" tone="dark" className="mt-6" lines={['CCC', { before: 'Style', accent: 'guide.', style: 'block' }]} />
        </div>
      </section>

      <Block title="Colour tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Object.entries(colors).map(([k, v]) => (
            <div key={k} className="overflow-hidden rounded-2xl border-2 border-black">
              <div className="h-24" style={{ background: v }} />
              <div className="bg-white px-3 py-2 font-mono text-xs">
                {k}
                <br />
                {v}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Type scale" dark>
        <div className="flex flex-col gap-6">
          {(['mega', 'd1', 'd2', 'd3', 'd4'] as const).map((s) => (
            <div key={s} className="flex items-baseline gap-6 border-b border-cream/10 pb-4">
              <span className="w-12 font-mono text-xs text-cream/50">{s}</span>
              <Headline as="p" size={s} tone="dark" lines={[{ before: 'Reels ', accent: 'sell.', style: s === 'd2' ? 'block' : 'orange' }]} />
            </div>
          ))}
          <p className="text-lead max-w-2xl">Lead — Bricolage Grotesque. Brands brief once; creators make it theirs.</p>
          <p className="max-w-2xl text-cream/70">Body — Bricolage Grotesque 16/1.5. We handle contracts, payments and the awkward follow-ups.</p>
          <p className="label-mono text-orange">Mono label — JetBrains Mono</p>
        </div>
      </Block>

      <Block title="Accents">
        <div className="flex flex-wrap items-center gap-10 font-display text-d3">
          <TiltedBlock>Results.</TiltedBlock>
          <span className="rounded-3xl bg-ink px-6 py-3">
            <TiltedBlock tone="dark">Results.</TiltedBlock>
          </span>
          <Headline as="p" size="d3" lines={[{ accent: 'Outline.', style: 'outline' }]} />
        </div>
      </Block>

      <Block title="Buttons">
        <div className="flex flex-wrap items-center gap-5">
          <Button cta={{ label: 'Start a campaign', modal: 'campaign' }} />
          <Button cta={{ label: 'Book a call', href: '/contact', meta: '15 min' }} variant="ink" icon="calendar" />
          <Button cta={{ label: 'Join as creator', modal: 'creator' }} variant="outline-light" />
          <Button cta={{ label: 'See pricing', href: '/pricing' }} variant="link-light" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-5 rounded-3xl bg-ink p-8">
          <Button cta={{ label: 'Start a campaign', modal: 'campaign' }} />
          <Button cta={{ label: 'Book a call', href: '/contact', meta: '15 min' }} variant="outline-dark" icon="calendar" />
          <Button cta={{ label: 'Join as a creator', href: '/creators' }} variant="link-dark" />
          <button type="button" onClick={() => openModal('login')} className="font-mono text-sm text-cream underline">
            Open login modal
          </button>
        </div>
      </Block>

      <Block title="Badges & icons" dark>
        <div className="flex flex-wrap gap-4">
          <Badge>Coming soon</Badge>
          <Badge tone="orange">Live</Badge>
          <Badge tone="cream" pulse={false}>
            Draft
          </Badge>
          <Badge tone="glass">Glass</Badge>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-cream">
          {ICONS.map((n) => (
            <span key={n} title={n} className="grid size-12 place-items-center rounded-xl border border-cream/15">
              <Icon name={n} />
            </span>
          ))}
        </div>
      </Block>

      <Block title="Cards">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(['cream', 'white', 'orange', 'ink'] as const).map((t) => (
            <Card key={t} tone={t} interactive className="p-6" data-cursor="View">
              <p className="font-mono text-xs uppercase">{t}</p>
              <p className="mt-10 font-display text-d4">Card</p>
            </Card>
          ))}
        </div>
      </Block>

      <Block title="Counter (odometer)" dark>
        <div className="flex flex-wrap gap-16 font-display text-d2 text-orange">
          <Counter value={2400} suffix="+" />
          <Counter value={1240000} />
          <Counter value={8} />
        </div>
      </Block>

      <section className="overflow-hidden bg-cream py-16">
        <Marquee items={marquees.formats} className="-rotate-2 border-y-2 border-black bg-orange py-4" itemClassName="font-display text-d3 text-black" />
        <Marquee items={marquees.cities} direction={-1} className="mt-6 rotate-1 border-y-2 border-black bg-ink py-4" itemClassName="font-display text-d3 text-cream" separator={<span className="text-orange">✦</span>} />
      </section>

      <Block title="Phone frame, video, logo">
        <div className="grid items-start gap-12 md:grid-cols-3">
          <PhoneFrame className="mx-auto w-64">
            <div className="flex h-full flex-col gap-3 p-4 pt-12">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border-2 border-black bg-white p-3">
                  <AbstractAvatar seed={i} />
                  <div className="h-3 flex-1 rounded-full bg-cream-2" />
                </div>
              ))}
            </div>
          </PhoneFrame>
          <div data-cursor="Play" className="mx-auto w-64 overflow-hidden rounded-[1.75rem] border-2 border-black shadow-[6px_6px_0_0_#000]">
            <Video media={assets.mosaic[0]} className="relative aspect-[9/16]" sizes="256px" />
          </div>
          <div className="flex flex-col items-center gap-10">
            <Logo className="h-28 w-auto" />
            <LogoMark className="size-28 text-orange" />
          </div>
        </div>
      </Block>
    </div>
  );
}
