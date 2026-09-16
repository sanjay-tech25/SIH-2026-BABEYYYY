---
type: algorithm
level: intermediate
status: completed
difficulty: hard
tags:
  - algorithm
  - period-finding
  - shor
  - modular-arithmetic
---
# Period Finding

## Problem
Given coprime integers $a$ and $N$ (where $1 < a < N$), find the smallest positive integer $r$ (called the **order** or **period**) such that:
$$a^r \equiv 1 \pmod N$$

## Classical Approach
Classically, computing order $r$ requires evaluating sequence $a^1, a^2, a^3, \dots \pmod N$ until reaching $1$. In the worst case, $r \approx N$, requiring $O(N) = O(2^n)$ exponential operations.

## Quantum Idea
Period finding reformulates modular exponentiation as a unitary operation $U_a |y\rangle = |a y \pmod N\rangle$. Applying **Quantum Phase Estimation** to $U_a$ extracts phase $\theta = s/r$ in polynomial time. Classical **Continued Fractions Algorithm** then recovers exact period $r$ from $\theta$.

## Prerequisites
- [[Quantum Phase Estimation]]
- [[Quantum Fourier Transform]]
- [[Matrices]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]

## Mathematical Formulation

### Unitary Modular Multiplication Operator $U_a$
$$U_a |y\rangle = |a y \pmod N\rangle$$
Eigenvectors of $U_a$ for $0 \le s < r$:
$$|u_s\rangle = \frac{1}{\sqrt{r}} \sum_{k=0}^{r-1} e^{-\frac{2\pi i s k}{r}} |a^k \pmod N\rangle$$
Eigenvalue equation:
$$U_a |u_s\rangle = e^{\frac{2\pi i s}{r}} |u_s\rangle$$

### Uniform Superposition of Eigenvectors
Remarkably, summing over all $|u_s\rangle$ yields standard basis state $|1\rangle$:
$$\frac{1}{\sqrt{r}} \sum_{s=0}^{r-1} |u_s\rangle = |1\rangle$$
Thus, initializing the target register to $|1\rangle$ and running QPE estimates phase $\theta = \frac{s}{r}$ for a uniformly random integer $s \in [0, r-1]$.

## Step-by-Step Algorithm
1. Initialize counting register to $|0\rangle^{\otimes t}$ and target register to $|1\rangle$.
2. Apply QPE routine on modular multiplication unitary $U_a$.
3. Measure counting register to observe phase fraction estimate $\frac{y}{2^t} \approx \frac{s}{r}$.
4. Run classical **Continued Fractions Algorithm** on $\frac{y}{2^t}$ to extract candidate denominator $r$.
5. Check if $a^r \equiv 1 \pmod N$. If yes, return $r$; if no, repeat.

## Quantum Circuit
```text
c_reg: ──[H^{\otimes t}]──[  Controlled-U_a^{2^j}  ]──[IQFT]──[M]
                          │
tgt  : ──[   |1⟩       ]──┴─────────────────────────
```

## Complexity
| Method | Complexity |
|---|---|
| Classical Search | $O(2^n)$ |
| Quantum Period Finding | **$O(n^3)$ polynomial steps** |

## Qiskit Implementation
```python
import math
from fractions import Fraction

def continued_fraction_period(measured_int, t, a, N):
    phase = measured_int / (2**t)
    frac = Fraction(phase).limit_denominator(N)
    r = frac.denominator
    if pow(a, r, N) == 1:
        return r
    return None

# Numerical example for a=7, N=15
a, N = 7, 15
# Period of 7^r mod 15: 7^1=7, 7^2=49=4, 7^3=28=13, 7^4=91=1 -> r=4
t = 8
measured_val = 64  # Phase 64/256 = 0.25 = 1/4
r_found = continued_fraction_period(measured_val, t, a, N)
print(f"Discovered period r for {a}^r mod {N}:", r_found)
```

## Example
Let $a=7, N=15$:
- Sequence: $7^1=7, 7^2=4 \pmod{15}, 7^3=13 \pmod{15}, 7^4=1 \pmod{15}$.
- True period $r=4$.
- QPE output measurement $y=64$ ($t=8$). Phase estimate $\theta = 64/256 = 1/4$.
- Continued fractions yields denominator $r=4$.

## Applications
Primary engine driving [[Shor Algorithm]] for RSA decryption.

## Limitations
Requires quantum circuit construction for modular exponentiation $U_a^{2^j}$.

## Related Algorithms
- [[Quantum Phase Estimation]]
- [[Shor Algorithm]]

## Prerequisites Graph
[[Quantum Phase Estimation]] → [[Period Finding]]

## Resources
- Nielsen & Chuang, Section 5.3
- IBM Quantum Learning: Period Finding