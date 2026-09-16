---
type: foundation
level: beginner
status: completed
difficulty: easy
tags:
  - foundation
  - bloch-sphere
  - visualization
  - single-qubit
---
# Bloch Sphere

## Definition
The **Bloch Sphere** is a geometric representation of the pure state space of a single qubit as points on the surface of a unit 3D sphere.

## Why It Matters
It provides intuitive visualization for single-qubit quantum state transformations, single-qubit gates (which correspond to rotations around sphere axes), and state evolution.

## Intuition
- **Level 1 (Intuition)**: Think of the Bloch sphere like the Earth. North Pole is $|0\rangle$, South Pole is $|1\rangle$. Equator points correspond to equal superpositions like $|+\rangle$ (prime meridian) and $|i\rangle$.
- **Level 2 (Mathematical)**: Any single qubit state can be written as $|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$, mapped to Cartesian coordinates $(x, y, z) = (\sin\theta\cos\phi, \sin\theta\sin\phi, \cos\theta)$.
- **Level 3 (Implementation)**: Qiskit provides `plot_bloch_multivector` to display qubit statevectors on Bloch spheres visually.

## Mathematical Foundation

### Polar Parameterization
$$|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle$$
where:
- $\theta \in [0, \pi]$ is the polar angle from the $+Z$ axis.
- $\phi \in [0, 2\pi)$ is the azimuthal angle from the $+X$ axis in the $XY$-plane.

### Cartesian Bloch Vector
$$\vec{r} = (x, y, z) = \begin{pmatrix} \langle\psi|X|\psi\rangle \\ \langle\psi|Y|\psi\rangle \\ \langle\psi|Z|\psi\rangle \end{pmatrix} = \begin{pmatrix} \sin\theta\cos\phi \\ \sin\theta\sin\phi \\ \cos\theta \end{pmatrix}$$

### Key Cardinal States
- North Pole ($\theta=0$): $|0\rangle \to (0, 0, 1)$
- South Pole ($\theta=\pi$): $|1\rangle \to (0, 0, -1)$
- $+X$ axis ($\theta=\pi/2, \phi=0$): $|+\rangle = \frac{|0\rangle+|1\rangle}{\sqrt{2}} \to (1, 0, 0)$
- $-X$ axis ($\theta=\pi/2, \phi=\pi$): $|-\rangle = \frac{|0\rangle-|1\rangle}{\sqrt{2}} \to (-1, 0, 0)$
- $+Y$ axis ($\theta=\pi/2, \phi=\pi/2$): $|+i\rangle = \frac{|0\rangle+i|1\rangle}{\sqrt{2}} \to (0, 1, 0)$
- $-Y$ axis ($\theta=\pi/2, \phi=3\pi/2$): $|-i\rangle = \frac{|0\rangle-i|1\rangle}{\sqrt{2}} \to (0, -1, 0)$

## Key Equations
$$x = \sin\theta\cos\phi, \quad y = \sin\theta\sin\phi, \quad z = \cos\theta$$
$$\|\vec{r}\|^2 = x^2 + y^2 + z^2 = 1 \quad (\text{for pure states})$$

## Example
For state $|+\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle$:
- $\cos(\theta/2) = 1/\sqrt{2} \implies \theta/2 = \pi/4 \implies \theta = \pi/2$
- $e^{i\phi} = 1 \implies \phi = 0$
- Bloch coordinates: $(\sin(\pi/2)\cos(0), \sin(\pi/2)\sin(0), \cos(\pi/2)) = (1, 0, 0)$.

## Circuit
Applying gate $R_x(\theta)$ rotates the Bloch vector around the $X$-axis by angle $\theta$.

## Implementation
```python
import numpy as np
from qiskit.quantum_info import Statevector
from qiskit.visualization import plot_bloch_multivector

# State vector for |+>
sv = Statevector([1/np.sqrt(2), 1/np.sqrt(2)])

# Extract bloch coordinates
bloch_x = np.real(sv.expectation_value(np.array([[0, 1], [1, 0]])))
bloch_y = np.real(sv.expectation_value(np.array([[0, -1j], [1j, 0]])))
bloch_z = np.real(sv.expectation_value(np.array([[1, 0], [0, -1]])))

print(f"Bloch Vector (x, y, z): ({bloch_x:.1f}, {bloch_y:.1f}, {bloch_z:.1f})")
```

## Prerequisites
- [[Qubit]]
- [[Complex Numbers]]
- [[Quantum State]]

## Related Concepts
- [[Pauli X]]
- [[Pauli Y]]
- [[Pauli Z]]
- [[Hadamard]]

## Algorithms Using This
- Single qubit state visualization in all algorithms.

## Common Mistakes
- Trying to visualize multi-qubit entangled states on single-qubit Bloch spheres. (Entanglement cannot be represented as independent single-qubit Bloch vectors!).

## Further Learning
- Practice calculating rotation matrices $R_x, R_y, R_z$ and verifying their geometric trajectory on the Bloch sphere.