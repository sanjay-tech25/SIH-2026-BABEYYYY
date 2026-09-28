import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ShieldCheckIcon, CheckCircle2Icon, LockIcon, SparklesIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { assessments, pastAttempts } from '../data/appData';
import { apiClient, type AdaptiveRoadmap } from '../services/apiClient';

type AssessmentsProps = {
  onStartPractice: () => void;
};

export function Assessments({ onStartPractice }: AssessmentsProps) {
  const [roadmap, setRoadmap] = useState<AdaptiveRoadmap | null>(null);

  useEffect(() => {
    let mounted = true;
    apiClient.getAdaptiveRoadmap().then((data) => {
      if (mounted && data) {
        setRoadmap(data);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleStartCheck = (assessment: typeof assessments[0]) => {
    apiClient.sendQubotEvent('ASSESSMENT_STARTED', {
      assessment_id: assessment.id,
      title: assessment.title,
      kind: assessment.kind
    }).catch(() => {});
    onStartPractice();
  };
  return (
    <div className="space-y-8">
      {/* 1. Open Editorial Header */}
      <header className="border-b border-purple-100/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-mono text-slate-500 mb-2">
          <span className="flex items-center gap-2 font-medium tracking-wide uppercase text-[13px] text-purple-950/70">
            <span className="h-2 w-2 rounded-full bg-[#f5d626]" />
            Benchmarked Assessments • Skill Mastery Evaluation
          </span>
        </div>
        <h1 className="font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
          Quantum Skill Assessments & Diagnostics
        </h1>
        <p className="mt-2 font-poppins text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Verify conceptual grounding, mathematical rigor, and circuit design principles through timed evaluations and diagnostic reviews.
        </p>
      </header>

      {/* 2. Available Skill Checks (Unboxed Registry Flow) */}
      <section aria-labelledby="open-heading" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-purple-100/80">
          <h2 id="open-heading" className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white">
            Available Skill Checks
          </h2>
          <span className="text-sm font-mono text-slate-500">
            {assessments.length} Evaluations Ready
          </span>
        </div>

        <div className="divide-y divide-purple-100/80 border-y border-purple-100/80">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="py-6 px-2 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:bg-purple-50/20 transition-colors group"
            >
              <div className="max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 font-mono text-xs font-bold text-[#4c1d70] border border-purple-200">
                    {a.kind}
                  </span>
                  <span className="text-sm font-mono text-slate-400">
                    {a.questions} questions • {a.minutes} min
                  </span>
                </div>

                <h3 className="mt-2 font-orbitron text-base font-bold text-[#1a052e] group-hover:text-[#4c1d70] transition-colors">
                  {a.title}
                </h3>
                <p className="mt-1 font-poppins text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {a.summary}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <div className="text-xs uppercase font-mono font-semibold text-slate-400">Your Best</div>
                  <div className={`text-lg font-bold font-orbitron ${a.bestScore === null ? 'text-slate-400' : 'text-emerald-600'}`}>
                    {a.bestScore === null ? '—' : `${a.bestScore}%`}
                  </div>
                </div>

                <Button
                  variant={a.bestScore === null ? 'primary' : 'secondary'}
                  className="rounded-full px-5 py-2 text-sm font-orbitron font-bold shadow-sm group/btn"
                  onClick={() => handleStartCheck(a)}
                >
                  <span>{a.bestScore === null ? 'Take skill check' : 'Retake'}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Previous Diagnostic History */}
      <section aria-labelledby="past-heading" className="space-y-4 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-purple-100/80">
          <h2 id="past-heading" className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white">
            Previous Diagnostic History
          </h2>
          <span className="text-sm font-mono text-slate-500">
            Past Attempts
          </span>
        </div>

        <div className="divide-y divide-purple-100/70 border-y border-purple-100/70">
          {pastAttempts.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 py-3.5 px-2 hover:bg-purple-50/30 transition-colors">
              <div className="min-w-0">
                <p className="text-base font-semibold text-[#1a052e]">{r.title}</p>
                <p className="text-sm font-mono text-slate-500">
                  {r.date} • {r.missed} question{r.missed === 1 ? '' : 's'} missed
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-lg font-bold text-[#4c1d70]">
                  {r.score}%
                </span>
                <Button variant="ghost" className="rounded-full text-sm font-semibold text-[#4c1d70] hover:bg-purple-50 px-3 py-1">
                  Review
                  <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}