import React, { useState } from 'react';
import { 
  ExternalLinkIcon, 
  DownloadIcon, 
  TerminalSquareIcon, 
  BookOpenIcon, 
  CheckIcon, 
  CopyIcon, 
  CpuIcon, 
  SparklesIcon, 
  PlayIcon,
  Code2Icon,
  FileCodeIcon,
  HelpCircleIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

interface LabNotebook {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  runtime: string;
  description: string;
  notebookUrl: string;
  sampleCode: string;
}

const LAB_NOTEBOOKS: LabNotebook[] = [
  {
    id: 'lab-0',
    slug: 'qubot-essentials',
    title: 'QUBOT Complete Essentials Lab (All 5 Modules)',
    category: 'Full Curriculum',
    difficulty: 'Beginner',
    runtime: '45 min',
    description: 'The master laboratory notebook covering superposition, state collapse, the 4 Bell states, quantum teleportation, Grover search, and parameterized ansätze.',
    notebookUrl: 'https://colab.research.google.com/#create=true',
    sampleCode: `# Step 1: Install Qiskit and simulator in Google Colab
!pip install -q qiskit qiskit-aer matplotlib pylatexenc numpy

import qiskit
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram
import numpy as np

print(f"Qiskit SDK Version: {qiskit.__version__}")
simulator = AerSimulator()
print(f"Simulator Ready: {simulator.name}")

# Module 1: Superposition Demo
qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)
print(qc.draw(output="text"))

job = simulator.run(transpile(qc, simulator), shots=1024)
print("Superposition Measurement Probabilities:", job.result().get_counts())`
  },
  {
    id: 'lab-1',
    slug: 'superposition-basics',
    title: 'Superposition & Getting Started with Qiskit',
    category: 'Foundations',
    difficulty: 'Beginner',
    runtime: '15 min',
    description: 'Construct single-qubit superpositions, rotate states on the Bloch sphere, and visualize probability collapse using Qiskit Aer.',
    notebookUrl: 'https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/1_getting_started_with_qiskit.ipynb',
    sampleCode: `# Step 1: Install and import Qiskit
!pip install -q qiskit qiskit-aer

from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram

# Create single-qubit circuit with Hadamard gate
qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)
print(qc.draw())

# Simulate
sim = AerSimulator()
counts = sim.run(transpile(qc, sim), shots=1000).result().get_counts()
print("Measurement probabilities:", counts)`
  },
  {
    id: 'lab-2',
    slug: 'bell-state-entanglement',
    title: 'Bell State & Data Plotting in Qiskit',
    category: 'Quantum States',
    difficulty: 'Intermediate',
    runtime: '20 min',
    description: 'Implement the canonical Einstein-Podolsky-Rosen (EPR) pair (|00⟩ + |11⟩)/√2 and plot measurement counts and state distributions.',
    notebookUrl: 'https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/circuits/2_plotting_data_in_qiskit.ipynb',
    sampleCode: `import qiskit
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Create 2-qubit Bell circuit
qc = QuantumCircuit(2, 2)
qc.h(0)         # Put qubit 0 into equal superposition
qc.cx(0, 1)     # Entangle qubit 1 with qubit 0
qc.measure([0, 1], [0, 1])

sim = AerSimulator()
counts = sim.run(transpile(qc, sim), shots=2048).result().get_counts()
print("Bell state measurements:", counts)`
  },
  {
    id: 'lab-3',
    slug: 'quantum-teleportation',
    title: 'Quantum State Teleportation Protocol',
    category: 'Protocols',
    difficulty: 'Advanced',
    runtime: '30 min',
    description: 'Transmit an unknown quantum state using a shared entangled pair and two bits of classical communication.',
    notebookUrl: 'https://colab.research.google.com/#create=true',
    sampleCode: `from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator

# Teleportation registers: 1 source + 1 Alice + 1 Bob
qr = QuantumRegister(3, name="q")
crz = ClassicalRegister(1, name="crz")
crx = ClassicalRegister(1, name="crx")
qc = QuantumCircuit(qr, crz, crx)

# 1. Prepare unknown state on Alice's qubit
qc.rx(1.23, 0)
qc.barrier()

# 2. Shared Bell pair between Alice (q1) and Bob (q2)
qc.h(1)
qc.cx(1, 2)
qc.barrier()

# 3. Alice performs Bell measurement
qc.cx(0, 1)
qc.h(0)
qc.measure(0, crz)
qc.measure(1, crx)
qc.barrier()

print(qc.draw(output="text"))`
  },
  {
    id: 'lab-4',
    slug: 'grover-algorithm',
    title: "Grover's Quadratic Search Algorithm",
    category: 'Algorithms',
    difficulty: 'Advanced',
    runtime: '35 min',
    description: 'Demonstrate quadratic speedup over classical brute-force search using quantum phase inversion and the diffusion operator.',
    notebookUrl: 'https://colab.research.google.com/github/Qiskit/qiskit-tutorials/blob/master/tutorials/algorithms/06_grover.ipynb',
    sampleCode: `from qiskit import QuantumCircuit
import numpy as np

# 2-qubit Grover Search for state |11>
grover_circuit = QuantumCircuit(2, 2)
grover_circuit.h([0, 1])

# Oracle marking |11> (Controlled-Z)
grover_circuit.cz(0, 1)

# Diffuser (Amplitude amplification)
grover_circuit.h([0, 1])
grover_circuit.x([0, 1])
grover_circuit.cz(0, 1)
grover_circuit.x([0, 1])
grover_circuit.h([0, 1])
grover_circuit.measure([0, 1], [0, 1])

print(grover_circuit.draw(output="text"))`
  }
];

export function OpenLab() {
  const [selectedLab, setSelectedLab] = useState<LabNotebook>(LAB_NOTEBOOKS[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedLab.sampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Open Editorial Header */}
      <header className="border-b border-purple-100/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-mono text-slate-500 mb-2">
          <span className="flex items-center gap-2 font-medium tracking-wide uppercase text-[13px] text-purple-950/70">
            <span className="h-2 w-2 rounded-full bg-[#f5d626]" />
            Google Colab Integration • Free GPU/TPU Runtime
          </span>
          <div className="flex items-center gap-3">
            <a
              href="/qubot_quantum_lab_essentials.ipynb"
              download="qubot_quantum_lab_essentials.ipynb"
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3.5 py-1.5 text-sm font-poppins font-semibold text-[#4c1d70] hover:bg-purple-50 transition shadow-sm"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Download .ipynb
            </a>
            <a
              href="https://colab.research.google.com/#create=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#4c1d70] px-4 py-1.5 text-sm font-orbitron font-bold text-white hover:bg-[#3b1458] transition shadow-sm"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
              Open Google Colab
            </a>
          </div>
        </div>
        <h1 className="font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
          Open Quantum Lab & Notebooks
        </h1>
        <p className="mt-2 font-poppins text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Download complete, self-contained Jupyter notebooks featuring all 5 curriculum modules configured for Qiskit 1.2+ with Aer simulation.
        </p>
      </header>

      {/* Main Grid: Notebook Directory & Code Preview */}
      <div className="grid gap-10 lg:grid-cols-12 pt-2">
        {/* Notebook List (Unboxed Clean List - ZERO Card Box) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="pb-2 border-b border-purple-100/80">
            <p className="text-sm font-mono font-semibold uppercase tracking-wider text-slate-500">
              Laboratory Modules ({LAB_NOTEBOOKS.length})
            </p>
          </div>

          <div className="divide-y divide-purple-100/80 border-b border-purple-100/80">
            {LAB_NOTEBOOKS.map((lab) => {
              const isSelected = selectedLab.id === lab.id;
              return (
                <div
                  key={lab.id}
                  onClick={() => setSelectedLab(lab)}
                  className={`py-4 px-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-100/60 text-[#4c1d70]'
                      : 'hover:bg-purple-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[13px] font-mono">
                    <span className="font-semibold uppercase tracking-wider text-[#4c1d70]">
                      {lab.category}
                    </span>
                    <span className="text-slate-400">{lab.runtime}</span>
                  </div>
                  <h3 className="mt-1 font-orbitron text-sm font-bold text-[#1a052e]">
                    {lab.title}
                  </h3>
                  <p className="mt-1 font-poppins text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {lab.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Notebook Code & Action */}
        <div key={selectedLab.id} className="genie-content space-y-6 lg:col-span-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#4c1d70]">
                Selected Lab Module
              </span>
              <h3 className="font-orbitron text-lg sm:text-xl font-bold text-[#1a052e] dark:text-white">
                {selectedLab.title}
              </h3>
            </div>

            <a
              href={selectedLab.notebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#f5d626] px-5 text-sm font-orbitron font-bold text-zinc-950 transition-all hover:bg-yellow-400 shadow-md hover:shadow-lg pulse-aura active:scale-95 shrink-0"
            >
              <span>Launch in Colab</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="font-poppins text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {selectedLab.description}
          </p>

          {/* Embedded Code Snippet */}
          <div className="rounded-2xl border border-purple-900/60 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#250b3a] px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm font-mono text-purple-200">
                <Code2Icon className="h-4 w-4 text-[#f5d626]" />
                <span>{selectedLab.slug}.py • Qiskit 1.2+</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-900/80 border border-purple-600/50 px-3 py-1 text-sm font-semibold text-[#f5d626] transition-colors hover:bg-purple-800"
              >
                {copiedCode ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto bg-[#160624] p-4 font-mono text-sm leading-relaxed text-[#f5d626] max-h-[380px]">
              {selectedLab.sampleCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
