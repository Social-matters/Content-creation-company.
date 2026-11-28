import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { LogoMark } from '@/components/brand/LogoMark';

export type NotificationTone = 'ig' | 'ccc' | 'match' | 'shoot' | 'star';

/** Phone-notification card used over hero media. */
export function NotificationCard({ app, time, text, tone, className }: { app: string; time: string; text: string; tone: NotificationTone; className?: string }) {
  return (
    <div
      className={cn(
        'flex w-[19rem] items-center gap-3 rounded-[1.35rem] border border-cream/15 bg-ink/85 p-3 pr-4 text-cream shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]',
        className,
      )}
    >
      <span
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-[0.8rem] border border-black/40',
          tone === 'ig' && 'bg-[radial-gradient(circle_at_30%_110%,#ffd776_0%,#f9813a_25%,#e0295f_55%,#9b2ec5_85%)] text-white',
          tone === 'ccc' && 'bg-orange text-ink',
          tone === 'match' && 'bg-cream text-ink',
          (tone === 'shoot' || tone === 'star') && 'bg-ink-3 text-orange',
        )}
      >
        {tone === 'ig' ? <Icon name="instagram" size={22} /> : tone === 'ccc' ? <LogoMark className="size-7" strokeWidth={10} /> : <Icon name={tone === 'shoot' ? 'calendar' : tone === 'star' ? 'star' : 'sparkle'} size={20} />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-center justify-between gap-3 text-[0.82rem]">
          <span className="font-semibold">{app}</span>
          <span className="text-cream/50">{time}</span>
        </span>
        <span className="truncate text-[0.92rem] text-cream/85">{text}</span>
      </span>
    </div>
  );
}
