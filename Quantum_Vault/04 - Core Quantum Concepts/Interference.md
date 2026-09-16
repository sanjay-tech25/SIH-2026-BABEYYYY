---
type: concept
level: beginner
status: completed
difficulty: easy
tags:
  - core-concept
  - interference
  - superposition
  - amplitudes
---
# Interference

## Definition
**Quantum Interference** is the physical phenomenon where complex probability amplitudes of different computational paths add constructively (amplifying probability) or destructively (canceling probability out).

## Why It Matters
Superposition creates quantum parallelism across $2^n$ paths, but measurement yields only one result. Interference is the crucial mechanism that cancels out unwanted/incorrect answers and reinforces the target correct answer amplitude before measurement!

## Intuition
- **Level 1 (Intuition)**: Think of water waves. If two wave crests meet, they combine into a taller wave (constructive interference). If a wave crest meets a trough, they flatten each other out (destructive interference). Quantum algorithms align phases so incorrect answer paths cancel to zero probability.
- **Level 2 (Mathematical)**: If an outcome $x$ receives amplitudes $\alpha_1$ and $\alpha_2$ from two paths, final probability $P(x) = |\alpha_1 + \alpha_2|^2 = |\alpha_1|^2 + |\alpha_2|^2 + 2 \text{Re}(\alpha_1^* \alpha_2)$. The cross-term $2 \text{Re}(\alpha_1^* \alpha_2)$ dictates interference.
- **Level 3 (Implementation)**: Applying two Hadamards in sequence ($H \cdot H = I$) demonstrates destructive interference on $|1\rangle$ and constructive interference on $|0\rangle$.

## Mathematical Foundation

### Path Amplitudes and Cross-Terms
For state $|\psi\rangle = \alpha_1 |x\rangle + \alpha_2 |x\rangle$:
$$P(x) = |\alpha_1 + \alpha_2|^2 = (\alpha_1^* + \alpha_2^*)(\alpha_1 + \alpha_2) = |\alpha_1|^2 + |\alpha_2|^2 + \alpha_1^* \alpha_2 + \alpha_1 \alpha_2^*$$
- **Constructive Interference**: When $\text{arg}(\alpha_1) = \text{arg}(\alpha_2) \implies P(x) > |\alpha_1|^2 + |\alpha_2|^2$.
- **Destructive Interference**: When $\text{arg}(\alpha_1) - \text{arg}(\alpha_2) = \pi \implies P(x) < |\alpha_1|^2 + |\alpha_2|^2$.

## Key Equations
$$H^2 = I \implies H H |0\rangle = H \left(\frac{|0\rangle+|1\rangle}{\sqrt{2}}\right) = \frac{1}{2}|0\rangle + \frac{1}{2}|1\rangle + \frac{1}{2}|0\rangle - \frac{1}{2}|1\rangle = |0\rangle$$
$$\text{Destructive Amplitude Cancellation: } \frac{1}{2} |1\rangle - \frac{1}{2} |1\rangle = 0$$

## Example
Examine $H H |0\rangle$:
1. $H|0\rangle \to \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$
2. Apply second $H$:
   - Path into $|0\rangle$: $\frac{1}{\sqrt{2}}\left(\frac{1}{\sqrt{2}}\right) + \frac{1}{\sqrt{2}}\left(\frac{1}{\sqrt{2}}\right) = \frac{1}{2} + \frac{1}{2} = 1$ (Constructive!)
   - Path into $|1\rangle$: $\frac{1}{\sqrt{2}}\left(\frac{1}{\sqrt{2}}\right) + \frac{1}{\sqrt{2}}\left(-\frac{1}{\sqrt{2}}\right) = \frac{1}{2} - \frac{1}{2} = 0$ (Destructive!)

## Circuit
```text
q_0: ──[H]──[H]──  (= Identity)
```

## Implementation
```python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
qc.h(0)
qc.h(0)  # Double Hadamard creates destructive interference for |1>

sv = Statevector.from_instruction(qc)
print("Final Statevector:", sv.data)
```

## Prerequisites
- [[Complex Numbers]]
- [[Probability]]
- [[Superposition]]
- [[Hadamard]]

## Related Concepts
- [[Phase Kickback]]
- [[Quantum Oracle]]

## Algorithms Using This
- [[Deutsch Algorithm]]
- [[Deutsch-Jozsa Algorithm]]
- [[Grover Algorithm]]
- [[Quantum Fourier Transform]]

## Common Mistakes
- Believing quantum speedups come solely from superposition. Without interference, measuring an equal superposition state yields random noise!

## Further Learning
- Read about the Mach-Zehnder Interferometer experiment in quantum optics.