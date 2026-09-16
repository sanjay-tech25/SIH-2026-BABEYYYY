import React from 'react';
import { CheckIcon, LockIcon, CircleDotIcon } from 'lucide-react';

type Tone = 'done' | 'active' | 'locked';

type StatusChipProps = {
  tone: Tone;
  children: React.ReactNode;
};

const toneStyles: Record<Tone, string> = {
  done: 'bg-brand-600 text-white border-brand-600',
  active:
  'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-600/15 dark:text-brand-200 dark:border-brand-500/40',
  locked:
  'bg-transparent text-zinc-500 border-zinc-300 dark:text-zinc-400 dark:border-zinc-700'
};

const toneIcon: Record<Tone, typeof CheckIcon> = {
  done: CheckIcon,
  active: CircleDotIcon,
  locked: LockIcon
};

export function StatusChip({ tone, children }: StatusChipProps) {
  const Icon = toneIcon[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${toneStyles[tone]}`}>
      
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </span>);

}