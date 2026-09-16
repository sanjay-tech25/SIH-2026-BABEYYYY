---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - normalization
  - probability
  - linear-algebra
---
# Normalization

## Definition
**Normalization** is the mathematical requirement that the total probability sum across all possible measurement outcomes of a quantum state vector must equal strictly 1.

## Why It Matters
Normalization enforces the conservation of probability. Unitary operators preserve normalization during circuit execution, ensuring physical validity of quantum simulations.

## Intuition
- **Level 1 (Intuition)**: If you roll a die, the probabilities of landing on 1, 2, 3, 4, 5, or 6 MUST sum to $100\%$. Normalization scales a quantum state vector so its total outcome probability equals $100\%$.
- **Level 2 (Mathematical)**: For state $|\psi\rangle = \sum_i c_i |i\rangle$, normalization requires $\langle\psi|\psi\rangle = \sum_i |c_i|^2 = 1$. Unnormalized vector $|v\rangle$ is normalized by $|\psi\rangle = \frac{|v\rangle}{\||v\rangle\|}$.
- **Level 3 (Implementation)**: Python functions normalize raw state vectors before passing them to Qiskit simulators to prevent probability overflow errors.

## Mathematical Foundation

### Vector Norm & Inner Product
The norm of vector $|v\rangle = \begin{pmatrix} v_0 \\ v_1 \\ \dots \\ v_{N-1} \end{pmatrix}$ is:
$$\||v\rangle\| = \sqrt{\langle v|v\rangle} = \sqrt{\sum_{i=0}^{N-1} |v_i|^2}$$

### Normalization Procedure
$$|\psi\rangle = \frac{|v\rangle}{\||v\rangle\|} = \frac{1}{\sqrt{\sum_i |v_i|^2}} \begin{pmatrix} v_0 \\ v_1 \\ \dots \\ v_{N-1} \end{pmatrix}$$

### Preservation Under Unitary Operations
If $|\psi\rangle$ is normalized ($\langle\psi|\psi\rangle = 1$) and $U$ is unitary ($U^\dagger U = I$), then transformed state $|\psi'\rangle = U|\psi\rangle$ is also normalized:
$$\langle\psi'|\psi'\rangle = \langle U\psi | U\psi \rangle = \langle\psi| U^\dagger U |\psi\rangle = \langle\psi| I |\psi\rangle = \langle\psi|\psi\rangle = 1$$

## Key Equations
$$\text{Inner Product Norm: } \langle\psi|\psi\rangle = \sum_{x} |\alpha_x|^2 = 1$$
$$\text{Normalization Operator: } |\psi\rangle = \frac{|v\rangle}{\sqrt{\langle v|v\rangle}}$$

## Example
Normalize unnormalized state $|v\rangle = 3|0\rangle + 4i|1\rangle$:
1. Compute norm squared: $\langle v|v\rangle = |3|^2 + |4i|^2 = 9 + 16 = 25$
2. Compute norm: $\||v\rangle\| = \sqrt{25} = 5$
3. Normalize: $|\psi\rangle = \frac{3}{5}|0\rangle + \frac{4}{5}i|1\rangle$
4. Check: $(3/5)^2 + (4/5)^2 = 9/25 + 16/25 = 25/25 = 1$.

## Circuit
Unitary gate application preserves state vector norm automatically throughout quantum circuits.

## Implementation
```python
import numpy as np

# Unnormalized vector
raw_vector = np.array([3.0, 4.0j], dtype=complex)

# Compute norm
norm = np.linalg.norm(raw_vector)

# Normalize statevector
normalized_state = raw_vector / norm

print(f"Norm: {norm}")
print("Normalized State:", normalized_state)
print("Probability Sum:", np.sum(np.abs(normalized_state)**2))
```

## Prerequisites
- [[Vectors]]
- [[Complex Numbers]]
- [[Probability]]

## Related Concepts
- [[Quantum State]]
- [[Qubit]]
- [[Measurement]]

## Algorithms Using This
- Standard requirement across all quantum algorithms and circuit simulations.

## Common Mistakes
- Forgetting to take the square root of the sum of squared magnitudes when computing the vector norm.
- Dividing by $\sum |c_i|$ instead of $\sqrt{\sum |c_i|^2}$.

## Further Learning
- Verify why non-unitary transformations (like unmitigated measurements or projections) collapse norms and require re-normalization.