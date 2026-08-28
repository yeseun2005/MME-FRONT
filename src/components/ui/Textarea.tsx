import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full min-h-24 px-3 py-2.5 border border-white/10 bg-surface-2 text-paper placeholder:text-muted outline-none focus:border-accent/60',
        className,
      )}
      {...rest}
    />
  );
}