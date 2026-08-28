import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type TagVariant = 'default' | 'verified' | 'pro' | 'readonly';

const variantClasses: Record<TagVariant, string> = {
  default: 'border border-white/10 text-muted',
  verified: 'bg-[#249ee5] text-white',
  pro: 'bg-[#d856ff] text-white',
  readonly: 'border border-accent/32 text-accent',
};

export function Tag({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: TagVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-1.5 text-[8px] font-extrabold tracking-widest',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}