import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'outline' | 'danger';
type ButtonSize = 'default' | 'wide' | 'compact';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-ink hover:bg-[#ffd85a] disabled:opacity-40 disabled:grayscale-[65%] disabled:cursor-not-allowed',
  outline: 'border border-accent/50 bg-transparent text-accent hover:bg-accent hover:text-ink',
  danger: 'border border-red-400/40 bg-transparent text-red-400 h-[42px] text-[9px] font-black',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'min-w-[174px] h-12 pl-5 pr-2.5',
  wide: 'w-full h-12 pl-5 pr-2.5',
  compact: 'min-w-[155px] h-11 px-4',
};

export function Button({
  variant = 'primary',
  size = 'default',
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-between gap-6 font-extrabold cursor-pointer transition-colors whitespace-nowrap',
        variantClasses[variant],
        variant !== 'danger' && sizeClasses[size],
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span className="w-8.5 h-8.5 grid place-items-center bg-ink text-accent">
          {icon}
        </span>
      )}
    </button>
  );
}