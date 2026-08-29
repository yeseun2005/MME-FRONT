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
  primary:
    'rounded-lg bg-accent text-ink hover:bg-[#ffd85a] disabled:bg-surface-2 disabled:text-muted disabled:cursor-not-allowed disabled:hover:bg-surface-2',
  outline: 'rounded-lg border border-accent/50 bg-transparent text-accent hover:bg-accent hover:text-ink',
  danger: 'rounded-lg border border-red-400/50 bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-ink',
};

const iconBoxClasses: Record<ButtonVariant, string> = {
  primary: 'bg-transparent border border-ink/30 text-ink',
  outline: 'bg-transparent text-inherit',
  danger: 'bg-red-400/20 text-red-400',
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
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-between gap-6 font-extrabold cursor-pointer transition-colors whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span
          className={cn(
            'w-8.5 h-8.5 grid place-items-center',
            disabled ? 'bg-muted/20 text-muted' : iconBoxClasses[variant],
          )}
        >
          {icon}
        </span>
      )}
    </button>
  );
}