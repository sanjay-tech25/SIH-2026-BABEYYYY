import React, { useState } from 'react';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusChip } from '../components/ui/StatusChip';
import { PageHeader } from '../components/ui/PageHeader';
import { courses, type Course, type ViewId } from '../data/appData';

type CoursesProps = {
  onNavigate: (id: ViewId) => void;
};

const filters = [
{ id: 'all', label: 'All' },
{ id: 'in-progress', label: 'In progress' },
{ id: 'done', label: 'Finished' },
{ id: 'not-started', label: 'Not started' }] as
const;

type FilterId = (typeof filters)[number]['id'];

function statusChip(course: Course) {
  if (course.status === 'done') return <StatusChip tone="done">Finished</StatusChip>;
  if (course.status === 'in-progress') return <StatusChip tone="active">In progress</StatusChip>;
  return <StatusChip tone="locked">Not started</StatusChip>;
}

export function Courses({ onNavigate }: CoursesProps) {
  const [filter, setFilter] = useState<FilterId>('all');
  const visible = filter === 'all' ? courses : courses.filter((c) => c.status === filter);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your courses"
        subtitle="Four courses tied to your quantum computing goal." />
      

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter courses">
        {filters.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={`min-h-[44px] rounded-xl border px-4 text-body transition-colors ${
              active ?
              'border-brand-600 bg-brand-600 font-medium text-white' :
              'border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'}`
              }>
              
              {f.label}
            </button>);

        })}
      </div>

      {visible.length === 0 ?
      <Card className="p-10 text-center">
          <p className="font-display text-h3 font-semibold text-zinc-900 dark:text-zinc-50">
            Nothing here yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-body text-zinc-600 dark:text-zinc-400">
            No courses match this filter.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => setFilter('all')}>
            Show all courses
          </Button>
        </Card> :

      <ul className="space-y-4">
          {visible.map((course) =>
        <Card as="li" key={course.id} className="p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    {statusChip(course)}
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {course.level}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-h2 font-semibold text-zinc-900 dark:text-zinc-50">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-body text-zinc-600 dark:text-zinc-400">
                    {course.summary}
                  </p>
                </div>
                <Button
              variant={course.status === 'in-progress' ? 'primary' : 'secondary'}
              className="shrink-0"
              onClick={() => onNavigate('lesson')}>
              
                  {course.status === 'done' ?
              'Review course' :
              course.status === 'in-progress' ?
              'Continue' :
              'Start course'}
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="mt-6 max-w-md">
                <div className="flex items-baseline justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>
                    {course.lessonsDone} of {course.lessonsTotal} lessons
                  </span>
                  {course.minutesLeft > 0 &&
              <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {course.minutesLeft} min left
                    </span>
              }
                </div>
                <ProgressBar
              value={course.lessonsDone / course.lessonsTotal * 100}
              label={`${course.title} progress`}
              tone={course.status === 'not-started' ? 'muted' : 'solid'}
              className="mt-2" />
            
              </div>
            </Card>
        )}
        </ul>
      }
    </div>);

}