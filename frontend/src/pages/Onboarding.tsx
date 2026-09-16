import React, { useState } from 'react';
import { 
  UserIcon, 
  TargetIcon, 
  GraduationCapIcon, 
  SlidersIcon, 
  ClockIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CheckIcon,
  SparklesIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { ViewId } from '../data/appData';

type OnboardingProps = {
  onComplete: () => void;
  onNavigate: (id: ViewId) => void;
};

export function Onboarding({ onComplete, onNavigate }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Alex');
  const [ageCategory, setAgeCategory] = useState<'YOUNG' | 'STUDENT' | 'ADULT'>('STUDENT');
  const [goal, setGoal] = useState('quantum_simulation');
  const [level, setLevel] = useState('beginner');
  const [preference, setPreference] = useState('mixed');
  const [dailyMinutes, setDailyMinutes] = useState(30);

  const steps = [
    { num: 1, title: 'Profile', icon: UserIcon },
    { num: 2, title: 'Goal', icon: TargetIcon },
    { num: 3, title: 'Level', icon: GraduationCapIcon },
    { num: 4, title: 'Style', icon: SlidersIcon },
    { num: 5, title: 'Time', icon: ClockIcon },
  ];

  const handleFinish = () => {
    localStorage.setItem('qubot_onboarding_completed', 'true');
    localStorage.setItem('qubot_learner_name', name);
    onComplete();
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto w-full max-w-xl">
        {/* Stepper Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-display text-xs font-bold text-white">
              QB
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-zinc-300">
              Personalized Setup
            </span>
          </div>
          <span className="text-xs font-medium text-zinc-400">
            Step {step} of 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-1 w-full rounded-full bg-zinc-800">
          <div 
            className="h-1 rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <Card className="border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          {/* Step 1: About You */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Let's personalize your experience</h2>
              <p className="mt-2 text-sm text-zinc-400">Tell us how you'd like to be addressed and your learner tier.</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Your Name or Handle
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Learner Category
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {[
                      { id: 'YOUNG', label: 'School / Young', desc: 'Visual & story-led' },
                      { id: 'STUDENT', label: 'College Student', desc: 'Rigorous math & lab' },
                      { id: 'ADULT', label: 'Professional', desc: 'Code & practical' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAgeCategory(t.id as any)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          ageCategory === t.id
                            ? 'border-emerald-500 bg-emerald-950/30 text-white ring-1 ring-emerald-500'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <p className="text-xs font-semibold text-zinc-200">{t.label}</p>
                        <p className="mt-1 text-[11px] text-zinc-400">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Learning Goal */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white">What is your primary focus?</h2>
              <p className="mt-2 text-sm text-zinc-400">QUBOT will optimize the initial prerequisite tree accordingly.</p>

              <div className="mt-6 space-y-3">
                {[
                  { id: 'quantum_simulation', title: 'Quantum Simulation & Circuits', desc: 'Bloch spheres, phase rotations, and Qiskit circuits.' },
                  { id: 'academic', title: 'College Physics & Linear Algebra', desc: 'Bra-ket vectors, eigen-matrices, and tensor products.' },
                  { id: 'skill_dev', title: 'Quantum Algorithms & Cryptography', desc: 'Shor, Grover, and quantum key distribution protocols.' },
                  { id: 'curiosity', title: 'General Foundation', desc: 'Understanding quantum mechanics from the ground up.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      goal === item.id
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-zinc-400">{item.desc}</p>
                    </div>
                    {goal === item.id && <CheckIcon className="h-4 w-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Experience Level */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white">What is your current background?</h2>
              <p className="mt-2 text-sm text-zinc-400">We will adjust where your learning path begins.</p>

              <div className="mt-6 space-y-3">
                {[
                  { id: 'beginner', title: 'Beginner', desc: 'No prior matrix algebra or quantum computing experience.' },
                  { id: 'intermediate', title: 'Intermediate', desc: 'Familiar with 2D vectors and basic programming.' },
                  { id: 'advanced', title: 'Advanced', desc: 'Comfortable with complex matrices, Dirac notation, and Python.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                      level === item.id
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-zinc-400">{item.desc}</p>
                    </div>
                    {level === item.id && <CheckIcon className="h-4 w-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Learning Preference */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white">How do you learn best?</h2>
              <p className="mt-2 text-sm text-zinc-400">The lesson viewer will emphasize your preferred content type.</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { id: 'visual', title: 'Visual & Interactive', desc: 'Bloch spheres and circuit diagrams' },
                  { id: 'practice', title: 'Practice-First', desc: 'Quizzes and active problem-solving' },
                  { id: 'reading', title: 'Structured Reading', desc: 'Comprehensive text and equations' },
                  { id: 'mixed', title: 'Balanced Mix', desc: 'Optimal blend of all modalities' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreference(item.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      preference === item.id
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Daily Time Availability */}
          {step === 5 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Daily Learning Target</h2>
              <p className="mt-2 text-sm text-zinc-400">Set a realistic pace for your daily plan.</p>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    className={`rounded-xl border p-4 text-center transition-all ${
                      dailyMinutes === mins
                        ? 'border-emerald-500 bg-emerald-950/30 text-white ring-1 ring-emerald-500'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <p className="font-display text-2xl font-bold text-white">{mins}</p>
                    <p className="text-xs text-zinc-400">minutes/day</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <SparklesIcon className="h-4 w-4" />
                  Your Customized Starting Path is Ready
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Based on your preferences, we've loaded the <strong>Quantum Foundations</strong> curriculum with an estimated 3-week completion timeline.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continue
                <ArrowRightIcon className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-500">
                Go to Dashboard
                <ArrowRightIcon className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
