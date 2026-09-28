import React from 'react';

type CardVariant = 'default' | 'elevated' | 'interactive' | 'accent' | 'cosmic' | 'editorial';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
  variant?: CardVariant;
  onClick?: () => void;
};

const variantStyles: Record<CardVariant, string> = {
  default:
    'border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:border-zinc-800 dark:bg-zinc-900',
  elevated:
    'border border-purple-200/70 bg-white shadow-[0_4px_16px_-4px_rgba(76,29,112,0.06)] dark:border-purple-900/50 dark:bg-zinc-900',
  interactive:
    'border border-slate-200/80 bg-white hover:border-purple-300/90 transition-colors dark:border-zinc-800 dark:bg-zinc-900',
  accent:
    'border border-purple-100 bg-white border-l-2 border-l-[#4c1d70] dark:border-zinc-800 dark:bg-zinc-900',
  cosmic:
    'border border-purple-900/60 bg-[#160624] text-white dark:border-purple-800 dark:bg-[#12041d]',
  editorial:
    'bg-transparent border-0 shadow-none',
};

export function Card({
  children,
  className = '',
  as = 'div',
  variant = 'default',
  onClick
}: CardProps) {
  const Tag = as;
  const radius = variant === 'editorial' ? '' : 'rounded-2xl';
  return (
    <Tag
      onClick={onClick}
      className={`${radius} transition-all ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Tag>
  );
}