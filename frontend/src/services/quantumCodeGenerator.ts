// Multi-Framework Quantum Code Synthesis Engine
// Generates optimized, runnable code for IBM Qiskit, Google Cirq, Xanadu PennyLane, and OpenQASM 2.0/3.0

export type QuantumFramework = 'qiskit' | 'cirq' | 'pennylane' | 'openqasm';

export interface CircuitGateInput {
  qubit: number;
  type: string; // 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'RX' | 'RY' | 'RZ' | 'CX' | 'CZ' | 'SWAP'
  control?: number;
  target2?: number;
  step?: number;
}

export interface FrameworkMetadata {
  id: QuantumFramework;
  name: string;
  vendor: string;
  badgeColor: string;
  fileExtension: string;
  documentationUrl: string;
  tagline: string;
}

export const FRAMEWORKS: FrameworkMetadata[] = [
  {
    id: 'qiskit',
    name: 'IBM Qiskit',
    vendor: 'IBM Quantum',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    fileExtension: 'py',
    documentationUrl: 'https://docs.quantum.ibm.com',
    tagline: 'Standard production SDK for superconducting QPUs & AerSimulator',
  },
  {
    id: 'cirq',
    name: 'Google Cirq',
    vendor: 'Google Quantum AI',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    fileExtension: 'py',
    documentationUrl: 'https://quantumai.google/cirq',
    tagline: 'NISQ algorithm framework optimized for Google Sycamore processors',
  },
  {
    id: 'pennylane',
    name: 'Xanadu PennyLane',
    vendor: 'Xanadu AI',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    fileExtension: 'py',
    documentationUrl: 'https://docs.pennylane.ai',
    tagline: 'Differentiable quantum machine learning & hybrid variational circuits',
  },
  {
    id: 'openqasm',
    name: 'OpenQASM 2.0',
    vendor: 'Open Quantum Standard',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    fileExtension: 'qasm',
    documentationUrl: 'https://openqasm.com',
    tagline: 'Hardware-independent quantum intermediate representation (IR)',
  },
];

export class QuantumCodeGenerator {
  public static generate(
    framework: QuantumFramework,
    numQubits: number,
    gates: CircuitGateInput[],
    shots: number = 1024
  ): string {
    const sortedGates = [...gates].sort((a, b) => (a.step ?? 0) - (b.step ?? 0));

    switch (framework) {
      case 'qiskit':
        return this.generateQiskit(numQubits, sortedGates, shots);
      case 'cirq':
        return this.generateCirq(numQubits, sortedGates, shots);
      case 'pennylane':
        return this.generatePennyLane(numQubits, sortedGates, shots);
      case 'openqasm':
        return this.generateOpenQASM(numQubits, sortedGates);
      default:
        return this.generateQiskit(numQubits, sortedGates, shots);
    }
  }

  // 1. IBM QISKIT
  private static generateQiskit(numQubits: number, gates: CircuitGateInput[], shots: number): string {
    const lines: string[] = [
      '# ====================================================================',
      '# IBM Qiskit (Python) Quantum Circuit Implementation',
      `# Target Hardware: IBM Quantum QPU / Qiskit Aer Simulator (${shots} Shots)`,
      '# ====================================================================',
      'import numpy as np',
      'from qiskit import QuantumCircuit, transpile',
      'from qiskit_aer import AerSimulator',
      '',
      `# 1. Initialize ${numQubits}-Qubit Quantum Circuit and Classical Registers`,
      `qc = QuantumCircuit(${numQubits}, ${numQubits})`,
      '',
      '# 2. Apply Unitary Quantum Gates',
    ];

    if (gates.length === 0) {
      lines.push('# (Circuit is currently empty)');
    }

    gates.forEach((g) => {
      const q = g.qubit;
      const c = g.control ?? (q === 0 ? 1 : 0);
      const t = g.target2 ?? (q === 0 ? 1 : 0);

      switch (g.type) {
        case 'H':
          lines.push(`qc.h(${q})  # Hadamard superposition on q[${q}]`);
          break;
        case 'X':
          lines.push(`qc.x(${q})  # Pauli-X NOT gate on q[${q}]`);
          break;
        case 'Y':
          lines.push(`qc.y(${q})  # Pauli-Y phase-flip on q[${q}]`);
          break;
        case 'Z':
          lines.push(`qc.z(${q})  # Pauli-Z phase-flip on q[${q}]`);
          break;
        case 'S':
          lines.push(`qc.s(${q})  # S (pi/2 phase) gate on q[${q}]`);
          break;
        case 'T':
          lines.push(`qc.t(${q})  # T (pi/4 phase) gate on q[${q}]`);
          break;
        case 'RX':
          lines.push(`qc.rx(np.pi / 2, ${q})  # Rotation around X on q[${q}]`);
          break;
        case 'RY':
          lines.push(`qc.ry(np.pi / 2, ${q})  # Rotation around Y on q[${q}]`);
          break;
        case 'RZ':
          lines.push(`qc.rz(np.pi / 2, ${q})  # Rotation around Z on q[${q}]`);
          break;
        case 'CX':
          lines.push(`qc.cx(${c}, ${q})  # CNOT entangling control q[${c}] -> target q[${q}]`);
          break;
        case 'CZ':
          lines.push(`qc.cz(${c}, ${q})  # Controlled-Z between q[${c}] and q[${q}]`);
          break;
        case 'SWAP':
          lines.push(`qc.swap(${q}, ${t})  # SWAP state between q[${q}] and q[${t}]`);
          break;
        default:
          lines.push(`qc.id(${q})`);
      }
    });

    lines.push('');
    lines.push('# 3. Projective Measurement into Classical Registers');
    lines.push(`qc.measure(range(${numQubits}), range(${numQubits}))`);
    lines.push('');
    lines.push('# 4. Transpile and Execute on AerSimulator');
    lines.push('simulator = AerSimulator()');
    lines.push('compiled_circuit = transpile(qc, simulator)');
    lines.push(`job = simulator.run(compiled_circuit, shots=${shots})`);
    lines.push('result = job.result()');
    lines.push('counts = result.get_counts()');
    lines.push('print("Qiskit Measurement Counts:", counts)');

    return lines.join('\n');
  }

  // 2. GOOGLE CIRQ
  private static generateCirq(numQubits: number, gates: CircuitGateInput[], shots: number): string {
    const lines: string[] = [
      '# ====================================================================',
      '# Google Cirq (Python) Quantum Circuit Implementation',
      `# Target Hardware: Google Quantum AI / Sycamore Architecture (${shots} Repetitions)`,
      '# ====================================================================',
      'import cirq',
      'import numpy as np',
      '',
      `# 1. Instantiate ${numQubits} Linear Qubit Registers`,
      `qubits = cirq.LineQubit.range(${numQubits})`,
      'circuit = cirq.Circuit()',
      '',
      '# 2. Append Quantum Operations to Circuit',
    ];

    if (gates.length === 0) {
      lines.push('# (Circuit is currently empty)');
    }

    gates.forEach((g) => {
      const q = `qubits[${g.qubit}]`;
      const c = `qubits[${g.control ?? (g.qubit === 0 ? 1 : 0)}]`;
      const t = `qubits[${g.target2 ?? (g.qubit === 0 ? 1 : 0)}]`;

      switch (g.type) {
        case 'H':
          lines.push(`circuit.append(cirq.H(${q}))`);
          break;
        case 'X':
          lines.push(`circuit.append(cirq.X(${q}))`);
          break;
        case 'Y':
          lines.push(`circuit.append(cirq.Y(${q}))`);
          break;
        case 'Z':
          lines.push(`circuit.append(cirq.Z(${q}))`);
          break;
        case 'S':
          lines.push(`circuit.append(cirq.S(${q}))`);
          break;
        case 'T':
          lines.push(`circuit.append(cirq.T(${q}))`);
          break;
        case 'RX':
          lines.push(`circuit.append(cirq.rx(np.pi / 2)(${q}))`);
          break;
        case 'RY':
          lines.push(`circuit.append(cirq.ry(np.pi / 2)(${q}))`);
          break;
        case 'RZ':
          lines.push(`circuit.append(cirq.rz(np.pi / 2)(${q}))`);
          break;
        case 'CX':
          lines.push(`circuit.append(cirq.CNOT(${c}, ${q}))`);
          break;
        case 'CZ':
          lines.push(`circuit.append(cirq.CZ(${c}, ${q}))`);
          break;
        case 'SWAP':
          lines.push(`circuit.append(cirq.SWAP(${q}, ${t}))`);
          break;
        default:
          lines.push(`circuit.append(cirq.I(${q}))`);
      }
    });

    lines.push('');
    lines.push('# 3. Append Measurements across all active wires');
    lines.push('circuit.append(cirq.measure(*qubits, key="result"))');
    lines.push('');
    lines.push('# 4. Simulate Wavefunction & Sample Distribution');
    lines.push('simulator = cirq.Simulator()');
    lines.push(`result = simulator.run(circuit, repetitions=${shots})`);
    lines.push('print("Google Cirq Circuit:")');
    lines.push('print(circuit)');
    lines.push('print("Measurement Histogram:", result.histogram(key="result"))');

    return lines.join('\n');
  }

  // 3. XANADU PENNYLANE
  private static generatePennyLane(numQubits: number, gates: CircuitGateInput[], shots: number): string {
    const lines: string[] = [
      '# ====================================================================',
      '# Xanadu PennyLane (Python) Differentiable QNode Implementation',
      `# Device: default.qubit (Shots: ${shots})`,
      '# ====================================================================',
      'import pennylane as qml',
      'import numpy as np',
      '',
      `# 1. Define Simulated Quantum Device with ${numQubits} Wires`,
      `dev = qml.device("default.qubit", wires=${numQubits}, shots=${shots})`,
      '',
      '# 2. Define Quantum Function / Differentiable Node',
      '@qml.qnode(dev)',
      'def quantum_circuit():',
    ];

    if (gates.length === 0) {
      lines.push('    # (Circuit is currently empty)');
      lines.push('    return qml.counts()');
    } else {
      gates.forEach((g) => {
        const q = g.qubit;
        const c = g.control ?? (q === 0 ? 1 : 0);
        const t = g.target2 ?? (q === 0 ? 1 : 0);

        switch (g.type) {
          case 'H':
            lines.push(`    qml.Hadamard(wires=${q})`);
            break;
          case 'X':
            lines.push(`    qml.PauliX(wires=${q})`);
            break;
          case 'Y':
            lines.push(`    qml.PauliY(wires=${q})`);
            break;
          case 'Z':
            lines.push(`    qml.PauliZ(wires=${q})`);
            break;
          case 'S':
            lines.push(`    qml.S(wires=${q})`);
            break;
          case 'T':
            lines.push(`    qml.T(wires=${q})`);
            break;
          case 'RX':
            lines.push(`    qml.RX(np.pi / 2, wires=${q})`);
            break;
          case 'RY':
            lines.push(`    qml.RY(np.pi / 2, wires=${q})`);
            break;
          case 'RZ':
            lines.push(`    qml.RZ(np.pi / 2, wires=${q})`);
            break;
          case 'CX':
            lines.push(`    qml.CNOT(wires=[${c}, ${q}])`);
            break;
          case 'CZ':
            lines.push(`    qml.CZ(wires=[${c}, ${q}])`);
            break;
          case 'SWAP':
            lines.push(`    qml.SWAP(wires=[${q}, ${t}])`);
            break;
          default:
            lines.push(`    qml.Identity(wires=${q})`);
        }
      });
      lines.push('    return qml.counts()');
    }

    lines.push('');
    lines.push('# 3. Execute QNode and Output Sample Frequencies');
    lines.push('counts = quantum_circuit()');
    lines.push('print("PennyLane Execution Results:", counts)');

    return lines.join('\n');
  }

  // 4. OPENQASM 2.0
  private static generateOpenQASM(numQubits: number, gates: CircuitGateInput[]): string {
    const lines: string[] = [
      '// ====================================================================',
      '// OpenQASM 2.0 Intermediate Representation (IR)',
      '// Standards: Open Quantum Assembly Language Specification',
      '// ====================================================================',
      'OPENQASM 2.0;',
      'include "qelib1.inc";',
      '',
      `qreg q[${numQubits}];`,
      `creg c[${numQubits}];`,
      '',
      '// Quantum Gates',
    ];

    if (gates.length === 0) {
      lines.push('// (Circuit is currently empty)');
    }

    gates.forEach((g) => {
      const q = g.qubit;
      const c = g.control ?? (q === 0 ? 1 : 0);
      const t = g.target2 ?? (q === 0 ? 1 : 0);

      switch (g.type) {
        case 'H':
          lines.push(`h q[${q}];`);
          break;
        case 'X':
          lines.push(`x q[${q}];`);
          break;
        case 'Y':
          lines.push(`y q[${q}];`);
          break;
        case 'Z':
          lines.push(`z q[${q}];`);
          break;
        case 'S':
          lines.push(`s q[${q}];`);
          break;
        case 'T':
          lines.push(`t q[${q}];`);
          break;
        case 'RX':
          lines.push(`rx(pi/2) q[${q}];`);
          break;
        case 'RY':
          lines.push(`ry(pi/2) q[${q}];`);
          break;
        case 'RZ':
          lines.push(`rz(pi/2) q[${q}];`);
          break;
        case 'CX':
          lines.push(`cx q[${c}], q[${q}];`);
          break;
        case 'CZ':
          lines.push(`cz q[${c}], q[${q}];`);
          break;
        case 'SWAP':
          lines.push(`swap q[${q}], q[${t}];`);
          break;
        default:
          lines.push(`id q[${q}];`);
      }
    });

    lines.push('');
    lines.push('// Measurements');
    for (let i = 0; i < numQubits; i++) {
      lines.push(`measure q[${i}] -> c[${i}];`);
    }

    return lines.join('\n');
  }
}
