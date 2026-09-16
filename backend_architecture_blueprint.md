# Backend Architecture Blueprint & Complete System Reference Manual

> **Document Status:** Authoritative System Blueprint  
> **Version:** 2.0 (Complete & Unified)  
> **Target Platform:** AI-Powered Adaptive Learning & Quantum Simulation Platform  
> **Core Frameworks:** FastAPI (Python 3.11+), SQLAlchemy 2.0 (Async), PostgreSQL, Alembic, Pydantic V2, Qiskit, Redis

---

## 1. System Overview & Core Principles

The backend functions as the single authoritative intelligence and persistence engine for the platform. It is strictly engineered around five architectural tenets:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ZERO-TRUST CLIENT                                │
│  Client only submits raw user interactions (e.g. answer option ID, focus    │
│  tick, circuit JSON). Backend calculates all scores, mastery deltas, XP,    │
│  streak status, level ups, and break policy gates.                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGE-ADAPTIVE PRESENTATION                           │
│  A single shared intelligence engine outputs structured payloads enriched   │
│  with `age_tier_config`. Presentation adapts across Young, Student, and      │
│  Adult/Professional personas without duplicating backend logic.             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONTINUOUS KNOWLEDGE TRACING (BKT)                      │
│  Curriculum is modeled as a Directed Acyclic Graph (DAG). Mastery is        │
│  computed dynamically per concept node with concept-specific thresholds.    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BEHAVIOR-AWARE FOCUS & MASCOT COMPANION                   │
│  Enforces sustainable study habits (1st skip allowed, 2nd consecutive skip  │
│  requires mandatory rest) and listens to idle/distraction signals.          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Backend File Structure

```
backend/
├── GEMINI.md                               # AI agent guidelines and non-negotiable coding rules
├── README.md                               # Setup, environment, test commands, and seeding guide
├── pyproject.toml                          # Python packaging, dependencies, linters (Ruff, Mypy)
├── .env.example                            # Required environment variables specification
├── Dockerfile                              # Multi-stage production container
├── docker-compose.yml                      # Local Postgres, Redis, and API service composition
├── alembic.ini                             # Database migration configuration
│
├── docs/                                   # Domain technical documentation (15 domain specs)
│   ├── architecture.md                     # Backend boundaries, data flow, and layers
│   ├── database-schema.md                  # Tables, relationships, indexes, constraints
│   ├── api-contracts.md                    # REST & WebSocket endpoint contracts
│   ├── authentication.md                   # JWT, refresh rotation, OAuth2, RBAC rules
│   ├── onboarding.md                       # Diagnostic profiling, goals, preferences
│   ├── curriculum.md                       # Courses, modules, lessons, concepts, DAG prerequisites
│   ├── assessment-engine.md                # Question types, scoring rubrics, distractor analysis
│   ├── adaptive-engine.md                  # BKT mastery formulas & recommendation graphs
│   ├── progress-gamification.md            # XP ledger, streak grace periods, badge triggers
│   ├── mascot-events.md                    # Mascot state machine, event mappings, dialogue catalog
│   ├── focus-pomodoro.md                   # Focus state machine, skip policies, mandatory breaks
│   ├── ai-tutor.md                         # RAG curriculum grounding, prompts, guardrails
│   ├── quantum-lab.md                      # Qiskit simulator pipeline, Colab launch configs
│   ├── instructor-analytics.md             # Cohort metrics, drop-off tracking, mastery heatmaps
│   ├── security.md                         # Authorization, input sanitation, rate limits
│   └── implementation-plan.md              # Milestones, delivery ordering, and task tracking
│
├── alembic/                                # Database migration environment
│   ├── env.py                              # Async SQLAlchemy migration runtime
│   ├── script.py.mako                      # Migration template
│   └── versions/                           # Timestamped migration versions
│
├── scripts/                                # Maintenance and seed CLI utilities
│   ├── seed_database.py                    # Master development database seeder
│   ├── seed_curriculum.py                  # Quantum curriculum seed (concepts, lessons, graphs)
│   ├── seed_assessments.py                 # Diagnostic and lesson quiz seed data
│   ├── create_admin.py                     # CLI to scaffold root admin / instructor credentials
│   └── validate_content.py                 # Content linter (checks orphan concepts, broken links)
│
├── app/
│   ├── main.py                             # FastAPI factory, middleware, CORS, exception handlers
│   │
│   ├── core/                               # Cross-cutting platform infrastructure
│   │   ├── config.py                       # Pydantic BaseSettings (.env loading & validation)
│   │   ├── database.py                     # Async engine, sessionmaker, base declarative class
│   │   ├── security.py                     # Argon2/bcrypt password hashing, JWT encode/decode
│   │   ├── dependencies.py                 # FastAPI Depends (get_db, get_current_user, etc.)
│   │   ├── permissions.py                  # Learner, Instructor, Admin role authorization
│   │   ├── exceptions.py                   # Domain-specific typed HTTP exceptions
│   │   ├── logging.py                      # JSON structured logging with correlation IDs
│   │   ├── rate_limit.py                   # Redis-backed / in-memory sliding window throttling
│   │   └── websocket_manager.py            # Real-time WebSocket connection registry & broadcaster
│   │
│   ├── api/                                # REST & WebSocket Route Handlers (Presentation Layer)
│   │   ├── router.py                       # Aggregates sub-routers with version prefixes (/api/v1)
│   │   ├── health.py                       # Liveness & readiness probes (/health, /ready)
│   │   ├── auth.py                         # /auth/register, /auth/login, /auth/refresh, /auth/logout
│   │   ├── users.py                        # /users/me, /users/profile, /users/preferences
│   │   ├── onboarding.py                   # /onboarding/profile, /onboarding/diagnostic, /onboarding/complete
│   │   ├── courses.py                      # /courses, /courses/{id}, /courses/{id}/modules
│   │   ├── lessons.py                      # /lessons/{id}, /lessons/{id}/complete
│   │   ├── resources.py                    # /resources/{id}, /resources/by-concept/{concept_id}
│   │   ├── assessments.py                  # /assessments/{id}/start, /assessments/{id}/submit
│   │   ├── learning_paths.py               # /learning-paths/current, /learning-paths/recalculate
│   │   ├── recommendations.py              # /recommendations/next-action
│   │   ├── progress.py                     # /progress/summary, /progress/topics, /progress/history
│   │   ├── achievements.py                 # /achievements, /achievements/user
│   │   ├── mascot.py                       # /mascot/state, /mascot/interact, /mascot/idle-nudge
│   │   ├── focus.py                        # /focus/start, /focus/complete, /focus/break-skip, /focus/break-done, /focus/distraction-event
│   │   ├── ai_tutor.py                     # /tutor/ask, /tutor/conversations/{id}
│   │   ├── circuits.py                     # /circuits, /circuits/{id}/execute
│   │   ├── lab.py                          # /lab/colab-link/{lesson_id}, /lab/simulators
│   │   ├── instructor.py                   # /instructor/analytics, /instructor/cohorts
│   │   ├── admin.py                        # /admin/users, /admin/content, /admin/system
│   │   └── websocket.py                    # /ws/events?token={jwt}
│   │
│   ├── models/                             # SQLAlchemy ORM Models (Database Layer)
│   │   ├── base.py                         # TimestampMixin, UUID/ULID primary keys
│   │   ├── user.py                         # User auth account (email, hash, role, status)
│   │   ├── user_profile.py                 # Profile details (age_bracket, persona, display_name)
│   │   ├── user_goal.py                    # Learning goals & target timelines
│   │   ├── user_preference.py              # Visual density, mascot verbosity, dark mode, reduced motion
│   │   ├── course.py                       # High-level curriculum entity
│   │   ├── module.py                       # Unit / chapter grouping within a course
│   │   ├── lesson.py                       # Bite-sized learning unit
│   │   ├── concept.py                      # Knowledge graph concept node
│   │   ├── concept_prerequisite.py         # Directed graph edge between concepts
│   │   ├── learning_resource.py            # Rich explanation, visual diagram, interactive widget
│   │   ├── assessment.py                   # Quiz / diagnostic container
│   │   ├── question.py                     # Question prompt, difficulty level, concept tag
│   │   ├── answer_option.py                # Distractors and correct options with explanations
│   │   ├── assessment_attempt.py           # User assessment attempt session
│   │   ├── assessment_response.py          # User question response and timestamp
│   │   ├── learner_mastery.py              # Concept mastery rating (0.0 to 1.0, confidence, last_assessed)
│   │   ├── learning_path.py                # Active personalized sequence
│   │   ├── learning_path_item.py           # Ordered path node (lesson / quiz)
│   │   ├── recommendation.py               # Current next-best-action decision record
│   │   ├── lesson_completion.py            # User lesson history & time spent
│   │   ├── progress_event.py               # Audit trail of learning steps
│   │   ├── xp_transaction.py               # Immutable ledger of XP awarded (source, amount, timestamp)
│   │   ├── streak.py                       # Daily streak counter, freeze tokens, last_active_date
│   │   ├── achievement.py                  # Badge definition, criteria rules, metadata
│   │   ├── user_achievement.py             # User unlocked badge instances
│   │   ├── mascot_event.py                 # Mascot dialog / state change history
│   │   ├── focus_session.py                # Pomodoro timer session record (duration, completed, skipped)
│   │   ├── break_record.py                 # Focus break log (duration, status: SKIPPED / COMPLETED)
│   │   ├── ai_conversation.py              # AI tutor conversation threads
│   │   ├── ai_message.py                   # Individual prompt / response pairs with citation tags
│   │   ├── circuit.py                      # User saved quantum circuits (JSON / QASM)
│   │   ├── circuit_execution.py            # Simulation execution job, counts, statevector, run_time
│   │   └── audit_log.py                    # Admin & security operation history
│   │
│   ├── schemas/                            # Pydantic V2 Models (Data Validation & Serialization)
│   │   ├── common.py                       # Generic responses, PaginationParams, PaginatedResponse[T]
│   │   ├── auth.py                         # TokenResponse, LoginRequest, RegisterRequest
│   │   ├── user.py                         # UserRead, UserUpdate, ProfileSchema, AgeTierConfigSchema
│   │   ├── onboarding.py                   # OnboardingRequest, DiagnosticSubmission, OnboardingResult
│   │   ├── course.py                       # CourseListRead, CourseDetailRead, ModuleRead
│   │   ├── lesson.py                       # LessonRead, LessonCompleteRequest, ContentCardSchema
│   │   ├── resource.py                     # ResourceRead, VisualAssetSchema
│   │   ├── assessment.py                   # AssessmentStartRead, QuestionRead, AnswerSubmit, AssessmentResultRead
│   │   ├── learning_path.py                # LearningPathRead, LearningPathItemRead
│   │   ├── recommendation.py               # NextActionResponse, MasteryDeltaSchema
│   │   ├── progress.py                     # ProgressOverviewRead, TopicMasteryRead, StreakStatusRead
│   │   ├── achievement.py                  # AchievementRead, UnlockedBadgeNotification
│   │   ├── mascot.py                       # MascotStateResponse, MascotInteractionRequest, IdleNudgeRequest
│   │   ├── focus.py                        # FocusSessionStart, FocusStatusResponse, BreakPolicyResponse, DistractionEventRequest
│   │   ├── ai_tutor.py                     # TutorQueryRequest, TutorAnswerResponse, SourceCitation
│   │   ├── circuit.py                      # CircuitCreate, CircuitUpdate, CircuitRead
│   │   ├── lab.py                          # SimulationRunRequest, SimulationResultResponse, BlochVector
│   │   └── instructor.py                   # CohortAnalyticsRead, DropoutRiskRead, ConceptStruggleHeatmap
│   │
│   ├── repositories/                       # Clean Data Access Layer (SQLAlchemy Async Queries)
│   │   ├── base.py                         # Generic CRUD repository (get, get_multi, create, update, delete)
│   │   ├── user_repository.py              # User, profile, goal, and preference queries
│   │   ├── course_repository.py            # Course, module, concept graph queries
│   │   ├── lesson_repository.py            # Lesson & resource queries
│   │   ├── assessment_repository.py        # Assessment, question, and attempt query logic
│   │   ├── mastery_repository.py           # Concept mastery and skill decay queries
│   │   ├── progress_repository.py          # Lesson completions, XP history, streak status
│   │   ├── achievement_repository.py       # Badges, unlocks, and criteria queries
│   │   ├── focus_repository.py             # Focus sessions, break logs, policy state queries
│   │   ├── circuit_repository.py           # Circuit definitions and execution results
│   │   └── analytics_repository.py         # Aggregations, cohorts, completion rates
│   │
│   ├── services/                           # Business Logic & Orchestration Layer
│   │   ├── auth_service.py                 # Registration, login, token refresh, password resets
│   │   ├── user_service.py                 # User profile management and age-tier configuration delivery
│   │   ├── onboarding_service.py           # Multi-step onboarding & initial diagnostic placement
│   │   ├── curriculum_service.py           # Course catalog and prerequisite resolution
│   │   ├── lesson_service.py               # Lesson rendering and completion processing
│   │   ├── resource_service.py             # Multimedia resource delivery
│   │   ├── assessment_service.py           # Handles quiz lifecycle, submissions, and feedback
│   │   ├── learning_path_service.py        # Path generation and dynamic recalibration
│   │   ├── recommendation_service.py       # Orchestrates next learning step suggestions
│   │   ├── progress_service.py             # Progress calculation, aggregate mastery summaries
│   │   ├── achievement_service.py          # Evaluates badge unlock triggers
│   │   ├── mascot_service.py               # Dispatches mascot reaction events & idle nudges
│   │   ├── focus_service.py                # Focus sessions, distraction events, break policy validation
│   │   ├── ai_tutor_service.py             # LLM orchestration, RAG prompt assembly, guardrail enforcement
│   │   ├── circuit_service.py              # Circuit CRUD and JSON parsing
│   │   ├── lab_service.py                  # Quantum simulator execution and Colab link generator
│   │   ├── instructor_service.py           # Instructor dashboards, cohort analytics
│   │   ├── notification_service.py         # Push notifications / WebSocket real-time updates
│   │   └── audit_service.py                # Security & compliance audit logging
│   │
│   ├── engines/                            # Algorithmic & Decision Engines (Core Intelligence)
│   │   ├── diagnostic_engine.py            # Evaluates initial diagnostic to compute starting level
│   │   ├── mastery_engine.py               # Bayesian / Score-weighted concept mastery updater
│   │   ├── assessment_engine.py            # Evaluates answer choices, extracts mistake patterns
│   │   ├── learning_engine.py              # Selects optimal node sequence across prerequisite DAG
│   │   ├── recommendation_engine.py        # Chooses Advance vs Reinforce vs Revise
│   │   ├── progression_engine.py           # Computes user XP level thresholds (e.g. Level 1 -> 2 -> 3)
│   │   ├── gamification_engine.py          # Awards XP, increments streaks, checks badge rules
│   │   ├── focus_policy_engine.py          # Enforces 1st skip allowed -> 2nd consecutive mandatory break
│   │   └── mascot_event_engine.py          # Maps events (e.g., streak_lost, quiz_passed, idle) to mascot reactions
│   │
│   ├── ai/                                 # AI Tutor & Safe RAG Implementation
│   │   ├── provider.py                     # Provider interface (OpenAI / Anthropic / Gemini / Local)
│   │   ├── tutor_context.py                # Assembles safe student profile, current concept, active mistakes
│   │   ├── prompts.py                      # System prompts, Socratic teaching templates, few-shots
│   │   ├── retrieval.py                    # Vector/lexical retrieval of approved curriculum text
│   │   ├── guardrails.py                   # Strict out-of-domain rejection, tone check, safety filters
│   │   ├── response_parser.py              # Structured JSON/Markdown parser with citation links
│   │   └── evaluator.py                    # Automated response quality and hallucination checker
│   │
│   ├── quantum/                            # Quantum Execution & Simulation Subsystem
│   │   ├── base.py                         # Abstract QuantumBackend interface
│   │   ├── circuit_validator.py            # Syntax, qubit count limit, and gate compatibility validator
│   │   ├── qiskit_backend.py               # Qiskit Aer simulator implementation (Statevector, Shots)
│   │   ├── pennylane_backend.py            # Adapter for variational quantum circuits (Future/Extensible)
│   │   ├── cirq_backend.py                 # Adapter for Google Cirq interfaces (Future/Extensible)
│   │   ├── colab_launcher.py               # Generates customized Google Colab / Jupyter notebook URLs
│   │   ├── result_normalizer.py            # Formats shot counts, probabilities, statevectors into standard schema
│   │   └── visualization_data.py           # Prepares Bloch sphere coordinates and histogram datasets
│   │
│   ├── events/                             # Event Dispatching & WebSocket Contracts
│   │   ├── event_types.py                  # Strongly typed event enum (e.g., `LESSON_COMPLETED`, `BREAK_REQUIRED`)
│   │   ├── event_publisher.py              # Internal pub/sub event publisher
│   │   └── event_handlers.py               # Async event listeners (e.g. triggers mascot reaction on quiz fail)
│   │
│   ├── tasks/                              # Asynchronous Background Tasks (Celery / BackgroundTasks)
│   │   ├── reminder_tasks.py               # Daily study notifications & inactivity prompts
│   │   ├── streak_tasks.py                 # Midnight streak validation & freeze token consumption
│   │   ├── analytics_tasks.py              # Nightly rollup of cohort analytics
│   │   └── content_validation_tasks.py     # Scheduled check for curriculum graph consistency
│   │
│   ├── constants/                          # System Enumerations & Constants
│   │   ├── roles.py                        # Roles: LEARNER, INSTRUCTOR, ADMIN
│   │   ├── mastery.py                      # Mastery levels: NOVICE, DEVELOPING, PROFICIENT, MASTERED
│   │   ├── focus_states.py                 # States: IDLE, IN_FOCUS, BREAK_RECOMMENDED, BREAK_SKIPPED, BREAK_REQUIRED
│   │   ├── mascot_states.py                # States: IDLE, HAPPY, THINKING, ENCOURAGING, CELEBRATING, etc.
│   │   └── achievement_types.py            # Types: STREAK_MILESTONE, MASTERY_COUNT, SPEED_CHALLENGE
│   │
│   └── utils/                              # Shared Helpers & Utilities
│       ├── datetime.py                     # UTC timezone formatting, streak delta calculation
│       ├── pagination.py                   # Cursor and offset pagination helpers
│       ├── identifiers.py                  # ULID/UUID generator utilities
│       └── validation.py                   # Input sanitation and regex validators
│
└── tests/                                  # Automated Test Suite
    ├── conftest.py                         # Fixtures (async db session, test client, mock tokens)
    ├── factories/                          # FactoryBoy / Polyfactory data generators
    ├── unit/                               # Isolated unit tests for engines, services, quantum, AI
    │   ├── engines/                        # Tests for all 9 decision engines
    │   ├── services/                       # Tests for business logic operations
    │   ├── quantum/                        # Tests for circuit validator, Qiskit simulator
    │   └── ai/                             # Tests for guardrails, prompt builder, response parser
    ├── integration/                        # Database & API route integration tests
    │   ├── api/                            # REST endpoint tests with authenticated clients
    │   ├── database/                       # Repository and constraint tests
    │   └── websocket/                      # Live WebSocket event tests
    └── e2e/                                # End-to-end integration flows
        ├── onboarding_flow_test.py         # Onboarding -> diagnostic -> path generation
        ├── adaptive_learning_flow_test.py  # Lesson -> assessment -> recommendation loop
        ├── focus_break_policy_test.py      # Session 1 skip -> Session 2 mandatory break enforcement
        └── circuit_execution_flow_test.py  # Circuit creation -> validation -> Qiskit simulation
```

---

## 3. Deep Engine Specifications & Formulas

### 3.1. Diagnostic & Mastery Engines (`diagnostic_engine.py` & `mastery_engine.py`)

#### Diagnostic Baseline Calculation
* Entry diagnostic contains balanced questions across 3 prerequisite domains:
  1. *Linear Algebra & Complex Numbers* ($C_1$)
  2. *Probability & Superposition Foundations* ($C_2$)
  3. *Logic Gates & Computing Basics* ($C_3$)
* **Initial Skill Level Formula:**
  $$\text{Level}_{\text{initial}} = 1 + \left\lfloor \sum_{i=1}^{n} w_i \cdot \text{Correct}_i \times 3.0 \right\rfloor$$
  * Score $< 40\%$ $\rightarrow$ Level 1 (Fundamentals Path)
  * Score $40\% - 75\%$ $\rightarrow$ Level 2 (Standard Quantum Path)
  * Score $> 75\%$ $\rightarrow$ Level 3 (Advanced Quantum Circuit Path)

#### Dynamic Bayesian Knowledge Tracing (BKT)
Mastery $P(L_{t})$ for concept $k$ after observing response $R_t \in \{1, 0\}$ is computed as:
$$P(L_t \mid R_t=1) = \frac{P(L_{t-1}) \cdot (1 - P(S))}{P(L_{t-1}) \cdot (1 - P(S)) + (1 - P(L_{t-1})) \cdot P(G)}$$
$$P(L_t \mid R_t=0) = \frac{P(L_{t-1}) \cdot P(S)}{P(L_{t-1}) \cdot P(S) + (1 - P(L_{t-1})) \cdot (1 - P(G))}$$
Where:
* $P(G)$ (Guess probability) $= 0.20$ (standard 4-choice MCQ)
* $P(S)$ (Slip probability) $= 0.10$
* Concept Transition: $P(L_{t+1}) = P(L_t) + (1 - P(L_t)) \cdot P(T)$ with $P(T) = 0.15$

#### Concept-Specific Threshold Matrix
Unlike naive platforms with a static 80% passing grade, thresholds scale by concept criticality:

| Concept Category | Example Topics | Required $P(L)$ Threshold | Recommendation on Failure |
|:---|:---|:---:|:---|
| **Foundational / Gatekeeper** | Matrix Multiplication, Complex Phases | $\ge 0.85$ | Force Prerequisite Revision |
| **Core Quantum Concepts** | Superposition, Entanglement, Bloch Sphere | $\ge 0.80$ | Targeted Reinforcement Cards |
| **Exploratory / Advanced** | Quantum Teleportation, Grover Search | $\ge 0.70$ | Advance with Optional Practice |

---

### 3.2. Recommendation Engine (`recommendation_engine.py`)

Traverses the curriculum DAG and outputs an actionable `NextActionResponse`:

```text
                  Assessment Result: Concept C_k
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
    P(L) >= Threshold     0.50 <= P(L) < Thresh       P(L) < 0.50
     [ADVANCE]              [REINFORCE]               [REVISE]
          │                     │                     │
Unlock next DAG node     Trigger 2 interactive    Traverse backward to
and update learner       concept cards on         prerequisite concept node
active level             weak subtopics           in the curriculum DAG
```

---

### 3.3. Focus & Pomodoro Policy Engine (`focus_policy_engine.py`)

Strictly regulates endurance and screen fatigue. The backend is the sole authority of the state machine:

```
                      ┌──────────────────────┐
                      │    IDLE / STANDBY    │
                      └──────────┬───────────┘
                                 │ POST /focus/start
                                 ▼
                      ┌──────────────────────┐
                      │   IN_FOCUS (25 min)  │
                      └──────────┬───────────┘
                                 │ POST /focus/complete
                                 ▼
                      ┌──────────────────────┐
                      │  BREAK_RECOMMENDED   │
                      └────┬────────────┬────┘
                           │            │
         POST /focus/break-done         │ POST /focus/break-skip
                           │            │ (Logged as BREAK_SKIPPED)
                           │            ▼
                           │  ┌──────────────────────┐
                           │  │  IN_FOCUS (Cycle 2)  │
                           │  └─────────┬────────────┘
                           │            │ POST /focus/complete
                           │            ▼
                           │  ┌──────────────────────┐
                           │  │    BREAK_REQUIRED    │
                           │  │  (Mandatory Rest)    │
                           │  └─────────┬────────────┘
                           │            │
                           └────────────┼──────── POST /focus/break-done
                                        │ (5 min completed)
                                        ▼
                              [New Focus Permitted]
```

#### Distraction Ingestion Pipeline (`/focus/distraction-event`)
* **Trigger:** Frontend detects `window.onblur` $> 45\text{s}$ or `idleTimer` $> 180\text{s}$ on a learning screen.
* **Backend Processing:**
  1. Records `DistractionEvent` in database.
  2. Dispatches `mascot.nudge` WebSocket message with contextual assistance:
     > *"Stuck on this quantum circuit step? Let's take a 2-minute breather or ask the AI Tutor for a hint!"*

---

### 3.4. Age-Tier Persona Configuration (`user_service.py`)

Returned in `/api/v1/users/me` and `/api/v1/onboarding/profile` to control presentation without backend fork:

```json
{
  "user_id": "usr_01J8...",
  "age_bracket": "STUDENT",
  "age_tier_config": {
    "theme_mode": "balanced",
    "visual_density": "standard",
    "mascot_presence": "interactive",
    "gamification_intensity": "high",
    "animation_profile": "smooth_active",
    "features": {
      "show_xp_bursts": true,
      "show_streak_animations": true,
      "mascot_voice_prompts": true,
      "dense_data_tables": false
    }
  }
}
```

* **`YOUNG`:** High animation, playful card sizes, prominent mascot, simplified text hierarchy.
* **`STUDENT`:** Balanced gamification, competitive streak tracking, structured step progression.
* **`ADULT_PROFESSIONAL`:** Minimal mascot footprint, high data density, focus on practical execution time.

---

### 3.5. Mascot State Engine (`mascot_event_engine.py`)

Maps platform events to mascot emotional states, animations, and age-adapted dialogues:

| Event | Mascot State | Dialogue (Student/Young) | Dialogue (Adult/Professional) |
|:---|:---|:---|:---|
| `LOGIN` | `HAPPY` | "Welcome back! Ready for today's quantum mission?" | "Welcome back. Resuming at Quantum Gates." |
| `ASSESSMENT_PASSED` | `CELEBRATING` | "Awesome job! You mastered Superposition! 🎉" | "Assessment passed (Score: 92%). Node unlocked." |
| `ASSESSMENT_FAILED` | `ENCOURAGING` | "Don't sweat it! Quantum physics is weird. Let's review the Bloch sphere!" | "Mastery score below threshold. Reviewing foundation." |
| `BREAK_RECOMMENDED` | `BREAK_REMINDER`| "Time for a 5-minute snack break! Brains need recharge!" | "Session 1 complete. 5-minute break recommended." |
| `BREAK_REQUIRED` | `BREAK_REMINDER`| "Whoa, 2 focus cycles straight! Mandatory break time now!" | "Two consecutive cycles completed. Rest required." |
| `IDLE_DISTRACTED` | `THINKING` | "Need a hand with this equation? I can explain it simpler!" | "Lesson paused. Need a hint on this concept?" |

---

### 3.6. Quantum Execution Lab Subsystem (`app/quantum/`)

```
                          ┌──────────────────────────┐
                          │   Frontend Circuit JSON  │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │  circuit_validator.py    │
                          │ - Max 10 qubits (safety) │
                          │ - Max depth 100          │
                          │ - Syntax / Gate checks   │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │   qiskit_backend.py      │
                          │ - AerSimulator / Sampler │
                          │ - Computes Statevector   │
                          │ - Computes Shot Counts   │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │  result_normalizer.py    │
                          │  & visualization_data.py │
                          │ - Output Shot Histogram  │
                          │ - (x, y, z) Bloch Vector │
                          └──────────────────────────┘
```

* **Bloch Sphere Vector Mapping:**
  For single-qubit state $|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$:
  $$x = \sin\theta\cos\phi, \quad y = \sin\theta\sin\phi, \quad z = \cos\theta$$

---

## 4. API Endpoints Contract Map

| Group | Method | Path | Description | Authority / Guard |
|:---|:---|:---|:---|:---|
| **Auth** | `POST` | `/api/v1/auth/register` | Register new account | Public, Rate-limited |
| | `POST` | `/api/v1/auth/login` | Authenticate & get JWT tokens | Public, Rate-limited |
| | `POST` | `/api/v1/auth/refresh` | Rotate access token | Valid Refresh Token |
| **Onboarding** | `POST` | `/api/v1/onboarding/profile` | Set age bracket, goals, preferences | Authenticated User |
| | `POST` | `/api/v1/onboarding/diagnostic` | Submit entry quiz answers | Authenticated User |
| | `GET` | `/api/v1/onboarding/status` | Get initial level placement & path | Authenticated User |
| **Courses & DAG** | `GET` | `/api/v1/courses` | List all active courses | Authenticated User |
| | `GET` | `/api/v1/courses/{id}/dag` | Get full prerequisite concept graph | Authenticated User |
| | `GET` | `/api/v1/lessons/{id}` | Fetch lesson cards & resources | Authenticated User |
| | `POST` | `/api/v1/lessons/{id}/complete` | Mark lesson card done | Backend validates time |
| **Assessment** | `POST` | `/api/v1/assessments/{id}/start`| Start timed quiz attempt session | Authenticated User |
| | `POST` | `/api/v1/assessments/{id}/submit`| Submit answers $\rightarrow$ updates BKT | Authoritative Scoring |
| **Recommendation**| `GET` | `/api/v1/recommendations/next` | Real-time `ADVANCE/REINFORCE/REVISE` | Authoritative BKT |
| **Focus Mode** | `POST` | `/api/v1/focus/start` | Start 25-min focus session | Authenticated User |
| | `POST` | `/api/v1/focus/complete` | Complete focus session | Validates duration |
| | `POST` | `/api/v1/focus/break-skip` | Skip 1st break (records status) | Allowed once |
| | `POST` | `/api/v1/focus/break-done` | Record break completion | Clears mandatory rest |
| | `POST` | `/api/v1/focus/distraction`| Ingest idle / blur event | Triggers mascot nudge |
| **Mascot** | `GET` | `/api/v1/mascot/state` | Current mood, dialogue, state | Authenticated User |
| | `POST` | `/api/v1/mascot/interact` | User taps mascot | Returns contextual tip |
| **AI Tutor** | `POST` | `/api/v1/tutor/ask` | Safe RAG-grounded quantum tutor | Guardrail Checked |
| **Quantum Lab** | `POST` | `/api/v1/circuits/execute` | Run circuit in Qiskit simulator | Max 10 qubits / 1024 shots |
| | `GET` | `/api/v1/lab/colab/{lesson_id}`| Generate preconfigured Colab link | Authenticated User |
| **Progress** | `GET` | `/api/v1/progress/summary` | XP, level, streak, mastery stats | Authenticated User |
| **Instructor** | `GET` | `/api/v1/instructor/analytics` | Cohort retention & mastery heatmap | Role: `INSTRUCTOR/ADMIN` |
| **WebSocket** | `WS` | `/ws/events` | Real-time event subscription channel | JWT via query token |

---

## 5. Database Schema & Key Relationships

```
┌──────────────────┐          ┌───────────────────┐          ┌──────────────────┐
│      users       │1       1 │   user_profiles   │1       * │  xp_transactions │
│──────────────────┼──────────┼───────────────────┼──────────┼──────────────────┤
│ id (PK)          │          │ user_id (FK, UQ)  │          │ id (PK)          │
│ email (UQ)       │          │ age_bracket       │          │ user_id (FK)     │
│ password_hash    │          │ display_name      │          │ amount           │
│ role (ENUM)      │          │ persona           │          │ reason           │
└────────┬─────────┘          └───────────────────┘          └──────────────────┘
         │
         │1
         │
         ├────────────────────────────────┬────────────────────────────────┐
         │*                               │*                               │*
┌────────┴─────────┐             ┌────────┴──────────┐            ┌────────┴─────────┐
│ focus_sessions   │             │ learner_mastery   │            │assessment_attempt│
│──────────────────┤             │───────────────────┤            │──────────────────┤
│ id (PK)          │             │ id (PK)           │            │ id (PK)          │
│ user_id (FK)     │             │ user_id (FK)      │            │ user_id (FK)     │
│ cycle_number     │             │ concept_id (FK)   │            │ assessment_id(FK)│
│ break_skipped    │             │ mastery_score     │            │ score (FLOAT)    │
│ status (ENUM)    │             │ confidence (FLOAT)│            │ passed (BOOL)    │
└──────────────────┘             └───────────────────┘            └──────────────────┘
```

---

## 6. Testing & Quality Assurance Plan

1. **Unit Tests (`pytest tests/unit/`):**
   * Test BKT formula transitions for edge probabilities.
   * Verify Focus Engine locks after 2 consecutive skips.
   * Test Qiskit circuit validator on illegal gate depths and qubit counts.
   * Test AI guardrails with out-of-domain prompts.
2. **Integration Tests (`pytest tests/integration/`):**
   * Authenticated REST client requests for lesson completion, quizzes, and focus intervals.
   * Concurrent streak update tests with database transactions.
3. **End-to-End Scenarios (`pytest tests/e2e/`):**
   * Full Onboarding $\rightarrow$ Diagnostic Assessment $\rightarrow$ Level placement $\rightarrow$ Personalized Path Generation.
   * Focus Session 1 $\rightarrow$ Skip Break $\rightarrow$ Focus Session 2 $\rightarrow$ Verify `BREAK_REQUIRED` gate rejects Focus Session 3 until break is logged.
