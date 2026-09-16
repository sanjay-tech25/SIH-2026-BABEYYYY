# QUBOT BACKEND INTEGRATION & OPERATIONS SPECIFICATION

## Purpose

This document is the implementation specification for integrating Qubot into the existing backend of the learning platform.

Qubot must NOT be implemented as a decorative frontend mascot. It is a backend-connected learning-companion layer that consumes learner activity, learning/mastery signals, assessment results, session state, and fatigue/distraction signals, then produces structured Qubot states, interventions, dialogue intents, animation intents, and actions for the frontend.

The existing backend architecture must remain the source of truth for authentication, learning content, assessment, mastery/progress, recommendations, analytics, and user data. Qubot should integrate with those systems through clean contracts rather than duplicating their logic.

The final frontend should be able to render Qubot's UI/UX without embedding learning/business logic inside the mascot component.

---

# 1. CORE ARCHITECTURAL PRINCIPLE

Use this separation:

```text
EXISTING LEARNING PLATFORM
        |
        | learner activity + learning state
        v
+--------------------------+
|      QUBOT LAYER         |
|                          |
| Event Processor          |
| Learner-State Adapter    |
| Struggle Detector        |
| Behavior Engine          |
| Intervention Engine      |
| Pomodoro/Break Engine    |
| Conversation/Response    |
| Qubot State Manager      |
+------------+-------------+
             |
             | structured Qubot state/events
             v
+--------------------------+
|      FRONTEND QUBOT      |
|                          |
| Character renderer       |
| Expressions              |
| Animations               |
| Speech/dialogue UI       |
| Interaction controls     |
| Timer UI                 |
+--------------------------+
```

### Critical rule

The frontend must NEVER independently decide:

- whether a learner is struggling
- whether a break is required
- what intervention is appropriate
- what mastery level the learner has
- whether a hint should be triggered
- whether the user is showing repeated-error behavior

The backend/Qubot layer makes those decisions.

The frontend renders the decision.

---

# 2. QUBOT RESPONSIBILITIES

Qubot should support all of the following:

1. Persistent learning companion
2. Context-aware reactions
3. Learner struggle/confusion detection
4. Adaptive intervention selection
5. Encouragement and positive reinforcement
6. Hint/explanation intervention
7. Alternative explanation requests
8. Repeated-error handling
9. Guessing/random-answer detection
10. Fatigue detection
11. Inactivity detection
12. Distraction detection
13. Pomodoro study-session management
14. Break recommendations
15. Break-skipping rules
16. Required-break enforcement on the second iteration as previously planned
17. Session lifecycle awareness
18. Lesson/question awareness
19. Progress/milestone reactions
20. Context-aware Qubot messages
21. Structured animation/expression commands
22. Event-driven operation
23. Persistent Qubot state for the active learning session
24. Analytics/telemetry for Qubot interactions
25. Extensible behavior rules so future Qubot abilities can be added without rewriting the frontend

---

# 3. QUBOT IS A SYSTEM, NOT A SINGLE COMPONENT

Recommended backend structure:

```text
backend/
├── auth/
├── users/
├── learning/
├── assessment/
├── progress/
├── mastery/
├── recommendation/
├── analytics/
│
└── qubot/
    ├── qubot.controller
    ├── qubot.service
    ├── qubot.state
    ├── qubot.events
    ├── qubot.behavior
    ├── qubot.intervention
    ├── qubot.struggle
    ├── qubot.pomodoro
    ├── qubot.session
    ├── qubot.conversation
    ├── qubot.analytics
    ├── qubot.types
    ├── qubot.constants
    └── qubot.schemas
```

Adapt naming to the existing backend framework instead of blindly creating duplicate architecture.

If the existing project already has services/controllers/modules for these responsibilities, integrate into those modules rather than creating parallel implementations.

---

# 4. EVENT-DRIVEN QUBOT

The platform should emit normalized learner events.

Minimum event catalog:

```text
SESSION_STARTED
SESSION_RESUMED
SESSION_PAUSED
SESSION_ENDED

LESSON_STARTED
LESSON_COMPLETED
TOPIC_STARTED
TOPIC_COMPLETED

QUESTION_STARTED
ANSWER_SUBMITTED
ANSWER_CORRECT
ANSWER_WRONG

HINT_REQUESTED
EXPLANATION_REQUESTED
SOLUTION_VIEWED

MULTIPLE_ATTEMPTS
LONG_INACTIVITY
RAPID_GUESSING
REPEATED_CONCEPT_FAILURE

MASTERY_INCREASED
MASTERY_DECREASED
MILESTONE_REACHED

POMODORO_STARTED
POMODORO_COMPLETED
BREAK_SUGGESTED
BREAK_ACCEPTED
BREAK_SKIPPED
BREAK_STARTED
BREAK_COMPLETED
BREAK_REQUIRED

QUBOT_OPENED
QUBOT_INTERACTION
QUBOT_DISMISSED
QUBOT_INTERVENTION_ACCEPTED
QUBOT_INTERVENTION_REJECTED
```

Every event should contain a consistent envelope.

Example:

```json
{
  "event_id": "uuid",
  "event_type": "ANSWER_SUBMITTED",
  "user_id": "uuid",
  "session_id": "uuid",
  "lesson_id": "uuid",
  "question_id": "uuid",
  "timestamp": "ISO-8601",
  "payload": {}
}
```

Do not expose sensitive internal data unnecessarily to the frontend.

---

# 5. LEARNER STATE

Qubot needs a normalized learner-state snapshot.

Example:

```json
{
  "session_id": "uuid",
  "current_activity": "QUESTION",
  "topic": "Algebra",
  "difficulty": 3,
  "mastery": 0.62,
  "recent_accuracy": 0.58,
  "recent_attempts": 4,
  "hints_used": 2,
  "time_on_current_task_seconds": 184,
  "session_duration_seconds": 1260,
  "inactivity_seconds": 0,
  "struggle_score": 0.74,
  "fatigue_score": 0.51,
  "distraction_score": 0.18
}
```

This is a computed operational state, not necessarily a database object.

Prefer deriving transient signals from existing data and persisting only information that is genuinely needed.

---

# 6. STRUGGLE / CONFUSION DETECTION ENGINE

## Goal

Detect when the learner is likely confused, stuck, overloaded, guessing, or otherwise struggling.

Do NOT use a single rule such as:

> 3 wrong answers = struggling.

Use multiple signals.

### Signals

#### A. Error frequency

Track recent incorrect answers.

Possible signal:

```text
error_rate = incorrect_answers / recent_attempts
```

#### B. Repeated attempts

Detect repeated attempts on the same question.

#### C. Time-on-task

Compare current time against:

- historical average
- expected time for difficulty
- learner's own baseline
- recent question times

Avoid hardcoding one universal "too slow" value.

#### D. Hint dependency

Repeated hint usage can indicate conceptual difficulty.

#### E. Repeated concept failure

If multiple questions tied to the same prerequisite/concept fail, increase conceptual-struggle confidence.

#### F. Backtracking

Repeatedly returning to earlier material may indicate uncertainty.

#### G. Accuracy trend

A sudden performance decline should increase struggle/fatigue signals.

#### H. Rapid guessing

Very short response times combined with incorrect answers can indicate guessing.

#### I. Long inactivity

Extended inactivity during an active task can indicate distraction, confusion, or disengagement.

Do NOT assume inactivity always means struggle. Treat it as a signal requiring context.

#### J. Difficulty/mastery mismatch

If the current difficulty is significantly above estimated mastery, raise the likelihood of conceptual struggle.

---

# 7. STRUGGLE SCORE

Implement a normalized score from 0.0 to 1.0.

Conceptual model:

```text
struggle_score =
    weighted(error_signal)
  + weighted(time_signal)
  + weighted(repetition_signal)
  + weighted(hint_signal)
  + weighted(concept_failure_signal)
  + weighted(backtracking_signal)
  + weighted(accuracy_drop_signal)
```

Normalize and clamp to [0, 1].

The weights MUST be configurable.

Do not hardcode them throughout the codebase.

Recommended initial configuration:

```json
{
  "error_weight": 0.25,
  "time_weight": 0.15,
  "repetition_weight": 0.15,
  "hint_weight": 0.10,
  "concept_failure_weight": 0.20,
  "backtracking_weight": 0.05,
  "accuracy_drop_weight": 0.10
}
```

These are initial defaults only and must be tunable through configuration.

---

# 8. STRUGGLE TYPES

Classify the dominant struggle instead of only returning a number.

Supported types:

```text
NONE
CONCEPTUAL
PROCEDURAL
REPEATED_ERROR
TIME_PRESSURE
GUESSING
FATIGUE
DISTRACTION
DIFFICULTY_MISMATCH
UNKNOWN
```

Example:

```json
{
  "score": 0.78,
  "confidence": 0.91,
  "type": "CONCEPTUAL"
}
```

Confidence should represent how strongly the available signals support the classification.

---

# 9. STRUGGLE THRESHOLDS

Use configurable thresholds.

Example:

```text
0.00 - 0.29 = NORMAL
0.30 - 0.49 = MILD
0.50 - 0.69 = MODERATE
0.70 - 0.84 = HIGH
0.85 - 1.00 = CRITICAL
```

These values are defaults and must be configurable.

Avoid triggering disruptive interventions for mild signals.

Use hysteresis/cooldowns so Qubot does not repeatedly interrupt the learner.

---

# 10. INTERVENTION ENGINE

The intervention engine maps learner state to an action.

Examples:

```text
CONCEPTUAL
    -> alternative explanation
    -> visual explanation
    -> prerequisite reminder

PROCEDURAL
    -> guided step
    -> partial hint

REPEATED_ERROR
    -> identify mistake pattern
    -> step-by-step hint

GUESSING
    -> slow-down prompt
    -> ask learner to identify what the question asks

TIME_PRESSURE
    -> reassurance
    -> simplify next action

FATIGUE
    -> break suggestion

DISTRACTION
    -> short reset
    -> Pomodoro/distraction remedy

DIFFICULTY_MISMATCH
    -> recommend easier prerequisite
    -> adaptive difficulty adjustment request
```

Qubot should prefer the least disruptive intervention that can reasonably help.

---

# 11. QUBOT BEHAVIOR ENGINE

The behavior engine determines HOW Qubot responds.

It should output:

```text
state
emotion
animation
message intent
interaction type
priority
cooldown
optional action
```

Example:

```json
{
  "state": "ENCOURAGING",
  "emotion": "SUPPORTIVE",
  "animation": "gentle_encourage",
  "message": "Let's try this from another angle.",
  "interaction": "ALTERNATIVE_EXPLANATION",
  "priority": "MEDIUM",
  "cooldown_seconds": 30
}
```

Do not hardcode visual implementation details such as CSS classes into the backend.

Use semantic animation identifiers.

---

# 12. QUBOT STATES

Create a canonical state machine.

Suggested states:

```text
IDLE
GREETING
LISTENING
THINKING
WATCHING
ENCOURAGING
CELEBRATING
CONFUSED
CONCERNED
HELPING
EXPLAINING
HINTING
WAITING
BREAK_SUGGESTED
BREAK_ACTIVE
BREAK_REQUIRED
DISTRACTION_INTERVENTION
SESSION_COMPLETE
```

The frontend maps each semantic state to the correct Qubot artwork, animation, expression, sound, and layout.

---

# 13. QUBOT EMOTIONS

Keep emotion separate from state.

Suggested emotion values:

```text
NEUTRAL
CURIOUS
HAPPY
EXCITED
PROUD
SUPPORTIVE
CONCERNED
THOUGHTFUL
ENCOURAGING
PLAYFUL
CALM
FOCUSED
```

This gives the UI freedom to change visual presentation without changing backend logic.

---

# 14. QUBOT ANIMATION CONTRACT

Backend should send semantic animation IDs.

Examples:

```text
idle_breathe
look_left
look_right
think
small_happy
celebrate
gentle_encourage
concerned
hint
explain
listen
break_suggest
sleepy
focus
wave
```

The frontend owns the actual animation implementation.

If the animation asset changes, backend contracts should NOT change.

---

# 15. DIALOGUE / MESSAGE SYSTEM

Do not force all dialogue to be hardcoded strings in business logic.

Use message intents/templates.

Example:

```json
{
  "intent": "CONCEPTUAL_STRUGGLE",
  "tone": "SUPPORTIVE",
  "variables": {
    "concept": "quadratic equations"
  }
}
```

The response layer can resolve this to a message.

Possible intents:

```text
WELCOME
ENCOURAGE
CORRECT_ANSWER
INCORRECT_ANSWER
CONCEPTUAL_HELP
REPEATED_ERROR_HELP
HINT_OFFER
ALTERNATIVE_EXPLANATION
GUESSING_WARNING
BREAK_SUGGESTION
BREAK_REQUIRED
BREAK_COMPLETE
SESSION_RESUME
MILESTONE
LESSON_COMPLETE
GOODBYE
```

Messages should avoid shaming, infantilizing, or over-notifying the learner.

---

# 16. QUBOT INTERACTION API

Expose a clean API contract.

Recommended endpoints:

```http
GET  /api/qubot/state
POST /api/qubot/events
POST /api/qubot/interactions
GET  /api/qubot/session
POST /api/qubot/session/start
POST /api/qubot/session/end
```

Adapt routes to the existing backend conventions.

### GET /api/qubot/state

Returns current Qubot state for the active session.

Example:

```json
{
  "session_id": "uuid",
  "state": "THINKING",
  "emotion": "CURIOUS",
  "animation": "think",
  "message": null,
  "interaction": null,
  "timestamp": "ISO-8601"
}
```

### POST /api/qubot/events

Accept normalized learner events.

### POST /api/qubot/interactions

Used when the learner explicitly interacts with Qubot.

Example:

```json
{
  "interaction": "REQUEST_HINT",
  "context": {
    "question_id": "uuid"
  }
}
```

---

# 17. QUBOT RESPONSE CONTRACT

The frontend should receive a stable schema.

Example:

```json
{
  "qubot": {
    "state": "HELPING",
    "emotion": "SUPPORTIVE",
    "animation": "gentle_encourage"
  },
  "message": {
    "visible": true,
    "intent": "ALTERNATIVE_EXPLANATION",
    "text": "Let's try this from another angle."
  },
  "intervention": {
    "type": "ALTERNATIVE_EXPLANATION",
    "required": false,
    "action": "OPEN_ALTERNATIVE_EXPLANATION"
  },
  "session": {
    "pomodoro_state": "ACTIVE"
  },
  "meta": {
    "priority": "MEDIUM",
    "cooldown_seconds": 30
  }
}
```

Keep the contract backward-compatible and versionable.

---

# 18. POMODORO MODULE

Qubot owns the user-facing study-session orchestration while the underlying timer should be reliable and server-aware.

States:

```text
IDLE
FOCUS_ACTIVE
FOCUS_COMPLETE
BREAK_SUGGESTED
BREAK_ACTIVE
BREAK_SKIPPED
NEXT_ITERATION
BREAK_REQUIRED
SESSION_COMPLETE
```

Required behavior from the existing project plan:

### First completed focus interval

Qubot suggests a break.

User can:

```text
TAKE BREAK
CONTINUE
```

### If user chooses CONTINUE

Allow continuation for the first iteration as previously planned.

### Second iteration

The break becomes mandatory.

The user should not be able to endlessly bypass breaks.

Example:

```text
Iteration 1
Focus -> Break suggested
            |
        Skip allowed
            |
        Continue
            |
Iteration 2
Focus -> Break required
            |
       Break must occur
```

Use configurable durations.

Do not assume fixed Pomodoro values if the existing platform already has configuration.

Example configuration:

```json
{
  "focus_duration_seconds": 1500,
  "break_duration_seconds": 300,
  "max_skippable_breaks": 1,
  "mandatory_break_after_iteration": 2
}
```

---

# 19. DISTRACTION-REMEDY SYSTEM

Qubot should support the previously planned distraction-remedy flow.

Signals may include:

- prolonged inactivity
- repeated task switching if telemetry supports it
- rapid navigation away from task
- repeated opening/closing of unrelated UI
- long idle periods

Do not overinterpret a single signal.

When confidence is sufficient:

```text
DETECT POSSIBLE DISTRACTION
        |
        v
QUBOT CALM INTERVENTION
        |
        +--> Resume focus
        |
        +--> Short reset
        |
        +--> Start Pomodoro
```

Avoid punitive language.

---

# 20. FATIGUE DETECTION

Fatigue is not the same as conceptual struggle.

Use signals such as:

- session duration
- declining accuracy
- increasing response time
- increasing mistakes
- prolonged continuous activity
- repeated hint use

Produce:

```json
{
  "fatigue_score": 0.66,
  "confidence": 0.81
}
```

Fatigue should usually result in a gentle break recommendation rather than academic intervention.

---

# 21. ADAPTIVE DIFFICULTY INTEGRATION

Qubot should NOT own the mastery algorithm.

Instead:

```text
Assessment/Mastery Engine
        |
        v
Current mastery + difficulty
        |
        v
Qubot observes state
        |
        v
Qubot may recommend:
- easier prerequisite
- different explanation
- guided problem
```

If the existing recommendation engine supports adaptive difficulty, Qubot should call or publish a request to it rather than implementing a second recommendation engine.

---

# 22. LEARNING ENGINE INTEGRATION

Qubot should be able to consume:

- current lesson
- current topic
- current question
- question difficulty
- concept/prerequisite metadata
- mastery
- recent accuracy
- progress
- recommendation context

Qubot should be able to trigger:

- hint request
- explanation request
- alternative explanation
- prerequisite recommendation
- break recommendation

These should be contracts/events, not hardwired dependencies.

---

# 23. FRONTEND INTEGRATION CONTRACT

The future UI/UX should be able to build:

- Qubot floating companion
- Qubot dock/panel
- speech bubble
- expression changes
- idle animation
- contextual animation
- hint interaction
- break overlay
- Pomodoro timer
- distraction-remedy UI
- celebration state
- learning-state feedback

without implementing learning logic.

Frontend mapping example:

```text
Backend state       -> Frontend behavior

IDLE                -> idle animation
THINKING            -> thinking animation
ENCOURAGING         -> supportive animation + bubble
CONFUSED            -> concerned/thoughtful expression
HELPING             -> explanation animation
CELEBRATING         -> celebration animation
BREAK_SUGGESTED     -> break prompt
BREAK_ACTIVE        -> break/timer UI
BREAK_REQUIRED      -> mandatory break UI
```

---

# 24. REAL-TIME VS POLLING

Prefer event-driven or real-time delivery if the existing backend already supports:

- WebSockets
- Server-Sent Events
- realtime subscriptions

If realtime infrastructure is unavailable, provide a polling-compatible `/api/qubot/state` endpoint.

The frontend must not depend on a specific transport.

Define the Qubot response contract independently from transport.

---

# 25. SESSION PERSISTENCE

Track enough state to restore a learning session.

Recommended transient state:

```text
current_qubot_state
current_emotion
current_intervention
struggle_score
fatigue_score
distraction_score
current_pomodoro_iteration
break_status
cooldowns
last_intervention_timestamp
```

Persist long-lived learner information through the existing user/progress systems rather than duplicating it inside Qubot.

---

# 26. COOLDOWNS AND ANTI-SPAM

Qubot must not constantly interrupt.

Every intervention should support:

```text
priority
cooldown
dismissible
repeatable
max_repetitions
```

Example:

```json
{
  "priority": "MEDIUM",
  "cooldown_seconds": 60,
  "max_repetitions": 2
}
```

Repeated low-confidence signals should not generate repeated messages.

---

# 27. PRIORITY SYSTEM

Suggested priority:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Example:

```text
Celebration              LOW
Encouragement            LOW
Hint suggestion          MEDIUM
Repeated conceptual help MEDIUM
Fatigue break            HIGH
Required break           CRITICAL
```

The actual priority should remain configurable.

---

# 28. USER CONTROL

The learner should retain reasonable control over Qubot.

Support:

```text
dismiss
mute
minimize
reopen
request_hint
request_explanation
accept_intervention
reject_intervention
take_break
skip_break (when permitted)
resume
```

Mandatory safety/productivity behavior such as the second-iteration break should still follow configured rules.

---

# 29. ACCESSIBILITY

Backend contracts should support accessible UI behavior.

Avoid conveying meaning only through:

- color
- facial expression
- animation
- sound

Every meaningful Qubot action should have semantic text or accessible labels available to the frontend.

Allow reduced-motion handling on the frontend.

---

# 30. PRIVACY AND DATA MINIMIZATION

Only collect signals required for learning adaptation and Qubot behavior.

Do NOT introduce webcam/emotion recognition simply because Qubot is a mascot.

The initial struggle detector should operate on learning interaction telemetry:

```text
answers
attempts
timing
hints
mastery
progress
inactivity
session behavior
```

Do not infer sensitive personal traits.

Do not expose internal scoring details unnecessarily to learners.

---

# 31. ANALYTICS

Track Qubot performance as a product system.

Useful events:

```text
QUBOT_INTERVENTION_SHOWN
QUBOT_INTERVENTION_ACCEPTED
QUBOT_INTERVENTION_DISMISSED
QUBOT_HINT_REQUESTED
QUBOT_ALTERNATIVE_EXPLANATION_USED
QUBOT_BREAK_SUGGESTED
QUBOT_BREAK_ACCEPTED
QUBOT_BREAK_SKIPPED
QUBOT_BREAK_COMPLETED
QUBOT_STRUGGLE_DETECTED
QUBOT_STRUGGLE_RESOLVED
```

Measure:

- intervention acceptance rate
- intervention dismissal rate
- repeated-intervention rate
- post-intervention accuracy
- time-to-resolution
- learning continuation
- break completion
- session completion
- false-positive struggle detection

Do not optimize for "more Qubot interactions." Optimize for better learning outcomes and appropriate engagement.

---

# 32. TESTING REQUIREMENTS

Create unit tests for:

### Struggle detector

- no struggle
- isolated wrong answer
- repeated wrong answers
- excessive time
- repeated hints
- repeated concept failure
- rapid guessing
- inactivity
- sudden accuracy drop
- difficulty mismatch
- combined signals

### Behavior engine

Verify each struggle type maps to an appropriate response.

### Cooldowns

Verify repeated events do not spam interventions.

### Pomodoro

Test:

```text
first iteration
break suggestion
skip allowed
continuation
second iteration
mandatory break
break completion
session resume
```

### State machine

Verify illegal transitions are rejected.

### API

Validate request/response schemas.

### Regression

Ensure existing learning, assessment, progress, recommendation, and analytics modules continue to work.

---

# 33. OBSERVABILITY

Add structured logging around:

```text
Qubot event received
Learner state calculated
Struggle score calculated
Intervention selected
Qubot state changed
Pomodoro state changed
Break rule evaluated
Frontend interaction received
```

Never log unnecessary personal/sensitive information.

Include:

```text
event_id
session_id
user_id (according to existing privacy/logging policy)
qubot_state
intervention_type
timestamp
```

---

# 34. CONFIGURATION

All thresholds and behavior parameters should be configurable.

Suggested configuration:

```json
{
  "struggle": {
    "mild_threshold": 0.30,
    "moderate_threshold": 0.50,
    "high_threshold": 0.70,
    "critical_threshold": 0.85,
    "weights": {}
  },
  "fatigue": {},
  "distraction": {},
  "cooldowns": {},
  "pomodoro": {
    "focus_duration_seconds": 1500,
    "break_duration_seconds": 300,
    "max_skippable_breaks": 1,
    "mandatory_break_after_iteration": 2
  }
}
```

Use environment/config management already present in the project.

---

# 35. ERROR HANDLING

Qubot must fail gracefully.

If the Qubot service is unavailable:

- learning must continue
- assessment must continue
- progress must continue
- frontend should fall back to neutral Qubot state
- timer should not silently lose state if it is a critical session function

Example fallback:

```json
{
  "state": "IDLE",
  "emotion": "NEUTRAL",
  "animation": "idle_breathe",
  "message": null
}
```

Qubot must be a supporting layer, not a single point of failure for the learning platform.

---

# 36. SECURITY

Apply the existing authentication/authorization middleware.

Ensure:

- users can access only their own Qubot session
- event payloads are validated
- question/lesson IDs are authorized
- interaction endpoints cannot modify another user's state
- timers cannot be arbitrarily manipulated by untrusted clients
- server-side session state remains authoritative where necessary

---

# 37. API VERSIONING

Use the existing API versioning strategy.

If none exists, structure Qubot contracts so future versions can be introduced without breaking the frontend.

Example:

```text
/api/v1/qubot/...
```

Do not force a new versioning strategy if the existing backend already has one.

---

# 38. IMPLEMENTATION ORDER

Implement in this order:

## Phase 1 — Integration foundation

1. Inspect the existing backend.
2. Identify learning, assessment, progress, mastery, recommendation, analytics, and session modules.
3. Reuse existing services/models where possible.
4. Create Qubot module boundaries.
5. Define schemas/types/contracts.

## Phase 2 — Event pipeline

6. Normalize learner events.
7. Connect existing learning events to Qubot.
8. Add Qubot event processor.
9. Add learner-state adapter.

## Phase 3 — Intelligence

10. Implement struggle detector.
11. Implement fatigue detector.
12. Implement distraction detector.
13. Implement struggle classification.
14. Implement configurable thresholds.
15. Implement intervention engine.
16. Implement behavior/state machine.

## Phase 4 — Pomodoro

17. Implement session timer state.
18. Implement break suggestion.
19. Implement first-iteration skip behavior.
20. Implement second-iteration mandatory break.
21. Implement break completion/resume flow.
22. Emit timer events.

## Phase 5 — Frontend contract

23. Implement Qubot state endpoint.
24. Implement event endpoint.
25. Implement interaction endpoint.
26. Implement semantic animation/message contracts.
27. Add realtime transport if available.

## Phase 6 — Reliability

28. Add cooldowns.
29. Add error handling/fallback states.
30. Add security validation.
31. Add analytics.
32. Add observability.
33. Add unit/integration/regression tests.

---

# 39. DEFINITION OF DONE

Qubot backend integration is complete when:

- [ ] Existing backend architecture remains intact.
- [ ] Qubot is a modular layer, not UI-only logic.
- [ ] Learner events reach Qubot.
- [ ] Qubot can calculate learner state.
- [ ] Struggle detection works from multiple signals.
- [ ] Struggle types are classified.
- [ ] Fatigue is distinguished from conceptual struggle.
- [ ] Distraction signals are supported.
- [ ] Qubot interventions are selected contextually.
- [ ] Qubot states/emotions/animations are returned semantically.
- [ ] Frontend does not contain struggle/business logic.
- [ ] Pomodoro flow is implemented.
- [ ] First break can be skipped.
- [ ] Second-iteration break is mandatory.
- [ ] Cooldowns prevent Qubot spam.
- [ ] Qubot interactions are logged.
- [ ] Analytics events are emitted.
- [ ] API contracts are validated.
- [ ] Authentication/authorization is enforced.
- [ ] Qubot failure does not break learning.
- [ ] Unit tests cover detector, behavior engine, state machine, and Pomodoro.
- [ ] Integration tests cover learner-event → Qubot-response flow.
- [ ] Existing backend tests still pass.
- [ ] The eventual Qubot UI can be integrated without rewriting backend learning logic.

---

# 40. IMPORTANT IMPLEMENTATION INSTRUCTION FOR ANTIGRAVITY

Before changing code:

1. Inspect the current repository structure.
2. Read the existing backend architecture and identify existing services/models/controllers.
3. Do NOT duplicate functionality that already exists.
4. Do NOT rewrite stable backend modules merely to fit Qubot.
5. Integrate Qubot through adapters, events, services, and contracts.
6. Preserve existing API behavior unless a change is explicitly required.
7. Reuse existing authentication, database, caching, queue, websocket, and configuration infrastructure.
8. Follow the project's existing language/framework conventions.
9. Implement migrations only when persistence is actually required.
10. Keep all Qubot visual implementation in the frontend.
11. Keep all learning/business decisions in the backend.
12. Keep thresholds configurable.
13. Add tests alongside implementation.
14. Document every new API/event contract.
15. Run the existing test suite after integration.
16. Fix regressions before finishing.
17. Produce a concise implementation summary listing files changed, APIs added, events added, tests added, and any assumptions.

---

# 41. TARGET EXPERIENCE

The intended end-to-end behavior is:

```text
Learner starts lesson
        |
        v
Qubot greets / enters IDLE
        |
        v
Learner solves problem
        |
        v
Events are emitted
        |
        v
Qubot observes learner state
        |
        v
Struggle/fatigue/distraction signals calculated
        |
        v
No issue?
   |             |
  YES            NO
   |             |
Continue      classify issue
                 |
       +---------+---------+
       |         |         |
   Conceptual  Fatigue  Distraction
       |         |         |
       v         v         v
Alternative   Break     Reset /
explanation  suggestion  Pomodoro
       |
       v
Qubot response
       |
       v
Frontend renders:
expression + animation + dialogue + action
       |
       v
Learner continues
       |
       v
Outcome event
       |
       v
Qubot learns from the result / updates current state
```

The final system should make Qubot feel like a persistent, intelligent learning companion while keeping the actual learning platform modular, reliable, and maintainable.

---

# 42. NON-GOALS

Do NOT implement these unless separately requested:

- webcam-based emotion recognition
- facial-expression analysis of the learner
- medical/psychological diagnosis
- invasive behavioral surveillance
- Qubot replacing the core tutor/learning engine
- duplicate mastery algorithms
- duplicate recommendation algorithms
- hardcoded frontend animation implementation in backend
- forcing Qubot into every screen
- excessive gamification that interrupts learning

Qubot should enhance the learning experience, not become the learning platform itself.

---

# FINAL PRINCIPLE

**The learning platform decides what the learner needs.  
Qubot decides how to communicate and intervene.  
The frontend decides how Qubot looks and moves.**

That separation is the key to making the final Qubot UI/UX fit cleanly into the existing system.
