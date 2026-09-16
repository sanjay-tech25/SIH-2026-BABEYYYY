import React from 'react';
import { 
  CompassIcon, 
  GitForkIcon, 
  TargetIcon, 
  CpuIcon, 
  ArrowRightIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  SparklesIcon, 
  ShieldCheckIcon 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { ViewId } from '../data/appData';

type LandingProps = {
  onNavigate: (id: ViewId) => void;
  onOpenAuth: () => void;
};

export function Landing({ onNavigate, onOpenAuth }: LandingProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-display text-sm font-bold text-white shadow-sm">
              QB
            </span>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white">QUBOT</span>
              <span className="ml-2 hidden rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-300 sm:inline-block">
                Adaptive Learning
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Sign in
            </button>
            <Button onClick={() => onNavigate('onboarding')}>
              Start Diagnostic
              <ArrowRightIcon className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Quantum Simulation & AI Foundations
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Learn quantum mechanics through personalized paths.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              QUBOT replaces linear textbooks with an adaptive knowledge graph. It evaluates your current conceptual gaps, recalibrates prerequisites in real-time, and paces your practice.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button onClick={() => onNavigate('onboarding')} className="min-h-[44px] px-6 text-base">
                Take Initial Diagnostic
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <button
                type="button"
                onClick={() => onNavigate('path')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                <GitForkIcon className="h-4 w-4 text-emerald-400" />
                Explore Concept Graph
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                <span>No prior physics required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                <span>Interactive circuit simulation</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Card Preview */}
          <div className="lg:col-span-5">
            <Card className="border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Live Knowledge State
                  </span>
                </div>
                <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-emerald-400">Mastery: 78%</span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-200">Current Focus: Phase Gates</span>
                    <span className="text-emerald-400">Next Recommended</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Target: Master rotations around the Z-axis of the Bloch sphere before two-qubit entanglements.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Prerequisite: Linear Algebra Basics</span>
                    <span className="text-zinc-300">100% Mastered</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Single-Qubit State Vectors</span>
                    <span className="text-zinc-300">85% Complete</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <SparklesIcon className="h-3.5 w-3.5 text-emerald-400" />
                    Adaptive Recalibration Active
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    If you miss 2 matrix calculations, QUBOT automatically injects a 3-minute visual geometry refresher.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-zinc-800/80 bg-zinc-900/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              How the adaptive engine personalizes your curriculum
            </h2>
            <p className="mt-3 text-base text-zinc-400">
              Linear curriculums force everyone through the same pace. QUBOT continuously rebuilds your learning queue.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400">
                <TargetIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">1. Diagnostic Baseline</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                A 5-minute initial assessment maps your exact starting math and computing knowledge, skipping what you already know.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400">
                <GitForkIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">2. Prerequisite Graph</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Every quantum concept depends on specific micro-skills. The system unlocks advanced topics only when fundamentals are solid.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400">
                <CpuIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">3. Active Recall & Simulation</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                You build real quantum circuits and receive targeted practice questions right when your memory retention begins to decay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">
            Designed for every learning tier
          </h2>
          <p className="mt-3 max-w-xl text-base text-zinc-400">
            Language, pace, and depth dynamically adjust based on your chosen learner profile.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Young Learners</span>
              <h4 className="mt-2 font-display text-lg font-semibold text-white">Intuitive & Visual</h4>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Interactive coin-flip analogies, visual Bloch spheres, and bite-sized challenges with supportive feedback.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">College Students</span>
              <h4 className="mt-2 font-display text-lg font-semibold text-white">Rigorous & Mathematical</h4>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Full Dirac bra-ket notation, unitary matrices, state vectors, and rigorous quantum gate calculations.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Working Developers</span>
              <h4 className="mt-2 font-display text-lg font-semibold text-white">Practical & Code-First</h4>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Qiskit circuit syntax, algorithm execution, quantum error mitigation, and quantum key distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-lg font-bold text-white">Ready to begin your personalized path?</p>
            <p className="text-xs text-zinc-400">Configure your goals in 2 minutes and start with your first lesson.</p>
          </div>
          <Button onClick={() => onNavigate('onboarding')} className="min-h-[44px] px-6">
            Get Started Free
            <ArrowRightIcon className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
