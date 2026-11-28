import Image from 'next/image';
import { howItWorks } from '@/content/home';
import { assets } from '@/content/assets';
import { AbstractAvatar } from '@/components/ui/PhoneFrame';
import { Icon } from '@/components/ui/Icon';
import { LogoMark } from '@/components/brand/LogoMark';

const m = howItWorks.mock;
const THUMBS = [assets.ui.coffee, assets.ui.pizza, assets.ui.toast, assets.ui.wok];

export function AppBar({ title, meta, live }: { title: string; meta: string; live?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-black/10 px-4 pb-3">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-ink text-orange">
          <LogoMark className="size-5" strokeWidth={11} />
        </span>
        <span className="text-[0.95rem] font-bold">{title}</span>
      </div>
      <span className="flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-2 py-0.5 font-mono text-[0.6rem] uppercase">
        <span className={live ? 'size-1.5 animate-pulse rounded-full bg-[#16a34a]' : 'size-1.5 rounded-full bg-orange'} />
        {meta}
      </span>
    </div>
  );
}

/** All four mock screens, stacked. GSAP drives which one is visible. */
export function HowItWorksScreens() {
  return (
    <div className="absolute inset-0 pt-11 text-ink">
      <div className="flex justify-between px-6 pb-3 font-mono text-[0.65rem] font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-3.5 rounded-[2px] border border-ink" />
        </span>
      </div>

      {/* 01 Brief */}
      <div data-screen="brief" className="absolute inset-x-0 bottom-0 top-[4.4rem] flex flex-col">
        <AppBar title={m.brief.title} meta={m.brief.status} />
        <div className="flex flex-1 flex-col gap-3 p-4">
          {m.brief.fields.map((f) => (
            <div key={f.label}>
              <p className="mb-1 font-mono text-[0.6rem] uppercase tracking-wider text-ink/60">{f.label}</p>
              <div className="rounded-xl border-2 border-black bg-white px-3 py-2 text-[0.85rem]">
                <span data-type className="inline-block whitespace-nowrap">
                  {f.value}
                </span>
                <span data-caret className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-orange" />
              </div>
            </div>
          ))}
          {(
            [
              [m.brief.citiesLabel, m.brief.cities],
              [m.brief.formatsLabel, m.brief.formats],
            ] as const
          ).map(([label, items]) => (
            <div key={label}>
              <p className="mb-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-ink/60">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((c, i) => (
                  <span key={c} className="relative overflow-hidden rounded-full border-2 border-black bg-white px-2.5 py-1 text-[0.72rem] font-semibold">
                    {i < 2 && <span data-chip-fill className="absolute inset-0 origin-left bg-orange" />}
                    <span className="relative">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="mb-1.5 flex justify-between font-mono text-[0.6rem] uppercase tracking-wider text-ink/60">
              <span>{m.brief.creatorsLabel}</span>
              <span data-slider-num className="text-[0.75rem] font-bold text-ink">
                {m.brief.creators}
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-ink/10">
              <div data-slider-fill className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-ink" style={{ transform: 'scaleX(0.4)' }} />
            </div>
          </div>
          <button type="button" tabIndex={-1} data-send className="mt-auto flex items-center justify-center gap-2 rounded-full border-2 border-black bg-orange py-2.5 font-mono text-[0.72rem] font-bold uppercase shadow-[3px_3px_0_0_#000]">
            {m.brief.button}
            <Icon name="send" size={14} />
          </button>
        </div>
      </div>

      {/* 02 Match */}
      <div data-screen="match" className="invisible absolute inset-x-0 bottom-0 top-[4.4rem] flex flex-col">
        <AppBar title={m.match.title} meta={m.match.meta} />
        <div className="flex flex-col gap-2.5 p-4">
          {m.match.creators.map((c, i) => (
            <div key={c.handle} data-match-card className="rounded-2xl border-2 border-black bg-white p-3 shadow-[3px_3px_0_0_#000]">
              <div className="flex items-center gap-2.5">
                <AbstractAvatar seed={i} className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.82rem] font-bold">{c.handle}</p>
                  <p className="text-[0.68rem] text-ink/60">
                    {c.niche} · {c.followers}
                  </p>
                </div>
                <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[0.62rem] font-bold text-orange">{c.fit}%</span>
              </div>
              <div className="relative mt-2.5 overflow-hidden rounded-full border-2 border-black py-1 text-center font-mono text-[0.62rem] font-bold uppercase">
                <span>{m.match.accept}</span>
                <span data-accept className="absolute inset-0 flex origin-left items-center justify-center gap-1 bg-orange">
                  <Icon name="check" size={12} strokeWidth={3} />
                  {m.match.accepted}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 03 Review */}
      <div data-screen="review" className="invisible absolute inset-x-0 bottom-0 top-[4.4rem] flex flex-col">
        <AppBar title={m.review.title} meta={m.review.meta} />
        <div className="grid grid-cols-2 gap-2.5 p-4">
          {THUMBS.map((t) => (
            <div key={t.poster} data-thumb className="relative overflow-hidden rounded-xl border-2 border-black bg-ink">
              <Image src={t.poster} alt="" width={t.width} height={t.height} sizes="130px" className="aspect-[3/4] w-full object-cover" />
              <span className="absolute left-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-cream/90">
                <Icon name="play" size={8} />
              </span>
              <span data-stamp className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-center gap-1 rounded-full border-2 border-black bg-orange py-1 font-mono text-[0.55rem] font-bold uppercase">
                <Icon name="check" size={10} strokeWidth={3} />
                {m.review.approved}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 04 Live */}
      <div data-screen="live" className="invisible absolute inset-x-0 bottom-0 top-[4.4rem] flex flex-col">
        <AppBar title={m.live.title} meta={m.live.live} live />
        <div className="p-4">
          <p data-views className="font-display text-[2.3rem] leading-none">
            {m.live.total.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[0.72rem] font-semibold text-[#16a34a]">
            <Icon name="trend" size={13} />
            {m.live.today}
          </p>
          <svg viewBox="0 0 240 100" className="mt-3 h-24 w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="hiw-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#FF812A" stopOpacity="0.45" />
                <stop offset="1" stopColor="#FF812A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path data-area d="M0 92 C30 88 50 80 70 74 S110 60 130 50 S170 30 190 22 S225 8 240 4 L240 100 L0 100Z" fill="url(#hiw-area)" />
            <path data-line d="M0 92 C30 88 50 80 70 74 S110 60 130 50 S170 30 190 22 S225 8 240 4" fill="none" stroke="#141210" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="mt-1 font-mono text-[0.55rem] uppercase text-ink/50">{m.live.caption}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {m.live.feed.map((f, i) => (
              <li key={f.handle} data-feed className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-2.5 py-1.5">
                <AbstractAvatar seed={i} className="size-7" />
                <span className="min-w-0 flex-1 truncate text-[0.7rem]">
                  <b>{f.handle}</b> {f.text}
                </span>
                <span className="font-mono text-[0.62rem] font-bold">{f.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
