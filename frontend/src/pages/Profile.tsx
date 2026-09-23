import { useState, useEffect } from 'react';
import {
  UserIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  AwardIcon,
  BookOpenIcon,
  ClockIcon,
  FlameIcon,
  FlaskConicalIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ArrowRightIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  SparklesIcon,
  FileCheckIcon,
  SendIcon,
  ExternalLinkIcon,
  BarChart3Icon,
  CheckIcon,
  CopyIcon,
  UsersIcon,
  Edit3Icon,
  RotateCcwIcon,
  SaveIcon,
  XIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusChip } from '../components/ui/StatusChip';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { stateStore, type AppState, type UserRole, type AgeTier } from '../services/stateStore';
import type { ViewId } from '../data/appData';

interface ProfileProps {
  initialRole?: UserRole;
  onNavigate?: (id: ViewId) => void;
}

interface CohortStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ageTier: AgeTier;
  level: number;
  activeChapter: string;
  diagnosticScore: number;
  integrityScore: number;
  milestonesEarned: number;
  status: 'exceeding' | 'on-track' | 'intervention';
  struggleConcept?: string;
}

const COHORT_STUDENTS: CohortStudent[] = [
  {
    id: 'std-1',
    name: 'Manoj Kumar',
    email: 'manoj.quantum@edu.in',
    avatar: 'M',
    ageTier: 'STUDENT',
    level: 3,
    activeChapter: 'Chapter 2: Qubits & Single-Qubit Gates',
    diagnosticScore: 78,
    integrityScore: 98,
    milestonesEarned: 1,
    status: 'on-track'
  },
  {
    id: 'std-2',
    name: 'Priya Sharma',
    email: 'priya.qc@iitb.ac.in',
    avatar: 'P',
    ageTier: 'STUDENT',
    level: 4,
    activeChapter: 'Chapter 3: Quantum Circuits & Entanglement',
    diagnosticScore: 94,
    integrityScore: 99,
    milestonesEarned: 2,
    status: 'exceeding'
  },
  {
    id: 'std-3',
    name: 'Vikram Malhotra',
    email: 'vikram.m@quantum.edu',
    avatar: 'V',
    ageTier: 'STUDENT',
    level: 2,
    activeChapter: 'Chapter 1: Mathematics of Quantum Computing',
    diagnosticScore: 48,
    integrityScore: 89,
    milestonesEarned: 0,
    status: 'intervention',
    struggleConcept: 'measurement_collapse_born'
  },
  {
    id: 'std-4',
    name: 'Aarav Patel',
    email: 'aarav.quantum@academy.org',
    avatar: 'A',
    ageTier: 'STUDENT',
    level: 3,
    activeChapter: 'Chapter 2: Qubits & Single-Qubit Gates',
    diagnosticScore: 82,
    integrityScore: 98,
    milestonesEarned: 1,
    status: 'on-track'
  },
  {
    id: 'std-5',
    name: 'Dr. Rohan Sengupta',
    email: 'rohan.sengupta@res.in',
    avatar: 'R',
    ageTier: 'ADULT',
    level: 2,
    activeChapter: 'Chapter 1: Mathematics of Quantum Computing',
    diagnosticScore: 54,
    integrityScore: 92,
    milestonesEarned: 0,
    status: 'intervention',
    struggleConcept: 'dirac_bra_ket_vectors'
  },
  {
    id: 'std-6',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@tech.edu',
    avatar: 'S',
    ageTier: 'STUDENT',
    level: 3,
    activeChapter: 'Chapter 2: Qubits & Single-Qubit Gates',
    diagnosticScore: 88,
    integrityScore: 97,
    milestonesEarned: 1,
    status: 'on-track'
  }
];

export function Profile({ initialRole, onNavigate }: ProfileProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [activeRole, setActiveRole] = useState<UserRole>(
    initialRole || appState.user.role || 'LEARNER'
  );
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'exceeding' | 'on-track' | 'intervention'>('all');
  const [selectedStudent, setSelectedStudent] = useState<CohortStudent | null>(null);
  const [remediationSent, setRemediationSent] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [institutionInput, setInstitutionInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const user = appState.user;
  const p = appState.progress;

  const handleOpenEdit = () => {
    setNameInput(user.name);
    setEmailInput(user.email);
    setInstitutionInput(user.institution || '');
    setDepartmentInput(user.department || '');
    setGoalInput(user.learningGoal || '');
    setIsEditingUser(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    stateStore.updateUserProfile({
      name: nameInput.trim() || 'Learner',
      email: emailInput.trim() || 'learner@quantum.edu',
      institution: institutionInput.trim(),
      department: departmentInput.trim(),
      learningGoal: goalInput.trim(),
      avatar: (nameInput.trim() || 'L').charAt(0).toUpperCase()
    });
    setIsEditingUser(false);
    setNoticeMessage('User profile details updated successfully.');
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all telemetry, Competency Points, streak, lessons, labs, and milestones to 0 (Clean Slate)?')) {
      stateStore.resetAllProgress();
      setNoticeMessage('All analytics, progress, Competency Points, streak, and milestones reset to clean 0.');
      setTimeout(() => setNoticeMessage(null), 4000);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
    stateStore.setRole(newRole);
  };

  const handleAgeTierChange = (tier: AgeTier) => {
    stateStore.updateUserProfile({ ageTier: tier });
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSendRemediation = (studentId: string, conceptName: string) => {
    setRemediationSent(`Targeted Remediation Module on "${conceptName}" dispatched to student.`);
    setTimeout(() => setRemediationSent(null), 4000);
  };

  // Filter cohort students
  const filteredStudents = COHORT_STUDENTS.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      std.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      std.activeChapter.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || std.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalHours = (p.totalStudyMinutes / 60).toFixed(1);
  const xpTarget = p.currentLevel * 350;
  const xpProgress = Math.min(100, Math.round(((p.totalXP % 350) / 350) * 100));

  return (
    <div className="space-y-8">
      {/* Notice Message Banner */}
      {noticeMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
          <CheckCircle2Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title={activeRole === 'LEARNER' ? 'Learner Competence Profile' : 'Instructor Faculty Panel'}
          subtitle={
            activeRole === 'LEARNER'
              ? 'Personalized academic standing, verifiable credentials, quantum competency vector, and study telemetry.'
              : 'Cohort learning analytics, concept struggle heatmaps, anti-tamper proctoring integrity, and student intervention.'
          }
        />

        {/* Global Persona / Role Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-900 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => handleRoleChange('LEARNER')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeRole === 'LEARNER'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" />
            Learner Profile
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('INSTRUCTOR')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeRole === 'INSTRUCTOR'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <GraduationCapIcon className="h-3.5 w-3.5" />
            Instructor Panel
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. LEARNER PROFILE VIEW */}
      {/* ========================================================================= */}
      {activeRole === 'LEARNER' && (
        <div className="space-y-8">
          {/* Identity & Institution Card */}
          <Card className="p-6 sm:p-8 border-l-4 border-l-emerald-600">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 font-display text-2xl font-bold text-white shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow"
                    title="Active Identity"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      {user.name}
                    </h2>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      Certified Quantum Learner
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      Level {p.currentLevel}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                    {user.email}
                  </p>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 pt-0.5">
                    {user.institution || 'Department of Physics & Quantum Computing, IIT Madras'}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Enrolled since {user.joinedDate || 'August 2026'} · Candidate ID: QBT-2026-IND-04
                  </p>

                  {/* Manual User Detail Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleOpenEdit}
                      className="gap-1.5 text-xs h-7 px-2.5"
                    >
                      <Edit3Icon className="h-3.5 w-3.5" />
                      Edit Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetProgress}
                      className="gap-1.5 text-xs h-7 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <RotateCcwIcon className="h-3.5 w-3.5" />
                      Reset to 0 (Clean Slate)
                    </Button>
                  </div>
                </div>
              </div>

              {/* Age Tier Selector */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-950/60 shrink-0">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Curriculum Tier</span>
                <div className="flex items-center gap-1.5">
                  {(['YOUNG', 'STUDENT', 'ADULT'] as AgeTier[]).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => handleAgeTierChange(tier)}
                      className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
                        user.ageTier === tier
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-200/70 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500">
                  {user.ageTier === 'STUDENT'
                    ? 'Formal linear algebra & Qiskit code'
                    : user.ageTier === 'YOUNG'
                    ? 'Intuitive metaphors & visuals'
                    : 'Mathematical rigor & NISQ hardware'}
                </span>
              </div>
            </div>

            {/* Tier & Competency Points Meter */}
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-baseline justify-between text-xs font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">
                  Tier {p.currentLevel} Competency ({p.totalXP} Total CP)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {p.totalXP % 350} / 350 CP to Tier {p.currentLevel + 1}
                </span>
              </div>
              <ProgressBar value={xpProgress} label="Competency progress" className="mt-2 h-2" />
            </div>
          </Card>

          {/* Primary Learning Goals & Telemetry */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4 text-emerald-600" />
                <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Active Learning Goal
                </h3>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium bg-zinc-50 p-3 rounded-xl border border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
                "{user.learningGoal || 'Master Quantum Information Theory & NISQ Algorithms for Quantum Supremacy Benchmark'}"
              </p>

              <dl className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="rounded-lg bg-zinc-50/80 p-3 dark:bg-zinc-950/60">
                  <dt className="text-zinc-500">Target Cadence</dt>
                  <dd className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">35 min / Day</dd>
                </div>
                <div className="rounded-lg bg-zinc-50/80 p-3 dark:bg-zinc-950/60">
                  <dt className="text-zinc-500">Active Streak</dt>
                  <dd className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {p.streakDays} Days Active
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-emerald-600" />
                <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Academic Telemetry Summary
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950">
                  <div className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {totalHours} hrs
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Time Studied</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950">
                  <div className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {p.completedLabs.length}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Verified Labs</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950">
                  <div className="font-display text-xl font-bold text-blue-600 dark:text-blue-400">
                    {p.diagnosticPlacement ? `${p.diagnosticPlacement.score}%` : 'Pending'}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Diagnostic Score</div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-zinc-500">Need in-depth analytics?</span>
                {onNavigate && (
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('progress')}>
                    Open Telemetry Hub
                    <ArrowRightIcon className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Verifiable Credentials & Digital Passport */}
          <Card className="p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Verifiable Academic Credentials
                </span>
                <h3 className="mt-0.5 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Quantum Skill Passport & Cryptographic Ledger
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {onNavigate && (
                  <Button variant="secondary" size="sm" onClick={() => onNavigate('achievements')}>
                    <AwardIcon className="h-3.5 w-3.5" />
                    All Milestones
                  </Button>
                )}
              </div>
            </div>

            {/* Dynamic Credential Cards */}
            {Object.keys(p.milestoneProofs).length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(p.milestoneProofs).map(([code, proof]) => (
                  <div key={code} className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {proof.milestoneCode}
                        </span>
                      </div>
                      <StatusChip tone="done">Verified</StatusChip>
                    </div>
                    <h4 className="mt-2 font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {proof.title}
                    </h4>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      {proof.evidenceTitle}
                    </p>
                    <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-3 dark:border-emerald-900/40 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                      <span>{proof.verificationHash}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyToken(proof.verificationHash)}
                        className="text-emerald-700 hover:underline dark:text-emerald-400 flex items-center gap-1"
                      >
                        {copiedToken ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  No Verified Credentials Earned Yet
                </h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Complete Chapter 1 theory topics and verify the statevector normalization simulation in AerSimulator to earn your first milestone credential (MS-01).
                </p>
                {onNavigate && (
                  <Button
                    size="sm"
                    onClick={() => {
                      stateStore.setActiveLesson('ch-1', 't1-1');
                      onNavigate('lesson');
                    }}
                  >
                    Start Chapter 1 Now
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Quick Action Navigation Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card
              className="p-5 cursor-pointer hover:border-emerald-500 transition group"
              onClick={() => onNavigate && onNavigate('path')}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600">
                  Curriculum Roadmap
                </span>
                <ArrowRightIcon className="h-4 w-4 text-zinc-400 group-hover:text-emerald-600" />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Follow your adaptive path from Chapter 1 through Capstone algorithms.
              </p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-emerald-500 transition group"
              onClick={() => onNavigate && onNavigate('circuits')}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600">
                  Circuit Studio
                </span>
                <ArrowRightIcon className="h-4 w-4 text-zinc-400 group-hover:text-emerald-600" />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Design and simulate custom multi-qubit unitary circuits in browser.
              </p>
            </Card>

            <Card
              className="p-5 cursor-pointer hover:border-emerald-500 transition group"
              onClick={() => onNavigate && onNavigate('assessments')}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600">
                  Skill Practice
                </span>
                <ArrowRightIcon className="h-4 w-4 text-zinc-400 group-hover:text-emerald-600" />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Attempt adaptive diagnostic assessments and verify calculation fidelity.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INSTRUCTOR FACULTY PANEL VIEW */}
      {/* ========================================================================= */}
      {activeRole === 'INSTRUCTOR' && (
        <div className="space-y-8">
          {/* Notification toast if remediation was dispatched */}
          {remediationSent && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                <span>{remediationSent}</span>
              </div>
              <button
                type="button"
                onClick={() => setRemediationSent(null)}
                className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Faculty Header Card */}
          <Card className="p-6 sm:p-7 border-l-4 border-l-emerald-600 bg-gradient-to-r from-emerald-50/40 via-white to-zinc-50 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-zinc-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    <GraduationCapIcon className="h-3.5 w-3.5" />
                    ACADEMIC FACULTY DIRECTORY
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Cohort: QC-2026-AUTUMN
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Dr. Evelyn Vance & Instructor Manoj Kumar
                </h2>
                <p className="max-w-2xl text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Active monitoring of 248 enrolled quantum computing students across theoretical linear algebra, laboratory circuit simulations, and Bayesian concept retention.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button variant="secondary" size="sm" onClick={() => alert('Cohort audit gradebook exported to CSV.')}>
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Export Gradebook CSV
                </Button>
              </div>
            </div>
          </Card>

          {/* Cohort KPI Grid (Matching backend InstructorOverviewRead) */}
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Total Enrolled Learners
              </dt>
              <dd className="mt-2 font-display text-3xl font-black text-zinc-900 dark:text-zinc-50">
                248
              </dd>
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                100% active this semester
              </p>
            </Card>

            <Card className="p-5">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Cohort Mean Quiz Score
              </dt>
              <dd className="mt-2 font-display text-3xl font-black text-zinc-900 dark:text-zinc-50">
                78.4%
              </dd>
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                +4.2% higher than benchmark
              </p>
            </Card>

            <Card className="p-5">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Verified Labs Executed
              </dt>
              <dd className="mt-2 font-display text-3xl font-black text-zinc-900 dark:text-zinc-50">
                1,420
              </dd>
              <p className="mt-1 text-xs text-purple-600 font-medium">
                AerSimulator statevector checks
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-amber-500">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Learners Needing Intervention
              </dt>
              <dd className="mt-2 font-display text-3xl font-black text-amber-600 dark:text-amber-400">
                14
              </dd>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300 font-medium">
                Struggling with Born rule & phase kickback
              </p>
            </Card>
          </dl>

          {/* Concept Struggle Heatmap (ConceptHeatmapItem from backend) */}
          <Card className="p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Cohort Learning Diagnostics
                </span>
                <h3 className="mt-0.5 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Concept Struggle Heatmap & Retention Analysis
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Telemetry compiled from 1,890 formative quiz checks, adaptive tests, and circuit simulator runs.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
                  Critical (&lt;50%)
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Moderate (50–70%)
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Mastered (&gt;70%)
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  id: 'grover_diffusion_operator',
                  title: 'Grover Diffusion Operator & Inversion',
                  chapter: 'Chapter 4: Algorithms',
                  avgMastery: 39,
                  learnersTested: 98,
                  status: 'critical' as const,
                  issue: 'Learners failing to normalize inversion about the mean matrix 2|s⟩⟨s| - I.'
                },
                {
                  id: 'measurement_collapse_born',
                  title: 'Born Rule Probability & State Collapse',
                  chapter: 'Chapter 1: Mathematics',
                  avgMastery: 46,
                  learnersTested: 182,
                  status: 'critical' as const,
                  issue: 'Misinterpreting probability amplitude α with squared modulus |α|².'
                },
                {
                  id: 'entanglement_monogamy',
                  title: 'Entanglement Monogamy & Bell Inequality',
                  chapter: 'Chapter 3: Circuits',
                  avgMastery: 52,
                  learnersTested: 154,
                  status: 'moderate' as const,
                  issue: 'Confusion over non-locality bounds vs. classical probabilistic mixtures.'
                },
                {
                  id: 'phase_kickback_oracle',
                  title: 'Phase Kickback & Deutsch-Jozsa Oracle',
                  chapter: 'Chapter 4: Algorithms',
                  avgMastery: 58,
                  learnersTested: 120,
                  status: 'moderate' as const,
                  issue: 'Difficulty tracing target register eigenvalue -1 into control qubit phase.'
                },
                {
                  id: 'unitary_invariance_hadamard',
                  title: 'Unitary Transformation & Hadamard Superposition',
                  chapter: 'Chapter 2: Gates',
                  avgMastery: 84,
                  learnersTested: 240,
                  status: 'healthy' as const,
                  issue: 'High retention. 84% passing on first attempt.'
                },
                {
                  id: 'dirac_bra_ket_vectors',
                  title: 'Dirac Bra-Ket Notation & Inner Products',
                  chapter: 'Chapter 1: Mathematics',
                  avgMastery: 91,
                  learnersTested: 248,
                  status: 'healthy' as const,
                  issue: 'Mastered cohort-wide with minimal remediation needed.'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl p-4 border transition ${
                    item.status === 'critical'
                      ? 'border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-950/20'
                      : item.status === 'moderate'
                      ? 'border-amber-200 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-950/20'
                      : 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                        {item.chapter} · {item.learnersTested} tested
                      </span>
                      <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </h4>
                    </div>
                    <span
                      className={`font-mono text-sm font-black ${
                        item.status === 'critical'
                          ? 'text-red-600 dark:text-red-400'
                          : item.status === 'moderate'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {item.avgMastery}%
                    </span>
                  </div>

                  <ProgressBar
                    value={item.avgMastery}
                    label={item.title}
                    className="mt-2.5 h-2"
                  />

                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.issue}
                  </p>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSendRemediation(item.id, item.title)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                    >
                      <SendIcon className="h-3 w-3" />
                      Dispatch Targeted Remediation Lab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Cohort Learner Directory & Real Progress Drilldown */}
          <Card className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Cohort Student Directory & Progress Ledger
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Live monitoring of individual student trajectory, diagnostic integrity, and milestone accomplishments.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    placeholder="Search by student or topic..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="h-9 rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="flex items-center gap-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'intervention', label: 'Needs Intervention' },
                    { id: 'on-track', label: 'On Track' },
                    { id: 'exceeding', label: 'Exceeding' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setStatusFilter(f.id as any)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        statusFilter === f.id
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Tier</th>
                    <th className="py-3 px-4 font-semibold">Active Chapter</th>
                    <th className="py-3 px-4 font-semibold">Diagnostic Score</th>
                    <th className="py-3 px-4 font-semibold">Proctoring Integrity</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            {std.avatar}
                          </span>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">
                              {std.name}
                            </div>
                            <div className="text-[10px] text-zinc-400">{std.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {std.ageTier}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                        {std.activeChapter}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {std.diagnosticScore}%
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                        {std.integrityScore}% Active
                      </td>
                      <td className="py-3 px-4">
                        {std.status === 'exceeding' ? (
                          <StatusChip tone="done">Exceeding</StatusChip>
                        ) : std.status === 'on-track' ? (
                          <StatusChip tone="active">On Track</StatusChip>
                        ) : (
                          <StatusChip tone="caution">Needs Intervention</StatusChip>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedStudent(std)}
                        >
                          Inspect Twin
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Student Digital Twin Drill-Down Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm">
              <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 font-display text-lg font-bold text-white shadow">
                      {selectedStudent.avatar}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-xs text-zinc-500">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    
                  </button>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-zinc-500">Current Chapter</span>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{selectedStudent.activeChapter}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Milestones Achieved</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedStudent.milestonesEarned} Verified
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Diagnostic Score</span>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{selectedStudent.diagnosticScore}%</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Telemetry Integrity</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedStudent.integrityScore}%</p>
                    </div>
                  </div>

                  {selectedStudent.struggleConcept && (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <span className="text-amber-700 dark:text-amber-400 font-semibold">Identified Struggle Concept: </span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">{selectedStudent.struggleConcept}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedStudent(null)}>
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleSendRemediation(selectedStudent.id, selectedStudent.struggleConcept || 'Quantum Foundations');
                      setSelectedStudent(null);
                    }}
                  >
                    <SendIcon className="h-3.5 w-3.5" />
                    Dispatch Remediation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual User Details & Profile Configuration Modal */}
      {isEditingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Edit3Icon className="h-5 w-5 text-emerald-600" />
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Manual User Details & Profile Setup
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingUser(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Manoj Kumar"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. manoj.quantum@edu.in"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                  Academic Institution / Affiliation
                </label>
                <input
                  type="text"
                  value={institutionInput}
                  onChange={(e) => setInstitutionInput(e.target.value)}
                  placeholder="e.g. Department of Physics & Quantum Computing, IIT Madras"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                  Department / Laboratory
                </label>
                <input
                  type="text"
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                  placeholder="e.g. Center for Quantum Information and Computation"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                  Quantum Learning Target / Goal
                </label>
                <textarea
                  rows={2}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g. Master Quantum Information Theory & NISQ Algorithms for Quantum Supremacy Benchmark"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditingUser(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <SaveIcon className="h-3.5 w-3.5" />
                  Save Details
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
