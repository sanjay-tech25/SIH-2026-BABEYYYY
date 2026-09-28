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
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          tone === 'solid'
            ? 'bg-gradient-to-r from-[#4c1d70] to-[#f5d626]'
            : 'bg-[#4c1d70]/40'
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}