import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const baseStyles =
  'inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer';

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[32px] h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'min-h-[40px] h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'min-h-[48px] h-12 px-6 text-base gap-2.5 rounded-xl',
  icon: 'h-9 w-9 p-0 rounded-lg justify-center'
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus-visible:ring-emerald-500 border border-emerald-600/30',
  secondary:
    'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 focus-visible:ring-zinc-400',
  ghost:
    'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100 focus-visible:ring-zinc-400',
  accent:
    'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow focus-visible:ring-purple-500 border border-purple-500/30',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow focus-visible:ring-rose-500 border border-rose-600/30',
  outline:
    'border border-emerald-600/50 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 dark:border-emerald-500/40 dark:text-emerald-400 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 focus-visible:ring-emerald-500'
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
