import type { ReactNode, MouseEventHandler } from 'react';
import { cn } from '../../lib/cn';

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div onClick={onClick} className={cn('overflow-hidden border border-white/10 bg-surface', className)}>
      {children}
    </div>
  );
}