import React from 'react';
import { CheckIcon, LockIcon, CircleDotIcon, AlertTriangleIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';

export type Tone = 'done' | 'active' | 'locked' | 'caution' | 'warning' | 'info';

type StatusChipProps = {
  tone: Tone | string;
  children: React.ReactNode;
  className?: string;
};

const toneStyles: Record<string, string> = {
  done: 'bg-[#4c1d70] text-white border-[#4c1d70] shadow-sm',
  active:
    'bg-[#f3edf7] text-[#4c1d70] border-[#cbb3d8] font-bold shadow-sm dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-600',
  locked:
    'bg-white text-slate-500 border-[#cbb3d8] shadow-sm dark:text-zinc-400 dark:border-zinc-700',
  caution:
    'bg-amber-50 text-amber-800 border-amber-300 font-semibold shadow-sm dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700',
  warning:
    'bg-rose-50 text-rose-800 border-rose-300 font-semibold shadow-sm dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700',
  info:
    'bg-blue-50 text-blue-800 border-blue-300 font-semibold shadow-sm dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700'
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style} ${className}`}>
      <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}