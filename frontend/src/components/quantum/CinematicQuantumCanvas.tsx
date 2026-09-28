import React, { useEffect, useRef, useState } from 'react';
import { 
  BinaryIcon, 
  WavesIcon, 
  CompassIcon, 
  LayersIcon, 
  Share2Icon, 
  CpuIcon, 
  SparklesIcon, 
  ZapIcon,
  PlayIcon,
  RotateCcwIcon,
  MousePointerClickIcon
} from 'lucide-react';

interface StageMeta {
  index: number;
  title: string;
  subtitle: string;
  formula: string;
  desc: string;
  icon: typeof BinaryIcon;
  badge: string;
}

const STAGES: StageMeta[] = [
  {
    index: 0,
    title: 'Classical Computing',
    subtitle: 'Deterministic Bit Grid',
    formula: 'b ∈ {0, 1}',
    desc: 'Information stored in discrete macroscopic states: voltages high or low, deterministic Boolean logic gates. Click anywhere to inject quantum disturbance.',
    icon: BinaryIcon,
    badge: 'Stage 01 • Deterministic',
  },
  {
    index: 1,
    title: 'Quantum Wavefunctions',
    subtitle: 'Probability Amplitudes',
    formula: 'ψ(x, t) = A e^{i(kx - ωt)}',
    desc: 'Matter exhibits wave-particle duality; states are represented as complex amplitude probability waves in Hilbert space.',
    icon: WavesIcon,
    badge: 'Stage 02 • Wave Mechanics',
  },
  {
    index: 2,
    title: 'Single-Qubit State Vectors',
    subtitle: 'Bloch Sphere Geometry',
    formula: '|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩',
    desc: 'Drag with your mouse to rotate the 3D Bloch sphere vector. Observe polar θ and azimuthal φ angles update live.',
    icon: CompassIcon,
    badge: 'Stage 03 • The Qubit (Interactive 3D)',
  },
  {
    index: 3,
    title: 'Superposition & Interference',
    subtitle: 'Hadamard Transformation',
    formula: 'H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩',
    desc: 'Simultaneous co-existence in all basis states; quantum interference selectively cancels error paths and reinforces solutions.',
    icon: LayersIcon,
    badge: 'Stage 04 • Coherence',
  },
  {
    index: 4,
    title: 'Quantum Entanglement',
    subtitle: 'Bell States & Non-Locality',
    formula: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
    desc: 'Maximal correlation across spatial separation: measuring qubit A instantaneously collapses qubit B. Click qubits to pulse resonance.',
    icon: Share2Icon,
    badge: 'Stage 05 • Non-Locality (Interactive)',
  },
  {
    index: 5,
    title: 'Quantum Gate Operations',
    subtitle: 'Unitary Coordinate Rotations',
    formula: 'U† U = I,  U ∈ SU(2ⁿ)',
    desc: 'Click on any quantum gate (H, X, CX, S, T) to fire an active photon beam through the register line.',
    icon: CpuIcon,
    badge: 'Stage 06 • Unitary Logic (Click Gates)',
  },
  {
    index: 6,
    title: 'Quantum Algorithms',
    subtitle: 'Grover Amplitude Amplification',
    formula: 'G = (2|ψ⟩⟨ψ| - I) O',
    desc: 'Targeted phase inversion and inversion about the average amplifying target item probability quadratically faster than classical search.',
    icon: SparklesIcon,
    badge: 'Stage 07 • Quantum Speedup',
  },
  {
    index: 7,
    title: 'Practical Quantum Systems',
    subtitle: 'Qiskit Aer & Real Hardware',
    formula: '⟨M_z⟩ = Tr(ρ σ_z) ± ε',
    desc: 'Click on any measurement histogram bar to trigger a simulated wavefunction collapse with 1024 shots.',
    icon: ZapIcon,
    badge: 'Stage 08 • Realization (Click Bars)',
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export function CinematicQuantumCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [interactiveAngle, setInteractiveAngle] = useState({ pitch: 0.4, yaw: 0 });
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Pointer & Interactive state
  const pointerRef = useRef({
    x: -1000,
    y: -1000,
    isDown: false,
    dragStartX: 0,
    dragStartY: 0,
  });

  const particlesRef = useRef<Particle[]>([]);

  // Animation interpolation state
  const animState = useRef({
    currentProgress: 0,
    targetProgress: 0,
    time: 0,
    rafId: 0,
    activeGateIndex: 0,
    beamOffset: 0,
    isCollapsing: false,
    collapseAlpha: 0,
  });

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (isManualOverride) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScrolled / totalScrollable));
      animState.current.targetProgress = progress;
      setScrollProgress(progress);

      const stage = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
      setActiveStageIdx(stage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isManualOverride]);

  // Jump to specific stage
  const jumpToStage = (idx: number) => {
    setIsManualOverride(true);
    const targetP = (idx + 0.5) / STAGES.length;
    animState.current.targetProgress = targetP;
    setScrollProgress(targetP);
    setActiveStageIdx(idx);

    const el = containerRef.current;
    if (el) {
      const totalScrollable = el.offsetHeight - window.innerHeight;
      const targetScroll = el.offsetTop + targetP * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    // Reset manual override flag after smooth scroll completes
    setTimeout(() => setIsManualOverride(false), 800);
  };

  // Canvas Mouse & Interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointerRef.current.isDown = true;
    pointerRef.current.dragStartX = x;
    pointerRef.current.dragStartY = y;
    pointerRef.current.x = x;
    pointerRef.current.y = y;

    // Spawn 14 quantum particle sparks on click
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        alpha: 1,
        color: i % 2 === 0 ? '#10b981' : '#06b6d4',
      });
    }

    // Trigger state-specific interactions
    const p = animState.current.currentProgress;
    if (p >= 0.65 && p < 0.85) {
      // Cycle active gate in Stage 5/6
      animState.current.activeGateIndex = (animState.current.activeGateIndex + 1) % 6;
      animState.current.beamOffset = 0;
    } else if (p >= 0.85) {
      // Trigger quantum collapse flash in Stage 7
      animState.current.isCollapsing = true;
      animState.current.collapseAlpha = 1;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (pointerRef.current.isDown) {
      const dx = x - pointerRef.current.x;
      const dy = y - pointerRef.current.y;
      setInteractiveAngle((prev) => ({
        pitch: Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev.pitch + dy * 0.01)),
        yaw: prev.yaw + dx * 0.015,
      }));
    }

    pointerRef.current.x = x;
    pointerRef.current.y = y;
  };

  const handlePointerUp = () => {
    pointerRef.current.isDown = false;
  };

  // High-DPI Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const state = animState.current;
      state.time += 0.02;

      // Smooth interpolation for frame transitions
      if (prefersReducedMotion) {
        state.currentProgress = state.targetProgress;
      } else {
        state.currentProgress += (state.targetProgress - state.currentProgress) * 0.1;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const p = state.currentProgress; // 0.0 to 1.0
      const t = state.time;
      const ptr = pointerRef.current;

      // Draw subtle quantum field background grid with interactive pointer warping
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Atmospheric Energy Core
      const coreRadius = Math.min(width, height) * 0.38;
      const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, coreRadius);
      coreGrad.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
      coreGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.09)');
      coreGrad.addColorStop(0.8, 'rgba(139, 92, 246, 0.05)');
      coreGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // ==========================================
      // SECTION RENDERERS BASED ON SCROLL PROGRESS
      // ==========================================

      if (p < 0.18) {
        // --- STAGE 0 & 1: CLASSICAL BITS TO QUANTUM WAVEFUNCTIONS ---
        const blend = p / 0.18; // 0 -> 1
        const cols = 9;
        const rows = 6;
        const spacingX = Math.min(width / (cols + 1), 68);
        const spacingY = Math.min(height / (rows + 1), 52);
        const startX = cx - ((cols - 1) * spacingX) / 2;
        const startY = cy - ((rows - 1) * spacingY) / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const baseX = startX + c * spacingX;
            const baseY = startY + r * spacingY;
            
            // Pointer gravity distortion
            const distToPtr = Math.hypot(baseX - ptr.x, baseY - ptr.y);
            const ptrDistort = Math.max(0, 1 - distToPtr / 160) * 24;

            const waveOffset = Math.sin(t + c * 0.5 + r * 0.4) * 20 * blend + ptrDistort;
            const x = baseX;
            const y = baseY + waveOffset;

            const isBitOne = (c + r) % 2 === 1;
            const alpha = 0.2 + (1 - blend) * 0.6;

            ctx.beginPath();
            ctx.arc(x, y, 4 + blend * 2, 0, Math.PI * 2);
            ctx.fillStyle = isBitOne
              ? `rgba(16, 185, 129, ${alpha})`
              : `rgba(6, 182, 212, ${alpha * 0.7})`;
            ctx.fill();

            if (c < cols - 1) {
              const nextWave = Math.sin(t + (c + 1) * 0.5 + r * 0.4) * 20 * blend;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(startX + (c + 1) * spacingX, baseY + nextWave);
              ctx.strokeStyle = `rgba(148, 163, 184, ${(1 - blend) * 0.15 + blend * 0.05})`;
              ctx.stroke();
            }
          }
        }

        // Draw sine wave packet across center
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const env = Math.exp(-Math.pow((x - cx) / (width * 0.25), 2));
          const waveY = cy + Math.sin((x * 0.04) - t * 2.5) * 44 * env * blend;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.strokeStyle = `rgba(52, 211, 153, ${blend * 0.9})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 14 * blend;
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else if (p < 0.42) {
        // --- STAGE 2: BLOCH SPHERE QUBIT VECTOR (INTERACTIVE 3D ROTATION) ---
        const sphereR = Math.min(width, height) * 0.29;
        const autoTheta = (p - 0.18) / 0.24 * Math.PI;
        const totalYaw = interactiveAngle.yaw + t * 0.8;
        const totalPitch = interactiveAngle.pitch;

        // 3D Projection with interactive mouse drag angles
        const projectSphere = (sx: number, sy: number, sz: number) => {
          const x1 = sx * Math.cos(totalYaw) - sy * Math.sin(totalYaw);
          const y1 = sx * Math.sin(totalYaw) + sy * Math.cos(totalYaw);
          const y2 = y1 * Math.cos(totalPitch) - sz * Math.sin(totalPitch);
          const z2 = y1 * Math.sin(totalPitch) + sz * Math.cos(totalPitch);
          return { px: cx + x1 * sphereR, py: cy - z2 * sphereR };
        };

        // Wireframe Equator
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= 48; i++) {
          const ang = (i / 48) * Math.PI * 2;
          const pt = projectSphere(Math.cos(ang), Math.sin(ang), 0);
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();

        // Meridian
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.beginPath();
        for (let i = 0; i <= 48; i++) {
          const ang = (i / 48) * Math.PI * 2;
          const pt = projectSphere(0, Math.sin(ang), Math.cos(ang));
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();

        // Axes: |0> (up), |1> (down)
        const pole0 = projectSphere(0, 0, 1.25);
        const pole1 = projectSphere(0, 0, -1.25);
        ctx.beginPath();
        ctx.moveTo(pole1.px, pole1.py);
        ctx.lineTo(pole0.px, pole0.py);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = 'bold 12px Sora, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('|0⟩', pole0.px, pole0.py - 10);
        ctx.fillText('|1⟩', pole1.px, pole1.py + 18);

        // Qubit State Vector |ψ>
        const vx = Math.sin(autoTheta) * Math.cos(totalYaw);
        const vy = Math.sin(autoTheta) * Math.sin(totalYaw);
        const vz = Math.cos(autoTheta);
        const tip = projectSphere(vx, vy, vz);

        // Vector line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tip.px, tip.py);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Glowing vector tip with pulse
        ctx.beginPath();
        ctx.arc(tip.px, tip.py, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.fill();

        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#a7f3d0';
        ctx.fillText('|ψ⟩', tip.px + 16, tip.py);

        // Equatorial projection dash
        const projBase = projectSphere(vx, vy, 0);
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.moveTo(tip.px, tip.py);
        ctx.lineTo(projBase.px, projBase.py);
        ctx.moveTo(cx, cy);
        ctx.lineTo(projBase.px, projBase.py);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
        ctx.stroke();
        ctx.setLineDash([]);

      } else if (p < 0.65) {
        // --- STAGE 3 & 4: SUPERPOSITION & BELL ENTANGLEMENT ---
        const spread = Math.min(width * 0.26, 190);
        const q1x = cx - spread;
        const q2x = cx + spread;
        const qy = cy;

        // Draw Entanglement Linkage Bridge (Photonic correlation beam)
        const waveCount = 5;
        ctx.beginPath();
        for (let x = q1x; x <= q2x; x += 4) {
          const normX = (x - q1x) / (q2x - q1x);
          const env = Math.sin(normX * Math.PI);
          const y = qy + Math.sin(normX * Math.PI * waveCount + t * 4) * 24 * env;
          if (x === q1x) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.85)';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Second counter-harmonic photon wave
        ctx.beginPath();
        for (let x = q1x; x <= q2x; x += 4) {
          const normX = (x - q1x) / (q2x - q1x);
          const env = Math.sin(normX * Math.PI);
          const y = qy + Math.cos(normX * Math.PI * waveCount - t * 4) * 24 * env;
          if (x === q1x) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Qubit 1 Orbital Ring & Node
        const q1Pulse = 36 + Math.sin(t * 3) * 3;
        ctx.beginPath();
        ctx.arc(q1x, qy, q1Pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(q1x, qy, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('q[0]', q1x, qy - 48);
        ctx.fillText('(|0⟩+|1⟩)/√2', q1x, qy + 58);

        // Qubit 2 Orbital Ring & Node
        const q2Pulse = 36 + Math.cos(t * 3) * 3;
        ctx.beginPath();
        ctx.arc(q2x, qy, q2Pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(q2x, qy, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillText('q[1]', q2x, qy - 48);
        ctx.fillText('Bell Pair |Φ⁺⟩', q2x, qy + 58);

        // Center Correlation Nexus
        const nexusRadius = 14 + Math.sin(t * 4) * 4;
        ctx.beginPath();
        ctx.arc(cx, cy, nexusRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 25;
        ctx.fill();
        ctx.shadowBlur = 0;

      } else if (p < 0.85) {
        // --- STAGE 5 & 6: QUANTUM GATES & GROVER ALGORITHM ---
        const gatesList = ['H', 'X', 'CX', 'S', 'T', 'Grover'];
        const boxWidth = 58;
        const boxHeight = 58;
        const totalW = (gatesList.length - 1) * 85;
        const startX = cx - totalW / 2;

        // Draw quantum circuit wire lines
        [-32, 32].forEach((offsetY) => {
          ctx.beginPath();
          ctx.moveTo(cx - totalW / 2 - 60, cy + offsetY);
          ctx.lineTo(cx + totalW / 2 + 60, cy + offsetY);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        });

        // Gates placed on wires
        gatesList.forEach((gate, idx) => {
          const gx = startX + idx * 85;
          const gy = cy + (idx % 2 === 0 ? -32 : 32);
          const isTarget = idx === state.activeGateIndex;

          ctx.beginPath();
          ctx.roundRect(gx - boxWidth / 2, gy - boxHeight / 2, boxWidth, boxHeight, 14);
          ctx.fillStyle = isTarget ? '#10b981' : '#18181b';
          ctx.strokeStyle = isTarget ? '#34d399' : '#3f3f46';
          ctx.lineWidth = isTarget ? 3 : 1.5;
          if (isTarget) {
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 22;
          }
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.font = 'bold 16px Sora, sans-serif';
          ctx.fillStyle = isTarget ? '#09090b' : '#f4f4f5';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(gate, gx, gy);

          // CNOT connection vertical line if CX
          if (gate === 'CX') {
            ctx.beginPath();
            ctx.moveTo(gx, cy - 32);
            ctx.lineTo(gx, cy + 32);
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Control dot
            ctx.beginPath();
            ctx.arc(gx, cy - 32, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#8b5cf6';
            ctx.fill();
          }
        });

        // Animated laser beam moving through circuit
        state.beamOffset = (state.beamOffset + 3) % (totalW + 120);
        const beamX = cx - totalW / 2 - 60 + state.beamOffset;
        ctx.beginPath();
        ctx.arc(beamX, cy - 32, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Grover search amplitude amplification peak
        const peakHeight = 85;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fillRect(cx - 28, cy + 85 - peakHeight, 56, peakHeight);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 28, cy + 85 - peakHeight, 56, peakHeight);

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#34d399';
        ctx.textAlign = 'center';
        ctx.fillText(`Target |11⟩ Amp: 96%`, cx, cy + 110);

      } else {
        // --- STAGE 7: PRACTICAL HARDWARE & MEASUREMENT HISTOGRAM ---
        const finalP = (p - 0.85) / 0.15;
        const states = [
          { label: '|00⟩', pct: 49.8 },
          { label: '|01⟩', pct: 0.4 },
          { label: '|10⟩', pct: 0.3 },
          { label: '|11⟩', pct: 49.5 },
        ];

        const barW = 56;
        const maxH = 150;
        const totalGraphW = (states.length - 1) * 90;
        const startX = cx - totalGraphW / 2;

        states.forEach((st, idx) => {
          const bx = startX + idx * 90;
          const h = (st.pct / 50) * maxH * Math.min(1, finalP * 1.2);
          const by = cy + 50 - h;

          // Glowing Column Bar
          const grad = ctx.createLinearGradient(bx, by, bx, cy + 50);
          grad.addColorStop(0, '#34d399');
          grad.addColorStop(1, '#064e3b');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(bx - barW / 2, by, barW, h, [8, 8, 0, 0]);
          ctx.fill();

          // White glowing top cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx - barW / 2, by, barW, 2.5);

          // Percentage readout
          ctx.font = 'bold 13px monospace';
          ctx.fillStyle = '#a7f3d0';
          ctx.textAlign = 'center';
          ctx.fillText(`${st.pct}%`, bx, by - 8);

          // State label
          ctx.fillStyle = '#e4e4e7';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(st.label, bx, cy + 74);
        });

        // Hardware Chip QPU indicator line
        ctx.beginPath();
        ctx.moveTo(cx - 160, cy + 105);
        ctx.lineTo(cx + 160, cy + 105);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 11px Sora, sans-serif';
        ctx.fillStyle = '#a1a1aa';
        ctx.textAlign = 'center';
        ctx.fillText('QISKIT AER SIMULATOR • 1024 SHOTS • 0.02% ERROR RATE', cx, cy + 125);

        // Collapse flash effect
        if (state.collapseAlpha > 0) {
          ctx.fillStyle = `rgba(16, 185, 129, ${state.collapseAlpha * 0.25})`;
          ctx.fillRect(0, 0, width, height);
          state.collapseAlpha -= 0.05;
        }
      }

      // ==========================================
      // RENDER INTERACTIVE PARTICLES
      // ==========================================
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.025;

        if (pt.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Interactive Pointer Glow Follower
      if (ptr.x > 0 && ptr.x < width && ptr.y > 0 && ptr.y < height) {
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
      state.rafId = requestAnimationFrame(render);
    };

    animState.current.rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animState.current.rafId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReducedMotion, interactiveAngle]);

  const currentStage = STAGES[activeStageIdx];
  const IconComp = currentStage.icon;

  return (
    <div ref={containerRef} className="relative w-full h-[450vh]">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-950 flex flex-col items-center justify-center">
        
        {/* Fullscreen HTML5 Interactive Quantum Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing touch-none select-none"
          aria-label="Interactive quantum state transition visualization"
        />

        {/* Subtle Ambient Radial Lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950/70 to-zinc-950" />

        {/* Top Interactive Stage Scrubber Navigation */}
        <div className="absolute top-6 left-4 right-4 z-20 mx-auto max-w-6xl flex flex-col items-center gap-3 pointer-events-auto sm:top-8">
          
          <div className="flex w-full items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-zinc-900/80 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-400">
                {currentStage.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-[11px] font-mono text-zinc-400 backdrop-blur-md">
                <MousePointerClickIcon className="h-3 w-3 text-emerald-400" />
                <span>Click & Drag Canvas</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-3.5 py-1 text-xs font-mono text-zinc-400 backdrop-blur-md">
                <span>Progress:</span>
                <span className="font-bold text-emerald-400">{Math.round(scrollProgress * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Clickable Quick Jump Stage Buttons */}
          <div className="flex w-full items-center gap-1 overflow-x-auto pb-1 scrollbar-none sm:justify-center">
            {STAGES.map((stg, i) => (
              <button
                key={stg.index}
                type="button"
                onClick={() => jumpToStage(i)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
                  activeStageIdx === i
                    ? 'border border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'border border-zinc-800/80 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">0{i + 1}</span>
                <span>{stg.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Pinned Stage Context Card (Bottom Overlay) */}
        <div className="absolute bottom-8 left-4 right-4 z-20 mx-auto max-w-2xl pointer-events-auto sm:bottom-10 sm:left-6 sm:right-6">
          <div className="rounded-3xl border border-zinc-800/90 bg-zinc-900/90 p-6 backdrop-blur-2xl shadow-2xl transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <IconComp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    {currentStage.title}
                  </h3>
                  <p className="text-xs font-medium text-emerald-400/90">{currentStage.subtitle}</p>
                </div>
              </div>

              {/* Mathematical Formula Pill */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-1 font-mono text-xs font-semibold text-zinc-200 shadow-inner">
                {currentStage.formula}
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
              {currentStage.desc}
            </p>

            {/* Stepper Dots & Scrub buttons */}
            <div className="mt-4 flex items-center justify-between pt-2 border-t border-zinc-800/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeStageIdx === 0}
                  onClick={() => jumpToStage(activeStageIdx - 1)}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1.5">
                  {STAGES.map((s, idx) => (
                    <button
                      key={s.index}
                      type="button"
                      onClick={() => jumpToStage(idx)}
                      title={`Jump to ${s.title}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeStageIdx
                          ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : idx < activeStageIdx
                          ? 'w-2 bg-emerald-700'
                          : 'w-2 bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  disabled={activeStageIdx === STAGES.length - 1}
                  onClick={() => jumpToStage(activeStageIdx + 1)}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next Phase →
                </button>
              </div>

              <span className="font-mono text-[11px] text-zinc-500">
                Phase {activeStageIdx + 1} of {STAGES.length}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
