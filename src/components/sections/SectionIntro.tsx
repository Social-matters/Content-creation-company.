import { cn } from '@/lib/cn';
import type { Headline as HeadlineContent } from '@/content/types';
import { Headline } from '@/components/ui/Headline';
import { Eyebrow } from '@/components/ui/Badge';
import { RevealText } from '@/components/ui/Reveal';

type Props = {
  label?: string;
  headline: HeadlineContent;
  body?: string;
  /** Background: 'dark' (ink), 'light' (cream/white) or 'orange'. */
  tone?: 'dark' | 'light' | 'orange';
  size?: 'd1' | 'd2' | 'd3';
  className?: string;
  /** 'split' puts body on the right on desktop. */
  layout?: 'stack' | 'split';
  as?: 'h1' | 'h2';
};

/** Eyebrow + display headline + body, with reveals. Used by every section. */
export function SectionIntro({ label, headline, body, tone = 'light', size = 'd2', className, layout = 'stack', as = 'h2' }: Props) {
  return (
    <div className={cn(layout === 'split' ? 'grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] lg:gap-16' : 'flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-5">
        {label && <Eyebrow tone={tone}>{label}</Eyebrow>}
        <Headline as={as} lines={headline} size={size} tone={tone === 'dark' ? 'dark' : 'light'} />
      </div>
      {body && <RevealText className={cn('text-lead max-w-xl', tone === 'dark' ? 'text-cream/75' : tone === 'orange' ? 'text-black/80' : 'text-ink/75')}>{body}</RevealText>}
    </div>
  );
}
