import React, { useState, useRef } from 'react';
import { 
  CheckIcon, 
  CopyIcon, 
  DownloadIcon, 
  ExternalLinkIcon, 
  TerminalIcon, 
  PlayIcon, 
  RefreshCwIcon, 
  RotateCcwIcon, 
  Edit3Icon,
  SparklesIcon
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
  // Editable coding simulator extensions:
  editable?: boolean;
  onChange?: (newCode: string) => void;
  onRunSimulation?: () => void;
  isSimulating?: boolean;
  onResetCode?: () => void;
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
  title = 'Quantum Source Code Simulator',
  subtitle = 'In-platform executable quantum code environment',
  numQubits = 2,
  shots = 1024,
  onLaunchColab,
  colabLoading = false,
  className = '',
  editable = true,
  onChange,
  onRunSimulation,
  isSimulating = false,
  onResetCode
}: QuantumCodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      if (onChange) onChange(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleFocusEditor = () => {
    if (editable && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const codeLines = code.split('\n');
  const highlightedCode = highlightQuantumCode(code);

  return (
    <div className={`overflow-hidden rounded-2xl border border-zinc-800 bg-[#090d16] shadow-2xl transition-all focus-within:border-emerald-500/60 focus-within:shadow-[0_0_25px_rgba(16,185,129,0.15)] ${className}`}>
      {/* 1. Header Bar: File Tab, Framework Selector & Action Toolbar */}
      <div className="flex flex-col gap-3 border-b border-zinc-800/80 bg-[#0d121f] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Active File Tab & Status */}
        <div className="flex items-center gap-3">
          <div 
            onClick={handleFocusEditor}
            className="flex items-center gap-2 rounded-lg bg-zinc-900/90 px-3 py-1.5 text-xs font-mono text-zinc-200 border border-zinc-700/60 shadow-inner cursor-pointer hover:border-emerald-500/50 transition"
            title="Click to edit code"
          >
            <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-300">{filename}</span>
            <span className="text-[10px] text-zinc-500">({codeLines.length} lines)</span>
          </div>

          {/* Editable Indicator */}
          {editable && (
            <span 
              onClick={handleFocusEditor}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 cursor-pointer shadow-sm animate-pulse"
              title="Click anywhere below to edit code"
            >
              <Edit3Icon className="h-3 w-3" />
              Live Editable
            </span>
          )}

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

          {/* Reset Code Button */}
          {editable && onResetCode && (
            <button
              type="button"
              onClick={onResetCode}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition shadow-sm"
              title="Reset code to original starter code"
            >
              <RotateCcwIcon className="h-3 w-3 text-zinc-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
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

          {/* Run In-Platform Simulation Button */}
          {onRunSimulation && (
            <button
              type="button"
              onClick={onRunSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50 ring-2 ring-emerald-500/30"
            >
              {isSimulating ? (
                <>
                  <RefreshCwIcon className="h-3.5 w-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-3.5 w-3.5 fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. Sub-header Info Bar with Editing Prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 bg-[#0b0f19] px-4 py-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          {editable ? (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Click inside editor to type, modify quantum gates, or paste code:
            </span>
          ) : (
            <span className="text-zinc-500">{title}:</span>
          )}
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
            API Docs
            <ExternalLinkIcon className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>

      {/* 3. Code Viewport with Gutter & Interactive Textarea */}
      <div 
        onClick={handleFocusEditor}
        className="relative overflow-x-auto font-mono text-xs leading-relaxed max-h-[520px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 cursor-text"
      >
        <div className="flex min-w-full min-h-[300px]">
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

          {/* Editable Code Area */}
          {editable ? (
            <div className="flex-1 relative min-h-[300px]">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => onChange && onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full h-full min-h-[300px] py-4 px-5 text-emerald-300 font-mono text-xs leading-5 bg-transparent resize-none border-none outline-none focus:outline-none focus:ring-0 whitespace-pre overflow-x-auto caret-emerald-400 selection:bg-emerald-500/30 block"
                rows={Math.max(14, codeLines.length + 3)}
                placeholder="# Write, type, or paste quantum circuit code here..."
              />
            </div>
          ) : (
            <div className="flex-1 py-4 px-5 text-zinc-200 select-text overflow-x-auto">
              {highlightedCode.map((lineContent, i) => (
                <div key={i} className="h-5 leading-5 whitespace-pre font-mono">
                  {lineContent}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer Status Bar */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 bg-[#080b13] px-4 py-2 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-300 font-medium">
            {editable ? 'Interactive Quantum Simulator Ready' : 'Synthesized AST'}
          </span>
          <span>·</span>
          <span>Target: {currentMeta.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {editable && (
            <span className="text-emerald-400 hidden sm:inline">
              ✓ Tab indent supported
            </span>
          )}
          <span>UTF-8</span>
          <span>·</span>
          <span>{code.length} chars</span>
        </div>
      </div>
    </div>
  );
}
