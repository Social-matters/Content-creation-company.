import type { socials, SocialIcon } from '@/content/site';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

const iconFor: Record<SocialIcon, IconName> = { instagram: 'instagram', linkedin: 'linkedin', youtube: 'youtube', x: 'xLogo' };

export function SocialLinks({ items, className }: { items: typeof socials; className?: string }) {
  return (
    <ul className={cn('flex items-center gap-2', className)}>
      {items.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="grid size-10 place-items-center rounded-full border border-current/25 transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-black"
          >
            <Icon name={iconFor[s.icon]} size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
