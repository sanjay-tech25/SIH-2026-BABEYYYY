# Backend File Dictionary & Module Reference

> **Document Purpose:** Complete, concise, and explanatory reference for every single file in the `backend/` directory.

---

## 1. Root & Infrastructure Configuration

| File Path | Description |
|:---|:---|
| [`pyproject.toml`](file:///d:/sih2026/backend/pyproject.toml) | Python project configuration, dependencies (`fastapi`, `sqlalchemy`, `pydantic`, `qiskit`, `pytest`), tool settings (pytest, ruff). |
| [`.env.example`](file:///d:/sih2026/backend/.env.example) | Template of all required environment variables (JWT secrets, DB connection URLs, CORS domains, quantum limits). |
| [`app/main.py`](file:///d:/sih2026/backend/app/main.py) | Main FastAPI application entry point; handles lifespan startup, CORS middleware, global domain exception handling, and mounts API router `/api/v1`. |

---

## 2. Core Infrastructure (`app/core/`)

| File Path | Description |
|:---|:---|
| [`app/core/config.py`](file:///d:/sih2026/backend/app/core/config.py) | Pydantic `BaseSettings` loader for environment variables with type validation and defaults. |
| [`app/core/database.py`](file:///d:/sih2026/backend/app/core/database.py) | Async SQLAlchemy engine, `async_sessionmaker`, `Base` declarative class, and `get_db` session dependency. |
| [`app/core/security.py`](file:///d:/sih2026/backend/app/core/security.py) | PBKDF2-HMAC-SHA256 password hashing/verification and signed JWT access/refresh token encoding/decoding. |
| [`app/core/dependencies.py`](file:///d:/sih2026/backend/app/core/dependencies.py) | FastAPI dependencies for extracting authenticated `current_user` from JWT and enforcing role access. |
| [`app/core/permissions.py`](file:///d:/sih2026/backend/app/core/permissions.py) | Role-Based Access Control (RBAC) helper functions verifying permissions across Learner, Instructor, and Admin. |
| [`app/core/exceptions.py`](file:///d:/sih2026/backend/app/core/exceptions.py) | Strongly typed domain exceptions (`EntityNotFoundException`, `BreakPolicyViolationException`, `InvalidCircuitException`). |
| [`app/core/logging.py`](file:///d:/sih2026/backend/app/core/logging.py) | Structured logging setup with formatting and external logger level controls. |
| [`app/core/websocket_manager.py`](file:///d:/sih2026/backend/app/core/websocket_manager.py) | In-memory registry for active WebSocket user sessions, unicast personal notifications, and platform-wide broadcasts. |

---

## 3. Platform Constants (`app/constants/`)

| File Path | Description |
|:---|:---|
| [`app/constants/roles.py`](file:///d:/sih2026/backend/app/constants/roles.py) | Enums for user roles (`LEARNER`, `INSTRUCTOR`, `ADMIN`) and age brackets (`YOUNG`, `STUDENT`, `ADULT`). |
| [`app/constants/mastery.py`](file:///d:/sih2026/backend/app/constants/mastery.py) | Enums for BKT mastery tiers (`NOVICE`, `DEVELOPING`, `PROFICIENT`, `MASTERED`) and recommendation actions (`ADVANCE`, `REINFORCE`, `REVISE`). |
| [`app/constants/focus_states.py`](file:///d:/sih2026/backend/app/constants/focus_states.py) | Enums for Pomodoro focus cycle states (`IDLE`, `IN_FOCUS`, `BREAK_RECOMMENDED`, `BREAK_SKIPPED`, `BREAK_REQUIRED`) and break types. |
| [`app/constants/mascot_states.py`](file:///d:/sih2026/backend/app/constants/mascot_states.py) | Enum of 9 canonical QUBOT emotional states (`IDLE`, `HAPPY`, `THINKING`, `ENCOURAGING`, `CELEBRATING`, `CONFUSED`, `FOCUS_REMINDER`, `BREAK_REMINDER`, `SLEEPING`). |
| [`app/constants/qubot_contracts.py`](file:///d:/sih2026/backend/app/constants/qubot_contracts.py) | Canonical QUBOT Enums: 25 Interaction Intents (`QUBOTIntent`), Action CTAs (`QUBOTActionType`), Priorities (`QUBOTPriority`), and Tones (`QUBOTTone`). |
| [`app/constants/achievement_types.py`](file:///d:/sih2026/backend/app/constants/achievement_types.py) | Enums for badge categories (`STREAK`, `MASTERY`, `QUANTUM_LAB`) and XP reward event types. |

---

## 4. Database ORM Models (`app/models/`)

| File Path | Description |
|:---|:---|
| [`app/models/base.py`](file:///d:/sih2026/backend/app/models/base.py) | Helper for UUID4 primary key string generation and re-exports of `Base` and `TimestampMixin`. |
| [`app/models/user.py`](file:///d:/sih2026/backend/app/models/user.py) | `User` auth account table (email, password hash, role, active/onboarded flags, and relationship links). |
| [`app/models/user_profile.py`](file:///d:/sih2026/backend/app/models/user_profile.py) | `UserProfile` table storing display name, age bracket, persona, current level, and accumulated total XP. |
| [`app/models/user_goal.py`](file:///d:/sih2026/backend/app/models/user_goal.py) | `UserGoal` table storing primary learning goal, target daily minutes, and target timeline. |
| [`app/models/user_preference.py`](file:///d:/sih2026/backend/app/models/user_preference.py) | `UserPreference` table storing visual density, dark/light theme, reduced motion, and mascot verbosity. |
| [`app/models/course.py`](file:///d:/sih2026/backend/app/models/course.py) | `Course` table representing top-level curriculum tracks with title, slug, difficulty, and estimated hours. |
| [`app/models/module.py`](file:///d:/sih2026/backend/app/models/module.py) | `Module` table grouping ordered units/chapters within a parent course. |
| [`app/models/concept.py`](file:///d:/sih2026/backend/app/models/concept.py) | `Concept` table representing nodes in the knowledge graph with key, name, category, and mastery threshold. |
| [`app/models/concept_prerequisite.py`](file:///d:/sih2026/backend/app/models/concept_prerequisite.py) | `ConceptPrerequisite` table representing directed graph edges (`prerequisite_id` $\rightarrow$ `concept_id`). |
| [`app/models/lesson.py`](file:///d:/sih2026/backend/app/models/lesson.py) | `Lesson` table representing bite-sized learning cards, XP reward, estimated duration, and content JSON. |
| [`app/models/learning_resource.py`](file:///d:/sih2026/backend/app/models/learning_resource.py) | `LearningResource` table storing diagrams, simulation widgets, and Colab notebook references. |
| [`app/models/assessment.py`](file:///d:/sih2026/backend/app/models/assessment.py) | `Assessment` container table for diagnostic quizzes and lesson check-point tests. |
| [`app/models/question.py`](file:///d:/sih2026/backend/app/models/question.py) | `Question` table storing question prompt text, difficulty rating (1.0 to 3.0), and concept tag. |
| [`app/models/answer_option.py`](file:///d:/sih2026/backend/app/models/answer_option.py) | `AnswerOption` table with option text, correctness flag, and targeted distractor misconception feedback. |
| [`app/models/assessment_attempt.py`](file:///d:/sih2026/backend/app/models/assessment_attempt.py) | `AssessmentAttempt` table logging user quiz submissions, score percentage, and pass/fail outcome. |
| [`app/models/assessment_response.py`](file:///d:/sih2026/backend/app/models/assessment_response.py) | `AssessmentResponse` table recording individual question answers and response times per attempt. |
| [`app/models/learner_mastery.py`](file:///d:/sih2026/backend/app/models/learner_mastery.py) | `LearnerMastery` table tracking dynamic concept mastery rating ($P(L) \in [0.0, 1.0]$) and confidence. |
| [`app/models/learning_path.py`](file:///d:/sih2026/backend/app/models/learning_path.py) | `LearningPath` table managing the user's active personalized curriculum sequence. |
| [`app/models/learning_path_item.py`](file:///d:/sih2026/backend/app/models/learning_path_item.py) | `LearningPathItem` table tracking ordered lesson nodes, lock states, and completion status. |
| [`app/models/recommendation.py`](file:///d:/sih2026/backend/app/models/recommendation.py) | `Recommendation` table storing the historical log of `ADVANCE`, `REINFORCE`, or `REVISE` decisions. |
| [`app/models/lesson_completion.py`](file:///d:/sih2026/backend/app/models/lesson_completion.py) | `LessonCompletion` table recording time spent and XP earned per completed lesson. |
| [`app/models/progress_event.py`](file:///d:/sih2026/backend/app/models/progress_event.py) | `ProgressEvent` table providing an audit trail of user learning events. |
| [`app/models/xp_transaction.py`](file:///d:/sih2026/backend/app/models/xp_transaction.py) | `XPTransaction` table acting as an immutable ledger of every XP award and its source event. |
| [`app/models/streak.py`](file:///d:/sih2026/backend/app/models/streak.py) | `Streak` table storing consecutive active days, longest streak, and available streak freeze tokens. |
| [`app/models/achievement.py`](file:///d:/sih2026/backend/app/models/achievement.py) | `Achievement` catalog table defining badge metadata, icon assets, criteria rules, and XP bonuses. |
| [`app/models/user_achievement.py`](file:///d:/sih2026/backend/app/models/user_achievement.py) | `UserAchievement` table recording unlocked user badges with timestamps. |
| [`app/models/mascot_event.py`](file:///d:/sih2026/backend/app/models/mascot_event.py) | `MascotEvent` table logging mascot dialogue history and state transitions. |
| [`app/models/focus_session.py`](file:///d:/sih2026/backend/app/models/focus_session.py) | `FocusSession` table recording Pomodoro intervals, cycle numbers (1 vs 2), and break skipped flags. |
| [`app/models/break_record.py`](file:///d:/sih2026/backend/app/models/break_record.py) | `BreakRecord` table logging whether breaks were taken, skipped, or enforced as mandatory. |
| [`app/models/ai_conversation.py`](file:///d:/sih2026/backend/app/models/ai_conversation.py) | `AIConversation` table grouping Socratic AI tutor conversation threads. |
| [`app/models/ai_message.py`](file:///d:/sih2026/backend/app/models/ai_message.py) | `AIMessage` table storing user queries and Socratic AI tutor answers with concept citation tags. |
| [`app/models/circuit.py`](file:///d:/sih2026/backend/app/models/circuit.py) | `Circuit` table storing user-designed quantum circuits in JSON and QASM format. |
| [`app/models/circuit_execution.py`](file:///d:/sih2026/backend/app/models/circuit_execution.py) | `CircuitExecution` table logging simulation runs, shot counts, execution times, and Bloch vectors. |
| [`app/models/audit_log.py`](file:///d:/sih2026/backend/app/models/audit_log.py) | `AuditLog` table capturing administrative, authentication, and security events. |
| [`app/models/__init__.py`](file:///d:/sih2026/backend/app/models/__init__.py) | Exports all 30 SQLAlchemy models to register them with the declarative metadata. |

---

## 5. Repositories Layer (`app/repositories/`)

| File Path | Description |
|:---|:---|
| [`app/repositories/base.py`](file:///d:/sih2026/backend/app/repositories/base.py) | Generic asynchronous CRUD repository base class (`get`, `get_multi`, `create`, `update`, `delete`). |
| [`app/repositories/user_repository.py`](file:///d:/sih2026/backend/app/repositories/user_repository.py) | Query handler for `User`, `UserProfile`, `UserGoal`, and `UserPreference`. |
| [`app/repositories/course_repository.py`](file:///d:/sih2026/backend/app/repositories/course_repository.py) | Queries courses, modules, concept nodes, and prerequisite DAG edges. |
| [`app/repositories/lesson_repository.py`](file:///d:/sih2026/backend/app/repositories/lesson_repository.py) | Queries lesson details, associated cards, resources, and quiz links. |
| [`app/repositories/assessment_repository.py`](file:///d:/sih2026/backend/app/repositories/assessment_repository.py) | Queries assessments with eager-loaded questions/options and logs attempts. |
| [`app/repositories/mastery_repository.py`](file:///d:/sih2026/backend/app/repositories/mastery_repository.py) | Handles concept mastery upserts and fetches user mastery ratings. |
| [`app/repositories/progress_repository.py`](file:///d:/sih2026/backend/app/repositories/progress_repository.py) | Manages learning paths, lesson completions, XP transaction ledger, and streak records. |
| [`app/repositories/achievement_repository.py`](file:///d:/sih2026/backend/app/repositories/achievement_repository.py) | Queries badge catalog and handles unlocking logic. |
| [`app/repositories/focus_repository.py`](file:///d:/sih2026/backend/app/repositories/focus_repository.py) | Queries latest focus sessions and inserts break records. |
| [`app/repositories/circuit_repository.py`](file:///d:/sih2026/backend/app/repositories/circuit_repository.py) | Queries saved circuits and stores simulation execution results. |
| [`app/repositories/analytics_repository.py`](file:///d:/sih2026/backend/app/repositories/analytics_repository.py) | Computes cohort analytics, platform-wide averages, and concept struggle heatmaps. |
| [`app/repositories/__init__.py`](file:///d:/sih2026/backend/app/repositories/__init__.py) | Exports all database repositories. |

---

## 6. Algorithmic Intelligence Engines (`app/engines/`)

| File Path | Description |
|:---|:---|
| [`app/engines/diagnostic_engine.py`](file:///d:/sih2026/backend/app/engines/diagnostic_engine.py) | Evaluates diagnostic entry quizzes to compute starting level placement (Level 1/2/3). |
| [`app/engines/mastery_engine.py`](file:///d:/sih2026/backend/app/engines/mastery_engine.py) | Implements Bayesian Knowledge Tracing (BKT) with category-specific concept thresholds (0.85, 0.80, 0.70). |
| [`app/engines/assessment_engine.py`](file:///d:/sih2026/backend/app/engines/assessment_engine.py) | Evaluates student quiz submissions, scores attempts, and provides targeted distractor feedback. |
| [`app/engines/learning_engine.py`](file:///d:/sih2026/backend/app/engines/learning_engine.py) | Performs topological sorting over curriculum DAG and determines unlocked concepts. |
| [`app/engines/recommendation_engine.py`](file:///d:/sih2026/backend/app/engines/recommendation_engine.py) | Generates `ADVANCE`, `REINFORCE`, or `REVISE` actions based on concept mastery scores. |
| [`app/engines/progression_engine.py`](file:///d:/sih2026/backend/app/engines/progression_engine.py) | Computes level progression curves ($100 \times \text{level}^{1.5}$) and level-up events. |
| [`app/engines/gamification_engine.py`](file:///d:/sih2026/backend/app/engines/gamification_engine.py) | Manages streak day increments, 24-hour freeze token protections, and badge criteria checks. |
| [`app/engines/focus_policy_engine.py`](file:///d:/sih2026/backend/app/engines/focus_policy_engine.py) | Pomodoro state machine enforcing 1st skip vs 2nd mandatory break lock; handles distraction nudges. |
| [`app/engines/mascot_event_engine.py`](file:///d:/sih2026/backend/app/engines/mascot_event_engine.py) | Maps lifecycle triggers to mascot emotional states and age-adapted dialogues. |
| [`app/engines/qubot_decision_engine.py`](file:///d:/sih2026/backend/app/engines/qubot_decision_engine.py) | Canonical QUBOT Decision Engine implementing anti-shaming growth mindset and age-adapted CTAs. |
| [`app/engines/__init__.py`](file:///d:/sih2026/backend/app/engines/__init__.py) | Exports all core intelligence engines. |

---

## 7. Quantum Lab & AI Subsystems

| File Path | Description |
|:---|:---|
| [`app/quantum/base.py`](file:///d:/sih2026/backend/app/quantum/base.py) | Abstract `QuantumBackend` interface for simulator adapters. |
| [`app/quantum/circuit_validator.py`](file:///d:/sih2026/backend/app/quantum/circuit_validator.py) | Validates quantum circuit JSON (max 10 qubits, max 100 gate depth, allowed gate list). |
| [`app/quantum/visualization_data.py`](file:///d:/sih2026/backend/app/quantum/visualization_data.py) | Converts complex probability amplitudes to 3D Bloch sphere coordinates $(x, y, z)$. |
| [`app/quantum/qiskit_backend.py`](file:///d:/sih2026/backend/app/quantum/qiskit_backend.py) | Executes circuits on Qiskit Aer simulator with a deterministic mathematical fallback. |
| [`app/quantum/colab_launcher.py`](file:///d:/sih2026/backend/app/quantum/colab_launcher.py) | Generates preconfigured Google Colab notebook launcher links for interactive exercises. |
| [`app/quantum/__init__.py`](file:///d:/sih2026/backend/app/quantum/__init__.py) | Exports Quantum Lab components. |
| [`app/ai/tutor_context.py`](file:///d:/sih2026/backend/app/ai/tutor_context.py) | Assembles sanitized learner context (age tier, active concept, mistakes) for the AI tutor. |
| [`app/ai/prompts.py`](file:///d:/sih2026/backend/app/ai/prompts.py) | Socratic tutor system prompt and persona-adapted teaching instructions. |
| [`app/ai/guardrails.py`](file:///d:/sih2026/backend/app/ai/guardrails.py) | Strict domain guardrails ensuring AI tutor rejects out-of-scope queries. |
| [`app/ai/vault_rag.py`](file:///d:/sih2026/backend/app/ai/vault_rag.py) | Retrieval-Augmented Generation (RAG) search indexing all 107 Obsidian vault notes. |
| [`app/ai/provider.py`](file:///d:/sih2026/backend/app/ai/provider.py) | LLM provider abstraction generating grounded Socratic answers with concept citations. |
| [`app/ai/__init__.py`](file:///d:/sih2026/backend/app/ai/__init__.py) | Exports AI Tutor components. |

---

## 8. Validation Schemas (`app/schemas/`)

| File Path | Description |
|:---|:---|
| [`app/schemas/common.py`](file:///d:/sih2026/backend/app/schemas/common.py) | Generic `APIResponse[T]`, `PaginationParams`, and `PaginatedResponse[T]` wrapper models. |
| [`app/schemas/auth.py`](file:///d:/sih2026/backend/app/schemas/auth.py) | Request and response schemas for user registration, login, and JWT token rotation. |
| [`app/schemas/user.py`](file:///d:/sih2026/backend/app/schemas/user.py) | Schemas for profile, preferences, and dynamic `AgeTierConfigSchema`. |
| [`app/schemas/onboarding.py`](file:///d:/sih2026/backend/app/schemas/onboarding.py) | Schemas for onboarding profile setup, diagnostic quiz submission, and level placement result. |
| [`app/schemas/course.py`](file:///d:/sih2026/backend/app/schemas/course.py) | Read models for courses, nested modules, and lesson summaries. |
| [`app/schemas/lesson.py`](file:///d:/sih2026/backend/app/schemas/lesson.py) | Schemas for lesson card details, multimedia resources, and lesson completion requests. |
| [`app/schemas/assessment.py`](file:///d:/sih2026/backend/app/schemas/assessment.py) | Schemas for quiz questions, answer options, quiz submissions, and evaluation results. |
| [`app/schemas/progress.py`](file:///d:/sih2026/backend/app/schemas/progress.py) | Schemas for overall user progress, level XP meters, streak status, and concept masteries. |
| [`app/schemas/achievement.py`](file:///d:/sih2026/backend/app/schemas/achievement.py) | Schemas for viewing badge catalog and user unlocked status. |
| [`app/schemas/mascot.py`](file:///d:/sih2026/backend/app/schemas/mascot.py) | Schemas for mascot emotional state responses, user taps, and idle nudge requests. |
| [`app/schemas/qubot.py`](file:///d:/sih2026/backend/app/schemas/qubot.py) | Canonical QUBOT response schema with structured Action CTAs, distraction requests, and preferences. |
| [`app/schemas/focus.py`](file:///d:/sih2026/backend/app/schemas/focus.py) | Schemas for starting focus sessions, break statuses, and distraction event reports. |
| [`app/schemas/ai_tutor.py`](file:///d:/sih2026/backend/app/schemas/ai_tutor.py) | Schemas for querying Socratic AI tutor and receiving cited answers. |
| [`app/schemas/circuit.py`](file:///d:/sih2026/backend/app/schemas/circuit.py) | Schemas for saving quantum circuits, executing simulations, and returning Bloch vectors. |
| [`app/schemas/instructor.py`](file:///d:/sih2026/backend/app/schemas/instructor.py) | Schemas for instructor cohort analytics and concept struggle heatmaps. |
| [`app/schemas/__init__.py`](file:///d:/sih2026/backend/app/schemas/__init__.py) | Exports all Pydantic V2 schemas. |

---

## 9. Business Services & Parsers (`app/services/` & `app/parsers/`)

| File Path | Description |
|:---|:---|
| [`app/parsers/obsidian_parser.py`](file:///d:/sih2026/backend/app/parsers/obsidian_parser.py) | Robust parser for Obsidian Markdown notes, YAML frontmatter, wikilinks, and code blocks. |
| [`app/services/vault_ingestion_service.py`](file:///d:/sih2026/backend/app/services/vault_ingestion_service.py) | Ingestion pipeline synchronizing 107 Obsidian vault notes into database courses, modules, and DAG. |
| [`app/services/qubot_cooldown_manager.py`](file:///d:/sih2026/backend/app/services/qubot_cooldown_manager.py) | Frequency control and cooldown tracker preventing repetitive mascot notifications. |
| [`app/services/auth_service.py`](file:///d:/sih2026/backend/app/services/auth_service.py) | Business logic for registration, credential checks, and JWT access/refresh lifecycle. |
| [`app/services/user_service.py`](file:///d:/sih2026/backend/app/services/user_service.py) | Generates user details and dynamic `age_tier_config` based on learner profile. |
| [`app/services/onboarding_service.py`](file:///d:/sih2026/backend/app/services/onboarding_service.py) | Handles onboarding goals, processes diagnostics, sets starting level, and awards XP. |
| [`app/services/curriculum_service.py`](file:///d:/sih2026/backend/app/services/curriculum_service.py) | Assembles course catalog, module hierarchies, and concept prerequisites. |
| [`app/services/lesson_service.py`](file:///d:/sih2026/backend/app/services/lesson_service.py) | Delivers lesson content cards, records completion time, awards XP, and checks level-up. |
| [`app/services/assessment_service.py`](file:///d:/sih2026/backend/app/services/assessment_service.py) | Evaluates quiz attempts, updates BKT mastery, calculates recommendations, and pushes WS events. |
| [`app/services/progress_service.py`](file:///d:/sih2026/backend/app/services/progress_service.py) | Aggregates progress metrics, total XP, current level progress, and concept mastery badges. |
| [`app/services/achievement_service.py`](file:///d:/sih2026/backend/app/services/achievement_service.py) | Evaluates badge unlock rules and lists user achievement statuses. |
| [`app/services/focus_service.py`](file:///d:/sih2026/backend/app/services/focus_service.py) | Manages Pomodoro sessions, enforces mandatory 2nd-cycle breaks, and dispatches idle nudges. |
| [`app/services/mascot_service.py`](file:///d:/sih2026/backend/app/services/mascot_service.py) | Generates real-time QUBOT reactions, handles distraction blurs, and manages preferences. |
| [`app/services/ai_tutor_service.py`](file:///d:/sih2026/backend/app/services/ai_tutor_service.py) | Orchestrates Socratic AI tutor conversations and persists message history. |
| [`app/services/circuit_service.py`](file:///d:/sih2026/backend/app/services/circuit_service.py) | Validates and executes quantum circuits on Qiskit simulator, awards lab XP. |
| [`app/services/instructor_service.py`](file:///d:/sih2026/backend/app/services/instructor_service.py) | Aggregates platform-wide metrics and concept struggle heatmaps for instructors. |
| [`app/services/__init__.py`](file:///d:/sih2026/backend/app/services/__init__.py) | Exports all business service classes. |

---

## 10. API Route Handlers (`app/api/`)

| File Path | Description |
|:---|:---|
| [`app/api/auth.py`](file:///d:/sih2026/backend/app/api/auth.py) | Endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`. |
| [`app/api/users.py`](file:///d:/sih2026/backend/app/api/users.py) | Endpoints: `GET /users/me` (returns user profile + dynamic `age_tier_config`). |
| [`app/api/onboarding.py`](file:///d:/sih2026/backend/app/api/onboarding.py) | Endpoints: `POST /onboarding/profile`, `POST /onboarding/diagnostic`. |
| [`app/api/courses.py`](file:///d:/sih2026/backend/app/api/courses.py) | Endpoints: `GET /courses` (lists all published courses and nested module trees). |
| [`app/api/lessons.py`](file:///d:/sih2026/backend/app/api/lessons.py) | Endpoints: `GET /lessons/{id}`, `POST /lessons/{id}/complete`. |
| [`app/api/assessments.py`](file:///d:/sih2026/backend/app/api/assessments.py) | Endpoints: `GET /assessments/{id}`, `POST /assessments/{id}/submit`. |
| [`app/api/progress.py`](file:///d:/sih2026/backend/app/api/progress.py) | Endpoints: `GET /progress/summary` (XP, level progress, streaks, topic mastery). |
| [`app/api/achievements.py`](file:///d:/sih2026/backend/app/api/achievements.py) | Endpoints: `GET /achievements` (badge catalog with unlocked timestamps). |
| [`app/api/focus.py`](file:///d:/sih2026/backend/app/api/focus.py) | Endpoints: `POST /focus/start`, `/complete`, `/break-skip`, `/break-done`, `/distraction`. |
| [`app/api/mascot.py`](file:///d:/sih2026/backend/app/api/mascot.py) | Endpoints: `GET /mascot/state`, `POST /mascot/event`, `POST /mascot/distraction`, `GET /mascot/preferences`, `POST /mascot/interact`. |
| [`app/api/ai_tutor.py`](file:///d:/sih2026/backend/app/api/ai_tutor.py) | Endpoints: `POST /tutor/ask` (Socratic question and grounded answer). |
| [`app/api/circuits.py`](file:///d:/sih2026/backend/app/api/circuits.py) | Endpoints: `POST /circuits`, `POST /circuits/execute`, `GET /circuits/colab/{slug}`. |
| [`app/api/instructor.py`](file:///d:/sih2026/backend/app/api/instructor.py) | Endpoints: `GET /instructor/analytics` (Instructor/Admin role protected). |
| [`app/api/websocket.py`](file:///d:/sih2026/backend/app/api/websocket.py) | Endpoint: `WS /ws/events?token={jwt}` (Real-time event streaming). |
| [`app/api/router.py`](file:///d:/sih2026/backend/app/api/router.py) | Master router combining all 14 API sub-routers. |

---

## 11. Scripts & Maintenance (`scripts/`)

| File Path | Description |
|:---|:---|
| [`scripts/ingest_obsidian_vault.py`](file:///d:/sih2026/backend/scripts/ingest_obsidian_vault.py) | Automated CLI ingestion pipeline reading all 107 Obsidian markdown notes into DB courses, modules, and DAG. |
| [`scripts/seed_curriculum.py`](file:///d:/sih2026/backend/scripts/seed_curriculum.py) | Seeds concepts, prerequisite DAG edges, quantum course, modules, lessons, and badges. |
| [`scripts/seed_assessments.py`](file:///d:/sih2026/backend/scripts/seed_assessments.py) | Seeds initial diagnostic assessment, lesson checkpoint quizzes, and distractor feedback. |
| [`scripts/seed_database.py`](file:///d:/sih2026/backend/scripts/seed_database.py) | Master seed runner initializing tables, demo accounts, curriculum, and quizzes. |
| [`scripts/create_admin.py`](file:///d:/sih2026/backend/scripts/create_admin.py) | CLI utility to bootstrap an administrative user account. |
| [`scripts/validate_content.py`](file:///d:/sih2026/backend/scripts/validate_content.py) | Curriculum DAG validator ensuring zero cycles and prerequisite integrity. |

---

## 12. Automated Test Suite (`tests/`)

| File Path | Description |
|:---|:---|
| [`tests/conftest.py`](file:///d:/sih2026/backend/tests/conftest.py) | Pytest async fixtures (`prepare_test_db`, `db_session`, `client`, `auth_headers`). |
| [`tests/unit/test_engines.py`](file:///d:/sih2026/backend/tests/unit/test_engines.py) | Unit tests verifying all 9 decision engines (BKT formulas, DAG sort, Pomodoro lock). |
| [`tests/unit/test_quantum.py`](file:///d:/sih2026/backend/tests/unit/test_quantum.py) | Unit tests for circuit validator, Qiskit simulator, and Bloch sphere calculations. |
| [`tests/unit/test_ai_tutor.py`](file:///d:/sih2026/backend/tests/unit/test_ai_tutor.py) | Unit tests verifying domain guardrails, context assembly, and Socratic responses. |
| [`tests/integration/test_api_auth.py`](file:///d:/sih2026/backend/tests/integration/test_api_auth.py) | Integration tests for user registration, login, token refresh, and `/users/me`. |
| [`tests/integration/test_api_learning.py`](file:///d:/sih2026/backend/tests/integration/test_api_learning.py) | Integration tests for courses, focus sessions, mascot state, AI tutor, and circuits. |
| [`tests/e2e/test_flows.py`](file:///d:/sih2026/backend/tests/e2e/test_flows.py) | Full E2E journey tests (Onboarding $\rightarrow$ Diagnostic $\rightarrow$ Level, and Focus Mandatory Break lock). |
