// Educational Conceptual Quantum Programming Engine (Sections 4, 5, 6, 7 of Specification)
// Translates between readable quantum pseudocode and the platform's internal circuit AST.

export interface ConceptualCircuitAST {
  numQubits: number;
  gates: Array<{
    type: string;
    target: number;
    control?: number;
    target2?: number;
    params?: Record<string, number>;
  }>;
  measurements: number[];
  syntaxErrors: string[];
}

export class ConceptualQuantumCodeEngine {
  /**
   * Converts a list of gate strings (e.g. ['H', 'S', 'S', 'H', 'CX']) into readable pseudocode.
   */
  public static gatesToScript(circuitGates: string[], numQubits: number = 2): string {
    const lines: string[] = [
      `// --- Educational Quantum Script ---`,
      `CREATE CIRCUIT ${numQubits} QUBITS`,
      '',
    ];

    circuitGates.forEach((g) => {
      const upper = g.toUpperCase();
      switch (upper) {
        case 'H':
          lines.push('APPLY HADAMARD TO QUBIT 0');
          break;
        case 'X':
          lines.push('APPLY PAULI-X TO QUBIT 0');
          break;
        case 'Y':
          lines.push('APPLY PAULI-Y TO QUBIT 0');
          break;
        case 'Z':
          lines.push('APPLY PAULI-Z TO QUBIT 0');
          break;
        case 'S':
          lines.push('APPLY S GATE TO QUBIT 0');
          break;
        case 'T':
          lines.push('APPLY T GATE TO QUBIT 0');
          break;
        case 'CX':
          lines.push(`APPLY CNOT FROM QUBIT 0 TO QUBIT ${Math.min(1, numQubits - 1)}`);
          break;
        case 'CZ':
          lines.push(`APPLY CZ FROM QUBIT 0 TO QUBIT ${Math.min(1, numQubits - 1)}`);
          break;
        case 'SWAP':
          lines.push(`APPLY SWAP BETWEEN QUBIT 0 AND QUBIT ${Math.min(1, numQubits - 1)}`);
          break;
        default:
          lines.push(`APPLY ${upper} TO QUBIT 0`);
      }
    });

    lines.push('');
    lines.push('MEASURE ALL');
    return lines.join('\n');
  }

  /**
   * Parses learner's conceptual quantum script into AST and extracted gate array.
   */
  public static parseScript(script: string): ConceptualCircuitAST {
    const lines = script.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('#'));
    let numQubits = 2;
    const gates: ConceptualCircuitAST['gates'] = [];
    const measurements: number[] = [];
    const syntaxErrors: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upper = line.toUpperCase();

      // 1. Circuit Declaration
      if (upper.startsWith('CREATE CIRCUIT')) {
        const match = upper.match(/CREATE\s+CIRCUIT\s+(\d+)\s+QUBITS?/);
        if (match) {
          numQubits = Math.max(1, Math.min(10, parseInt(match[1], 10)));
        } else {
          syntaxErrors.push(`Line ${i + 1}: Invalid CREATE CIRCUIT syntax. Example: 'CREATE CIRCUIT 2 QUBITS'`);
        }
        continue;
      }

      // 2. Measure All / Single
      if (upper.startsWith('MEASURE')) {
        if (upper.includes('ALL')) {
          for (let q = 0; q < numQubits; q++) measurements.push(q);
        } else {
          const qMatch = upper.match(/MEASURE\s+(?:QUBIT\s+)?(\d+)/);
          if (qMatch) {
            measurements.push(parseInt(qMatch[1], 10));
          }
        }
        continue;
      }

      // 3. Gate Applications
      if (upper.startsWith('APPLY') || upper.match(/^[HXYZST]|CX|CNOT|CZ|SWAP/)) {
        if (upper.includes('HADAMARD') || upper.startsWith('H ') || upper === 'H') {
          const q = this.extractQubit(upper, 0);
          if (q >= numQubits) syntaxErrors.push(`Line ${i + 1}: Qubit ${q} out of range (Circuit has ${numQubits} qubits)`);
          gates.push({ type: 'H', target: q });
        } else if (upper.includes('PAULI-X') || upper.startsWith('X ') || upper === 'X' || upper.includes(' NOT ')) {
          const q = this.extractQubit(upper, 0);
          if (q >= numQubits) syntaxErrors.push(`Line ${i + 1}: Qubit ${q} out of range`);
          gates.push({ type: 'X', target: q });
        } else if (upper.includes('PAULI-Y') || upper.startsWith('Y ') || upper === 'Y') {
          const q = this.extractQubit(upper, 0);
          if (q >= numQubits) syntaxErrors.push(`Line ${i + 1}: Qubit ${q} out of range`);
          gates.push({ type: 'Y', target: q });
        } else if (upper.includes('PAULI-Z') || upper.startsWith('Z ') || upper === 'Z') {
          const q = this.extractQubit(upper, 0);
          if (q >= numQubits) syntaxErrors.push(`Line ${i + 1}: Qubit ${q} out of range`);
          gates.push({ type: 'Z', target: q });
        } else if (upper.includes('S GATE') || upper.startsWith('S ') || upper === 'S') {
          const q = this.extractQubit(upper, 0);
          if (q >= numQubits) syntaxErrors.push(`Line ${i + 1}: Qubit ${q} out of range`);
          gates.push({ type: 'S', target: q });
        } else if (upper.includes('T GATE') || upper.startsWith('T ') || upper === 'T') {
          const q = this.extractQubit(upper, 0);
          if (q >= numQubits) syntaxErrors.push(`Line ${i + 1}: Qubit ${q} out of range`);
          gates.push({ type: 'T', target: q });
        } else if (upper.includes('CNOT') || upper.includes('CX')) {
          const match = upper.match(/(?:FROM\s+(?:QUBIT\s+)?)(\d+)(?:\s+TO\s+(?:QUBIT\s+)?)(\d+)/) || upper.match(/(?:CX|CNOT)\s+(\d+)\s+(\d+)/);
          const c = match ? parseInt(match[1], 10) : 0;
          const t = match ? parseInt(match[2], 10) : 1;
          if (c === t) {
            syntaxErrors.push(`Line ${i + 1}: Control and Target qubits cannot be the same (Qubit ${c})`);
          }
          if (c >= numQubits || t >= numQubits) {
            syntaxErrors.push(`Line ${i + 1}: Qubit index out of range for ${numQubits}-qubit circuit`);
          }
          gates.push({ type: 'CX', control: c, target: t });
        } else if (upper.includes('CZ')) {
          const match = upper.match(/(\d+)\s+AND\s+(\d+)/) || upper.match(/(\d+)\s+(\d+)/);
          const c = match ? parseInt(match[1], 10) : 0;
          const t = match ? parseInt(match[2], 10) : 1;
          gates.push({ type: 'CZ', control: c, target: t });
        } else if (upper.includes('SWAP')) {
          const match = upper.match(/(\d+)\s+AND\s+(\d+)/) || upper.match(/(\d+)\s+(\d+)/);
          const q1 = match ? parseInt(match[1], 10) : 0;
          const q2 = match ? parseInt(match[2], 10) : 1;
          gates.push({ type: 'SWAP', target: q1, target2: q2 });
        } else {
          syntaxErrors.push(`Line ${i + 1}: Unrecognized quantum operation: '${line}'`);
        }
        continue;
      }

      syntaxErrors.push(`Line ${i + 1}: Unrecognized statement: '${line}'`);
    }

    return {
      numQubits,
      gates,
      measurements: measurements.length > 0 ? measurements : Array.from({ length: numQubits }, (_, i) => i),
      syntaxErrors,
    };
  }

  private static extractQubit(line: string, defaultQ: number = 0): number {
    const match = line.match(/(?:QUBIT|WIRE|Q\[)\s*(\d+)/i) || line.match(/\s+(\d+)$/);
    return match ? parseInt(match[1], 10) : defaultQ;
  }
}
