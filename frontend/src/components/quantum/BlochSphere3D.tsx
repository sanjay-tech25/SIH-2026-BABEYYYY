import React, { useEffect, useRef, useState } from 'react';
import { Rotate3dIcon, RefreshCwIcon, CompassIcon } from 'lucide-react';

export interface QubitVector {
  qubit_index: number;
  x: number;
  y: number;
  z: number;
  label?: string;
  color?: string;
}

export interface BlochSphere3DProps {
  vectors?: QubitVector[];
  blochVectors?: QubitVector[]; // compatibility alias
  numQubits?: number;
  compact?: boolean;
  size?: number;
}

const QUBIT_COLORS = ['#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899'];

export function BlochSphere3D({ vectors, blochVectors, numQubits = 1, compact = false, size }: BlochSphere3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedQubit, setSelectedQubit] = useState<number | 'all'>('all');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [rotation, setRotation] = useState<{ pitch: number; yaw: number }>({ pitch: 0.32, yaw: 0.65 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resolve active vectors
  const rawVectors = (vectors && vectors.length > 0) ? vectors : (blochVectors && blochVectors.length > 0 ? blochVectors : []);
  const activeVectors: QubitVector[] = rawVectors.length > 0
    ? rawVectors
    : Array.from({ length: Math.max(1, numQubits) }).map((_, idx) => ({
        qubit_index: idx,
        x: 0,
        y: 0,
        z: 1, // ground state |0>
      }));

  // Handle auto-rotation
  useEffect(() => {
    if (!isAutoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotation((prev) => ({
        pitch: prev.pitch,
        yaw: (prev.yaw + 0.01) % (Math.PI * 2),
      }));
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setLastMouse({ x: e.clientX, y: e.clientY });
    setRotation((prev) => ({
      pitch: Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, prev.pitch + dy * 0.01)),
      yaw: prev.yaw + dx * 0.01,
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Render 3D Sphere on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    // 0.35 leaves comfortable margins so labels (+X, +Y, |0>, |1>) never get clipped
    const radius = Math.min(width, height) * 0.34;

    ctx.clearRect(0, 0, width, height);

    // 3D Projection math: X right, Y in/out, Z up
    const project = (x: number, y: number, z: number) => {
      // 1. Rotate yaw around Z-axis
      const cosY = Math.cos(rotation.yaw);
      const sinY = Math.sin(rotation.yaw);
      const x1 = x * cosY - y * sinY;
      const y1 = x * sinY + y * cosY;

      // 2. Rotate pitch around X-axis
      const cosP = Math.cos(rotation.pitch);
      const sinP = Math.sin(rotation.pitch);
      const y2 = y1 * cosP - z * sinP;
      const z2 = y1 * sinP + z * cosP;

      // Orthographic projection to screen
      return {
        px: cx + x1 * radius,
        py: cy - z2 * radius,
        depth: y2,
      };
    };

    // 1. Draw Glassmorphism Sphere Background
    const grad = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.25, radius * 0.1, cx, cy, radius);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
    grad.addColorStop(0.6, 'rgba(6, 182, 212, 0.06)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.5)');

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.38)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Draw Latitude Wireframe Rings
    const latitudes = [-0.6, -0.3, 0, 0.3, 0.6];
    latitudes.forEach((zVal) => {
      const rRing = Math.sqrt(Math.max(0, 1 - zVal * zVal));
      ctx.beginPath();
      const pointsCount = 48;
      for (let i = 0; i <= pointsCount; i++) {
        const theta = (i / pointsCount) * Math.PI * 2;
        const pt = project(rRing * Math.cos(theta), rRing * Math.sin(theta), zVal);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.strokeStyle = zVal === 0 ? 'rgba(6, 182, 212, 0.55)' : 'rgba(148, 163, 184, 0.14)';
      ctx.lineWidth = zVal === 0 ? 1.5 : 1;
      ctx.setLineDash(zVal === 0 ? [] : [3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 3. Draw Longitude Wireframe Meridians
    const longitudes = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
    longitudes.forEach((phi) => {
      ctx.beginPath();
      const pointsCount = 48;
      for (let i = 0; i <= pointsCount; i++) {
        const theta = (i / pointsCount) * Math.PI * 2;
        const z = Math.cos(theta);
        const r = Math.sin(theta);
        const x = r * Math.cos(phi);
        const y = r * Math.sin(phi);
        const pt = project(x, y, z);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 4. Draw Main Axes (X, Y, Z) with boundary clamping
    const drawAxis = (x: number, y: number, z: number, label: string, color: string) => {
      const start = project(-x * 1.12, -y * 1.12, -z * 1.12);
      const end = project(x * 1.12, y * 1.12, z * 1.12);
      ctx.beginPath();
      ctx.moveTo(start.px, start.py);
      ctx.lineTo(end.px, end.py);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label with boundary safety margins
      ctx.font = 'bold 10px Sora, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lx = Math.max(16, Math.min(width - 16, end.px + (x ? 12 : 0)));
      const ly = Math.max(12, Math.min(height - 12, end.py - (z ? 10 : 0)));
      ctx.fillText(label, lx, ly);
    };

    drawAxis(1, 0, 0, '+X (|+⟩)', 'rgba(52, 211, 153, 0.8)');
    drawAxis(0, 1, 0, '+Y (|+i⟩)', 'rgba(34, 211, 238, 0.8)');
    drawAxis(0, 0, 1, '|0⟩ (Z)', '#ffffff');

    // South Pole Label
    const southPole = project(0, 0, -1.18);
    ctx.font = 'bold 10px Sora, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('|1⟩ (-Z)', southPole.px, Math.min(height - 12, southPole.py + 4));

    // 5. Draw Qubit State Vectors
    activeVectors.forEach((vec, idx) => {
      if (selectedQubit !== 'all' && selectedQubit !== vec.qubit_index) return;

      const color = QUBIT_COLORS[idx % QUBIT_COLORS.length];
      const norm = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z) || 1;
      const nx = vec.x / norm;
      const ny = vec.y / norm;
      const nz = vec.z / norm;

      const origin = project(0, 0, 0);
      const tip = project(nx, ny, nz);

      // Vector Line
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(tip.px, tip.py);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glow Halo at Vector Tip
      ctx.beginPath();
      ctx.arc(tip.px, tip.py, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Outer Ring on Tip
      ctx.beginPath();
      ctx.arc(tip.px, tip.py, 7.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Qubit Badge Label
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      const labelX = Math.min(width - 36, tip.px + 10);
      const labelY = Math.max(12, Math.min(height - 12, tip.py - 4));
      ctx.fillText(`q[${vec.qubit_index}]`, labelX, labelY);

      // Equatorial projection lines
      const projXY = project(nx, ny, 0);
      ctx.beginPath();
      ctx.setLineDash([2, 2]);
      ctx.moveTo(tip.px, tip.py);
      ctx.lineTo(projXY.px, projXY.py);
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(projXY.px, projXY.py);
      ctx.strokeStyle = `${color}66`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }, [rotation, activeVectors, selectedQubit]);

  // Selected Vector calculation for stats readout
  const focusVector = (selectedQubit === 'all') ? activeVectors[0] : (activeVectors.find(v => v.qubit_index === selectedQubit) || activeVectors[0]);
  const normVal = Math.sqrt((focusVector?.x ?? 0) ** 2 + (focusVector?.y ?? 0) ** 2 + (focusVector?.z ?? 1) ** 2) || 1;
  const zNorm = (focusVector?.z ?? 1) / normVal;
  const thetaRad = Math.acos(Math.max(-1, Math.min(1, zNorm)));
  const thetaDeg = Math.round((thetaRad * 180) / Math.PI);
  const phiRad = Math.atan2(focusVector?.y ?? 0, focusVector?.x ?? 0);
  const phiDeg = Math.round(((phiRad >= 0 ? phiRad : (phiRad + Math.PI * 2)) * 180) / Math.PI);
  const prob0 = Math.round((Math.cos(thetaRad / 2) ** 2) * 100);
  const prob1 = 100 - prob0;

  // COMPACT MODE: For embedding cleanly inside parent cards / side-by-side grids
  if (compact) {
    const canvasSize = size || 260;
    return (
      <div className="relative flex flex-col items-center justify-center w-full py-1">
        <div className="relative flex items-center justify-center" style={{ width: canvasSize, height: canvasSize }}>
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-grab active:cursor-grabbing select-none rounded-xl"
            style={{ width: canvasSize, height: canvasSize }}
          />

          {/* Controls overlay (spin & reset) */}
          <div className="absolute top-1 right-1 flex items-center gap-1 z-10">
            <button
              type="button"
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-1 rounded-md text-[10px] transition ${
                isAutoRotate
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700'
              }`}
              title={isAutoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            >
              <Rotate3dIcon className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setRotation({ pitch: 0.32, yaw: 0.65 })}
              className="p-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[10px]"
              title="Reset View"
            >
              <RefreshCwIcon className="h-3 w-3" />
            </button>
          </div>

          {/* Ambient background glow ring */}
          <div className="pointer-events-none absolute h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl" />
        </div>
      </div>
    );
  }

  // FULL STANDALONE CARD MODE: For CircuitBuilder and ChapterLab
  const canvasW = size || 360;
  const canvasH = size ? Math.round(size * 0.85) : 300;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-950 p-5 text-white shadow-xl dark:border-zinc-800">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <CompassIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide text-zinc-100">
              Interactive 3D Bloch / Q-Sphere
            </h4>
            <p className="text-[11px] text-zinc-400">Drag to rotate 3D sphere • Real-time statevector mapping</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              isAutoRotate
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Rotate3dIcon className="h-3 w-3" />
            {isAutoRotate ? 'Spinning' : 'Paused'}
          </button>
          <button
            type="button"
            onClick={() => setRotation({ pitch: 0.32, yaw: 0.65 })}
            className="flex items-center gap-1 rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
            title="Reset to default angle"
          >
            <RefreshCwIcon className="h-3 w-3" />
            Reset View
          </button>
        </div>
      </div>

      {/* Qubit Selector Tabs */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedQubit('all')}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
            selectedQubit === 'all'
              ? 'bg-zinc-100 text-zinc-900 shadow'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          All Qubits ({activeVectors.length})
        </button>
        {activeVectors.map((v) => {
          const isSel = selectedQubit === v.qubit_index;
          const col = QUBIT_COLORS[v.qubit_index % QUBIT_COLORS.length];
          return (
            <button
              key={v.qubit_index}
              type="button"
              onClick={() => setSelectedQubit(v.qubit_index)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                isSel
                  ? 'bg-zinc-800 text-white border border-zinc-600'
                  : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col }} />
              q[{v.qubit_index}]
            </button>
          );
        })}
      </div>

      {/* Main Canvas Area */}
      <div className="relative mt-2 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-grab active:cursor-grabbing select-none"
        />

        {/* Ambient background glow ring */}
        <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Spherical Coordinates & State Analysis Footer */}
      {focusVector && (
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-zinc-800/80 pt-3 sm:grid-cols-4 font-mono text-xs">
          <div className="rounded-xl bg-zinc-900/90 p-2.5 border border-zinc-800/80 text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">Polar Angle (θ)</span>
            <p className="mt-0.5 text-sm font-bold text-emerald-400">{thetaDeg}°</p>
          </div>
          <div className="rounded-xl bg-zinc-900/90 p-2.5 border border-zinc-800/80 text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">Azimuthal (φ)</span>
            <p className="mt-0.5 text-sm font-bold text-cyan-400">{phiDeg}°</p>
          </div>
          <div className="rounded-xl bg-zinc-900/90 p-2.5 border border-zinc-800/80 text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">P(|0⟩) State</span>
            <p className="mt-0.5 text-sm font-bold text-zinc-100">{prob0}%</p>
          </div>
          <div className="rounded-xl bg-zinc-900/90 p-2.5 border border-zinc-800/80 text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">P(|1⟩) State</span>
            <p className="mt-0.5 text-sm font-bold text-violet-400">{prob1}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
