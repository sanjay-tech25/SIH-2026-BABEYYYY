import React from 'react';

type ProgressBarProps = {
  value: number;
  label: string;
  tone?: 'solid' | 'muted' | 'emerald' | 'purple' | 'amber';
  className?: string;
};

export function ProgressBar({ value, label, tone = 'solid', className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  const getGradient = () => {
    switch (tone) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400';
      case 'purple':
        return 'bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400';
      case 'amber':
        return 'bg-gradient-to-r from-amber-500 to-orange-400';
      case 'muted':
        return 'bg-zinc-400 dark:bg-zinc-600';
      case 'solid':
      default:
        return 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400';
    }
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${getGradient()}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}