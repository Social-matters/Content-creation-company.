import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * CCC wordmark. SVG traced from the original logo PNG (public/brand/ccc-logo.png),
 * orange letterforms on the black extruded shadow.
 */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/ccc-logo.svg"
      alt="Content Creation Company"
      width={1470}
      height={660}
      priority={priority}
      unoptimized
      className={cn('select-none', className)}
      draggable={false}
    />
  );
}
