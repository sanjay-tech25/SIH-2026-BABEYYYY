import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { GlobeIcon, RotateCcwIcon, SparklesIcon, InfoIcon } from 'lucide-react';
import type { StatevectorItem } from './StatevectorChart';

interface QSphereProps {
  amplitudes?: StatevectorItem[];
  numQubits?: number;
}

export function QSphere({
  amplitudes = [],
  numQubits = 2,
}: QSphereProps) {
  const [rotY, setRotY] = useState(25);
  const [rotX, setRotX] = useState(15);
  const [hoveredNode, setHoveredNode] = useState<{
    basis: string;
    prob: number;
    phase: number;
    r: number;
    i: number;
  } | null>(null);

  // Generate basis states if not provided
  const totalStates = Math.pow(2, numQubits);
  const stateItems: StatevectorItem[] = amplitudes.length > 0
    ? amplitudes
    : Array.from({ length: totalStates }).map((_, idx) => ({
        basis: idx.toString(2).padStart(numQubits, '0'),
        amplitude: { r: idx === 0 ? 1.0 : 0.0, i: 0.0 }
      }));

  // Hamming weight calculation (number of 1s)
  const getHammingWeight = (binary: string): number => {
    return binary.split('').filter((c) => c === '1').length;
  };

  // Group states by Hamming weight for latitude rings
  const weightBuckets: Record<number, StatevectorItem[]> = {};
  for (let k = 0; k <= numQubits; k++) {
    weightBuckets[k] = [];
  }
  stateItems.forEach((item) => {
    const w = getHammingWeight(item.basis);
    weightBuckets[w].push(item);
  });

  // Calculate 3D sphere coordinates (x, y, z)
  const sphereRadius = 110;
  const cx = 150;
  const cy = 150;

  // Convert phase in [0, 2pi) to HSL color
  const getPhaseColor = (phi: number): string => {
    const hue = (phi * 180) / Math.PI;
    return `hsl(${hue.toFixed(0)}, 85%, 55%)`;
  };

  const getPhase = (r: number, i: number): number => {
    let phi = Math.atan2(i, r);
    if (phi < 0) phi += 2 * Math.PI;
    return phi;
  };

  // Project 3D coordinate (X, Y, Z) to 2D screen with rotation
  const project3D = (x: number, y: number, z: number) => {
    const radY = (rotY * Math.PI) / 180;
    const radX = (rotX * Math.PI) / 180;

    // Rotation around Y axis
    const x1 = x * Math.cos(radY) + z * Math.sin(radY);
    const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

    // Rotation around X axis
    const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

    return {
      screenX: cx + x1,
      screenY: cy - y2,
      depth: z2,
    };
  };

  // Build projected nodes
  const nodes = stateItems.map((item) => {
    const w = getHammingWeight(item.basis);
    const bucket = weightBuckets[w];
    const indexInBucket = bucket.indexOf(item);
    const countInBucket = bucket.length;

    // Polar angle theta from North Pole (0) to South Pole (PI)
    const theta = numQubits === 0 ? 0 : (w / numQubits) * Math.PI;

    // Azimuthal angle phi around latitude ring
    const phiRing = countInBucket === 1
      ? 0
      : (indexInBucket / countInBucket) * 2 * Math.PI;

    // 3D Cartesian coordinates on sphere
    const x = sphereRadius * Math.sin(theta) * Math.cos(phiRing);
    const z = sphereRadius * Math.sin(theta) * Math.sin(phiRing);
    const y = sphereRadius * Math.cos(theta); // North is +Y

    const proj = project3D(x, y, z);
    const r = item.amplitude.r;
    const i = item.amplitude.i;
    const prob = r * r + i * i;
    const phase = getPhase(r, i);

    return {
      item,
      screenX: proj.screenX,
      screenY: proj.screenY,
      depth: proj.depth,
      prob,
      phase,
      r,
      i,
      color: getPhaseColor(phase),
      // Scale radius with probability
      nodeRadius: Math.max(4, Math.sqrt(prob) * 16),
    };
  });

  // Sort nodes by depth so closer ones render on top
  nodes.sort((a, b) => a.depth - b.depth);

  return (
    <Card className="p-6 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-purple-100/80 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4c1d70] flex items-center gap-1.5">
            <GlobeIcon className="h-3.5 w-3.5 text-[#f5d626]" />
            Multi-Qubit Q-Sphere (Section 12.9)
          </span>
          <h3 className="mt-0.5 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Spherical Multi-Qubit State Representation
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            States arranged on latitude rings by Hamming weight. Node radius indicates probability $|c_j|^2$; color indicates relative phase $\phi$.
          </p>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>Rot Y:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotY}
              onChange={(e) => setRotY(parseInt(e.target.value))}
              className="w-16 accent-[#4c1d70]"
            />
            <span>Rot X:</span>
            <input
              type="range"
              min="-60"
              max="60"
              value={rotX}
              onChange={(e) => setRotX(parseInt(e.target.value))}
              className="w-16 accent-[#4c1d70]"
            />
          </div>
          <button
            type="button"
            onClick={() => { setRotY(25); setRotX(15); }}
            className="p-1.5 rounded-lg border border-purple-200 text-zinc-600 hover:bg-purple-50 transition"
            title="Reset Angle"
          >
            <RotateCcwIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Stage */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="relative flex items-center justify-center">
          <svg width="300" height="300" className="overflow-visible select-none">
            {/* Sphere Background Wireframe */}
            <circle
              cx={cx}
              cy={cy}
              r={sphereRadius}
              className="fill-purple-50/20 stroke-purple-300/40 dark:fill-zinc-900 dark:stroke-purple-800/40"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Latitude Circles */}
            {Array.from({ length: numQubits + 1 }).map((_, k) => {
              const theta = numQubits === 0 ? 0 : (k / numQubits) * Math.PI;
              const ringY = sphereRadius * Math.cos(theta);
              const ringR = sphereRadius * Math.sin(theta);
              const proj = project3D(0, ringY, 0);

              if (ringR < 2) return null;

              return (
                <ellipse
                  key={k}
                  cx={cx}
                  cy={proj.screenY}
                  rx={ringR}
                  ry={ringR * Math.abs(Math.sin((rotX * Math.PI) / 180))}
                  fill="none"
                  className="stroke-purple-200/50 dark:stroke-zinc-800"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              );
            })}

            {/* Central Axis */}
            <line
              x1={cx}
              y1={cy - sphereRadius - 10}
              x2={cx}
              y2={cy + sphereRadius + 10}
              className="stroke-purple-300/40 dark:stroke-zinc-700"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text x={cx + 6} y={cy - sphereRadius - 12} className="text-[10px] font-mono fill-zinc-400 font-bold">
              |0...0⟩ (North)
            </text>
            <text x={cx + 6} y={cy + sphereRadius + 18} className="text-[10px] font-mono fill-zinc-400 font-bold">
              |1...1⟩ (South)
            </text>

            {/* State Nodes */}
            {nodes.map((node) => {
              const isZero = node.prob < 0.001;
              return (
                <g
                  key={node.item.basis}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() =>
                    setHoveredNode({
                      basis: node.item.basis,
                      prob: node.prob,
                      phase: node.phase,
                      r: node.r,
                      i: node.i,
                    })
                  }
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer Glow on High Probability */}
                  {!isZero && (
                    <circle
                      cx={node.screenX}
                      cy={node.screenY}
                      r={node.nodeRadius + 4}
                      fill={node.color}
                      opacity={0.3}
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={node.screenX}
                    cy={node.screenY}
                    r={node.nodeRadius}
                    fill={isZero ? 'rgb(203, 213, 225)' : node.color}
                    className="stroke-white dark:stroke-zinc-950 transition-all shadow-sm"
                    strokeWidth="1.5"
                  />

                  {/* State Label */}
                  <text
                    x={node.screenX + node.nodeRadius + 4}
                    y={node.screenY + 4}
                    className={`text-[10px] font-mono font-bold ${
                      isZero
                        ? 'fill-zinc-400 opacity-60'
                        : 'fill-zinc-900 dark:fill-zinc-100 font-black'
                    }`}
                  >
                    |{node.item.basis}⟩
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Panel: Node Inspector & Hamming Latitudes */}
        <div className="w-full md:w-64 space-y-3">
          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900 text-xs font-mono space-y-2">
            <span className="font-bold text-[#4c1d70] uppercase tracking-wide block">
              Node State Inspector
            </span>
            {hoveredNode ? (
              <div className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center justify-between border-b border-purple-200/80 pb-1">
                  <span className="font-bold text-sm text-[#4c1d70]">|{hoveredNode.basis}⟩</span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getPhaseColor(hoveredNode.phase) }}
                  />
                </div>
                <div className="flex justify-between">
                  <span>Probability:</span>
                  <span className="font-bold">{(hoveredNode.prob * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Phase Angle:</span>
                  <span className="font-bold">
                    {((hoveredNode.phase * 180) / Math.PI).toFixed(0)}° ({ (hoveredNode.phase / Math.PI).toFixed(2) }π)
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>Amplitude:</span>
                  <span>{hoveredNode.r.toFixed(2)} + {hoveredNode.i.toFixed(2)}i</span>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Hover over any state node on the Q-Sphere to inspect probability amplitude and phase rotation.
              </p>
            )}
          </div>

          {/* Latitude Index Breakdown */}
          <div className="rounded-2xl border border-slate-200/80 p-3 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 space-y-1.5">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Hamming Latitudes:</span>
            {Array.from({ length: numQubits + 1 }).map((_, w) => (
              <div key={w} className="flex justify-between text-[10px]">
                <span>Weight {w} ({w === 0 ? 'North' : w === numQubits ? 'South' : `Ring ${w}`}):</span>
                <span className="font-bold text-[#4c1d70]">{weightBuckets[w]?.length || 0} state(s)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
