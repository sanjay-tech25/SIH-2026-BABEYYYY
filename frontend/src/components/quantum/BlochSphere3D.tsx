import React, { useEffect, useRef, useState } from 'react';
import { Rotate3dIcon, RefreshCwIcon, EyeIcon, CompassIcon } from 'lucide-react';

interface QubitVector {
  qubit_index: number;
  x: number;
  y: number;
  z: number;
  label?: string;
  color?: string;
}

interface BlochSphere3DProps {
  vectors: QubitVector[];
  numQubits: number;
}

const QUBIT_COLORS = ['#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899'];

export function BlochSphere3D({ vectors, numQubits }: BlochSphere3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedQubit, setSelectedQubit] = useState<number | 'all'>('all');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [rotation, setRotation] = useState<{ pitch: number; yaw: number }>({ pitch: 0.35, yaw: 0.6 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fallback if no vectors passed yet
  const activeVectors: QubitVector[] = (vectors && vectors.length > 0)
    ? vectors
    : Array.from({ length: numQubits }).map((_, idx) => ({
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
    const radius = Math.min(width, height) * 0.38;

    ctx.clearRect(0, 0, width, height);

    // 3D Projection math
    // World coordinates: X right, Y in/out, Z up
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
    const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.05)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.4)');

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
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
      ctx.strokeStyle = zVal === 0 ? 'rgba(6, 182, 212, 0.5)' : 'rgba(148, 163, 184, 0.12)';
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

    // 4. Draw Main Axes (X, Y, Z)
    const drawAxis = (x: number, y: number, z: number, label: string, color: string) => {
      const start = project(-x * 1.15, -y * 1.15, -z * 1.15);
      const end = project(x * 1.15, y * 1.15, z * 1.15);
      ctx.beginPath();
      ctx.moveTo(start.px, start.py);
      ctx.lineTo(end.px, end.py);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw Axis Label
      ctx.font = 'bold 11px Sora, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, end.px + (x ? 12 : 0), end.py - (z ? 10 : 0));
    };

    drawAxis(1, 0, 0, '+X (|+⟩)', 'rgba(52, 211, 153, 0.7)');
    drawAxis(0, 1, 0, '+Y (|i⟩)', 'rgba(34, 211, 238, 0.7)');
    drawAxis(0, 0, 1, '|0⟩ (Z)', '#ffffff');

    // South Pole Label
    const southPole = project(0, 0, -1.2);
    ctx.font = 'bold 11px Sora, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('|1⟩ (-Z)', southPole.px, southPole.py);

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
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glow Halo at Vector Tip
      ctx.beginPath();
      ctx.arc(tip.px, tip.py, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Outer Ring on Tip
      ctx.beginPath();
      ctx.arc(tip.px, tip.py, 9, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Qubit Badge Label
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`q[${vec.qubit_index}]`, tip.px + 12, tip.py - 4);

      // Draw equatorial projection lines
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
            onClick={() => setRotation({ pitch: 0.35, yaw: 0.6 })}
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
          width={380}
          height={320}
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
