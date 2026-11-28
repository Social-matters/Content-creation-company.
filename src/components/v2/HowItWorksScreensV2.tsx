import { howV2 } from '@/content/v2/home';
import { AbstractAvatar } from '@/components/ui/PhoneFrame';
import { Icon, type IconName } from '@/components/ui/Icon';
import { LogoMark } from '@/components/brand/LogoMark';

const m = howV2.mock;
const label = 'mb-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-ink/60';

function AppBar({ title, meta, live }: { title: string; meta: string; live?: boolean }) {
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

/**
 * Mock screens: brief (with what you need), influencer shortlist, approvals (celebrity
 * request, model booking, reel draft) and the live counter.
 * `buildTimeline` drives them through their data hooks. Abstract avatars only: no real people in mock UI.
 */
export function HowItWorksScreensV2() {
  return (
    <div className="absolute inset-0 pt-11 text-ink">
      <div className="flex justify-between px-6 pb-3 font-mono text-[0.65rem] font-semibold">
        <span>9:41</span>
        <span className="h-2 w-3.5 rounded-[2px] border border-ink" />
      </div>

      {/* 01 Brief */}
      <div data-screen="brief" className="absolute inset-x-0 bottom-0 top-[4.4rem] flex flex-col">
        <AppBar title={m.brief.title} meta={m.brief.status} />
        <div className="flex flex-1 flex-col gap-3 p-4">
          {m.brief.fields.map((f) => (
            <div key={f.label}>
              <p className={label}>{f.label}</p>
              <div className="rounded-xl border-2 border-black bg-white px-3 py-2 text-[0.85rem]">
                <span data-type className="inline-block whitespace-nowrap">
                  {f.value}
                </span>
                <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-orange" />
              </div>
            </div>
          ))}
          {(
            [
              [m.brief.needsLabel, m.brief.needs, 3],
              [m.brief.citiesLabel, m.brief.cities, 2],
            ] as const
          ).map(([title, items, filled]) => (
            <div key={title}>
              <p className={label}>{title}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((c, i) => (
                  <span key={c} className="relative overflow-hidden rounded-full border-2 border-black bg-white px-2.5 py-1 text-[0.72rem] font-semibold">
                    {i < filled && <span data-chip-fill className="absolute inset-0 origin-left bg-orange" />}
                    <span className="relative">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className={`${label} flex justify-between`}>
              <span>{m.brief.countLabel}</span>
              <span className="text-[0.75rem] font-bold text-ink">{m.brief.count}</span>
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

      {/* 02 Match: influencer shortlist */}
      <div data-screen="match" className="invisible absolute inset-x-0 bottom-0 top-[4.4rem] flex flex-col">
        <AppBar title={m.match.title} meta={m.match.meta} />
        <div className="flex flex-col gap-2.5 p-4">
          {m.match.items.map((c, i) => (
            <div key={c.handle} data-match-card className="rounded-2xl border-2 border-black bg-white p-3 shadow-[3px_3px_0_0_#000]">
              <div className="flex items-center gap-2.5">
                <AbstractAvatar seed={i} className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.82rem] font-bold">{c.handle}</p>
                  <p className="text-[0.68rem] text-ink/60">{c.niche}</p>
                </div>
                <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[0.58rem] font-bold uppercase text-orange">{c.tier}</span>
              </div>
              <div className="mt-2 flex gap-3 font-mono text-[0.62rem] text-ink/70">
                <span>
                  <b className="text-ink">{c.followers}</b>
                </span>
                <span>
                  {m.match.engagement} <b className="text-ink">{c.er}</b>
                </span>
              </div>
              <div className="relative mt-2 overflow-hidden rounded-full border-2 border-black py-1 text-center font-mono text-[0.62rem] font-bold uppercase">
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

      {/* 03 Approve: celebrity request, model booking, reel draft */}
      <div data-screen="review" className="invisible absolute inset-x-0 bottom-0 top-[4.4rem] flex flex-col">
        <AppBar title={m.approve.title} meta={m.approve.meta} />
        <div className="flex flex-col gap-2.5 p-4">
          {m.approve.items.map((a) => (
            <div key={a.kind} data-thumb className="relative rounded-2xl border-2 border-black bg-white p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-orange">
                  <Icon name={a.icon as IconName} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.56rem] uppercase tracking-wider text-ink/60">{a.kind}</p>
                  <p className="truncate text-[0.8rem] font-bold">{a.title}</p>
                </div>
              </div>
              <span data-stamp className="mt-2.5 flex items-center justify-center gap-1 rounded-full border-2 border-black bg-orange py-1 font-mono text-[0.58rem] font-bold uppercase">
                <Icon name="check" size={10} strokeWidth={3} />
                {a.status}
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
          <p className="mt-1 flex items-center gap-1 text-[0.72rem] font-semibold text-[#15803d]">
            <Icon name="trend" size={13} />
            {m.live.today}
          </p>
          <svg viewBox="0 0 240 100" className="mt-3 h-24 w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="hiw-area-v2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#FF812A" stopOpacity="0.45" />
                <stop offset="1" stopColor="#FF812A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path data-area d="M0 92 C30 88 50 80 70 74 S110 60 130 50 S170 30 190 22 S225 8 240 4 L240 100 L0 100Z" fill="url(#hiw-area-v2)" />
            <path data-line d="M0 92 C30 88 50 80 70 74 S110 60 130 50 S170 30 190 22 S225 8 240 4" fill="none" stroke="#141210" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="mt-1 font-mono text-[0.55rem] uppercase text-ink/60">{m.live.caption}</p>
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
