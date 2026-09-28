import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useGeniePresence } from '../ui/useGenieMotion';
import {
  GlassesIcon,
  VideoIcon,
  VideoOffIcon,
  Rotate3dIcon,
  Volume2Icon,
  VolumeXIcon,
  Maximize2Icon,
  Minimize2Icon,
  SparklesIcon,
  ZapIcon,
  XIcon,
  RefreshCwIcon,
  RadioIcon,
  ActivityIcon,
  AtomIcon,
  SunIcon,
  MoonIcon
} from 'lucide-react';

export interface ARVRVector {
  qubit_index: number;
  x: number;
  y: number;
  z: number;
  label?: string;
  color?: string;
}

interface ARVRQuantumViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialVectors?: ARVRVector[];
  numQubits?: number;
}

type SpatialMode = 'ar' | 'vr' | 'stereo';

const QUBIT_PALETTE_LIGHT = ['#059669', '#d97706', '#7c3aed', '#0284c7', '#db2777'];
const QUBIT_PALETTE_DARK = ['#10b981', '#f5d626', '#a855f7', '#06b6d4', '#ec4899'];

// Pre-defined Unitary Transformation Matrices
const UNITARY_MATRICES: Record<string, { name: string; m00: string; m01: string; m10: string; m11: string }> = {
  H: { name: 'Hadamard (H)', m00: '1/√2', m01: '1/√2', m10: '1/√2', m11: '-1/√2' },
  X: { name: 'Pauli-X (NOT)', m00: '0', m01: '1', m10: '1', m11: '0' },
  Y: { name: 'Pauli-Y', m00: '0', m01: '-i', m10: 'i', m11: '0' },
  Z: { name: 'Pauli-Z (Phase)', m00: '1', m01: '0', m10: '0', m11: '-1' },
  S: { name: 'Phase S (√Z)', m00: '1', m01: '0', m10: '0', m11: 'i' },
  T: { name: 'Phase T (π/8)', m00: '1', m01: '0', m10: '0', m11: 'e^(iπ/4)' },
  RY: { name: 'Rotation-Y (π/2)', m00: 'cos(π/4)', m01: '-sin(π/4)', m10: 'sin(π/4)', m11: 'cos(π/4)' },
  RESET: { name: 'Ground Projector', m00: '1', m01: '0', m10: '0', m11: '0' },
};

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  alpha: number;
  colorLight: string;
  colorDark: string;
}

interface Shockwave {
  id: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface SlerpTransition {
  active: boolean;
  startX: number;
  startY: number;
  startZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  startTime: number;
  duration: number;
  trail: Array<{ x: number; y: number; z: number }>;
}

export function ARVRQuantumViewer({
  isOpen,
  onClose,
  initialVectors = [],
  numQubits = 2,
}: ARVRQuantumViewerProps) {
  const [mode, setMode] = useState<SpatialMode>('ar');
  const [isLightLab, setIsLightLab] = useState(true); // Default to Light Theme as requested
  const [cameraActive, setCameraActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedQubit, setSelectedQubit] = useState(0);

  // 3D Gyroscopic Rotation
  const [pitch, setPitch] = useState(0.28);
  const [yaw, setYaw] = useState(0.72);
  const [roll] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  // Dynamic Quantum State Vectors
  const [vectors, setVectors] = useState<ARVRVector[]>(() => {
    if (initialVectors && initialVectors.length > 0) return initialVectors;
    return Array.from({ length: Math.max(1, numQubits) }).map((_, i) => ({
      qubit_index: i,
      x: i === 0 ? 0 : 0.707,
      y: 0,
      z: i === 0 ? 1 : 0.707,
      label: `q[${i}]`,
      color: isLightLab ? QUBIT_PALETTE_LIGHT[i % QUBIT_PALETTE_LIGHT.length] : QUBIT_PALETTE_DARK[i % QUBIT_PALETTE_DARK.length],
    }));
  });

  // Active Unitary & Injected Gate Feedback
  const [activeGate, setActiveGate] = useState<string>('H');
  const [gateFlash, setGateFlash] = useState<string | null>(null);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);

  // Mouse Raycast Target Surface Reticle
  const [mouseRay, setMouseRay] = useState<{ x: number; y: number; onSphere: boolean; theta: number; phi: number } | null>(null);

  // Refs for Canvases and Media
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRightRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Background Quantum Particles (140 3D fluctuations)
  const particlesRef = useRef<Particle3D[]>([]);

  // Slerp Transition Ref
  const slerpRef = useRef<SlerpTransition>({
    active: false,
    startX: 0,
    startY: 0,
    startZ: 1,
    targetX: 0,
    targetY: 0,
    targetZ: 1,
    startTime: 0,
    duration: 600,
    trail: [],
  });

  // Initialize Particles with dual palette for Light / Dark
  useEffect(() => {
    const pts: Particle3D[] = [];
    const colorsLight = ['#4c1d70', '#7c3aed', '#0284c7', '#059669', '#db2777', '#d97706'];
    const colorsDark = ['#f5d626', '#c084fc', '#38bdf8', '#10b981', '#f43f5e', '#a855f7'];
    for (let i = 0; i < 140; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 800,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.25,
        colorLight: colorsLight[i % colorsLight.length],
        colorDark: colorsDark[i % colorsDark.length],
      });
    }
    particlesRef.current = pts;
  }, []);

  // Sync Vectors if initialVectors update
  useEffect(() => {
    if (initialVectors && initialVectors.length > 0) {
      setVectors(initialVectors);
    }
  }, [initialVectors]);

  // Handle Keyboard Shortcuts for Quick Gate Injections (1-8)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') injectGate('H');
      else if (e.key === '2') injectGate('X');
      else if (e.key === '3') injectGate('Y');
      else if (e.key === '4') injectGate('Z');
      else if (e.key === '5') injectGate('S');
      else if (e.key === '6') injectGate('T');
      else if (e.key === '7') injectGate('RY');
      else if (e.key === '8' || e.key === '0') injectGate('RESET');
      else if (e.key === 'Escape') onClose();
      else if (e.key === ' ') setIsAutoRotate((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedQubit, vectors]);

  // Web Audio Harmonic Polyphonic Synthesizer
  const playHarmonicSound = useCallback(
    (freqBase: number, type: OscillatorType = 'sine', pan = 0) => {
      if (!audioEnabled) return;
      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (panner) panner.pan.setValueAtTime(pan, now);

        // Sub oscillator
        const oscSub = ctx.createOscillator();
        const gainSub = ctx.createGain();
        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(freqBase / 2, now);
        gainSub.gain.setValueAtTime(0.08, now);
        gainSub.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        // Main Harmonic Oscillator
        const oscMain = ctx.createOscillator();
        const gainMain = ctx.createGain();
        oscMain.type = type;
        oscMain.frequency.setValueAtTime(freqBase, now);
        oscMain.frequency.exponentialRampToValueAtTime(freqBase * 1.5, now + 0.18);
        gainMain.gain.setValueAtTime(0.12, now);
        gainMain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        // Resonant lowpass filter sweep
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);
        filter.frequency.exponentialRampToValueAtTime(450, now + 0.35);

        oscSub.connect(gainSub);
        oscMain.connect(gainMain);

        gainSub.connect(filter);
        gainMain.connect(filter);

        if (panner) {
          filter.connect(panner);
          panner.connect(ctx.destination);
        } else {
          filter.connect(ctx.destination);
        }

        oscSub.start(now);
        oscMain.start(now);
        oscSub.stop(now + 0.36);
        oscMain.stop(now + 0.3);
      } catch {
        // Audio policy or unsupported
      }
    },
    [audioEnabled]
  );

  // Web AR Camera Feed Toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err) {
        console.warn('Camera access denied or unavailable in this environment, falling back to simulated AR grid.');
        setCameraActive(false);
      }
    }
  };

  // Turn off camera when closed or unmounted
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // In-VR Spatial Gate Injection with Geodesic Slerp & Shockwave Trigger
  const injectGate = (gateType: 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'RY' | 'RESET') => {
    setActiveGate(gateType);
    setGateFlash(gateType);
    setTimeout(() => setGateFlash(null), 1200);

    const targetIdx = selectedQubit;
    const current = vectors[targetIdx] || { x: 0, y: 0, z: 1 };
    let tx = current.x;
    let ty = current.y;
    let tz = current.z;

    let soundFreq = 520;
    if (gateType === 'H') {
      soundFreq = 587.33; // D5
      tx = current.z;
      ty = 0;
      tz = current.x;
    } else if (gateType === 'X') {
      soundFreq = 440.0; // A4
      tx = current.x;
      ty = -current.y;
      tz = -current.z;
    } else if (gateType === 'Y') {
      soundFreq = 493.88; // B4
      tx = -current.x;
      ty = current.y;
      tz = -current.z;
    } else if (gateType === 'Z') {
      soundFreq = 659.25; // E5
      tx = -current.x;
      ty = -current.y;
      tz = current.z;
    } else if (gateType === 'S') {
      soundFreq = 698.46; // F5
      tx = -current.y;
      ty = current.x;
      tz = current.z;
    } else if (gateType === 'T') {
      soundFreq = 783.99; // G5
      const cos45 = Math.SQRT1_2;
      tx = current.x * cos45 - current.y * cos45;
      ty = current.x * cos45 + current.y * cos45;
      tz = current.z;
    } else if (gateType === 'RY') {
      soundFreq = 880.0; // A5
      const cosTheta = Math.SQRT1_2;
      const sinTheta = Math.SQRT1_2;
      tx = current.x * cosTheta + current.z * sinTheta;
      ty = current.y;
      tz = -current.x * sinTheta + current.z * cosTheta;
    } else if (gateType === 'RESET') {
      soundFreq = 392.0; // G4
      tx = 0;
      ty = 0;
      tz = 1;
    }

    // Normalize target unit vector
    const norm = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
    tx /= norm;
    ty /= norm;
    tz /= norm;

    // Start Geodesic Slerp Transition
    slerpRef.current = {
      active: true,
      startX: current.x,
      startY: current.y,
      startZ: current.z,
      targetX: tx,
      targetY: ty,
      targetZ: tz,
      startTime: performance.now(),
      duration: 550,
      trail: [{ x: current.x, y: current.y, z: current.z }],
    };

    // Play Audio Feedback
    playHarmonicSound(soundFreq, 'sine', (targetIdx % 2 === 0 ? -0.2 : 0.2));

    // Spawn expanding shockwave
    setShockwaves((prev) => [
      ...prev.slice(-4),
      {
        id: Date.now() + Math.random(),
        radius: 18,
        maxRadius: 280,
        alpha: 0.95,
        color: isLightLab
          ? (gateType === 'H' ? '#4c1d70' : gateType === 'X' ? '#db2777' : '#0284c7')
          : (gateType === 'H' ? '#f5d626' : gateType === 'X' ? '#ec4899' : '#06b6d4'),
      },
    ]);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setFullscreen(false);
    }
  };

  // Interactive Mouse Drag & Raycast Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      setLastMouse({ x: e.clientX, y: e.clientY });
      setPitch((prev) => Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev + dy * 0.007)));
      setYaw((prev) => prev + dx * 0.007);
    }

    // 3D Surface Raycasting
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const R = Math.min(rect.width, rect.height) * 0.32;

      const dx = (mx - cx) / R;
      const dy = -(my - cy) / R;
      const distSq = dx * dx + dy * dy;

      if (distSq <= 1.0) {
        const dz = Math.sqrt(Math.max(0, 1 - distSq));
        // Un-rotate by pitch and yaw to get sphere spherical angles
        const cosP = Math.cos(-pitch);
        const sinP = Math.sin(-pitch);
        const cosY = Math.cos(-yaw);
        const sinY = Math.sin(-yaw);

        // Inverse pitch about X
        const y1 = dy * cosP - dz * sinP;
        const z1 = dy * sinP + dz * cosP;
        const x1 = dx;

        // Inverse yaw about Z
        const x2 = x1 * cosY - y1 * sinY;
        const y2 = x1 * sinY + y1 * cosY;
        const z2 = z1;

        const theta = Math.acos(Math.max(-1, Math.min(1, z2)));
        const phi = Math.atan2(y2, x2);

        setMouseRay({
          x: mx,
          y: my,
          onSphere: true,
          theta: Math.round((theta * 180) / Math.PI),
          phi: Math.round(((phi >= 0 ? phi : phi + Math.PI * 2) * 180) / Math.PI),
        });
      } else {
        setMouseRay(null);
      }
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Core 3D Hologram Spatial Rendering Function
  const render3DHologramFrame = (
    canvas: HTMLCanvasElement,
    eyeOffset = 0,
    width: number,
    height: number,
    timeMs: number
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2 + eyeOffset;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.32;

    const currentYaw = yaw + (eyeOffset ? (eyeOffset > 0 ? 0.025 : -0.025) : 0);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const cosYaw = Math.cos(currentYaw);
    const sinYaw = Math.sin(currentYaw);

    const project3D = (x: number, y: number, z: number) => {
      // 1. Yaw about Z
      const x1 = x * cosYaw - y * sinYaw;
      const y1 = x * sinYaw + y * cosYaw;
      const z1 = z;

      // 2. Pitch about X
      const y2 = y1 * cosPitch - z1 * sinPitch;
      const z2 = y1 * sinPitch + z1 * cosPitch;
      const x2 = x1;

      // 3. Perspective Projection
      const fov = 480;
      const scale = fov / (fov + y2);

      return {
        px: cx + x2 * R * scale,
        py: cy - z2 * R * scale,
        depth: y2,
      };
    };

    // 1. Cosmic Atmosphere Gradient (Light Optics Lab vs Dark Void)
    const gradBg = ctx.createRadialGradient(cx, cy, R * 0.15, cx, cy, R * 2.2);
    if (isLightLab) {
      if (mode === 'vr') {
        gradBg.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        gradBg.addColorStop(0.4, 'rgba(248, 244, 254, 0.98)');
        gradBg.addColorStop(0.85, 'rgba(240, 232, 252, 0.98)');
        gradBg.addColorStop(1, 'rgba(228, 218, 246, 1.0)');
      } else if (mode === 'stereo') {
        gradBg.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
        gradBg.addColorStop(1, 'rgba(238, 230, 250, 0.98)');
      } else {
        gradBg.addColorStop(0, cameraActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.94)');
        gradBg.addColorStop(1, cameraActive ? 'rgba(238, 230, 250, 0.55)' : 'rgba(235, 225, 250, 0.98)');
      }
    } else {
      if (mode === 'vr') {
        gradBg.addColorStop(0, 'rgba(46, 16, 75, 0.45)');
        gradBg.addColorStop(0.5, 'rgba(18, 5, 32, 0.82)');
        gradBg.addColorStop(1, 'rgba(6, 2, 12, 0.98)');
      } else if (mode === 'stereo') {
        gradBg.addColorStop(0, 'rgba(38, 12, 60, 0.4)');
        gradBg.addColorStop(1, 'rgba(6, 2, 12, 0.98)');
      } else {
        gradBg.addColorStop(0, cameraActive ? 'rgba(25, 8, 40, 0.2)' : 'rgba(38, 12, 60, 0.4)');
        gradBg.addColorStop(1, cameraActive ? 'rgba(6, 2, 12, 0.55)' : 'rgba(6, 2, 12, 0.95)');
      }
    }
    ctx.fillStyle = gradBg;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw 3D Quantum Vacuum Particles (Starfield)
    particlesRef.current.forEach((p) => {
      // Update drift
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      if (p.x > 400) p.x = -400;
      if (p.x < -400) p.x = 400;
      if (p.y > 400) p.y = -400;
      if (p.y < -400) p.y = 400;
      if (p.z > 400) p.z = -400;
      if (p.z < -400) p.z = 400;

      // Project particle
      const pRot = project3D(p.x / R, p.y / R, p.z / R);
      const pulse = Math.sin(timeMs / 400 + p.x) * 0.2 + 0.8;
      ctx.beginPath();
      ctx.arc(pRot.px, pRot.py, Math.max(0.6, p.radius * pulse), 0, Math.PI * 2);
      ctx.fillStyle = isLightLab ? p.colorLight : p.colorDark;
      ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha * pulse));
      ctx.shadowColor = isLightLab ? p.colorLight : p.colorDark;
      ctx.shadowBlur = isLightLab ? 3 : 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
    });

    // 3. Outer Concentric Coordinate Radar Rings
    ctx.save();
    ctx.strokeStyle = isLightLab
      ? 'rgba(76, 29, 112, 0.12)'
      : mode === 'ar'
      ? 'rgba(245, 214, 38, 0.16)'
      : 'rgba(168, 85, 247, 0.22)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    for (let rRing = R * 0.4; rRing <= R * 1.45; rRing += R * 0.35) {
      ctx.beginPath();
      ctx.arc(cx, cy, rRing, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    // 4. Draw 3D Sphere Wireframe Latitudes (with glowing equator)
    const latitudes = [-0.7, -0.35, 0, 0.35, 0.7];
    latitudes.forEach((zVal) => {
      ctx.beginPath();
      const rRing = Math.sqrt(Math.max(0, 1 - zVal * zVal));
      const steps = 64;
      for (let i = 0; i <= steps; i++) {
        const phi = (i / steps) * Math.PI * 2;
        const pt = project3D(rRing * Math.cos(phi), rRing * Math.sin(phi), zVal);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      if (zVal === 0) {
        // Equator: Radiant Royal Plum & Gold in Light Mode / Canary Gold in Dark Mode
        ctx.strokeStyle = isLightLab ? '#4c1d70' : '#f5d626';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = isLightLab ? '#4c1d70' : '#f5d626';
        ctx.shadowBlur = isLightLab ? 8 : 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = isLightLab ? 'rgba(76, 29, 112, 0.22)' : 'rgba(192, 132, 252, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // 5. Draw 3D Sphere Longitude Meridians
    const longitudes = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
    longitudes.forEach((phi) => {
      ctx.beginPath();
      const steps = 64;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(theta);
        const pt = project3D(x, y, z);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.strokeStyle = isLightLab ? 'rgba(124, 58, 237, 0.20)' : 'rgba(168, 85, 247, 0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 6. Draw Cartesian Axes (X, Y, Z) with Glowing Coordinate End-Caps
    const axes = isLightLab
      ? [
          { name: '+X |+⟩', x: 1.25, y: 0, z: 0, color: '#c026d3' },
          { name: '+Y |+i⟩', x: 0, y: 1.25, z: 0, color: '#0284c7' },
          { name: '+Z |0⟩', x: 0, y: 0, z: 1.25, color: '#4c1d70' },
          { name: '-Z |1⟩', x: 0, y: 0, z: -1.25, color: '#7c3aed' },
        ]
      : [
          { name: '+X |+⟩', x: 1.25, y: 0, z: 0, color: '#ec4899' },
          { name: '+Y |+i⟩', x: 0, y: 1.25, z: 0, color: '#06b6d4' },
          { name: '+Z |0⟩', x: 0, y: 0, z: 1.25, color: '#f5d626' },
          { name: '-Z |1⟩', x: 0, y: 0, z: -1.25, color: '#8b5cf6' },
        ];

    axes.forEach((axis) => {
      const p0 = project3D(0, 0, 0);
      const p1 = project3D(axis.x, axis.y, axis.z);

      ctx.beginPath();
      ctx.moveTo(p0.px, p0.py);
      ctx.lineTo(p1.px, p1.py);
      ctx.strokeStyle = axis.color;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Glowing axis tip dot
      ctx.beginPath();
      ctx.arc(p1.px, p1.py, 4, 0, Math.PI * 2);
      ctx.fillStyle = axis.color;
      ctx.shadowColor = axis.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Axis Label
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = axis.color;
      ctx.fillText(axis.name, p1.px + 6, p1.py + 4);
    });

    // 7. Multi-Qubit Entanglement Energy Tendrils
    if (vectors.length >= 2) {
      const v0 = vectors[0];
      const v1 = vectors[1];
      const p0 = project3D(v0.x, v0.y, v0.z);
      const p1 = project3D(v1.x, v1.y, v1.z);

      ctx.save();
      ctx.beginPath();
      const segments = 16;
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const curX = p0.px + (p1.px - p0.px) * t;
        const curY = p0.py + (p1.py - p0.py) * t;
        const envelope = 1 - 4 * (t - 0.5) * (t - 0.5); // parabolic peak in middle
        const wiggle = Math.sin(timeMs / 70 + s * 1.5) * 6 * envelope;
        if (s === 0) ctx.moveTo(curX, curY + wiggle);
        else ctx.lineTo(curX, curY + wiggle);
      }
      ctx.strokeStyle = isLightLab ? '#0284c7' : '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = isLightLab ? '#0284c7' : '#06b6d4';
      ctx.shadowBlur = isLightLab ? 8 : 14;
      ctx.stroke();
      ctx.restore();
    }

    // 8. Slerp Geodesic Comet Trail Arc
    if (slerpRef.current.active && slerpRef.current.trail.length > 1) {
      ctx.save();
      const trail = slerpRef.current.trail;
      for (let i = 1; i < trail.length; i++) {
        const ptA = project3D(trail[i - 1].x, trail[i - 1].y, trail[i - 1].z);
        const ptB = project3D(trail[i].x, trail[i].y, trail[i].z);
        const alpha = (i / trail.length) * 0.9;
        ctx.beginPath();
        ctx.moveTo(ptA.px, ptA.py);
        ctx.lineTo(ptB.px, ptB.py);
        ctx.strokeStyle = isLightLab
          ? `rgba(76, 29, 112, ${alpha})`
          : `rgba(245, 214, 38, ${alpha})`;
        ctx.lineWidth = 1 + (i / trail.length) * 3.5;
        ctx.shadowColor = isLightLab ? '#4c1d70' : '#f5d626';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 9. Shockwave Wavefront Ripples
    shockwaves.forEach((sw) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 3;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = isLightLab ? 8 : 18;
      ctx.stroke();

      // Outer halo
      ctx.beginPath();
      ctx.arc(cx, cy, sw.radius * 1.12, 0, Math.PI * 2);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = sw.alpha * 0.45;
      ctx.stroke();
      ctx.restore();
    });

    // 10. Draw Quantum State Vectors
    vectors.forEach((v, idx) => {
      const isFocused = idx === selectedQubit;
      const palette = isLightLab ? QUBIT_PALETTE_LIGHT : QUBIT_PALETTE_DARK;
      const col = palette[idx % palette.length];

      // If active slerp on this qubit, compute current interpolated position
      let curX = v.x;
      let curY = v.y;
      let curZ = v.z;

      if (isFocused && slerpRef.current.active) {
        const elapsed = timeMs - slerpRef.current.startTime;
        const progress = Math.min(1, elapsed / slerpRef.current.duration);

        // Spherical Linear Interpolation (Slerp)
        const dot = Math.max(
          -1,
          Math.min(
            1,
            slerpRef.current.startX * slerpRef.current.targetX +
              slerpRef.current.startY * slerpRef.current.targetY +
              slerpRef.current.startZ * slerpRef.current.targetZ
          )
        );
        const thetaSlerp = Math.acos(dot);
        if (thetaSlerp > 0.001) {
          const sinTheta = Math.sin(thetaSlerp);
          const a = Math.sin((1 - progress) * thetaSlerp) / sinTheta;
          const b = Math.sin(progress * thetaSlerp) / sinTheta;
          curX = a * slerpRef.current.startX + b * slerpRef.current.targetX;
          curY = a * slerpRef.current.startY + b * slerpRef.current.targetY;
          curZ = a * slerpRef.current.startZ + b * slerpRef.current.targetZ;
        } else {
          curX = slerpRef.current.targetX;
          curY = slerpRef.current.targetY;
          curZ = slerpRef.current.targetZ;
        }

        // Add to trail
        slerpRef.current.trail.push({ x: curX, y: curY, z: curZ });
        if (slerpRef.current.trail.length > 25) slerpRef.current.trail.shift();

        if (progress >= 1) {
          slerpRef.current.active = false;
          // Commit to state
          setVectors((prev) =>
            prev.map((vec, i) =>
              i === targetIdx ? { ...vec, x: slerpRef.current.targetX, y: slerpRef.current.targetY, z: slerpRef.current.targetZ } : vec
            )
          );
        }
      }

      const p0 = project3D(0, 0, 0);
      const pTip = project3D(curX, curY, curZ);

      ctx.save();
      // Vector Line
      ctx.beginPath();
      ctx.moveTo(p0.px, p0.py);
      ctx.lineTo(pTip.px, pTip.py);
      ctx.strokeStyle = col;
      ctx.lineWidth = isFocused ? 4.2 : 2.5;
      ctx.shadowColor = col;
      ctx.shadowBlur = isLightLab ? 8 : 18;
      ctx.stroke();

      // Particle Vector Tip Head
      ctx.beginPath();
      ctx.arc(pTip.px, pTip.py, isFocused ? 8 : 5.5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Outer Orbiting Wave Halo around Tip
      const haloRadius = 12 + Math.sin(timeMs / 200 + idx) * 2;
      ctx.beginPath();
      ctx.arc(pTip.px, pTip.py, haloRadius, 0, Math.PI * 2);
      ctx.strokeStyle = col;
      ctx.globalAlpha = isLightLab ? 0.45 : 0.6;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Equatorial projection lines
      const pEquator = project3D(curX, curY, 0);
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(pTip.px, pTip.py);
      ctx.lineTo(pEquator.px, pEquator.py);
      ctx.moveTo(p0.px, p0.py);
      ctx.lineTo(pEquator.px, pEquator.py);
      ctx.strokeStyle = isLightLab ? 'rgba(76, 29, 112, 0.4)' : `${col}88`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // Qubit Badge
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = isLightLab ? '#4c1d70' : col;
      ctx.fillText(`q[${idx}] |ψ⟩`, pTip.px + 10, pTip.py - 6);
      ctx.restore();
    });

    // 11. Draw Interactive Surface Raycast Reticle
    if (mouseRay && mouseRay.onSphere) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseRay.x, mouseRay.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = isLightLab ? '#4c1d70' : '#f5d626';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = isLightLab ? '#4c1d70' : '#f5d626';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(mouseRay.x - 20, mouseRay.y);
      ctx.lineTo(mouseRay.x + 20, mouseRay.y);
      ctx.moveTo(mouseRay.x, mouseRay.y - 20);
      ctx.lineTo(mouseRay.x, mouseRay.y + 20);
      ctx.strokeStyle = isLightLab ? 'rgba(76, 29, 112, 0.45)' : 'rgba(245, 214, 38, 0.5)';
      ctx.stroke();

      // Coordinate readout tag
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = isLightLab ? '#4c1d70' : '#f5d626';
      ctx.fillText(`θ:${mouseRay.theta}° φ:${mouseRay.phi}°`, mouseRay.x + 18, mouseRay.y - 4);
      ctx.restore();
    }
  };

  // Continuous 60 FPS Animation Engine
  useEffect(() => {
    if (!isOpen) return;

    let isRunning = true;

    const loop = (timeMs: number) => {
      if (!isRunning) return;

      // Auto-rotation precession
      if (isAutoRotate && !isDragging) {
        setYaw((prev) => prev + 0.004);
      }

      // Progress shockwaves
      setShockwaves((prev) =>
        prev
          .map((sw) => ({
            ...sw,
            radius: sw.radius + 4.5,
            alpha: sw.alpha - 0.022,
          }))
          .filter((sw) => sw.alpha > 0)
      );

      // Render Active Views
      if (mode === 'stereo') {
        if (canvasLeftRef.current) {
          const w = canvasLeftRef.current.width;
          const h = canvasLeftRef.current.height;
          render3DHologramFrame(canvasLeftRef.current, -18, w, h, timeMs);
        }
        if (canvasRightRef.current) {
          const w = canvasRightRef.current.width;
          const h = canvasRightRef.current.height;
          render3DHologramFrame(canvasRightRef.current, 18, w, h, timeMs);
        }
      } else {
        if (canvasRef.current) {
          const w = canvasRef.current.width;
          const h = canvasRef.current.height;
          render3DHologramFrame(canvasRef.current, 0, w, h, timeMs);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, mode, isLightLab, isAutoRotate, isDragging, vectors, selectedQubit, mouseRay]);

  // Handle Dynamic Resize for Full-Bleed Canvas
  useEffect(() => {
    if (!isOpen) return;

    const resizeCanvases = () => {
      const dpr = window.devicePixelRatio || 1;
      if (mode === 'stereo') {
        const halfWidth = Math.floor(window.innerWidth / 2);
        const fullHeight = window.innerHeight;
        if (canvasLeftRef.current) {
          canvasLeftRef.current.width = halfWidth * dpr;
          canvasLeftRef.current.height = fullHeight * dpr;
        }
        if (canvasRightRef.current) {
          canvasRightRef.current.width = halfWidth * dpr;
          canvasRightRef.current.height = fullHeight * dpr;
        }
      } else {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth * dpr;
          canvasRef.current.height = window.innerHeight * dpr;
        }
      }
    };

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
    return () => window.removeEventListener('resize', resizeCanvases);
  }, [isOpen, mode]);

  const { present, motionProps } = useGeniePresence(isOpen, { panelRef: containerRef, origin: 'top', captureTrigger: true });
  if (!present) return null;

  // Selected Qubit Mathematical State & Pauli Expectation Values
  const curVec = vectors[selectedQubit] || vectors[0] || { x: 0, y: 0, z: 1 };
  const rNorm = Math.sqrt(curVec.x ** 2 + curVec.y ** 2 + curVec.z ** 2) || 1;
  const nx = curVec.x / rNorm;
  const ny = curVec.y / rNorm;
  const nz = curVec.z / rNorm;

  const thetaRad = Math.acos(Math.max(-1, Math.min(1, nz)));
  const phiRad = Math.atan2(ny, nx);
  const thetaDeg = Math.round((thetaRad * 180) / Math.PI);
  const phiDeg = Math.round(((phiRad >= 0 ? phiRad : phiRad + Math.PI * 2) * 180) / Math.PI);

  const prob0 = Math.round((Math.cos(thetaRad / 2) ** 2) * 100);
  const prob1 = 100 - prob0;

  // Pauli Basis Expectation Values <X>, <Y>, <Z>
  const pauliX = nx;
  const pauliY = ny;
  const pauliZ = nz;

  const activeMatrix = UNITARY_MATRICES[activeGate] || UNITARY_MATRICES.H;

  const modalContent = (
    <div
      ref={containerRef}
      {...motionProps}
      style={{ backgroundColor: isLightLab ? '#f8f6fc' : '#06020c' }}
      className={`genie-surface fixed inset-0 z-[99999] flex flex-col ${
        isLightLab ? 'text-zinc-900' : 'text-white'
      } backdrop-blur-3xl overflow-hidden select-none font-sans`}
    >
      {/* Background Camera Feed (True Web AR Passthrough) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 pointer-events-none ${
          mode === 'ar' && cameraActive ? (isLightLab ? 'opacity-70' : 'opacity-80') : 'opacity-0'
        }`}
      />

      {/* Cybernetic Motion Graphics Overlays */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isLightLab ? 'ar-grid-pattern-light opacity-65' : 'ar-grid-pattern opacity-25'
        }`}
      />
      {mode === 'vr' && (
        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-80 ${
            isLightLab ? 'vr-perspective-floor-light opacity-75' : 'vr-perspective-floor opacity-50'
          } animate-grid-perspective`}
        />
      )}

      {/* Animated Holographic Scanline Sweep */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-b ${
          isLightLab ? 'from-[#4c1d70]/30' : 'from-[#f5d626]/40'
        } to-transparent animate-scanline`}
      />

      {/* Top Cybernetic AR/VR HUD Bar */}
      <header
        className={`relative z-30 flex flex-wrap items-center justify-between gap-4 border-b ${
          isLightLab
            ? 'border-purple-200/90 bg-white/90 shadow-sm'
            : 'border-purple-900/60 bg-zinc-950/80'
        } px-6 py-3.5 backdrop-blur-xl`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isLightLab
                ? 'bg-gradient-to-br from-[#4c1d70] to-[#7c3aed] text-[#f5d626] shadow-[0_0_20px_rgba(76,29,112,0.25)]'
                : 'bg-gradient-to-br from-[#f5d626] to-purple-600 text-zinc-950 shadow-[0_0_20px_rgba(245,214,38,0.5)]'
            }`}
          >
            <GlassesIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLightLab ? 'bg-[#4c1d70]' : 'bg-[#f5d626]'
                } animate-ping`}
              />
              <h1
                className={`font-display text-sm font-extrabold uppercase tracking-wider ${
                  isLightLab ? 'text-[#3b1458]' : 'text-white'
                } sm:text-base`}
              >
                Quantum Spatial AR/VR Hologram
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold ${
                  isLightLab
                    ? 'bg-purple-100 text-[#4c1d70] border border-purple-300'
                    : 'bg-purple-900/80 text-[#f5d626] border border-[#f5d626]/40'
                }`}
              >
                {isLightLab ? 'Clean Optics Lab' : 'Cosmic Void'} • 60 FPS
              </span>
            </div>
            <p className={`text-[11px] ${isLightLab ? 'text-slate-600' : 'text-purple-200/80'}`}>
              Full-Bleed 6DoF Wavefunction & Stereoscopic Multi-Qubit Projection
            </p>
          </div>
        </div>

        {/* Spatial Mode Selector Tabs */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex rounded-full border ${
              isLightLab
                ? 'border-purple-200 bg-purple-50/80 p-1 text-xs font-bold'
                : 'border-purple-700/60 bg-purple-950/70 p-1 text-xs font-bold'
            }`}
          >
            <button
              type="button"
              onClick={() => setMode('ar')}
              className={`rounded-full px-4 py-1.5 transition-all ${
                mode === 'ar'
                  ? isLightLab
                    ? 'bg-[#4c1d70] text-[#f5d626] shadow-sm font-extrabold'
                    : 'bg-[#f5d626] text-zinc-950 shadow-[0_0_15px_rgba(245,214,38,0.4)]'
                  : isLightLab
                  ? 'text-[#4c1d70] hover:bg-purple-100'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              AR Passthrough
            </button>
            <button
              type="button"
              onClick={() => setMode('vr')}
              className={`rounded-full px-4 py-1.5 transition-all ${
                mode === 'vr'
                  ? isLightLab
                    ? 'bg-[#4c1d70] text-[#f5d626] shadow-sm font-extrabold'
                    : 'bg-[#f5d626] text-zinc-950 shadow-[0_0_15px_rgba(245,214,38,0.4)]'
                  : isLightLab
                  ? 'text-[#4c1d70] hover:bg-purple-100'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              VR Spatial Lab
            </button>
            <button
              type="button"
              onClick={() => setMode('stereo')}
              className={`rounded-full px-4 py-1.5 transition-all ${
                mode === 'stereo'
                  ? isLightLab
                    ? 'bg-[#4c1d70] text-[#f5d626] shadow-sm font-extrabold'
                    : 'bg-[#f5d626] text-zinc-950 shadow-[0_0_15px_rgba(245,214,38,0.4)]'
                  : isLightLab
                  ? 'text-[#4c1d70] hover:bg-purple-100'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              VR Stereoscopic (Headset)
            </button>
          </div>

          {/* Controls: Theme Toggle, Camera, Audio, Fullscreen, Close */}
          <button
            type="button"
            onClick={() => setIsLightLab(!isLightLab)}
            className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition border ${
              isLightLab
                ? 'border-purple-300 bg-purple-50 text-[#4c1d70] hover:bg-purple-100 shadow-sm'
                : 'border-purple-800 bg-purple-950/60 text-[#f5d626] hover:text-white'
            }`}
            title={isLightLab ? 'Switch to Deep Space (Dark) Mode' : 'Switch to Clean Optics Laboratory (Light) Mode'}
          >
            {isLightLab ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4 text-[#f5d626]" />}
            <span>{isLightLab ? 'Dark Space' : 'Light Lab'}</span>
          </button>

          {mode === 'ar' && (
            <button
              type="button"
              onClick={toggleCamera}
              className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition border ${
                cameraActive
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : isLightLab
                  ? 'bg-purple-50 text-[#4c1d70] border-purple-200 hover:bg-purple-100'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              {cameraActive ? <VideoIcon className="h-3.5 w-3.5" /> : <VideoOffIcon className="h-3.5 w-3.5" />}
              <span>{cameraActive ? 'Camera ON' : 'Start Camera'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
              isLightLab
                ? 'border-purple-200 bg-purple-50 text-[#4c1d70] hover:bg-purple-100'
                : 'border-purple-800 bg-purple-950/60 text-purple-200 hover:text-white'
            }`}
            title={audioEnabled ? 'Mute Quantum Synth Sound' : 'Enable Quantum Synth Sound'}
          >
            {audioEnabled ? (
              <Volume2Icon className={`h-4 w-4 ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'}`} />
            ) : (
              <VolumeXIcon className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
              isLightLab
                ? 'border-purple-200 bg-purple-50 text-[#4c1d70] hover:bg-purple-100'
                : 'border-purple-800 bg-purple-950/60 text-purple-200 hover:text-white'
            }`}
            title="Toggle Fullscreen"
          >
            {fullscreen ? <Minimize2Icon className="h-4 w-4" /> : <Maximize2Icon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
              isLightLab
                ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'border-rose-500/40 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60'
            }`}
            title="Exit AR/VR Mode (Esc)"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Full-Bleed Spatial Stage */}
      <div
        ref={stageRef}
        className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Full-Bleed Canvas: Single or Stereoscopic Split */}
        {mode === 'stereo' ? (
          <div
            className={`absolute inset-0 flex divide-x-2 ${
              isLightLab ? 'divide-[#4c1d70]/40' : 'divide-[#f5d626]/40'
            } pointer-events-none`}
          >
            {/* Left Eye View */}
            <div className="relative flex-1 h-full">
              <span
                className={`absolute top-4 left-6 z-20 font-mono text-[10px] font-bold uppercase ${
                  isLightLab
                    ? 'text-[#4c1d70] bg-white/90 border border-purple-300 shadow-sm'
                    : 'text-[#f5d626] bg-zinc-950/70 border border-[#f5d626]/40'
                } px-2.5 py-1 rounded-md`}
              >
                LEFT EYE [ST-L] (Δ = -14px)
              </span>
              <canvas ref={canvasLeftRef} className="w-full h-full block" />
            </div>

            {/* Right Eye View */}
            <div className="relative flex-1 h-full">
              <span
                className={`absolute top-4 left-6 z-20 font-mono text-[10px] font-bold uppercase ${
                  isLightLab
                    ? 'text-[#4c1d70] bg-white/90 border border-purple-300 shadow-sm'
                    : 'text-[#f5d626] bg-zinc-950/70 border border-[#f5d626]/40'
                } px-2.5 py-1 rounded-md`}
              >
                RIGHT EYE [ST-R] (Δ = +14px)
              </span>
              <canvas ref={canvasRightRef} className="w-full h-full block" />
            </div>
          </div>
        ) : (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
        )}

        {/* Left Telemetry HUD Panel (Floating Glass Panel) */}
        <div className="absolute left-6 top-6 z-20 space-y-3 pointer-events-auto max-w-[280px]">
          {/* Spatial Gyro Position */}
          <div className={`${isLightLab ? 'hud-glass-panel-light' : 'hud-glass-panel'} rounded-2xl p-4 shadow-2xl`}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
              <span className={isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'}>Spatial Gyroscope</span>
              <RadioIcon className={`h-3.5 w-3.5 ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'} animate-pulse`} />
            </div>
            <div className="mt-2.5 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className={isLightLab ? 'text-slate-500' : 'text-zinc-400'}>Pitch (θ):</span>
                <span className={`font-bold ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'}`}>
                  {Math.round((pitch * 180) / Math.PI)}°
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isLightLab ? 'text-slate-500' : 'text-zinc-400'}>Yaw (φ):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round((yaw * 180) / Math.PI) % 360}°
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isLightLab ? 'text-slate-500' : 'text-zinc-400'}>Roll (ψ):</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {Math.round((roll * 180) / Math.PI)}°
                </span>
              </div>
            </div>
          </div>

          {/* Pauli Basis State Tomography Panel */}
          <div className={`${isLightLab ? 'hud-glass-panel-light' : 'hud-glass-panel'} rounded-2xl p-4 shadow-2xl space-y-2.5`}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
              <span className={isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'}>Pauli Tomography</span>
              <AtomIcon className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="space-y-2 font-mono text-xs">
              {/* <X> */}
              <div>
                <div className="flex justify-between text-[10px]">
                  <span className={isLightLab ? 'text-slate-600' : 'text-zinc-300'}>⟨X̂⟩ Expectation</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400">{pauliX.toFixed(3)}</span>
                </div>
                <div className={`mt-1 h-1.5 w-full ${isLightLab ? 'bg-purple-100' : 'bg-zinc-900'} rounded-full overflow-hidden flex`}>
                  <div
                    className="h-full bg-pink-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(4, ((pauliX + 1) / 2) * 100)}%` }}
                  />
                </div>
              </div>

              {/* <Y> */}
              <div>
                <div className="flex justify-between text-[10px]">
                  <span className={isLightLab ? 'text-slate-600' : 'text-zinc-300'}>⟨Ŷ⟩ Expectation</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{pauliY.toFixed(3)}</span>
                </div>
                <div className={`mt-1 h-1.5 w-full ${isLightLab ? 'bg-purple-100' : 'bg-zinc-900'} rounded-full overflow-hidden flex`}>
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(4, ((pauliY + 1) / 2) * 100)}%` }}
                  />
                </div>
              </div>

              {/* <Z> */}
              <div>
                <div className="flex justify-between text-[10px]">
                  <span className={isLightLab ? 'text-slate-600' : 'text-zinc-300'}>⟨Ẑ⟩ Expectation</span>
                  <span className={`font-bold ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'}`}>
                    {pauliZ.toFixed(3)}
                  </span>
                </div>
                <div className={`mt-1 h-1.5 w-full ${isLightLab ? 'bg-purple-100' : 'bg-zinc-900'} rounded-full overflow-hidden flex`}>
                  <div
                    className={`h-full ${isLightLab ? 'bg-[#4c1d70]' : 'bg-[#f5d626]'} transition-all duration-300 rounded-full`}
                    style={{ width: `${Math.max(4, ((pauliZ + 1) / 2) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Purity & Relaxation Constants */}
            <div
              className={`mt-2 pt-2 border-t ${
                isLightLab ? 'border-purple-200/80' : 'border-purple-900/50'
              } grid grid-cols-2 gap-2 text-[10px] font-mono`}
            >
              <div>
                <span className={isLightLab ? 'text-slate-500 block' : 'text-zinc-400 block'}>Purity (γ):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">1.000 (Pure)</span>
              </div>
              <div>
                <span className={isLightLab ? 'text-slate-500 block' : 'text-zinc-400 block'}>T₁ / T₂*:</span>
                <span className={`font-bold ${isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'}`}>
                  52.4 / 74.8 μs
                </span>
              </div>
            </div>
          </div>

          {/* Qubit Selector Pill List */}
          <div className={`${isLightLab ? 'hud-glass-panel-light' : 'hud-glass-panel'} rounded-2xl p-3.5 shadow-2xl space-y-2`}>
            <span className={`text-[10px] font-mono uppercase font-bold ${isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'}`}>
              Active Register Target
            </span>
            <div className="flex flex-wrap gap-1.5">
              {vectors.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedQubit(i)}
                  className={`rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition border ${
                    selectedQubit === i
                      ? isLightLab
                        ? 'bg-[#4c1d70] text-[#f5d626] border-[#4c1d70] shadow-sm'
                        : 'bg-[#f5d626] text-zinc-950 border-[#f5d626] shadow-[0_0_12px_rgba(245,214,38,0.5)]'
                      : isLightLab
                      ? 'bg-purple-50 text-[#4c1d70] border-purple-200 hover:bg-purple-100'
                      : 'bg-purple-950/60 text-purple-200 border-purple-800 hover:bg-purple-900'
                  }`}
                >
                  q[{i}]
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Telemetry HUD Panel: Dirac Mathematical State & Matrix */}
        <div className="absolute right-6 top-6 z-20 space-y-3 pointer-events-auto max-w-[280px]">
          {/* Mathematical Dirac Notation */}
          <div className={`${isLightLab ? 'hud-glass-panel-light' : 'hud-glass-panel'} rounded-2xl p-4 shadow-2xl`}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
              <span className={isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'}>Wavefunction State</span>
              <SparklesIcon className={`h-3.5 w-3.5 ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'}`} />
            </div>
            <div className={`mt-2 font-mono text-base font-black ${isLightLab ? 'text-[#3b1458]' : 'text-[#f5d626]'}`}>
              |ψ(q[{selectedQubit}])⟩
            </div>
            <div className={`mt-1 text-xs font-mono ${isLightLab ? 'text-slate-700' : 'text-zinc-200'}`}>
              {Math.cos(thetaRad / 2).toFixed(3)}|0⟩ + {Math.sin(thetaRad / 2).toFixed(3)}e<sup>i{phiDeg}°</sup>|1⟩
            </div>

            {/* Measurement Probabilities */}
            <div
              className={`mt-3 grid grid-cols-2 gap-2 border-t ${
                isLightLab ? 'border-purple-200/80' : 'border-purple-900/60'
              } pt-2.5 font-mono text-[11px]`}
            >
              <div
                className={`rounded-xl ${
                  isLightLab ? 'bg-purple-50/80 border-purple-200' : 'bg-purple-950/60 border-purple-800/40'
                } p-2 text-center border`}
              >
                <span className={`text-[9px] ${isLightLab ? 'text-slate-500' : 'text-zinc-400'} block`}>
                  P(|0⟩) Ground
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{prob0}%</span>
              </div>
              <div
                className={`rounded-xl ${
                  isLightLab ? 'bg-purple-50/80 border-purple-200' : 'bg-purple-950/60 border-purple-800/40'
                } p-2 text-center border`}
              >
                <span className={`text-[9px] ${isLightLab ? 'text-slate-500' : 'text-zinc-400'} block`}>
                  P(|1⟩) Excited
                </span>
                <span className="font-bold text-violet-600 dark:text-violet-400 text-sm">{prob1}%</span>
              </div>
            </div>
          </div>

          {/* Unitary Operator Matrix HUD Card */}
          <div className={`${isLightLab ? 'hud-glass-panel-light' : 'hud-glass-panel'} rounded-2xl p-4 shadow-2xl`}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
              <span className={isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'}>Unitary Matrix [U]</span>
              <span className={`font-bold ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'}`}>{activeMatrix.name}</span>
            </div>
            <div
              className={`mt-2.5 p-2 rounded-xl ${
                isLightLab ? 'bg-white/95 border-purple-200 shadow-inner' : 'bg-zinc-950/80 border-purple-900/60'
              } border font-mono text-center text-xs`}
            >
              <div className="flex items-center justify-center gap-4">
                <span className={`text-xl ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'} font-light`}>[</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activeMatrix.m00}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{activeMatrix.m01}</span>
                  <span className="text-pink-600 dark:text-pink-400 font-bold">{activeMatrix.m10}</span>
                  <span className={isLightLab ? 'text-[#4c1d70] font-bold' : 'text-[#f5d626] font-bold'}>
                    {activeMatrix.m11}
                  </span>
                </div>
                <span className={`text-xl ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'} font-light`}>]</span>
              </div>
            </div>
          </div>

          {/* Animated Quantum Resonance Equalizer */}
          <div className={`${isLightLab ? 'hud-glass-panel-light' : 'hud-glass-panel'} rounded-2xl p-3.5 shadow-2xl`}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold mb-2">
              <span className={isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'}>Resonance Spectrum</span>
              <ActivityIcon className={`h-3 w-3 ${isLightLab ? 'text-[#4c1d70]' : 'text-[#f5d626]'}`} />
            </div>
            <div className="flex items-end justify-between h-9 gap-1">
              {[50, 85, 45, 95, 70, 40, 80, 55, 90, 65, 85, 45].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-full rounded-t ${
                    isLightLab
                      ? 'bg-gradient-to-t from-purple-400 via-purple-600 to-[#4c1d70]'
                      : 'bg-gradient-to-t from-purple-600 via-[#a855f7] to-[#f5d626]'
                  } transition-all duration-200`}
                  style={{ height: `${Math.max(15, (h + Math.sin(Date.now() / 180 + idx * 0.8) * 22))}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gate Injection Flash Banner */}
        {gateFlash && (
          <div
            className={`pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 rounded-full border ${
              isLightLab
                ? 'border-[#4c1d70] bg-[#4c1d70]/90 text-[#f5d626] shadow-[0_0_35px_rgba(76,29,112,0.4)]'
                : 'border-[#f5d626] bg-[#f5d626]/25 text-[#f5d626] shadow-[0_0_40px_rgba(245,214,38,0.85)]'
            } px-8 py-2.5 text-sm font-mono font-black backdrop-blur-2xl animate-in fade-in zoom-in duration-200`}
          >
            <ZapIcon className="h-5 w-5 fill-current animate-bounce" />
            <span>APPLYING QUANTUM OPERATOR: [{gateFlash}]</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Spatial Gate Dock */}
      <footer
        className={`relative z-30 flex flex-wrap items-center justify-between gap-4 border-t ${
          isLightLab
            ? 'border-purple-200/90 bg-white/90 shadow-lg'
            : 'border-purple-900/60 bg-zinc-950/85'
        } px-6 py-3.5 backdrop-blur-xl`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`font-mono text-xs font-bold uppercase tracking-wider ${
              isLightLab ? 'text-[#4c1d70]' : 'text-purple-300'
            }`}
          >
            Spatial Gate Injector:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { type: 'H', label: 'Hadamard', key: '1' },
              { type: 'X', label: 'Pauli-X', key: '2' },
              { type: 'Y', label: 'Pauli-Y', key: '3' },
              { type: 'Z', label: 'Pauli-Z', key: '4' },
              { type: 'S', label: 'Phase S', key: '5' },
              { type: 'T', label: 'Phase T', key: '6' },
              { type: 'RY', label: 'Rot-Y', key: '7' },
              { type: 'RESET', label: '|0⟩ Ground', key: '8' },
            ].map((g) => (
              <button
                key={g.type}
                type="button"
                onClick={() => injectGate(g.type as any)}
                className={`group relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono font-bold shadow-sm transition active:scale-95 ${
                  activeGate === g.type
                    ? isLightLab
                      ? 'border-[#4c1d70] bg-[#4c1d70] text-[#f5d626] shadow-md font-black'
                      : 'border-[#f5d626] bg-[#f5d626] text-zinc-950 shadow-[0_0_15px_rgba(245,214,38,0.5)] font-black'
                    : isLightLab
                    ? 'border-purple-200 bg-white text-[#4c1d70] hover:border-[#4c1d70] hover:bg-purple-50'
                    : 'border-purple-700 bg-purple-950/70 text-white hover:border-[#f5d626] hover:bg-[#f5d626] hover:text-zinc-950'
                }`}
                title={`Inject ${g.label} Operator (Key ${g.key})`}
              >
                <span
                  className={
                    activeGate === g.type
                      ? isLightLab
                        ? 'text-[#f5d626] font-black'
                        : 'text-zinc-950 font-black'
                      : isLightLab
                      ? 'text-[#4c1d70] font-black'
                      : 'text-[#f5d626] group-hover:text-zinc-950 font-black'
                  }
                >
                  [{g.type}]
                </span>
                <span>{g.label}</span>
                <span
                  className={`hidden sm:inline-block ml-1 rounded ${
                    isLightLab ? 'bg-purple-100 text-purple-700' : 'bg-black/30'
                  } px-1 text-[9px] opacity-80`}
                >
                  {g.key}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orbit Controls & Reset */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border transition ${
              isAutoRotate
                ? isLightLab
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm font-bold'
                  : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold'
                : isLightLab
                ? 'border-purple-200 bg-white text-slate-500 hover:bg-purple-50'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400'
            }`}
          >
            <Rotate3dIcon className="h-3.5 w-3.5" />
            <span>{isAutoRotate ? 'Orbiting (Space)' : 'Orbit Paused'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPitch(0.28);
              setYaw(0.72);
            }}
            className={`flex items-center gap-1 rounded-full border px-3 py-1.5 transition ${
              isLightLab
                ? 'border-purple-200 bg-white text-[#4c1d70] hover:bg-purple-50'
                : 'border-purple-800 bg-purple-950/60 text-purple-300 hover:text-white'
            }`}
          >
            <RefreshCwIcon className="h-3 w-3" />
            <span>Reset Angles</span>
          </button>
        </div>
      </footer>
    </div>
  );

  return createPortal(modalContent, document.body);
}
