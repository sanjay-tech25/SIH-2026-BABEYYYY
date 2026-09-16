import React from 'react';

type ProgressBarProps = {
  value: number;
  label: string;
  tone?: 'solid' | 'muted';
  className?: string;
};

export function ProgressBar({ value, label, tone = 'solid', className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 ${className}`}>
      
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${
        tone === 'solid' ? 'bg-brand-600' : 'bg-brand-600/40'}`
        }
        style={{ width: `${clamped}%` }} />
      
    </div>);

}