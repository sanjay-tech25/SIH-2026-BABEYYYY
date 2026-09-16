import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PageHeader } from '../components/ui/PageHeader';
import { weeklyMinutes, activity, skills, learner } from '../data/appData';

const tabs = [
{ id: 'time', label: 'Study time' },
{ id: 'consistency', label: 'Consistency' },
{ id: 'mastery', label: 'Skill mastery' }] as
const;

type TabId = (typeof tabs)[number]['id'];

const intensityClass = ['bg-zinc-100 dark:bg-zinc-800', 'bg-brand-200', 'bg-brand-400', 'bg-brand-600'];

export function Progress() {
  const [tab, setTab] = useState<TabId>('time');
  const peak = Math.max(...weeklyMinutes.map((d) => d.minutes));

  const stats = [
  { label: 'Level', value: `${learner.level}`, note: '1,050 XP to level 5' },
  { label: 'Time this week', value: '10.8 hrs', note: '18% more than last week' },
  { label: 'Practice accuracy', value: '91%', note: 'Across 14 quizzes' },
  { label: 'Days in a row', value: `${learner.streakDays}`, note: 'Longest run: 11 days' }];


  return (
    <div className="space-y-10">
      <PageHeader title="Your progress" subtitle="How your study time and accuracy are trending." />

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) =>
        <Card key={stat.label} className="p-5">
            <dt className="text-body text-zinc-600 dark:text-zinc-400">{stat.label}</dt>
            <dd className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </dd>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{stat.note}</p>
          </Card>
        )}
      </dl>

      <section>
        <div
          role="tablist"
          aria-label="Progress views"
          className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800">
          
          {tabs.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`-mb-px min-h-[44px] border-b-2 px-4 text-body transition-colors ${
                active ?
                'border-brand-600 font-medium text-brand-700 dark:text-brand-300' :
                'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'}`
                }>
                
                {t.label}
              </button>);

          })}
        </div>

        <div className="pt-8">
          {tab === 'time' &&
          <div>
              <h2 className="font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
                Minutes studied each day
              </h2>
              <p className="mt-2 text-body text-zinc-600 dark:text-zinc-400">
                Thursday was your longest session at 82 minutes.
              </p>
              <div className="mt-8 flex h-56 items-end gap-3 sm:gap-6">
                {weeklyMinutes.map((d) =>
              <div key={d.day} className="flex flex-1 flex-col items-center gap-3">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {d.minutes}
                    </span>
                    <div
                  className="w-full rounded-t-md bg-brand-600"
                  style={{ height: `${d.minutes / peak * 100}%` }}
                  role="img"
                  aria-label={`${d.day}: ${d.minutes} minutes`} />
                
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{d.day}</span>
                  </div>
              )}
              </div>
            </div>
          }

          {tab === 'consistency' &&
          <div>
              <h2 className="font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
                The last four weeks
              </h2>
              <p className="mt-2 text-body text-zinc-600 dark:text-zinc-400">
                You studied on 21 of the last 28 days.
              </p>
              <div className="mt-8 grid w-fit grid-cols-7 gap-2">
                {activity.map((level, i) =>
              <span
                key={i}
                className={`h-8 w-8 rounded-md ${intensityClass[level]}`}
                title={`Day ${i + 1}: ${level === 0 ? 'no study' : `${level * 20} min`}`} />

              )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span>Less</span>
                {intensityClass.map((cls, i) =>
              <span key={i} className={`h-3 w-3 rounded ${cls}`} aria-hidden="true" />
              )}
                <span>More</span>
              </div>
            </div>
          }

          {tab === 'mastery' &&
          <div>
              <h2 className="font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
                Where you're strong and weak
              </h2>
              <p className="mt-2 text-body text-zinc-600 dark:text-zinc-400">
                Quantum algorithms is your lowest score, so it comes up more often in practice.
              </p>
              <ul className="mt-8 space-y-6">
                {skills.map((skill) =>
              <li key={skill.name}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-body font-medium text-zinc-900 dark:text-zinc-100">
                        {skill.name}
                      </p>
                      <p className="text-body text-zinc-600 dark:text-zinc-400">
                        {skill.mastery}%{' '}
                        <span className="text-xs">
                          {skill.mastery >= 85 ? 'mastered' : 'still building'}
                        </span>
                      </p>
                    </div>
                    <ProgressBar
                  value={skill.mastery}
                  label={`${skill.name} mastery`}
                  tone={skill.mastery >= 85 ? 'solid' : 'muted'}
                  className="mt-2" />
                
                  </li>
              )}
              </ul>
            </div>
          }
        </div>
      </section>
    </div>);

}