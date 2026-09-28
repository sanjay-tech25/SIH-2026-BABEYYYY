import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  BookOpenIcon, 
  PaletteIcon, 
  EyeIcon, 
  CheckIcon,
  SaveIcon,
  CpuIcon,
  Volume2Icon,
  VolumeXIcon,
  SlidersIcon,
  DownloadIcon,
  RotateCcwIcon,
  SparklesIcon,
  ZapIcon,
  LayersIcon,
  RadioIcon,
  GraduationCapIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  MusicIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useGenieMotion } from '../components/ui/useGenieMotion';
import { 
  stateStore, 
  type AppState, 
  type AppSettings, 
  type UserProfile, 
  type AgeTier, 
  type UserRole 
} from '../services/stateStore';
import { audioEngine } from '../services/audioEngine';
import { apiClient } from '../services/apiClient';
import type { ViewId } from '../data/appData';

type SettingsProps = {
  dark: boolean;
  onToggleDark: () => void;
  onNavigate?: (id: ViewId) => void;
};

type SettingsTab = 'account' | 'learning' | 'simulator' | 'appearance' | 'audio' | 'accessibility';

const LEARNING_GOAL_PRESETS = [
  'Master NISQ Algorithms & VQE Optimization',
  'Quantum Cryptography & BB84 Protocol Design',
  'Quantum Machine Learning & Hybrid Quantum-Classical Networks',
  'Fault-Tolerant Quantum Computing & Surface Codes',
  'Quantum Foundations, Superposition & Bra-Ket Linear Algebra'
];

export function Settings({ dark, onToggleDark, onNavigate }: SettingsProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const { preference: reducedMotion, setPreference: setReducedMotion } = useGenieMotion();

  // Local editable form state initialized from stateStore
  const [name, setName] = useState(appState.user.name);
  const [email, setEmail] = useState(appState.user.email);
  const [institution, setInstitution] = useState(appState.user.institution || '');
  const [department, setDepartment] = useState(appState.user.department || '');
  const [learningGoal, setLearningGoal] = useState(appState.user.learningGoal || '');
  const [role, setRole] = useState<UserRole>(appState.user.role);
  const [ageTier, setAgeTier] = useState<AgeTier>(appState.user.ageTier);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    ...appState.settings,
    reducedMotion: reducedMotion
  });

  const [saved, setSaved] = useState(false);
  const [audioTesting, setAudioTesting] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Synchronize with external store changes
  useEffect(() => {
    const unsubscribe = stateStore.subscribe((state) => {
      setAppState(state);
    });
    return unsubscribe;
  }, []);

  // Update reduced motion when setting changes
  useEffect(() => {
    setReducedMotion(settings.reducedMotion);
  }, [settings.reducedMotion, setReducedMotion]);

  const handleSave = () => {
    // 1. Update User Profile in stateStore
    stateStore.updateUserProfile({
      name,
      email,
      institution,
      department,
      learningGoal,
      role,
      ageTier,
      avatar: name.charAt(0).toUpperCase() || 'Q'
    });

    // 2. Update Settings in stateStore
    stateStore.updateSettings(settings);

    // 3. Sync Audio Engine
    if (settings.soundEnabled !== undefined) {
      audioEngine.setMuted(!settings.soundEnabled);
    }

    // 4. Dispatch Telemetry to Backend
    apiClient.sendQubotEvent('SETTINGS_UPDATED', {
      name,
      role,
      ageBracket: ageTier,
      learningGoal
    }).catch(() => {});

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTestAudioChord = () => {
    setAudioTesting(true);
    audioEngine.setMuted(false);
    audioEngine.playSuccessChord();
    setTimeout(() => setAudioTesting(false), 600);
  };

  const handleTestGateClick = () => {
    audioEngine.setMuted(false);
    audioEngine.playGateSnap();
  };

  const handleExportPortfolio = () => {
    const exportData = {
      user: stateStore.getState().user,
      settings: stateStore.getState().settings,
      progress: {
        completedLessons: stateStore.getState().progress.completedLessons,
        completedLabs: stateStore.getState().progress.completedLabs,
        totalXP: stateStore.getState().progress.totalXP,
        totalStudyMinutes: stateStore.getState().progress.totalStudyMinutes,
        milestoneProofs: stateStore.getState().progress.milestoneProofs,
        quizScores: stateStore.getState().progress.quizScores
      },
      exportedAt: new Date().toISOString(),
      platform: 'Egreen Quanta Academic Platform'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `egreen-quanta-portfolio-${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmReset = () => {
    stateStore.resetAllProgress();
    setResetModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="w-full min-w-0 space-y-8 antialiased">
      {/* 1. Header Section */}
      <header className="border-b border-purple-100/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-mono text-slate-500 mb-2">
          <span className="flex items-center gap-2 font-medium tracking-wide uppercase text-[13px] text-[#4c1d70] dark:text-purple-300">
            <span className="h-2 w-2 rounded-full bg-[#f5d626] animate-pulse" />
            Personalized Configuration Engine
          </span>
          <span className="text-xs bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[#4c1d70] dark:text-purple-300 px-3 py-1 rounded-full font-sans font-medium">
            Local Storage Synced
          </span>
        </div>
        <h1 className="font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
          Platform Settings & Personalization
        </h1>
        <p className="mt-2 font-poppins text-base text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Fine-tune your quantum research profile, adaptive learning curriculum, hardware simulation parameters, audio synthesis, and visual accessibility.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2 w-full min-w-0">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 lg:border-r lg:border-purple-100/80 dark:lg:border-zinc-800 lg:pr-8 space-y-2">
          {[
            { id: 'account', label: 'User Profile & Identity', icon: UserIcon },
            { id: 'learning', label: 'Pedagogical & Goals', icon: BookOpenIcon },
            { id: 'simulator', label: 'Quantum Simulator', icon: CpuIcon },
            { id: 'appearance', label: 'Theme & Accents', icon: PaletteIcon },
            { id: 'audio', label: 'Audio & Sound FX', icon: Volume2Icon },
            { id: 'accessibility', label: 'Accessibility & Data', icon: SlidersIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 font-poppins text-sm font-semibold transition-all text-left ${
                  isSelected
                    ? 'bg-[#4c1d70] text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-zinc-800 hover:text-[#4c1d70] dark:hover:text-purple-300'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-[#f5d626]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Quick Stats Pill */}
          <div className="mt-8 rounded-2xl border border-purple-100 dark:border-zinc-800 bg-purple-50/50 dark:bg-zinc-900/60 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4c1d70] dark:text-purple-300 uppercase">
              <ShieldCheckIcon className="h-4 w-4 text-[#f5d626]" />
              Learner Credentials
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Role: <span className="font-semibold text-slate-900 dark:text-white">{role}</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Curriculum: <span className="font-semibold text-slate-900 dark:text-white">{ageTier}</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Framework: <span className="font-semibold uppercase text-slate-900 dark:text-white">{settings.defaultFramework || 'qiskit'}</span>
            </p>
          </div>
        </div>

        {/* Tab Content Panes */}
        <div key={activeTab} className="genie-content lg:col-span-9 w-full min-w-0 space-y-8">

          {/* TAB 1: USER PROFILE & IDENTITY */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-zinc-800 pb-3">
                <h3 className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-[#4c1d70] dark:text-purple-400" />
                  Academic Profile & Quantum Identity
                </h3>
                <span className="text-xs font-mono text-slate-500">Editable Credentials</span>
              </div>

              {/* Avatar Preview & Role Badge */}
              <div className="flex items-center gap-4 rounded-2xl border border-purple-100 dark:border-zinc-800 bg-purple-50/30 dark:bg-zinc-900/40 p-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c1d70] to-[#25093a] text-2xl font-bold font-orbitron text-[#f5d626] shadow-md">
                  {name.charAt(0).toUpperCase() || 'Q'}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                    ✓
                  </span>
                </div>
                <div>
                  <h4 className="font-orbitron text-base font-bold text-[#1a052e] dark:text-white">
                    {name || 'Quantum Researcher'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    {email || 'researcher@academic.edu'}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 text-[11px] font-bold text-[#4c1d70] dark:text-purple-300">
                      <GraduationCapIcon className="h-3 w-3" />
                      {role}
                    </span>
                    <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                      Tier: {ageTier}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    Learner / Researcher Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-purple-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 font-poppins text-sm text-slate-900 dark:text-white focus:border-[#4c1d70] focus:outline-none focus:ring-1 focus:ring-[#4c1d70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    Academic / Contact Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full rounded-xl border border-purple-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 font-poppins text-sm text-slate-900 dark:text-white focus:border-[#4c1d70] focus:outline-none focus:ring-1 focus:ring-[#4c1d70]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    University / Institution / Organization
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Department of Physics, IIT Madras"
                    className="w-full rounded-xl border border-purple-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 font-poppins text-sm text-slate-900 dark:text-white focus:border-[#4c1d70] focus:outline-none focus:ring-1 focus:ring-[#4c1d70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                    Department / Research Lab
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Center for Quantum Information"
                    className="w-full rounded-xl border border-purple-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 font-poppins text-sm text-slate-900 dark:text-white focus:border-[#4c1d70] focus:outline-none focus:ring-1 focus:ring-[#4c1d70]"
                  />
                </div>
              </div>

              {/* Learning Goal Presets */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                  Primary Quantum Specialization Goal
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {LEARNING_GOAL_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLearningGoal(preset)}
                      className={`text-xs rounded-xl px-3 py-1.5 font-medium transition-all text-left ${
                        learningGoal === preset
                          ? 'border border-[#4c1d70] bg-[#4c1d70] text-white shadow-xs'
                          : 'border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-purple-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="Describe your personalized quantum learning objective..."
                  className="w-full rounded-xl border border-purple-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 font-poppins text-sm text-slate-900 dark:text-white focus:border-[#4c1d70] focus:outline-none focus:ring-1 focus:ring-[#4c1d70]"
                />
              </div>

              {/* Platform Role Switcher */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                  Academic Platform Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'LEARNER', label: 'Student / Independent Learner', desc: 'Focus on interactive courses, lab experiments, and assessments' },
                    { id: 'INSTRUCTOR', label: 'Instructor / Quantum Researcher', desc: 'Access to cohort tracking, syllabus exports, and verification metrics' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as UserRole)}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        role === r.id
                          ? 'border-2 border-[#4c1d70] bg-purple-50/50 dark:bg-purple-950/30 shadow-xs'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200'
                      }`}
                    >
                      <p className="font-orbitron text-sm font-bold text-[#1a052e] dark:text-white">{r.label}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PEDAGOGICAL & LEARNING GOALS */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-zinc-800 pb-3">
                <h3 className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-[#4c1d70] dark:text-purple-400" />
                  Pedagogical Track & Learning Mode
                </h3>
                <span className="text-xs font-mono text-slate-500">Adaptive Curriculum Engine</span>
              </div>

              {/* Age Tier / Learning Mode */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                  Adaptive Pedagogy Tier
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: 'YOUNG', title: 'Young Learner', desc: 'Visual analogies, gate games, intuitive physics with zero prerequisites' },
                    { id: 'STUDENT', title: 'College Student', desc: 'Rigorous linear algebra, complex vectors, and unitary quantum circuit math' },
                    { id: 'ADULT', title: 'Quantum Developer', desc: 'Hardware noise models, OpenQASM, and Qiskit Python algorithm synthesis' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setAgeTier(tier.id as AgeTier)}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        ageTier === tier.id
                          ? 'border-2 border-[#4c1d70] bg-purple-50/50 dark:bg-purple-950/30 shadow-xs'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-orbitron text-sm font-bold text-[#1a052e] dark:text-white">{tier.title}</p>
                        {ageTier === tier.id && <CheckIcon className="h-4 w-4 text-[#4c1d70] dark:text-purple-300" />}
                      </div>
                      <p className="mt-2 font-poppins text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{tier.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Quantum SDK */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                  Default Quantum SDK / Code Framework
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'qiskit', name: 'Qiskit 1.2+', sub: 'IBM Quantum' },
                    { id: 'cirq', name: 'Cirq', sub: 'Google Quantum AI' },
                    { id: 'pennylane', name: 'PennyLane', sub: 'Xanadu QML' },
                    { id: 'openqasm', name: 'OpenQASM 3.0', sub: 'Hardware Spec' },
                  ].map((fw) => (
                    <button
                      key={fw.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, defaultFramework: fw.id as any })}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        settings.defaultFramework === fw.id
                          ? 'border-2 border-[#4c1d70] bg-purple-50/60 dark:bg-purple-950/40'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200'
                      }`}
                    >
                      <p className="font-orbitron text-xs font-bold text-slate-900 dark:text-white">{fw.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{fw.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Study Commitment Target */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                  Daily Study Commitment Target
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { min: 15, label: '15 Minutes', badge: 'Sprint' },
                    { min: 25, label: '25 Minutes', badge: 'Pomodoro' },
                    { min: 45, label: '45 Minutes', badge: 'Deep Focus' },
                    { min: 60, label: '60 Minutes', badge: 'Mastery' },
                  ].map((item) => (
                    <button
                      key={item.min}
                      type="button"
                      onClick={() => setSettings({ ...settings, dailyGoalMinutes: item.min })}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        (settings.dailyGoalMinutes || 25) === item.min
                          ? 'border-2 border-[#4c1d70] bg-purple-50/60 dark:bg-purple-950/40'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase font-bold text-[#4c1d70] dark:text-purple-300">
                        {item.badge}
                      </span>
                      <p className="font-orbitron text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {item.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spaced Repetition Frequency & Adaptive Remediation */}
              <div className="space-y-4 pt-2 border-t border-purple-100 dark:border-zinc-800">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Automated Adaptive Remediation
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Automatically schedule visual quantum circuit drills when assessment scores fall below 70%.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Automated Adaptive Remediation"
                    checked={settings.adaptiveRemediation ?? true}
                    onChange={(e) => setSettings({ ...settings, adaptiveRemediation: e.target.checked })}
                    className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Daily Study & Streak Reminders
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Display daily streak tracking notifications to maintain continuous quantum learning momentum.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Daily Study & Streak Reminders"
                    checked={settings.studyReminders ?? true}
                    onChange={(e) => setSettings({ ...settings, studyReminders: e.target.checked })}
                    className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUANTUM SIMULATOR & LAB ENGINE */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-zinc-800 pb-3">
                <h3 className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white flex items-center gap-2">
                  <CpuIcon className="h-5 w-5 text-[#4c1d70] dark:text-purple-400" />
                  Quantum Simulator & Workbench Engine
                </h3>
                <span className="text-xs font-mono text-slate-500">Qiskit Aer Settings</span>
              </div>

              {/* Default Measurement Shot Count */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                  Default Quantum Measurement Shots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { shots: 1024, label: '1,024 Shots', desc: 'Fastest Monte Carlo' },
                    { shots: 2048, label: '2,048 Shots', desc: 'High Fidelity' },
                    { shots: 4096, label: '4,096 Shots', desc: 'Balanced Precision' },
                    { shots: 8192, label: '8,192 Shots', desc: 'Statistical Benchmark' },
                  ].map((s) => (
                    <button
                      key={s.shots}
                      type="button"
                      onClick={() => setSettings({ ...settings, defaultShots: s.shots })}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        (settings.defaultShots || 1024) === s.shots
                          ? 'border-2 border-[#4c1d70] bg-purple-50/60 dark:bg-purple-950/40'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200'
                      }`}
                    >
                      <p className="font-orbitron text-sm font-bold text-slate-900 dark:text-white">{s.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bloch Sphere Fidelity & Options */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                    Bloch Sphere Rendering Quality
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'high', title: 'High (60 FPS)', desc: 'Full WebGL sphere with latitude grid & phase arcs' },
                      { id: 'medium', title: 'Medium', desc: 'Standard 3D vector projection' },
                      { id: 'low', title: 'Performance', desc: 'Lightweight wireframe for lower CPU/GPU' },
                    ].map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setSettings({ ...settings, blochQuality: q.id as any })}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          (settings.blochQuality || 'high') === q.id
                            ? 'border-2 border-[#4c1d70] bg-purple-50/60 dark:bg-purple-950/40'
                            : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200'
                        }`}
                      >
                        <p className="font-orbitron text-xs font-bold text-slate-900 dark:text-white">{q.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">{q.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-slate-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Auto-Rotate Bloch Sphere in 3D Space
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Slowly orbits the statevector camera around the Z-axis when idle for spatial depth.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="Auto-Rotate Bloch Sphere in 3D Space"
                    checked={settings.autoRotateBloch ?? true}
                    onChange={(e) => setSettings({ ...settings, autoRotateBloch: e.target.checked })}
                    className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      NISQ Noise Model Simulation Preview
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Inject simulated $T_1$ relaxation and $T_2$ dephasing decoherence into circuit state collapses.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="NISQ Noise Model Simulation Preview"
                    checked={settings.noiseModel ?? false}
                    onChange={(e) => setSettings({ ...settings, noiseModel: e.target.checked })}
                    className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                  />
                </div>
              </div>

              {/* Quantum State Notation Format */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                  Quantum State Mathematical Display Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'braket', title: 'Dirac Bra-Ket', example: '|ψ⟩ = α|0⟩ + β|1⟩' },
                    { id: 'matrix', title: 'Unitary Matrix', example: '[[α], [β]] vector' },
                    { id: 'amplitudes', title: 'Amplitudes %', example: 'P(|0⟩) + P(|1⟩) = 1.0' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, stateDisplayFormat: fmt.id as any })}
                      className={`rounded-xl border p-3 text-center transition-all ${
                        (settings.stateDisplayFormat || 'braket') === fmt.id
                          ? 'border-2 border-[#4c1d70] bg-purple-50/60 dark:bg-purple-950/40'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-200'
                      }`}
                    >
                      <p className="font-orbitron text-xs font-bold text-slate-900 dark:text-white">{fmt.title}</p>
                      <p className="font-mono text-[11px] text-[#4c1d70] dark:text-purple-300 mt-1 font-semibold">{fmt.example}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: THEME & BRAND ACCENTS */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-zinc-800 pb-3">
                <h3 className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white flex items-center gap-2">
                  <PaletteIcon className="h-5 w-5 text-[#4c1d70] dark:text-purple-400" />
                  Appearance, Theme & Brand Accents
                </h3>
                <span className="text-xs font-mono text-slate-500">Visual Customization</span>
              </div>

              {/* Dark / Light Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-purple-100 dark:border-zinc-800">
                <div>
                  <p className="font-orbitron text-base font-bold text-[#1a052e] dark:text-white">
                    {dark ? 'Dark Mode Active' : 'Light Mode Active'}
                  </p>
                  <p className="font-poppins text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Tailored brand palette featuring royal plum (#4c1d70) and canary gold (#f5d626).
                  </p>
                </div>
                <Button 
                  onClick={onToggleDark} 
                  variant="secondary" 
                  className="rounded-full px-5 py-2 font-orbitron text-xs font-bold shadow-xs hover:border-[#4c1d70]"
                >
                  Switch to {dark ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>

              {/* Accent Color Palette */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                  Custom Platform Accent Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'violet', label: 'Royal Plum', hex: '#4c1d70', desc: 'Official' },
                    { id: 'indigo', label: 'Electric Indigo', hex: '#4338ca', desc: 'Academic' },
                    { id: 'cyan', label: 'Cyan Entangle', hex: '#0891b2', desc: 'Quantum' },
                    { id: 'emerald', label: 'Emerald Matrix', hex: '#059669', desc: 'Clean' },
                    { id: 'amber', label: 'Solar Amber', hex: '#d97706', desc: 'Vibrant' },
                  ].map((color) => {
                    const isSelected = (settings.accentColor || 'violet') === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSettings({ ...settings, accentColor: color.id as any })}
                        className={`rounded-2xl border p-3 text-center transition-all ${
                          isSelected
                            ? 'border-2 border-slate-900 dark:border-white shadow-sm'
                            : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300'
                        }`}
                      >
                        <div 
                          className="h-8 w-8 rounded-full mx-auto shadow-inner flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && '✓'}
                        </div>
                        <p className="font-orbitron text-xs font-bold text-slate-900 dark:text-white mt-2">
                          {color.label}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{color.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* High Contrast Mode & Density */}
              <div className="space-y-4 pt-2 border-t border-purple-100 dark:border-zinc-800">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      High Contrast Mode (WCAG AAA)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Enhances contrast ratios for circuit lines, unitary math matrices, and gate labels.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    aria-label="High Contrast Mode (WCAG AAA)"
                    checked={settings.highContrast ?? false}
                    onChange={(e) => setSettings({ ...settings, highContrast: e.target.checked })}
                    className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Circuit Grid Layout Density
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Toggle between spacious editorial spacing and dense compact laboratory wires.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, gridDensity: 'comfortable' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        (settings.gridDensity || 'comfortable') === 'comfortable'
                          ? 'bg-[#4c1d70] text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      Comfortable
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, gridDensity: 'compact' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        settings.gridDensity === 'compact'
                          ? 'bg-[#4c1d70] text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      Compact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIO & SOUND FX */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-zinc-800 pb-3">
                <h3 className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white flex items-center gap-2">
                  <Volume2Icon className="h-5 w-5 text-[#4c1d70] dark:text-purple-400" />
                  Web Audio Micro-Cues & Auditory Feedback
                </h3>
                <span className="text-xs font-mono text-slate-500">100% In-Browser Synthesized</span>
              </div>

              {/* Sound Enabled Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-purple-100 dark:border-zinc-800">
                <div>
                  <p className="font-orbitron text-base font-bold text-[#1a052e] dark:text-white">
                    Interactive Sound Cues
                  </p>
                  <p className="font-poppins text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Synthesizes harmonic quantum chords on circuit execution and crisp clicks on gate placement.
                  </p>
                </div>
                <input
                  type="checkbox"
                  aria-label="Interactive Sound Cues"
                  checked={settings.soundEnabled ?? true}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setSettings({ ...settings, soundEnabled: nextVal });
                    audioEngine.setMuted(!nextVal);
                  }}
                  className="h-5 w-5 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                />
              </div>

              {/* Master Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Master Synthesizer Volume
                  </label>
                  <span className="font-mono text-xs font-bold text-[#4c1d70] dark:text-purple-300">
                    {settings.audioVolume ?? 80}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audioVolume ?? 80}
                  onChange={(e) => setSettings({ ...settings, audioVolume: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-purple-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#4c1d70]"
                />
              </div>

              {/* Audio Test Triggers */}
              <div className="rounded-2xl border border-purple-100 dark:border-zinc-800 bg-purple-50/40 dark:bg-zinc-900/40 p-5 space-y-3">
                <p className="font-orbitron text-xs font-bold uppercase tracking-wider text-[#4c1d70] dark:text-purple-300">
                  Live Audio Synthesizer Verification
                </p>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Verify browser Web Audio playback directly using these built-in harmonic test cues:
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleTestGateClick}
                    className="inline-flex items-center gap-2 rounded-xl text-xs font-semibold px-4 py-2"
                  >
                    <ZapIcon className="h-3.5 w-3.5 text-amber-500" />
                    Test Gate Click (440-880Hz)
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleTestAudioChord}
                    className="inline-flex items-center gap-2 rounded-xl text-xs font-semibold px-4 py-2 border-[#4c1d70]/40 text-[#4c1d70] dark:text-purple-300"
                  >
                    <MusicIcon className="h-3.5 w-3.5 text-[#4c1d70] dark:text-purple-300" />
                    {audioTesting ? 'Synthesizing...' : 'Test Execution Chord (C5 Major Triad)'}
                  </Button>
                </div>
              </div>

              {/* 40Hz Focus Generator */}
              <div className="flex items-center justify-between py-3 border-t border-purple-100 dark:border-zinc-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    40Hz Gamma Focus Ambient Hum
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Generate subtle binaural focus oscillations for prolonged theoretical quantum problem-solving.
                  </p>
                </div>
                <input
                  type="checkbox"
                  aria-label="40Hz Gamma Focus Ambient Hum"
                  checked={settings.binauralFocus ?? false}
                  onChange={(e) => setSettings({ ...settings, binauralFocus: e.target.checked })}
                  className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                />
              </div>
            </div>
          )}

          {/* TAB 6: ACCESSIBILITY, DATA & PRIVACY */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-zinc-800 pb-3">
                <h3 className="font-orbitron text-lg font-bold text-[#1a052e] dark:text-white flex items-center gap-2">
                  <SlidersIcon className="h-5 w-5 text-[#4c1d70] dark:text-purple-400" />
                  Accessibility, Synchronization & Data Control
                </h3>
                <span className="text-xs font-mono text-slate-500">Security & Backup</span>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between py-4 border-b border-purple-100 dark:border-zinc-800">
                <div>
                  <p className="text-base font-semibold text-[#1a052e] dark:text-white">Reduced Motion</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Minimizes interface animation and disables Genie camera transform transitions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  aria-label="Reduced Motion"
                  checked={settings.reducedMotion}
                  onChange={(e) => setSettings({ ...settings, reducedMotion: e.target.checked })}
                  className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                />
              </div>

              {/* Cloud Synchronization */}
              <div className="flex items-center justify-between py-4 border-b border-purple-100 dark:border-zinc-800">
                <div>
                  <p className="text-base font-semibold text-[#1a052e] dark:text-white">Cloud Sync & Backup</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Continuously synchronizes your course milestones, verified proofs, and badges to the server.
                  </p>
                </div>
                <input
                  type="checkbox"
                  aria-label="Cloud Sync & Backup"
                  checked={settings.cloudSync ?? true}
                  onChange={(e) => setSettings({ ...settings, cloudSync: e.target.checked })}
                  className="h-4 w-4 rounded border-purple-300 text-[#4c1d70] focus:ring-[#4c1d70]"
                />
              </div>

              {/* Export Portfolio */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-purple-100 dark:border-zinc-800">
                <div>
                  <p className="text-base font-semibold text-[#1a052e] dark:text-white">
                    Export Academic Portfolio & Badges
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Download an offline JSON archive of all completed quantum milestones, quiz attempts, and proofs.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleExportPortfolio}
                  className="inline-flex items-center gap-2 rounded-xl text-xs font-bold px-4 py-2 border-purple-200 dark:border-zinc-700"
                >
                  <DownloadIcon className="h-4 w-4 text-[#4c1d70] dark:text-purple-300" />
                  Export Portfolio (.json)
                </Button>
              </div>

              {/* Reset Learning History (Danger Zone) */}
              <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-orbitron text-xs font-bold uppercase tracking-wider">
                  <AlertTriangleIcon className="h-4 w-4 text-rose-600" />
                  Danger Zone: Reset Learning History
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-400">
                  Resetting removes local lesson completions and test attempts, allowing you to restart diagnostic placement and curriculum from zero.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white dark:bg-rose-950 px-3.5 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors shadow-2xs"
                  >
                    <RotateCcwIcon className="h-3.5 w-3.5" />
                    Reset All Progress...
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Save Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between border-t border-purple-100 dark:border-zinc-800 pt-5 gap-4">
            <span className="text-xs text-slate-500 font-mono">
              Auto-persisted to local browser storage
            </span>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono animate-fadeInUp">
                  <CheckIcon className="h-4 w-4" />
                  Preferences Saved & Synced!
                </span>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-[#4c1d70] px-6 py-2.5 text-sm font-orbitron font-bold text-white shadow-md transition hover:bg-[#3b1458] active:scale-95"
              >
                <SaveIcon className="h-4 w-4 text-[#f5d626]" />
                Save Changes
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal for Reset Progress */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60">
                <AlertTriangleIcon className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="font-orbitron text-lg font-bold text-slate-900 dark:text-white">
                Confirm Progress Reset
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to reset all course progress, lab mission records, and quiz scores? This action cannot be undone. Your profile credentials and settings will be preserved.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setResetModalOpen(false)}
                className="rounded-full text-xs px-4 py-2"
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-full bg-rose-600 px-5 py-2 text-xs font-orbitron font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
              >
                Yes, Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
