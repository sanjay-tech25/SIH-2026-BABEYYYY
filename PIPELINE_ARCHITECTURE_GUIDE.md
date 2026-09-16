# Complete Pipeline Architecture Guide: Essential Models & Engines

This document provides a comprehensive end-to-end breakdown of how all the essential models, engines, and processing pipelines were constructed in the **QUBOT Adaptive Learning & Quantum Simulation Platform**.

---

## Architecture Overview: The 6 Core Pipelines

```
+---------------------------------------------------------------------------------------------------+
|                                      INCOMING LEARNER ACTIONS                                     |
|           (Gate placements, Quiz attempts, Chat questions, Focus intervals, Window blurs)         |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
     +-------------------+------------------------+------------------------+-------------------+
     |                   |                        |                        |                   |
     v                   v                        v                        v                   v
[1. QUANTUM LAB]   [2. RAG TUTOR]           [3. STRUGGLE]           [4. FATIGUE/POMO]   [5. MASTERY]
 CircuitValidator   Guardrails Filter        Error Rate (25%)        Session Duration    Bayesian Update
     │                   │                   Time vs Exp (15%)       Accuracy Slope      Prereq DAG
 Qiskit Aer          VaultBrain Search       Repeated Attempts(15%)  Latency Drift       Decay Function
 (NumPy Fallback)    Markdown Parser         Hint Frequency (10%)        │                   │
     │                   │                   Concept Failures (20%)  Mandatory 2-Cycle   Next Node Unlock
 Statevector /       Socratic Synthesizer    Rapid Guessing (<4s)    Lockout (HTTP 423)      │
 Bloch Vectors       (Young/Student/Adult)        │                      │                   │
     │                   │                        v                      v                   v
     |                   |                  [INTERVENTION & BEHAVIOR ENGINE] <---------------+
     |                   |                   - 18 Canonical States (IDLE, HELPING, etc.)
     |                   |                   - 12 Emotions (SUPPORTIVE, CURIOUS, etc.)
     |                   |                   - Semantic Animations (gentle_encourage, think)
     |                   |                   - Anti-Spam Hysteresis Cooldowns
     v                   v                                    │
+----+-------------------+------------------------------------+-------------------------------------+
|                                    STRUCTURED RESPONSE ENVELOPE                                   |
|                      (Consumed by React Canvas, Qubot mascot, and Chat UI)                        |
+---------------------------------------------------------------------------------------------------+
```

---

## 1. Quantum Circuit Simulation Pipeline

* **Files:** [`backend/app/quantum/circuit_validator.py`](backend/app/quantum/circuit_validator.py), [`backend/app/quantum/qiskit_backend.py`](backend/app/quantum/qiskit_backend.py), [`backend/app/quantum/colab_launcher.py`](backend/app/quantum/colab_launcher.py)

### How It Works:
```
Raw Circuit JSON ──► CircuitValidator ──► Qiskit QuantumCircuit ──► AerSimulator ──► Histogram & Bloch Vectors
                                                │ (if Aer fails)
                                                └──► NumPy Tensor Engine
```

1. **Validation Stage (`CircuitValidator`):**
   - Enforces topological constraints: verifies qubit indices $[0, N-1]$, depth limit $\le 100$, and gate validity against `ALLOWED_GATES = {'H', 'X', 'Y', 'Z', 'S', 'T', 'CX', 'CNOT', 'CZ', 'SWAP', 'RX', 'RY', 'RZ'}`.
   - Throws standard HTTP 422 errors with precise line-item error messages if the circuit violates physics constraints.
2. **Qiskit Aer Execution Stage (`QiskitBackend`):**
   - Instantiates a Python `QuantumCircuit(num_qubits, num_qubits)`.
   - Iterates through gate list, dynamically applying single-qubit rotations and multi-qubit entanglement operators (`qc.h()`, `qc.cx()`, `qc.swap()`).
   - Appends projective measurement operators and compiles the circuit for **AerSimulator**.
   - Runs simulation with $1024$ shots, extracting execution duration (ms), measurement count distributions (e.g., `{"00": 512, "11": 512}`), and Bloch coordinates for each qubit.
3. **High-Fidelity Matrix Fallback Stage:**
   - If Qiskit Aer is unavailable, a vectorized NumPy tensor engine initializes statevector $|0\dots0\rangle$ of size $2^N$, computes Kronecker tensor products, and calculates probability amplitudes without external library dependencies.
4. **Google Colab Bridge (`ColabLauncher`):**
   - Generates customized standalone Jupyter notebooks for circuits requiring real cloud QPUs or mathematical depth.

---

## 2. Socratic AI Tutor & Obsidian Brain RAG Pipeline

* **Files:** [`backend/app/ai/guardrails.py`](backend/app/ai/guardrails.py), [`backend/app/ai/vault_rag.py`](backend/app/ai/vault_rag.py), [`backend/app/ai/tutor_context.py`](backend/app/ai/tutor_context.py), [`backend/app/ai/provider.py`](backend/app/ai/provider.py)

### How It Works:
```
Student Question ──► AIGuardrails ──► VaultBrainRAG (Markdown Index) ──► Socratic Grounding ──► Age-Tier Formatter
                         │ (if unsafe)                                          │
                         └──► Friendly Redirection                              └──► Cites exact note (.md)
```

1. **Safety & Domain Guardrail (`AIGuardrails`):**
   - Analyzes incoming prompts with regex boundary matching to reject non-academic queries (exploits, politics, financial speculation) and politely steers conversation back to quantum concepts.
2. **In-Memory Vault Indexing (`VaultBrainRAG`):**
   - Scans and caches the local `Quantum_Vault/` markdown repository.
   - Parses each file's YAML frontmatter, tags, difficulty, and standard sections: `## Definition`, `## Intuition`, and `## Mathematical Foundation`.
3. **Token-Scoring Retrieval:**
   - Scores notes based on query tokens:
     $$\text{Score} = (\text{Title Matches} \times 10) + (\text{Tag Matches} \times 5) + (\text{Content Matches} \times 1)$$
   - Extracts the top 2 highest-ranking notes.
4. **Pedagogical Synthesis (`AIProvider`):**
   - Extracts the note's summary, intuition, and formula.
   - Formulates a Socratic follow-up question (e.g., *"How does this phase rotation impact interference after a second Hadamard gate?"*).
   - Appends verified citation slugs (e.g., `["Hadamard_Gate.md"]`), completely eliminating LLM hallucinations.

---

## 3. Multi-Signal Struggle & Confusion Detection Pipeline

* **Files:** [`backend/app/engines/struggle_engine.py`](backend/app/engines/struggle_engine.py), [`backend/app/core/config.py`](backend/app/core/config.py)

### How It Works:
```
Interaction Telemetry ──► 7 Weighted Signals ──► Normalized Score [0.0, 1.0] ──► Severity & Root Cause Classifier
```

1. **Signal Extraction:**
   - **Error Rate:** $\text{errors} / \text{recent\_attempts}$
   - **Time Ratio:** Compares $\text{time\_spent}$ against $\text{expected\_time}$ baseline.
   - **Repetition Signal:** Normalized attempts on the exact same question $(\text{attempts} - 1) / 3.0$.
   - **Hint Dependency:** Ratio of hint requests used.
   - **Concept Failure:** Consecutive failures on questions tied to the same prerequisite node.
   - **Backtracking:** Frequency of navigation back to prior materials.
   - **Accuracy Drop:** Sudden degradation compared to personal baseline.
   - **Rapid Guessing Check:** Flags answers submitted in $<4$ seconds with incorrect response.
2. **Configurable Weighted Scoring:**
   $$\text{Struggle Score} = \sum (w_i \cdot s_i) = 0.25 s_{\text{err}} + 0.15 s_{\text{time}} + 0.15 s_{\text{rep}} + 0.10 s_{\text{hint}} + 0.20 s_{\text{concept}} + 0.05 s_{\text{back}} + 0.10 s_{\text{drop}}$$
3. **Classification:**
   - Scores $\ge 0.85$ are flagged as **CRITICAL**, $\ge 0.70$ as **HIGH**, $\ge 0.50$ as **MODERATE**, $\ge 0.30$ as **MILD**, and $< 0.30$ as **NORMAL**.
   - Diagnoses the dominant type: `CONCEPTUAL`, `PROCEDURAL`, `REPEATED_ERROR`, `GUESSING`, `TIME_PRESSURE`, or `DIFFICULTY_MISMATCH`.

---

## 4. Fatigue & Distraction Detection Pipeline

* **Files:** [`backend/app/engines/fatigue_engine.py`](backend/app/engines/fatigue_engine.py), [`backend/app/engines/distraction_engine.py`](backend/app/engines/distraction_engine.py)

### How It Works:
Isolates cognitive exhaustion from academic inability:

1. **Fatigue Detection (`FatigueDetectionEngine`):**
   - Monitors continuous focus session duration (ramping up after 45 minutes / 2700s).
   - Detects the downward slope in accuracy combined with increasing response latency.
   - Emits an `is_fatigued: true` signal to trigger cognitive rest instead of academic remediation.
2. **Distraction Remedy (`DistractionEngine`):**
   - Ingests browser telemetry: window blur events, tab switches, and inactivity intervals $> 90$s.
   - Triggers calm, non-punitive reset actions (`START_RESET` or `RESUME_LEARNING`).

---

## 5. Pedagogical Intervention & Behavioral State Machine Pipeline

* **Files:** [`backend/app/engines/intervention_engine.py`](backend/app/engines/intervention_engine.py), [`backend/app/engines/qubot_decision_engine.py`](backend/app/engines/qubot_decision_engine.py), [`backend/app/constants/qubot_contracts.py`](backend/app/constants/qubot_contracts.py)

### How It Works:
```
Diagnosed Struggle + Fatigue ──► InterventionEngine ──► QUBOTDecisionEngine ──► QubotResponseEnvelope
```

1. **Intervention Mapping:**
   - `CONCEPTUAL` $\longrightarrow$ Alternative visual explanation / spinning coin analogy.
   - `PROCEDURAL` $\longrightarrow$ Guided step-by-step hint.
   - `REPEATED_ERROR` $\longrightarrow$ Misconception analysis flashcard.
   - `GUESSING` $\longrightarrow$ Slow-down prompt and question objective review.
   - `FATIGUE` $\longrightarrow$ Mandatory break suggestion.
2. **State & Emotion Synthesis:**
   - Selects from **18 Canonical States** (`IDLE`, `ENCOURAGING`, `EXPLAINING`, `BREAK_REQUIRED`, etc.).
   - Assigns 1 of **12 Distinct Emotions** (`SUPPORTIVE`, `CURIOUS`, `THOUGHTFUL`, `CALM`, etc.).
   - Assigns a **Semantic Animation ID** (`gentle_encourage`, `think`, `small_happy`, `break_suggest`).
3. **Anti-Spam Cooldown Manager (`QUBOTCooldownManager`):**
   - Enforces per-intent cooldown timers ($30$s to $60$s) so QUBOT never spams or interrupts the learner's active concentration.
4. **Structured Envelope Output:**
   - Produces the Section 17 JSON contract containing `qubot`, `message`, `intervention`, `session`, and `meta`.

---

## 6. Cognitive Focus & Mandatory Break Policy Pipeline

* **Files:** [`backend/app/services/focus_service.py`](backend/app/services/focus_service.py), [`backend/app/engines/focus_policy_engine.py`](backend/app/engines/focus_policy_engine.py), [`backend/app/core/exceptions.py`](backend/app/core/exceptions.py)

### How It Works:
```
Focus Cycle 1 (25m) ──► Break Suggested ──► Student Skips (Allowed)
                                                    │
Focus Cycle 2 (25m) ◄───────────────────────────────┘
         │
         ▼
Break REQUIRED (Mandatory) ──► Attempt to start Cycle 3 ──► HTTP 423 LOCKED Exception
```

1. **Cycle 1 (Soft Suggestion):**
   - After 25 minutes of focus work, QUBOT suggests a 5-minute break. The student can choose to take the break or continue (skip).
2. **Cycle 2 (Hard Lockout):**
   - If Cycle 1 was skipped and Cycle 2 finishes without rest, the session status transitions to `BREAK_REQUIRED`.
   - `FocusPolicyEngine.validate_new_session_permission()` rejects any attempt to start a 3rd session, raising `BreakPolicyViolationException` (`HTTP_423_LOCKED`).
3. **Memory Consolidation:**
   - The lock clears only when a valid 5-minute break is recorded, aligning with cognitive science for optimal neural retention.

---

## Summary of Pipelines & Key Source Files

| Pipeline | Core Class / Engine | Input Signals | Primary Output |
| :--- | :--- | :--- | :--- |
| **1. Quantum Simulation** | `QiskitBackend` & `CircuitValidator` | Circuit JSON (Gates & Qubits) | Statevector, Bloch vectors, Counts histogram |
| **2. Socratic RAG Tutor** | `VaultBrainRAG` & `AIProvider` | Student question & user age tier | Grounded Socratic explanation with verified citations |
| **3. Struggle Detection** | `StruggleDetectionEngine` | 7 telemetry inputs (errors, times, hints) | Weighted score $[0, 1]$, severity, and struggle type |
| **4. Fatigue & Distraction**| `FatigueDetectionEngine` & `DistractionEngine` | Session length, latency drift, window blur | Fatigue score & calm reset recommendations |
| **5. Behavioral Companion** | `QUBOTDecisionEngine` & `InterventionEngine` | Diagnosed struggle + learner age tier | 18 States, 12 Emotions, Animation ID, Envelope |
| **6. Cognitive Break Policy**| `FocusPolicyEngine` & `FocusService` | Pomodoro cycle count & skip history | Enforced break transitions (`HTTP 423` on violation) |
