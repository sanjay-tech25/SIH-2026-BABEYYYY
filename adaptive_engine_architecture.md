# Adaptive Learning Engine Architecture & Working Blueprint

> **A Comprehensive Visual & Mathematical Guide to the Multi-Tiered Quantum Adaptive Learning System**

---

## 1. Executive Overview & System Architecture

The Adaptive Learning Engine powers a personalized, non-linear quantum computing curriculum. Instead of forcing all learners through a rigid linear sequence, it dynamically evaluates cognitive mastery, calculates real-time transition probabilities, enforces prerequisite mastery via a Directed Acyclic Graph (DAG), and provides automated remediation.

### 1.1 Complete End-to-End Visual Pipeline

```mermaid
flowchart TD
    Start([Learner Joins Platform]) --> Diag[1. Diagnostic Placement Engine]
    Diag --> InitPriors[Initialize Concept Mastery Priors P_L0]
    
    InitPriors --> LearningLoop{Learning & Assessment Loop}
    
    LearningLoop --> Lesson[Interactive Lesson & Qiskit Lab]
    Lesson --> Checkpoint[Assessment / Quiz Submission]
    
    Checkpoint --> BKT[2. Bayesian Knowledge Tracing Engine]
    BKT --> Posterior[Compute Posterior Mastery P_Lt]
    
    Posterior --> ThresholdCheck{3. Concept Threshold Evaluator}
    
    ThresholdCheck -->|P_Lt >= Concept Threshold| Advance[🟢 ADVANCE: Unlock Next DAG Concept]
    ThresholdCheck -->|0.50 <= P_Lt < Threshold| Reinforce[🟡 REINFORCE: Serve Interactive Katas & Simulations]
    ThresholdCheck -->|P_Lt < 0.50 Repeatedly| Revise[🔴 REVISE: Route back to Upstream Prerequisite]
    
    Advance --> UpdateDAG[Traverse Knowledge Graph DAG]
    Reinforce --> LearningLoop
    Revise --> LearningLoop
    UpdateDAG --> LearningLoop
    
    subgraph Parallel Subsystems
        FocusEngine[Pomodoro Focus Policy Engine]
        MascotEngine[Age-Adaptive Mascot Engine]
        AIEngine[Socratic AI Tutor & Obsidian Vault RAG]
    end
    
    LearningLoop -.-> FocusEngine
    LearningLoop -.-> MascotEngine
    LearningLoop -.-> AIEngine
```

---

## 2. Component 1: Diagnostic Placement Engine

When a learner first logs in, they undergo an adaptive diagnostic assessment to evaluate their mathematical and quantum foundations.

```
       [ Diagnostic Quiz (Math & Quantum Foundations) ]
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
     Score < 50%      Score 50% - 79%     Score >= 80%
            │                │                │
            ▼                ▼                ▼
     [ BEGINNER ]    [ INTERMEDIATE ]   [ ADVANCED ]
            │                │                │
   P(L0) Math = 0.10 P(L0) Math = 0.60 P(L0) Math = 0.90
   P(L0) Qubit = 0.05P(L0) Qubit= 0.50 P(L0) Qubit= 0.85
   Starts at Stage 01Starts at Stage 03Fast-tracks to Stage 06
```

### Purpose:
* Prevents advanced learners from being bored by basic linear algebra.
* Prevents novice learners from being overwhelmed by complex multi-qubit gates.

---

## 3. Component 2: Bayesian Knowledge Tracing (BKT) Engine

The mathematical core of the adaptive assessment is **Bayesian Knowledge Tracing (BKT)**. BKT models student knowledge as a latent (hidden) binary variable: **Mastered ($L=1$)** or **Not Mastered ($L=0$)**.

### 3.1 The Hidden Markov State Machine

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Unmastered: Initial State P(L_0)
    
    Unmastered --> Mastered: Learning Transition P(T)
    Unmastered --> Unmastered: 1 - P(T)
    Mastered --> Mastered: Retention (1 - Forget)
    
    note right of Unmastered
      Observations:
      - Correct: Guess P(G) = 0.20
      - Incorrect: 1 - P(G) = 0.80
    end note
    
    note right of Mastered
      Observations:
      - Correct: 1 - P(S) = 0.90
      - Incorrect: Slip P(S) = 0.10
    end note
```

### 3.2 The 4 Standard Parameters

| Parameter | Symbol | Default Value | Meaning |
| :--- | :---: | :---: | :--- |
| **Prior** | $P(L_0)$ | $0.10$ | Baseline probability that learner already knows the concept before instruction. |
| **Transition** | $P(T)$ | $0.15$ | Probability that learner transitions from unmastered to mastered state after a learning event. |
| **Slip** | $P(S)$ | $0.10$ | Probability that a learner who **knows** the concept makes an accidental mistake. |
| **Guess** | $P(G)$ | $0.20$ | Probability that a learner who **does not know** the concept guesses the correct answer. |

---

### 3.3 The Real-Time Update Formulas

#### Step 1: Observation Update (Bayes' Theorem)

* **Case A: Learner answers CORRECTLY**
  $$P(L_t | \text{Correct}) = \frac{P(L_{t-1}) \cdot (1 - P(S))}{P(L_{t-1}) \cdot (1 - P(S)) + (1 - P(L_{t-1})) \cdot P(G)}$$

* **Case B: Learner answers INCORRECTLY**
  $$P(L_t | \text{Incorrect}) = \frac{P(L_{t-1}) \cdot P(S)}{P(L_{t-1}) \cdot P(S) + (1 - P(L_{t-1})) \cdot (1 - P(G))}$$

#### Step 2: Learning Transition Update (Accounting for Instruction)

$$P(L_t) = P(L_t | \text{Obs}) + \Big(1 - P(L_t | \text{Obs})\Big) \cdot P(T)$$

---

### 3.4 Step-by-Step Numerical Walkthrough

Suppose a learner starts a new concept (*Superposition*) with prior $P(L_0) = 0.20$.

```
Attempt 1 (Correct):
  P(L1 | Correct) = (0.20 * 0.90) / [ (0.20 * 0.90) + (0.80 * 0.20) ]
                  = 0.18 / [ 0.18 + 0.16 ] = 0.18 / 0.34 = 0.5294
  P(L1) after Transition = 0.5294 + (1 - 0.5294) * 0.15 = 0.6000  (60.0% Mastery)

Attempt 2 (Correct):
  P(L2 | Correct) = (0.60 * 0.90) / [ (0.60 * 0.90) + (0.40 * 0.20) ]
                  = 0.54 / [ 0.54 + 0.08 ] = 0.54 / 0.62 = 0.8710
  P(L2) after Transition = 0.8710 + (1 - 0.8710) * 0.15 = 0.8903  (89.0% Mastery)

Result: 89.0% >= 80.0% (Core Concept Threshold) -> CONCEPT MASTERED! Unlocks next lesson.
```

---

## 4. Component 3: Concept-Weighted Mastery Thresholds

Rather than treating all concepts equally, the platform enforces **domain-calibrated mastery thresholds**:

```
 1.00 ┌───────────────────────────────────────────────────────────┐
      │                                                           │
 0.85 ├──────────────────────────── [FOUNDATIONAL THRESHOLD: 85%] │
      │ (Linear Algebra, Qubit State Vectors, Bra-Ket Notation)   │
 0.80 ├──────────────────────────── [CORE THRESHOLD: 80%]         │
      │ (Superposition, Pauli Gates, Bell State Entanglement)     │
 0.70 ├──────────────────────────── [ADVANCED THRESHOLD: 70%]     │
      │ (Grover Search, Shor's Algorithm, Surface Codes)          │
 0.00 └───────────────────────────────────────────────────────────┘
```

* **Foundational (0.85)**: Strict threshold prevents cognitive debt in multi-qubit systems.
* **Core (0.80)**: Standard operational threshold for quantum circuit design.
* **Advanced (0.70)**: Exploratory threshold for cutting-edge algorithms and hardware protocols.

---

## 5. Component 4: Knowledge Graph DAG & Prerequisite Resolver

The curriculum is represented as a **Directed Acyclic Graph (DAG)** with 106 concepts and 749 prerequisite edges extracted directly from Obsidian wikilinks.

### 5.1 Knowledge Graph DAG Sample

```mermaid
graph TD
    Math["01. Linear Algebra & Complex Amplitudes"] --> Qubit["02. Qubit State Vectors |0> and |1>"]
    Qubit --> Super["03. Quantum Superposition & Bloch Sphere"]
    Super --> Gates["04. Unitary Gates (H, X, Y, Z, Phase)"]
    Gates --> MultiQ["05. Multi-Qubit Registers & Tensor Products"]
    MultiQ --> Entangle["06. Quantum Entanglement & Bell Pairs"]
    Entangle --> Teleport["07. Quantum Teleportation Protocol"]
    Entangle --> Grover["08. Grover Amplitude Amplification"]
    Grover --> QFT["09. Quantum Fourier Transform"]
    QFT --> Shor["10. Shor's Prime Factorization"]

    classDef foundational fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef core fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef advanced fill:#311042,stroke:#f43f5e,stroke-width:2px,color:#fff;

    class Math,Qubit foundational;
    class Super,Gates,MultiQ,Entangle,Teleport core;
    class Grover,QFT,Shor advanced;
```

### 5.2 Topological Sorting & Prerequisite Enforcement
Before unlocking any concept $C_k$, the engine verifies:
$$\forall P_i \in \text{Prerequisites}(C_k): \quad \text{Mastery}(P_i) \ge \text{Threshold}(P_i)$$

If even a single prerequisite is below threshold, $C_k$ remains **LOCKED**.

---

## 6. Component 5: Dynamic Remediation Flow (Backtracking in DAG)

When a student struggles with a concept, the adaptive engine does not simply repeat the same question. It performs **DAG Backtracking Remediation**:

```mermaid
sequenceDiagram
    autonumber
    actor Learner
    participant UI as Frontend App
    participant BE as Assessment Engine
    participant BKT as BKT Mastery Engine
    participant REC as Recommendation Engine
    participant DAG as Knowledge Graph DAG

    Learner->>UI: Submits Answer for "Quantum Entanglement"
    UI->>BE: POST /api/v1/assessments/submit
    BE->>BKT: Calculate New Mastery
    BKT-->>BE: Mastery drops to 0.42 (< 0.50)
    BE->>REC: Evaluate Adaptive Action
    REC->>DAG: Inspect Prerequisites of "Quantum Entanglement"
    DAG-->>REC: Prerequisite = "Tensor Products & Multi-Qubits" (Mastery = 0.58)
    REC-->>BE: Recommendation = REVISE (Target: "Tensor Products")
    BE-->>UI: Return Diagnostic Remediation + Interactive Kata Card
    UI-->>Learner: "Let's reinforce multi-qubit tensor products before tackling Bell States!"
```

---

## 7. Component 6: Age-Bracket Cognitive Adaptation

The platform adapts content, cognitive load, and mascot tone according to the learner's age group:

```
┌─────────────────┬───────────────────┬────────────────────────────────────────┐
│ Persona         │ Cognitive Load    │ Visual & Pedagogical Style              │
├─────────────────┼───────────────────┼────────────────────────────────────────┤
│ 🐣 YOUNG        │ Low / Intuitive   │ • Spatial & coin-flip analogies        │
│   (Ages 8-12)   │                   │ • High gamification (Mascot animations)│
│                 │                   │ • Simplified non-matrix math           │
├─────────────────┼───────────────────┼────────────────────────────────────────┤
│ 🎓 STUDENT      │ Medium / Standard │ • Dirac Bra-Ket notation               │
│   (Ages 13-22)  │                   │ • Interactive Qiskit Python circuits   │
│                 │                   │ • Standard STEM curriculum alignment   │
├─────────────────┼───────────────────┼────────────────────────────────────────┤
│ 💼 ADULT        │ High / Rigorous   │ • Full unitary proof derivations       │
│   (Ages 23+)    │                   │ • Density matrices & Lindblad dynamics │
│                 │                   │ • Industrial Qiskit SDK workflows      │
└─────────────────┴───────────────────┴────────────────────────────────────────┘
```

---

## 8. Component 7: Pomodoro Focus Break Policy State Machine

To prevent cognitive fatigue during complex quantum calculations, the backend enforces an authoritative **Focus Policy**:

```mermaid
stateDiagram-v2
    direction TD
    IDLE --> FOCUS_ACTIVE: Start Focus (25m)
    FOCUS_ACTIVE --> BREAK_RECOMMENDED: 25m Timer Complete (+40 XP)
    
    BREAK_RECOMMENDED --> BREAK_ACTIVE: Take Break (5m)
    BREAK_RECOMMENDED --> CYCLE_2_ACTIVE: 1st Skip Allowed (Warning Modal)
    
    BREAK_ACTIVE --> IDLE: Break Finished (+15 XP)
    
    CYCLE_2_ACTIVE --> BREAK_REQUIRED: 2nd 25m Cycle Complete
    
    BREAK_REQUIRED --> MANDATORY_BREAK_LOCKED: 2nd Consecutive Skip Attempted
    note right of MANDATORY_BREAK_LOCKED
      Lockout: Assessment & Learning APIs Blocked (HTTP 423 Locked)
      Learner MUST take 5-minute break.
    end note
    
    MANDATORY_BREAK_LOCKED --> IDLE: Break Duration Elapsed
```

---

## 9. Component 8: Socratic AI Tutor & Obsidian Vault RAG

The AI Tutor uses **In-Context Socratic Prompting** combined with **Retrieval-Augmented Generation (RAG)** over the 107 Obsidian markdown notes:

```mermaid
flowchart LR
    Query["Learner Query: 'Why does measurement collapse the state?'"] --> Filter["Domain Guardrails"]
    Filter --> RAG["Vault Brain RAG Search"]
    
    subgraph Obsidian Knowledge Brain
        N1["02 - Measurement.md"]
        N2["02 - Born Rule.md"]
        N3["02 - Superposition.md"]
    end
    
    RAG --> N1
    RAG --> N2
    
    N1 & N2 --> ContextBuilder["Context & Age Persona Injector"]
    ContextBuilder --> LLM["Socratic LLM (Gemini / GPT-4o / Local RAG)"]
    LLM --> Answer["Socratic Guiding Question + Formula Citations"]
```

---

## 10. Summary Matrix of Adaptive Engines

| Subsystem | Underlying Algorithm | Response Time | Zero-Trust Authority |
| :--- | :--- | :---: | :---: |
| **Knowledge Tracing** | Bayesian Knowledge Tracing (BKT) | $< 2\text{ ms}$ | ✅ Backend Calculated |
| **Path Navigation** | Topological Sort on 749-Edge DAG | $< 5\text{ ms}$ | ✅ Backend Validated |
| **Focus Policy** | Finite State Machine (FSM) with Lockout | $< 1\text{ ms}$ | ✅ Server Enforced |
| **Gamification** | Immutable Double-Entry XP Ledger | $< 3\text{ ms}$ | ✅ Server Enforced |
| **Simulation Lab** | Qiskit Aer Statevector & Shots Simulator | $50 - 200\text{ ms}$ | ✅ Sandbox Executed |
| **AI Tutor** | Obsidian Vault RAG + Socratic Prompting | $300 - 800\text{ ms}$ | ✅ Guardrailed |
