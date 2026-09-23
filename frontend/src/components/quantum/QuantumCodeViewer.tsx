import { useState } from 'react';
import { 
  CheckIcon, 
  CopyIcon, 
  DownloadIcon, 
  ExternalLinkIcon, 
  TerminalIcon, 
  LayersIcon,
  Maximize2Icon,
  Minimize2Icon
} from 'lucide-react';
import { FRAMEWORKS, type QuantumFramework } from '../../services/quantumCodeGenerator';

interface QuantumCodeViewerProps {
  code: string;
  framework: QuantumFramework;
  onFrameworkChange?: (framework: QuantumFramework) => void;
  title?: string;
  subtitle?: string;
  numQubits?: number;
  shots?: number;
  onLaunchColab?: () => void;
  colabLoading?: boolean;
  className?: string;
}

/**
 * Lightweight tokenizing syntax highlighter for Python / OpenQASM code
 */
function highlightQuantumCode(rawCode: string) {
  const lines = rawCode.split('\n');

  return lines.map((line, lineIdx) => {
    // 1. Comments
    if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
      return (
        <span key={lineIdx} className="text-zinc-500 italic">
          {line}
        </span>
      );
    }

    // Split preserving spaces and punctuation
    const tokens = line.split(/(\s+|[(),.:;[\]{}="'])/);

    const renderedTokens = tokens.map((token, tokenIdx) => {
      // Python & QASM keywords
      const KEYWORDS = [
        'import', 'from', 'def', 'return', 'as', 'with', 'for', 'in', 'if', 'else', 'elif',
        'OPENQASM', 'include', 'qreg', 'creg', 'gate', 'measure', 'reset', 'barrier'
      ];
      // Quantum Framework Core types and functions
      const QUANTUM_SYMBOLS = [
        'QuantumCircuit', 'AerSimulator', 'transpile', 'Statevector', 'Bloch',
        'cirq', 'LineQubit', 'Circuit', 'Simulator',
        'qml', 'device', 'qnode', 'draw',
        'qubit', 'qubits', 'qc', 'dev'
      ];
      // Gates and Operations
      const GATES = [
        'h', 'x', 'y', 'z', 's', 't', 'cx', 'cz', 'swap', 'rx', 'ry', 'rz',
        'H', 'X', 'Y', 'Z', 'S', 'T', 'CNOT', 'CZ', 'SWAP', 'RX', 'RY', 'RZ',
        'Hadamard', 'PauliX', 'PauliY', 'PauliZ', 'CNOT'
      ];

      if (KEYWORDS.includes(token)) {
        return (
          <span key={tokenIdx} className="text-purple-400 font-semibold">
            {token}
          </span>
        );
      }
      if (QUANTUM_SYMBOLS.includes(token)) {
        return (
          <span key={tokenIdx} className="text-cyan-300 font-medium">
            {token}
          </span>
        );
      }
      if (GATES.includes(token)) {
        return (
          <span key={tokenIdx} className="text-emerald-400 font-bold">
            {token}
          </span>
        );
      }
      // String literals
      if (token.startsWith('"') || token.startsWith("'") || token.endsWith('"') || token.endsWith("'")) {
        return (
          <span key={tokenIdx} className="text-amber-300">
            {token}
          </span>
        );
      }
      // Numbers
      if (/^\d+(\.\d+)?$/.test(token)) {
        return (
          <span key={tokenIdx} className="text-orange-400">
            {token}
          </span>
        );
      }

      // Default plain token
      return (
        <span key={tokenIdx} className="text-zinc-200">
          {token}
        </span>
      );
    });

    return <span key={lineIdx}>{renderedTokens}</span>;
  });
}

export function QuantumCodeViewer({
  code,
  framework,
  onFrameworkChange,
  title = 'Multi-Framework Transpiled Source Code',
  subtitle = 'Synthesized AST representation for production execution',
  numQubits = 2,
  shots = 1024,
  onLaunchColab,
  colabLoading = false,
  className = ''
}: QuantumCodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentMeta = FRAMEWORKS.find((f) => f.id === framework) || FRAMEWORKS[0];
  const filename = `quantum_circuit_${framework}.${currentMeta.fileExtension}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const codeLines = code.split('\n');
  const highlightedCode = highlightQuantumCode(code);

  return (
    <div className={`overflow-hidden rounded-2xl border border-zinc-800 bg-[#090d16] shadow-2xl transition-all ${className}`}>
      {/* 1. Header Bar: Window chrome, Framework Selector & Action Toolbar */}
      <div className="flex flex-col gap-3 border-b border-zinc-800/80 bg-[#0d121f] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: File Tab & Target Vendor Badge */}
        <div className="flex items-center gap-3">
          {/* Active File Tab */}
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900/90 px-3 py-1 text-xs font-mono text-zinc-200 border border-zinc-700/60 shadow-inner">
            <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-300">{filename}</span>
            <span className="text-[10px] text-zinc-500">({codeLines.length} lines)</span>
          </div>

          {/* Target vendor badge */}
          <span className={`hidden md:inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${currentMeta.badgeColor}`}>
            {currentMeta.vendor}
          </span>
        </div>

        {/* Right: Framework Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Framework tabs */}
          {onFrameworkChange && (
            <div className="flex rounded-lg bg-zinc-900 p-1 border border-zinc-800">
              {FRAMEWORKS.map((fw) => {
                const isActive = framework === fw.id;
                return (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => onFrameworkChange(fw.id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                    }`}
                  >
                    {fw.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition shadow-sm"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition shadow-sm"
            title={`Download ${filename}`}
          >
            <DownloadIcon className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Optional Launch Colab */}
          {onLaunchColab && (
            <button
              type="button"
              onClick={onLaunchColab}
              disabled={colabLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition shadow-sm"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              <span>{colabLoading ? 'Launching...' : 'Run in Colab'}</span>
            </button>
          )}

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            title={isExpanded ? 'Collapse view' : 'Expand full view'}
          >
            {isExpanded ? <Minimize2Icon className="h-3.5 w-3.5" /> : <Maximize2Icon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Sub-header Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 bg-[#0b0f19] px-4 py-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">{title}:</span>
          <span className="text-zinc-300 font-medium">{currentMeta.tagline}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500">
          <span>Qubits: <strong className="text-emerald-400 font-bold">{numQubits}</strong></span>
          <span>·</span>
          <span>Shots: <strong className="text-zinc-300">{shots}</strong></span>
          <span>·</span>
          <a
            href={currentMeta.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-emerald-400 inline-flex items-center gap-1 transition"
          >
            API Reference
            <ExternalLinkIcon className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>

      {/* 3. Code Viewport with Gutter & Syntax Highlight */}
      <div className={`relative overflow-x-auto font-mono text-xs leading-relaxed ${isExpanded ? 'max-h-[700px]' : 'max-h-[440px]'} scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900`}>
        <div className="flex min-w-full">
          {/* Line Numbers Gutter */}
          <div
            className="sticky left-0 select-none border-r border-zinc-800/80 bg-[#080b13] px-3.5 py-4 text-right font-mono text-[11px] text-zinc-600 space-y-0"
            aria-hidden="true"
          >
            {codeLines.map((_, i) => (
              <div key={i} className="h-5 leading-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Formatted Code Lines */}
          <div className="flex-1 py-4 px-5 text-zinc-200 select-text overflow-x-auto">
            {highlightedCode.map((lineContent, i) => (
              <div key={i} className="h-5 leading-5 whitespace-pre font-mono">
                {lineContent}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Footer Status Bar */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 bg-[#080b13] px-4 py-2 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400">AST Generated</span>
          <span>·</span>
          <span>Target: {currentMeta.name}</span>
        </div>
        <div>
          <span>UTF-8</span>
          <span className="mx-2">·</span>
          <span>{code.length} chars</span>
        </div>
      </div>
    </div>
  );
}
