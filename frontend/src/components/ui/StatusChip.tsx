import React from 'react';
import { CheckIcon, LockIcon, CircleDotIcon, AlertTriangleIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';

export type Tone = 'done' | 'active' | 'locked' | 'caution' | 'warning' | 'info';

type StatusChipProps = {
  tone: Tone | string;
  children: React.ReactNode;
  className?: string;
};

const toneStyles: Record<string, string> = {
  done: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold shadow-sm dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  active:
    'bg-purple-50 text-purple-700 border-purple-200/80 font-semibold shadow-sm dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
  locked:
    'bg-zinc-100 text-zinc-600 border-zinc-200/80 shadow-sm dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700/60',
  caution:
    'bg-amber-50 text-amber-800 border-amber-200/80 font-semibold shadow-sm dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  warning:
    'bg-rose-50 text-rose-800 border-rose-200/80 font-semibold shadow-sm dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
  info:
    'bg-blue-50 text-blue-800 border-blue-200/80 font-semibold shadow-sm dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60'
};

const toneIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  done: CheckIcon,
  active: CircleDotIcon,
  locked: LockIcon,
  caution: AlertTriangleIcon,
  warning: AlertCircleIcon,
  info: InfoIcon
};

export function StatusChip({ tone, children, className = '' }: StatusChipProps) {
  const Icon = toneIcon[tone] || CircleDotIcon;
  const style = toneStyles[tone] || toneStyles.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${style} ${className}`}
    >
      <Icon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}