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
      <PageHeader
        title="Open Quantum Lab (Google Colab)"
        subtitle="Download or launch pre-configured quantum computing notebooks in Google Colab with free GPU/TPU compute."
      />

      {/* Main Download & Colab Launch Banner */}
      <Card className="border-emerald-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 p-6 sm:p-8 text-zinc-100 shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <SparklesIcon className="h-3.5 w-3.5" />
              QUBOT Official Essentials Notebook Ready
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-white">
              QUBOT Quantum Computing Essentials (.ipynb)
            </h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400">
              A complete, self-contained Jupyter notebook featuring all 5 curriculum modules (Superposition, Bell Entanglement, Teleportation, Grover Search, and Variational Circuits) with Qiskit 1.2+ configuration.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/qubot_quantum_lab_essentials.ipynb"
              download="qubot_quantum_lab_essentials.ipynb"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-900 shadow transition-all hover:bg-zinc-100"
            >
              <DownloadIcon className="h-4 w-4 text-emerald-600" />
              Download .ipynb
            </a>

            <a
              href="https://colab.research.google.com/#create=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow transition-all hover:bg-emerald-500"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              Open Google Colab
            </a>
          </div>
        </div>

        {/* Quick Instructions Step Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">1</span>
            <span className="text-zinc-400">Click <strong>Download .ipynb</strong> or copy code from below.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">2</span>
            <span className="text-zinc-400">Click <strong>Open Google Colab</strong> in your browser.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">3</span>
            <span className="text-zinc-400">In Colab, go to <strong>File &gt; Upload Notebook</strong> to run.</span>
          </div>
        </div>
      </Card>

      {/* Main Grid: Notebook Directory & Code Preview */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Notebook List */}
        <div className="space-y-3 lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Select Lab Module
          </p>

          {LAB_NOTEBOOKS.map((lab) => {
            const isSelected = selectedLab.id === lab.id;
            return (
              <div
                key={lab.id}
                onClick={() => setSelectedLab(lab)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {lab.category}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{lab.runtime}</span>
                </div>
                <h3 className="mt-1 font-display text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {lab.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {lab.description}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    lab.difficulty === 'Beginner' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : lab.difficulty === 'Intermediate'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                  }`}>
                    {lab.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    View Code
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Notebook Code & Action */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Selected Lab
                </span>
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedLab.title}
                </h3>
              </div>

              <a
                href={selectedLab.notebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition-all hover:bg-emerald-500 shadow-sm shrink-0"
              >
                Launch in Colab
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {selectedLab.description}
            </p>

            {/* Embedded Code Snippet */}
            <div className="mt-5">
              <div className="flex items-center justify-between rounded-t-xl border-x border-t border-zinc-700 bg-zinc-900 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Code2Icon className="h-4 w-4 text-emerald-400" />
                  <span>{selectedLab.slug}.py • Qiskit 1.2+</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
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
              <pre className="overflow-x-auto rounded-b-xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-emerald-400 max-h-[380px]">
                {selectedLab.sampleCode}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
