import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full h-11 px-3 border border-white/10 bg-surface-2 text-paper placeholder:text-muted outline-none focus:border-accent/60',
        className,
      )}
      {...rest}
    />
  );
}