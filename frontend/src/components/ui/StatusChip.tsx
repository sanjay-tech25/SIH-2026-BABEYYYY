import React from 'react';
import { CheckIcon, LockIcon, CircleDotIcon, AlertTriangleIcon } from 'lucide-react';

export type Tone = 'done' | 'active' | 'locked' | 'caution';

export type StatusChipProps = {
  tone: Tone;
  children: React.ReactNode;
};

const toneStyles: Record<Tone, string> = {
  done: 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-600 dark:text-white',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
  locked: 'bg-transparent text-zinc-500 border-zinc-300 dark:text-zinc-400 dark:border-zinc-700',
  caution: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60'
};

const toneIcon: Record<Tone, typeof CheckIcon> = {
  done: CheckIcon,
  active: CircleDotIcon,
  locked: LockIcon,
  caution: AlertTriangleIcon
};

export function StatusChip({ tone, children }: StatusChipProps) {
  const Icon = toneIcon[tone] || CircleDotIcon;
  const style = toneStyles[tone] || toneStyles.active;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}