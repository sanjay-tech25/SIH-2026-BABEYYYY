import React from 'react';
import {
  BookOpenIcon,
  FlameIcon,
  TargetIcon,
  AwardIcon,
  TrendingUpIcon,
  CalendarCheckIcon } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusChip } from '../components/ui/StatusChip';
import { PageHeader } from '../components/ui/PageHeader';
import { badges } from '../data/appData';

const icons = [BookOpenIcon, FlameIcon, TargetIcon, AwardIcon, TrendingUpIcon, CalendarCheckIcon];

export function Achievements() {
  const earned = badges.filter((b) => b.earnedOn).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Milestones"
        subtitle={`You've earned ${earned} of ${badges.length} so far.`} />
      

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge, i) => {
          const Icon = icons[i % icons.length];
          const isEarned = Boolean(badge.earnedOn);
          return (
            <Card as="li" key={badge.id} className="flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  isEarned ?
                  'bg-brand-600 text-white' :
                  'border border-zinc-200 text-zinc-400 dark:border-zinc-800'}`
                  }
                  aria-hidden="true">
                  
                  <Icon className="h-5 w-5" />
                </span>
                {isEarned ?
                <StatusChip tone="done">Earned</StatusChip> :

                <StatusChip tone="locked">Locked</StatusChip>
                }
              </div>

              <h2
                className={`mt-5 font-display text-h3 font-semibold ${
                isEarned ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'}`
                }>
                
                {badge.title}
              </h2>
              <p className="mt-2 flex-1 text-body text-zinc-600 dark:text-zinc-400">
                {badge.summary}
              </p>

              <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                {badge.earnedOn ?
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Earned {badge.earnedOn}
                  </p> :
                badge.progress ?
                <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {badge.progress.value.toLocaleString()} of{' '}
                      {badge.progress.target.toLocaleString()} {badge.progress.unit}
                    </p>
                    <ProgressBar
                    value={badge.progress.value / badge.progress.target * 100}
                    label={`${badge.title} progress`}
                    tone="muted"
                    className="mt-2" />
                  
                  </div> :
                null}
              </div>
            </Card>);

        })}
      </ul>
    </div>);

}