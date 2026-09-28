import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';

type ButtonProps = {
  children: React.ReactNode;
  variant?: Variant;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

const base =
  'inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4c1d70] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] cursor-pointer';

const variants: Record<Variant, string> = {
  primary: 'bg-[#4c1d70] text-white hover:bg-[#391555] shadow-sm hover:shadow',
  secondary:
    'border border-[#cbb3d8] bg-white text-slate-800 hover:bg-purple-50 hover:text-[#4c1d70] hover:border-[#4c1d70] shadow-sm dark:border-purple-900/40 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
  ghost:
    'text-[#4c1d70] hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-950/30',
  accent:
    'bg-[#f5d626] text-zinc-950 font-bold hover:bg-[#ebd024] shadow-sm hover:shadow'
};

export function Button({
  children,
  variant = 'primary',
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
      className={`genie-control ${base} ${variants[variant]} ${className}`}
      aria-label={rest['aria-label']}
    >
      {children}
    </button>
  );
}
