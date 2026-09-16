---
type: algorithm
level: advanced
status: completed
difficulty: hard
tags:
  - algorithm
  - shor
  - factoring
  - rsa
  - exponential-speedup
---
# Shor Algorithm

## Problem
Given a large composite integer $N = p \cdot q$ (where $p, q$ are prime numbers), find its prime factors $p$ and $q$.

## Classical Approach
The best-known classical algorithm is the General Number Field Sieve (GNFS), with sub-exponential complexity:
$$O\left( \exp\left( c (\ln N)^{1/3} (\ln \ln N)^{2/3} \right) \right)$$
Factoring 2048-bit RSA keys classically requires millions of core-years.

## Quantum Idea
Shor's algorithm reduces integer factorization to **Period Finding** of function $f(x) = a^x \pmod N$. By using [[Quantum Phase Estimation]] and [[Quantum Fourier Transform]], period $r$ is computed in polynomial time $O((\log N)^3)$. Classical greatest common divisor ($\gcd$) computations then extract prime factors $p, q = \gcd(a^{r/2} \pm 1, N)$.

## Prerequisites
- [[Period Finding]]
- [[Quantum Phase Estimation]]
- [[Quantum Fourier Transform]]

## Core Quantum Concepts
- [[Superposition]]
- [[Interference]]
- [[Quantum Oracle]]
- [[Phase Kickback]]

## Mathematical Formulation

### Reduction from Factoring to Period Finding
1. Pick random integer $a$ such that $1 < a < N$.
2. If $\gcd(a, N) > 1$, we found a non-trivial factor! Done.
3. Otherwise, use Quantum Period Finding to find even period $r$ of $a^x \pmod N$ ($a^r \equiv 1 \pmod N$).
4. Since $a^r \equiv 1 \pmod N$:
   $$a^r - 1 \equiv 0 \pmod N \implies (a^{r/2} - 1)(a^{r/2} + 1) \equiv 0 \pmod N$$
5. As long as $r$ is even and $a^{r/2} \not\equiv -1 \pmod N$, computing:
   $$p = \gcd(a^{r/2} - 1, N), \quad q = \gcd(a^{r/2} + 1, N)$$
   yields non-trivial prime factors of $N$!

## Step-by-Step Algorithm
1. Choose random $a \in (1, N)$.
2. Compute $g = \gcd(a, N)$. If $g > 1$, return factor $g$.
3. Execute **Quantum Period Finding** circuit to extract period $r$ of $a^x \pmod N$.
4. If $r$ is odd or $a^{r/2} \equiv -1 \pmod N$, restart with a different random $a$.
5. Compute prime factors $p = \gcd(a^{r/2} - 1, N)$ and $q = \gcd(a^{r/2} + 1, N)$.

## Quantum Circuit
```text
c_reg: ──[H^{\otimes t}]──[ Controlled-U_a^{2^j} ]──[IQFT]──[M]
                          │
tgt  : ──[   |1⟩       ]──┴───────────────────────
```

## Complexity
| Method | Complexity |
|---|---|
| Classical (GNFS) | $O(\exp(c (\log N)^{1/3} (\log \log N)^{2/3}))$ |
| Quantum (Shor) | **$O((\log N)^3)$ Polynomial Time** |

## Qiskit Implementation
```python
import math

def shors_classical_postprocessing(a, r, N):
    if r % 2 != 0:
        return None
    val = pow(a, r // 2, N)
    if val == N - 1:
        return None
    p = math.gcd(val - 1, N)
    q = math.gcd(val + 1, N)
    return p, q

# Factoring N = 15 with a = 7, discovered period r = 4
N = 15
a = 7
r = 4

factors = shors_classical_postprocessing(a, r, N)
print(f"Factoring N={N} using a={a}, period r={r}: Prime factors =", factors)
```

## Example
Factor $N = 15$:
1. Choose $a = 7$. Check $\gcd(7, 15) = 1$.
2. Run Quantum Period Finding: $7^r \pmod{15}$ gives period $r = 4$ (even!).
3. Compute $a^{r/2} = 7^{4/2} = 7^2 = 49 \equiv 4 \pmod{15}$.
4. Verify $4 \not\equiv -1 \pmod{15}$.
5. Calculate prime factors:
   - $p = \gcd(4 - 1, 15) = \gcd(3, 15) = 3$
   - $q = \gcd(4 + 1, 15) = \gcd(5, 15) = 5$
Result: $15 = 3 \times 5$.

## Applications
Post-quantum cryptography research, vulnerability assessment of RSA public-key encryption.

## Limitations
Requires high-fidelity fault-tolerant qubits ($O(N)$ logical qubits with millions of physical qubits for RSA-2048).

## Related Algorithms
- [[Quantum Phase Estimation]]
- [[Quantum Fourier Transform]]
- [[Period Finding]]

## Prerequisites Graph
[[Quantum Fourier Transform]] → [[Quantum Phase Estimation]] → [[Period Finding]] → [[Shor Algorithm]]

## Resources
- Paper: Shor (1994), IEEE FOCS.
- IBM Quantum Learning: Shor's Algorithm Implementation