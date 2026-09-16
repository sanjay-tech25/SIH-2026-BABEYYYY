import React, { useState } from 'react';
import { ChevronDownIcon, ArrowRightIcon, CheckIcon, LockIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusChip } from '../components/ui/StatusChip';
import { PageHeader } from '../components/ui/PageHeader';
import { pathSteps, type ViewId } from '../data/appData';

type LearningPathProps = {
  onNavigate: (id: ViewId) => void;
};

export function LearningPath({ onNavigate }: LearningPathProps) {
  const [openId, setOpenId] = useState<string | null>(
    pathSteps.find((s) => s.state === 'current')?.id ?? null
  );
  const mastered = pathSteps.filter((s) => s.state === 'mastered').length;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Your learning path"
        subtitle={`Six steps to your goal. You've cleared ${mastered}.`} />
      

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-label font-medium uppercase text-zinc-500 dark:text-zinc-400">
              Step 4 of 6
            </p>
            <p className="mt-2 font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
              Superposition & phase gates
            </p>
          </div>
          <div className="w-full sm:w-56">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">72% towards the next check</p>
            <ProgressBar value={72} label="Current step progress" className="mt-2" />
          </div>
        </div>
      </Card>

      <ol className="relative space-y-3 border-l border-zinc-200 pl-6 dark:border-zinc-800">
        {pathSteps.map((step) => {
          const open = openId === step.id;
          const isCurrent = step.state === 'current';
          const isUpcoming = step.state === 'upcoming';

          return (
            <li key={step.id} className="relative">
              <span
                className={`absolute -left-[31px] top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-semibold ${
                step.state === 'mastered' ?
                'border-brand-600 bg-brand-600 text-white' :
                isCurrent ?
                'border-brand-600 bg-white text-brand-700 dark:bg-zinc-950' :
                'border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-950'}`
                }
                aria-hidden="true">
                
                {step.state === 'mastered' ?
                <CheckIcon className="h-3.5 w-3.5" /> :
                isUpcoming ?
                <LockIcon className="h-3 w-3" /> :

                step.index
                }
              </span>

              <div
                className={`rounded-2xl border ${
                isCurrent ?
                'border-brand-600 bg-white dark:bg-zinc-900' :
                'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}`
                }>
                
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : step.id)}
                  aria-expanded={open}
                  className="flex min-h-[56px] w-full items-center gap-4 px-5 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950">
                  
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-medium text-zinc-900 dark:text-zinc-100">
                      {step.title}
                    </span>
                    {(isCurrent || open) &&
                    <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                        {step.summary}
                      </span>
                    }
                  </span>
                  {step.state === 'mastered' &&
                  <StatusChip tone="done">{step.score}%</StatusChip>
                  }
                  {isCurrent && <StatusChip tone="active">You are here</StatusChip>}
                  {isUpcoming && <StatusChip tone="locked">Locked</StatusChip>}
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
                    open ? 'rotate-180' : ''}`
                    }
                    aria-hidden="true" />
                  
                </button>

                {open &&
                <div className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
                    <ul className="space-y-2">
                      {step.lessons.map((lesson) =>
                    <li
                      key={lesson}
                      className="flex items-center gap-2 text-body text-zinc-600 dark:text-zinc-400">
                      
                          <span
                        className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"
                        aria-hidden="true" />
                      
                          {lesson}
                        </li>
                    )}
                    </ul>
                    {isCurrent &&
                  <Button className="mt-5" onClick={() => onNavigate('lesson')}>
                        Open lesson 8
                        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                  }
                  </div>
                }
              </div>
            </li>);

        })}
      </ol>
    </div>);

}