import React, { useState } from 'react';
import { PageMascot } from '../components/quantum/PageMascot';
import { useGenieReveals } from '../components/ui/useGenieMotion';
import {
  CompassIcon,
  GitForkIcon,
  TargetIcon,
  CpuIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PlayIcon,
  LayersIcon,
  AtomIcon,
  ZapIcon,
  FlameIcon,
  ExternalLinkIcon,
  RotateCcwIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  GlobeIcon,
  Building2Icon,
  BookOpenIcon,
  AwardIcon,
  RadioIcon,
  MicroscopeIcon,
  UserIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BentoFeatures } from '../components/quantum/BentoFeatures';
import { LearningPathRoadmap } from '../components/quantum/LearningPathRoadmap';
import { AdvancedQuantumStudio } from '../components/quantum/AdvancedQuantumStudio';
import type { ViewId } from '../data/appData';

type LandingProps = {
  onNavigate: (id: ViewId) => void;
  onOpenAuth: () => void;
};

export function Landing({ onNavigate, onOpenAuth }: LandingProps) {
  const [bktMastery, setBktMastery] = useState(82);
  const revealRef = useGenieReveals();
  const [bktNotice, setBktNotice] = useState<string | null>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState(2); // Next-Gen Security active by default matching fse-computing screenshot

  const featureTabs = [
    {
      id: 'holo',
      title: 'Holographic Data Visualization',
      subtitle: '3D Bloch sphere vector projection & state tomography',
      image: '/fse/tab-img1.png',
      action: () => onNavigate('circuits'),
      badge: '3D Bloch & Unitary Mechanics',
      details: 'Direct single and multi-qubit Bloch sphere rotation, real-time Pauli expectation values, and spherical phase coordinates.'
    },
    {
      id: 'neural',
      title: 'Neural Performance Optimization',
      subtitle: 'Real-time Bayesian Knowledge Tracing & personalized progression',
      image: '/fse/tab-img2.png',
      action: () => onNavigate('progress'),
      badge: 'BKT Engine Latency < 12ms',
      details: 'Continuous mathematical modeling of student skill mastery, slips, and guesses to dynamically optimize learning curves.'
    },
    {
      id: 'security',
      title: 'Next-Gen Security',
      subtitle: 'Schrödinger communication channels & BB84 quantum cryptography',
      image: '/fse/tab-img3.png',
      action: () => onNavigate('circuits'),
      badge: 'Atomic-Scale Cryptography',
      details: 'Pioneering safe atomic-scale quantum communication channels, Bell pair entanglement (|Φ⁺⟩), and quantum key distribution.'
    },
    {
      id: 'darkmatter',
      title: 'Dark Matter Mode',
      subtitle: 'Ion-trap & R-Atom cryogenic packaging with hardware matching generator',
      image: '/fse/tab-img4.png',
      action: () => onNavigate('courses'),
      badge: 'Cryogenic Hardware Physics',
      details: 'Advancing fault-tolerant universal quantum architectures with atomic matching generators and ultra-low decoherence.'
    },
    {
      id: 'grid',
      title: 'Multi-Dimensional Grid System',
      subtitle: 'Scalable unitary quantum gate matrix with Qiskit 1.2+ export',
      image: '/fse/tab-img5.png',
      action: () => onNavigate('circuits'),
      badge: 'Aer Monte Carlo Simulator',
      details: 'Construct and simulate multi-wire circuits with Hadamard, Pauli, Phase, CNOT, and Toffoli gates with live probability collapse.'
    },
    {
      id: 'ai',
      title: 'Visual Quantum Studio',
      subtitle: 'Interactive quantum state analysis & Qiskit code synthesis',
      image: '/fse/tab-img6.png',
      action: () => onNavigate('circuits'),
      badge: 'Interactive Circuit Studio',
      details: 'Interactive quantum state analysis, unitary matrix inspection, and real-time statevector collapse simulations.'
    }
  ];

  const triggerRecalibration = () => {
    setBktMastery((prev) => (prev >= 94 ? 82 : prev + 6));
    setBktNotice('BKT Engine Recalibrated: +6% Latent Knowledge Projection verified!');
    setTimeout(() => setBktNotice(null), 3000);
  };

  const quantumVerticals = [
    {
      title: 'Quantum Computing and ML Vertical',
      icon: CpuIcon,
      tag: 'Computing & Algorithms',
      desc: 'Harness state-of-the-art unitary quantum gates, Qiskit Aer Monte Carlo simulation, and hybrid classical-quantum variational algorithms (VQE / QAOA).',
      highlight: 'Aer Simulator & QASM 2.0 Export',
      action: () => onNavigate('circuits'),
      btnLabel: 'Launch Circuit Studio'
    },
    {
      title: 'Quantum Communication Vertical',
      icon: RadioIcon,
      tag: 'Secure Channels',
      desc: 'Pioneering safe atomic-scale quantum communication channels, Bell pair entanglement distributions (|Φ⁺⟩), and BB84 quantum key distribution.',
      highlight: 'Schrödinger Channel & Bell States',
      action: () => onNavigate('circuits'),
      btnLabel: 'Simulate Entanglement'
    },
    {
      title: 'Quantum System and Sensing Vertical',
      icon: MicroscopeIcon,
      tag: 'Precision Sensing',
      desc: 'Real-time 3D Bloch sphere vector projection, quantum phase estimation, and ultra-high-resolution magnetic field sensing with atom-scale sensitivity.',
      highlight: '3D Bloch Mechanics & Unitary Operators',
      action: () => onNavigate('path'),
      btnLabel: 'Explore Concept Graph'
    },
    {
      title: 'Quantum Material and Device Vertical',
      icon: AtomIcon,
      tag: 'Hardware Physics',
      desc: 'Engineering ion-trap and R-Atom based devices to advance hardware matching generators for fault-tolerant universal quantum architectures.',
      highlight: 'Ion-Trap & R-Atom Architectures',
      action: () => onNavigate('courses'),
      btnLabel: 'View Course Modules'
    }
  ];

  return (
    <div ref={revealRef} className="min-h-screen bg-slate-50 text-zinc-900 selection:bg-[#f5d626] selection:text-zinc-950 overflow-x-hidden font-sans">

      {/* Hero Section (FSE Computing Style) */}
      <section className="relative overflow-hidden bg-zinc-950 min-h-[600px] pt-20 pb-20 sm:pt-28 sm:pb-28 flex items-center justify-center text-center">
        {/* Background Image: Cosmic Starry Nebula from fse-computing */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55"
          style={{ backgroundImage: "url('/fse/slider.jpg')" }}
        />
        {/* Plum Gradient Atmospheric Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0414]/90 via-[#1e0a2e]/75 to-[#0d0414]/95" />

        {/* Radial Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(76,29,112,0.35)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 z-10">

          {/* Government Recognition Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-950/60 backdrop-blur-md px-4 py-1.5 text-sm font-mono font-bold text-[#f5d626] shadow-sm mb-4">
            <span className="flex h-2 w-2 rounded-full bg-[#f5d626] animate-pulse" />
            <span>DPIIT RECOGNIZED • SHAPING AI & QUANTUM COMPUTING</span>
          </div>

          {/* Welcoming Qubot Mascot */}
          <div className="mb-4 flex items-center justify-center">
            <PageMascot
              pose="welcome"
              animation="float"
              size="lg"
              bubblePosition="right"
              speechBubble={{
                title: "QUBOT Companion",
                text: "Hi! Welcome to QuanTech. Ready to explore quantum computing?",
                badge: "AI Companion"
              }}
            />
          </div>

          {/* Futuristic Headline in Orbitron Font */}
          <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.18] uppercase drop-shadow-md">
            Harness the Power of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d626] via-amber-200 to-[#f5d626]">
              Quantum Design
            </span>
          </h1>

          {/* Subtitle in Poppins Font */}
          <p className="font-poppins mx-auto mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-purple-100/90 leading-relaxed font-normal">
            Unlock a new era of possibilities with quantum computing. Egreen Quanta's ecosystem-shaping AI and quantum infrastructure harness the unique capabilities of qubits, superposition, and entanglement for a smarter future.
          </p>

          {/* Pill Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('precision-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full bg-white text-zinc-950 hover:bg-[#f5d626] font-orbitron font-bold text-sm sm:text-base px-8 py-3.5 shadow-[0_4px_25px_rgba(255,255,255,0.25)] transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              Get Started Today
            </button>
            <button
              onClick={() => onNavigate('circuits')}
              className="rounded-full border border-purple-300/40 bg-[#4c1d70]/80 hover:bg-[#4c1d70] text-white font-orbitron font-bold text-sm sm:text-base px-8 py-3.5 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 backdrop-blur-sm"
            >
              <CpuIcon className="h-4 w-4 text-[#f5d626]" />
              <span>LAUNCH QUANTUM LAB</span>
            </button>
            <button
              type="button"
              onClick={onOpenAuth}
              className="genie-control rounded-full px-5 py-3.5 text-base font-semibold text-purple-100 hover:text-[#f5d626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d626]"
            >
              Sign in
            </button>
          </div>

          {/* 3. Floating Frosted Glass Counter & Telemetry Bar (FSE Computing Style) */}
          <div className="relative z-20 mx-auto max-w-5xl mt-14 sm:mt-16">
            <div className="rounded-2xl border border-white/20 bg-zinc-900/80 dark:bg-zinc-950/85 backdrop-blur-xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">

                {/* Metric 1 */}
                <div className="flex items-center gap-4 pt-2 md:pt-0">
                  <div className="font-orbitron text-4xl sm:text-[2.75rem] font-extrabold text-white">
                    5<span className="text-[#f5d626]">+</span>
                  </div>
                  <div className="font-poppins text-sm font-semibold text-purple-200/90 uppercase tracking-wider leading-tight text-left">
                    Qubit Full<br />Simulation
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                  <div className="font-orbitron text-4xl sm:text-[2.75rem] font-extrabold text-white">
                    12<span className="text-[#f5d626]">+</span>
                  </div>
                  <div className="font-poppins text-sm font-semibold text-purple-200/90 uppercase tracking-wider leading-tight text-left">
                    Unitary<br />Quantum Gates
                  </div>
                </div>

                {/* Metric 3: Live BKT Mastery with simulation button */}
                <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                  <div className="font-orbitron text-4xl sm:text-[2.75rem] font-extrabold text-white">
                    {bktMastery}<span className="text-[#f5d626]">%</span>
                  </div>
                  <div className="text-left">
                    <div className="font-poppins text-sm font-semibold text-purple-200/90 uppercase tracking-wider leading-tight">
                      BKT Latent<br />Mastery
                    </div>
                    <button
                      type="button"
                      onClick={triggerRecalibration}
                      className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-[#f5d626] hover:underline"
                    >
                      <RotateCcwIcon className="h-2.5 w-2.5" />
                      <span>Recalibrate</span>
                    </button>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="flex items-center gap-4 pt-4 md:pt-0 md:pl-8">
                  <div className="font-orbitron text-4xl sm:text-[2.75rem] font-extrabold text-white">
                    4<span className="text-[#f5d626]">+</span>
                  </div>
                  <div className="font-poppins text-sm font-semibold text-purple-200/90 uppercase tracking-wider leading-tight text-left">
                    Research<br />Verticals
                  </div>
                </div>

              </div>

              {bktNotice && (
                <p className="mt-3 text-center font-mono text-[13px] font-medium text-emerald-400 animate-fadeIn">
                  {bktNotice}
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 4. "Built with Quantum Precision" Interactive Feature Showcase (FSE Computing Style) */}
      <section id="precision-section" className="py-20 bg-[#0a0512] text-white overflow-hidden relative">
        {/* Subtle grid pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#4c1d70_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">

          {/* Section Header with Explore More Services pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
            <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white">
              Built with{' '}
              <span className="text-[#f5d626] drop-shadow-sm">
                Quantum
              </span>{' '}
              Precision
            </h2>

            <button
              onClick={() => onNavigate('circuits')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-orbitron font-semibold text-white hover:bg-white/15 hover:border-purple-400 transition-all group"
            >
              <span>Explore More Services</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4c1d70] text-white text-xs group-hover:bg-[#f5d626] group-hover:text-zinc-950 transition-colors">
                &gt;
              </span>
            </button>
          </div>

          {/* Interactive Feature Showcase Display Box */}
          <div className="mt-8 rounded-3xl border border-white/15 bg-[#0a0512] overflow-hidden shadow-2xl relative min-h-[560px] flex flex-col lg:flex-row items-stretch">

            {/* Left Hardware Image & Action Pill */}
            <div key={activeFeatureTab} className="genie-content relative lg:w-7/12 min-h-[360px] lg:min-h-full overflow-hidden bg-zinc-950">
              <img
                src={featureTabs[activeFeatureTab].image}
                alt={featureTabs[activeFeatureTab].title}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out transform scale-100 hover:scale-105"
              />
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0512] hidden lg:block" />

              {/* Hardware Caption & Action Button */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full bg-[#4c1d70]/90 border border-[#f5d626]/40 px-3 py-1 font-mono text-[13px] font-bold text-[#f5d626] backdrop-blur-md shadow-md">
                    {featureTabs[activeFeatureTab].badge}
                  </span>
                  <p className="mt-2 text-sm text-zinc-300 font-poppins max-w-sm leading-relaxed">
                    {featureTabs[activeFeatureTab].details}
                  </p>
                </div>

                <button
                  onClick={featureTabs[activeFeatureTab].action}
                  className="rounded-full bg-white text-zinc-950 hover:bg-[#f5d626] px-5 py-2 text-sm font-poppins font-semibold transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                >
                  <span>Launch Module</span>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 text-white text-[11px]">
                    &gt;
                  </span>
                </button>
              </div>
            </div>

            {/* Right Interactive Tab List */}
            <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-center bg-[#0a0512]/95 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="space-y-2">
                {featureTabs.map((tab, idx) => {
                  const isActive = activeFeatureTab === idx;
                  return (
                    <div
                      key={tab.id}
                      onClick={() => setActiveFeatureTab(idx)}
                      onMouseEnter={() => setActiveFeatureTab(idx)}
                      className={`cursor-pointer border-b border-white/10 pb-3 pt-1.5 transition-all duration-200 group ${
                        isActive ? 'border-[#f5d626]' : 'hover:border-white/30'
                      }`}
                    >
                      <div
                        className={`rounded-lg py-2.5 transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-[#4c1d70] px-4 text-white shadow-[0_0_20px_rgba(76,29,112,0.6)] border border-purple-400/40'
                            : 'px-2 text-zinc-300 group-hover:text-white'
                        }`}
                      >
                        <span className={`font-orbitron text-sm sm:text-base font-semibold tracking-wide ${
                          isActive ? 'text-white' : 'text-zinc-300 group-hover:text-[#f5d626]'
                        }`}>
                          {tab.title}
                        </span>

                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-[#f5d626] animate-pulse" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Official Credentials & About Section (FSE Computing About Pattern) */}
      <section id="about-section" className="relative bg-white py-20 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

            {/* Left Column: Narrative & Formal Registration Numbers */}
            <div className="lg:col-span-6 space-y-6">

              <div>
                <h2 className="font-orbitron text-4xl sm:text-[2.75rem] font-extrabold tracking-tight text-[#3b1458]">
                  Egreen <span className="text-[#e2b714]">Quanta</span>
                </h2>
                <div className="mt-3 flex flex-wrap gap-2 text-sm font-mono font-bold text-purple-900">
                  <span className="rounded-md bg-purple-50 border border-purple-200/80 px-2.5 py-1">
                    DPIIT Reg: DIPP95980
                  </span>
                  <span className="rounded-md bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-amber-900">
                    Ringgold ID: 698012
                  </span>
                  <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-zinc-700">
                    ISNI: 0000 0005 1770 5709
                  </span>
                </div>
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-zinc-600 text-justify">
                <strong className="text-zinc-900">Egreen Quanta</strong> is a startup dedicated to promoting quantum technology through collaboration, funding, and support for researchers and industry professionals, with the goal of revolutionising many industries and enhancing societal development through new quantum initiatives.
              </p>

              <p className="text-base sm:text-lg leading-relaxed text-zinc-600 text-justify">
                The startup's mission is to promote multidisciplinary research, facilitate idea interchange, and fund cutting-edge quantum technology research to accelerate improvements in numerous areas and improve everyday life. We use <span className="font-semibold text-zinc-900">ion-trap and R-Atom-based devices</span> to improve the matching generator, thereby contributing to the creation of quantum computers. It has also developed a potential <span className="font-semibold text-zinc-900">quantum Schrödinger channel</span> for safe atomic-scale communication with classical sources.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('courses')}
                  className="rounded-full bg-[#4c1d70] px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow hover:bg-[#391555] transition-all"
                >
                  VIEW MORE IN DETAILS
                </button>
              </div>

            </div>

            {/* Right Column: High-Precision 3D Quantum Processor Hardware Graphic */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative group max-w-md w-full">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#4c1d70] via-[#f5d626] to-[#00b294] opacity-25 blur-xl group-hover:opacity-45 transition duration-500" />
                <div className="relative overflow-hidden rounded-3xl border-2 border-amber-200/60 bg-zinc-900 shadow-2xl">
                  <img
                    src="/home-about.webp"
                    alt="Egreen Quanta Microchip Hardware Graphic"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                    <div className="flex items-center gap-2 text-sm font-mono text-[#f5d626]">
                      <AtomIcon className="h-4 w-4" />
                      <span>R-Atom & Ion-Trap Quantum Substrate</span>
                    </div>
                    <p className="text-sm text-zinc-300 mt-1">High-coherence cryogenic packaging with atomic matching generator</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Official Cosmic Wave Section: Expectations From Government & Research Partners */}
      <section className="relative bg-[#3b1458] text-white overflow-hidden pt-12 pb-16">

        {/* Upper Fluid SVG Wave Divider */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 text-white fill-current">
            <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,0 L0,0 Z"></path>
          </svg>
        </div>

        {/* Floating Constellation / Planet Celestial Art */}
        <div className="pointer-events-none absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15%" cy="30%" r="80" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
            <ellipse cx="15%" cy="30%" rx="120" ry="30" stroke="white" strokeWidth="1" fill="none" transform="rotate(-25 200 200)" />
            <circle cx="85%" cy="70%" r="60" stroke="#f5d626" strokeWidth="1" fill="none" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center pt-8 z-20">

          <h2 className="font-display text-4xl sm:text-[2.75rem] font-bold tracking-tight text-white">
            Expectations From Government
          </h2>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-purple-100/90 max-w-3xl mx-auto text-justify sm:text-center">
            Governments can facilitate collaboration between established businesses, academic institutions, and entrepreneurs in the quantum ecosystem. In order to foster collaboration, facilitate the exchange of knowledge, and transmit technologies, startups anticipate that the government will establish funding programmes, platforms, and initiatives. This can facilitate access to resources, expertise, and prospective commercial partners for startups. Government assistance to businesses can take the form of facilitation of market entry opportunities and commercialization support. Such measures may encompass public procurement programmes, policies that promote the integration of quantum technologies across sectors, and innovation grants to facilitate the adoption of new technologies.
          </p>

          {/* Research Partners Subtitle */}
          <div className="mt-14">
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#f5d626] tracking-wide uppercase">
              Research Partners
            </h3>
            <p className="text-sm text-purple-200 mt-1 uppercase tracking-widest font-mono">
              Academic & Institutional Consortia
            </p>
          </div>

          {/* Partners Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 text-left">

            {/* National Partners Card */}
            <div className="rounded-2xl border border-purple-400/30 bg-purple-950/40 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-[#f5d626] font-bold text-base uppercase tracking-wider">
                <Building2Icon className="h-4 w-4" />
                <span>National Partners</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm sm:text-base text-purple-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0" />
                  <strong>QRACE</strong> — Quantum Research And Centre of Excellence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0" />
                  <strong>CDAC</strong> — Centre for Development of Advanced Computing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0" />
                  <strong>VIT</strong> — Vellore Institute of Technology
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0" />
                  <strong>SRM</strong> — SRM Institute of Science and Technology
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0" />
                  <strong>JNU</strong> — Jawaharlal Nehru University
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0" />
                  <strong>QIS</strong> — Quantum Information Systems
                </li>
              </ul>
            </div>

            {/* International Partners Card */}
            <div className="rounded-2xl border border-purple-400/30 bg-purple-950/40 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-[#f5d626] font-bold text-base uppercase tracking-wider">
                <GlobeIcon className="h-4 w-4" />
                <span>International Partners</span>
              </div>
              <ul className="mt-4 space-y-3 text-sm sm:text-base text-purple-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0 mt-0.5" />
                  <div>
                    <strong>GIT</strong> — Georgia Institute of Technology, USA
                    <span className="block text-sm text-purple-300">Quantum algorithm co-development</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0 mt-0.5" />
                  <div>
                    <strong>PNU</strong> — Pusan National University, South Korea
                    <span className="block text-sm text-purple-300">Quantum optics and state verification</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2Icon className="h-4 w-4 text-[#f5d626] shrink-0 mt-0.5" />
                  <div>
                    <strong>GIST</strong> — Gwangju Institute of Science and Technology, South Korea
                    <span className="block text-sm text-purple-300">Nanophotonics & atomic trap integration</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Lower Fluid SVG Wave Divider */}
        <div className="relative bottom-0 left-0 right-0 overflow-hidden leading-none mt-16 z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 text-slate-50 fill-current">
            <path d="M0,0 C300,90 600,-40 900,60 C1050,110 1150,30 1200,10 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

      </section>

      {/* 5. The 4 Official Quantum Verticals */}
      <section id="verticals-section" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-sm font-bold text-[#4c1d70]">
              <LayersIcon className="h-3.5 w-3.5" />
              <span>Core Technology Verticals</span>
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-[2.75rem] font-extrabold tracking-tight text-[#3b1458]">
              Our Quantum Verticals
            </h2>
            <p className="mt-3 text-zinc-600 text-base sm:text-lg">
              Explore the four core technological pillars powering our active learning platform and simulation infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quantumVerticals.map((vert) => {
              const Icon = vert.icon;
              return (
                <div
                  key={vert.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#4c1d70] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[#4c1d70] group-hover:bg-[#4c1d70] group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="mt-4 inline-block text-[13px] font-mono font-bold uppercase tracking-wider text-amber-600">
                      {vert.tag}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-zinc-900 group-hover:text-[#3b1458] transition-colors">
                      {vert.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">
                      {vert.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="block text-xs font-mono font-bold text-purple-700">
                      {vert.highlight}
                    </span>
                    <button
                      onClick={vert.action}
                      className="mt-3 w-full rounded-xl border border-purple-200 bg-purple-50/70 py-2 text-sm font-bold text-[#4c1d70] hover:bg-[#4c1d70] hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{vert.btnLabel}</span>
                      <ArrowRightIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Interactive Sandboxes: AI Tutor, BKT Calibration, and Gate Inspector */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-sm font-bold text-amber-900">
              <ZapIcon className="h-3.5 w-3.5 text-[#e2b714]" />
              <span>Direct Hands-On Experimentation</span>
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-[2.75rem] font-extrabold tracking-tight text-[#3b1458]">
              Interactive Architecture Sandboxes
            </h2>
            <p className="mt-3 text-zinc-600 text-base sm:text-lg">
              Test every subsystem directly in your browser: calibrate Bayesian Knowledge Tracing, inspect unitary matrices, compose quantum circuits, and take recall quizzes.
            </p>
          </div>

          <BentoFeatures onNavigate={onNavigate} />

        </div>
      </section>

      {/* 7. Curriculum Learning Path Roadmap */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#3b1458]">
              Verified Quantum Curriculum
            </h2>
            <p className="mt-2 text-base text-zinc-600">
              Six foundational milestones engineered from linear algebra to fault-tolerant universal quantum algorithms.
            </p>
          </div>

          <LearningPathRoadmap onNavigate={onNavigate} />
        </div>
      </section>

      {/* 8. Corporate Footer Matching egreenquanta.com */}
      <footer className="border-t border-slate-200 bg-white pt-16 pb-12 text-zinc-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">

            {/* Column 1: Brand & Credentials */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img src="/egreen-logo.png" alt="eGreen Quanta Logo" className="h-10 w-10 object-contain" />
                <div className="font-display text-2xl font-bold">
                  <span className="text-[#3b1458]">Egreen </span>
                  <span className="text-[#e2b714]">Quanta</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500 max-w-sm">
                Egreen Quanta's Ecosystem-Shaping Artificial Intelligence and Quantum Computing for a Smarter Future. To spur innovation and industry revolutions, it uses state-of-the-art technology to its full potential.
              </p>
              <div className="pt-1 text-[13px] font-mono text-purple-900 space-y-0.5">
                <div>DPIIT Registration No.: <strong>DIPP95980</strong></div>
                <div>Ringgold ID: <strong>698012</strong> | ISNI: <strong>0000 0005 1770 5709</strong></div>
              </div>
            </div>

            {/* Column 2: Quantum Verticals */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#3b1458]">
                Quantum Verticals
              </h4>
              <ul className="space-y-1.5 text-sm">
                <li><button onClick={() => onNavigate('circuits')} className="hover:text-[#4c1d70]">Quantum Computing & ML</button></li>
                <li><button onClick={() => onNavigate('circuits')} className="hover:text-[#4c1d70]">Quantum Communication</button></li>
                <li><button onClick={() => onNavigate('path')} className="hover:text-[#4c1d70]">Quantum System & Sensing</button></li>
                <li><button onClick={() => onNavigate('courses')} className="hover:text-[#4c1d70]">Quantum Material & Device</button></li>
              </ul>
            </div>

            {/* Column 3: Important Links */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#3b1458]">
                Platform Links
              </h4>
              <ul className="space-y-1.5 text-sm">
                <li><button onClick={() => onNavigate('dashboard')} className="hover:text-[#4c1d70]">Student Dashboard</button></li>
                <li><button onClick={() => onNavigate('courses')} className="hover:text-[#4c1d70]">Publications</button></li>
                <li><button onClick={() => onNavigate('path')} className="hover:text-[#4c1d70]">Patents</button></li>
                <li><button onClick={() => onNavigate('circuits')} className="hover:text-[#4c1d70]">Speaker Invitations</button></li>
              </ul>
            </div>

            {/* Column 4: Contact & Social */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#3b1458]">
                Contact Info
              </h4>
              <p className="text-sm text-zinc-500">
                Email: contact@egreenquanta.com
              </p>
              <div className="pt-2 flex items-center gap-3 text-sm">
                <a href="https://www.linkedin.com/in/dr-kumar-gautam-66954968/" target="_blank" rel="noreferrer" className="text-[#4c1d70] hover:underline font-bold">
                  LinkedIn
                </a>
                <span>•</span>
                <a href="https://scholar.google.com/citations?user=CacNT18AAAAJ&hl=en" target="_blank" rel="noreferrer" className="text-[#4c1d70] hover:underline font-bold">
                  Scholar
                </a>
                <span>•</span>
                <a href="https://www.facebook.com/egreenquanta2021" target="_blank" rel="noreferrer" className="text-[#4c1d70] hover:underline font-bold">
                  Facebook
                </a>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-400">
            <div>
              © 2026 Egreen Quanta. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4 text-[13px]">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Security Protocols</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Qubot Companion */}

    </div>
  );
}
