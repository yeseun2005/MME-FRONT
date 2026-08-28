import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-muted text-[11px] font-extrabold tracking-wide">
      {label}
      {children}
    </label>
  );
}

export function FormGrid({ children, single }: { children: ReactNode; single?: boolean }) {
  return (
    <div className={cn('grid gap-3', single ? 'grid-cols-1' : 'grid-cols-2 max-[760px]:grid-cols-1')}>
      {children}
    </div>
  );
}