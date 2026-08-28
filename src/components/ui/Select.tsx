import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full h-11 px-3 border border-white/10 bg-surface-2 text-paper outline-none focus:border-accent/60',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}