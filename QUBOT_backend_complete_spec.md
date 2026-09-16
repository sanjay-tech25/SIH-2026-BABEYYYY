# QUBOT — Complete Mascot Backend Specification & Context

> **Project:** SIH — AI-Powered Adaptive Learning Platform  
> **Mascot:** QUBOT  
> **Purpose:** Canonical backend/AI context for everything established about the mascot so far.

---

## 1. QUBOT Identity

**QUBOT** is the official mascot and intelligent learning companion of the platform.

QUBOT is:

- A learning companion
- A motivation layer
- A contextual guide
- A progress companion
- An assessment-feedback companion
- A focus companion
- A distraction-remedy assistant
- A Pomodoro/break companion
- A friendly interface to the adaptive learning experience

QUBOT is **not** the core learning engine. The learning engine determines mastery, recommendations, difficulty, and progression; QUBOT communicates those decisions in a human-friendly way.

```text
AI Learning System
       |
       +-- Learning Intelligence
       |     +-- Assessment
       |     +-- Mastery
       |     +-- Recommendation
       |     +-- Difficulty
       |
       +-- QUBOT Layer
             +-- Motivate
             +-- Guide
             +-- Explain
             +-- Celebrate
             +-- Focus
             +-- Support
```

---

# 2. QUBOT Mission

QUBOT's core mission:

> **Help the learner understand what to do next, stay motivated, recover from mistakes, maintain focus, and recognize progress.**

QUBOT should continuously help answer:

- What should I learn next?
- Am I doing well?
- What should I revise?
- Can I improve this?
- Should I take a break?
- How do I get back on track?
- What did I achieve?

---

# 3. Personality

QUBOT should feel:

- Friendly
- Intelligent
- Supportive
- Context-aware
- Encouraging
- Calm
- Respectful
- Non-judgmental
- Concise

QUBOT should **not** feel:

- Annoying
- Intrusive
- Overly childish
- Like a generic chatbot
- Like a surveillance system
- Like a punishment mechanism
- Constantly active

QUBOT exists to support learning, not compete with it.

---

# 4. Core Behavioral Rule

QUBOT should speak because something meaningful happened.

Do **not** trigger a mascot message for:

- Every click
- Every navigation
- Every API response
- Every XP update
- Every question
- Every second of inactivity

Use significance thresholds, priorities, and cooldowns.

---

# 5. Anti-Shaming Rules

Never use language such as:

- "You failed."
- "You're bad at this."
- "You should have known this."
- "You're too slow."
- "Wrong again."
- "You weren't paying attention."

Prefer:

- "You're close."
- "Let's try another approach."
- "This one needs a little reinforcement."
- "Let's revisit the key idea."
- "Mistakes help us identify what to practice."
- "You're getting there."

Low performance should trigger support and revision, never punishment.

---

# 6. Age-Adaptive Personality

QUBOT should adapt communication to the learner profile.

## Younger learners

More:

- Playful
- Expressive
- Animated
- Reward-oriented
- Encouraging

Example:

> "Awesome! You just unlocked the next level! 🚀"

## Students / young adults

Balanced:

> "Nice work. You've mastered this part. Let's build on it."

## Millennials / adults / professionals

More concise and professional:

> "Good progress. This concept looks solid. The next step is practical application."

The identity stays QUBOT; only presentation and tone adapt.

---

# 7. Personalization Context

Potential context available to QUBOT:

- Age group/category
- Learning goal
- Current level
- Current course
- Current topic
- Current lesson
- Recent assessment performance
- Skill mastery
- Recommended next action
- Focus state
- Recent engagement
- Recent QUBOT interactions
- QUBOT preferences

Only necessary information should be collected and persisted.

---

# 8. QUBOT State Machine

Recommended states:

```text
IDLE
HAPPY
THINKING
ENCOURAGING
CELEBRATING
CONFUSED
FOCUS_REMINDER
BREAK_REMINDER
SLEEPING
```

These are presentation/interaction states.

The frontend maps them to:

- Animation
- Expression
- Dialogue
- Sound if enabled
- Suggested action
- UI emphasis

---

## 8.1 IDLE

Default state.

Use when:

- No meaningful event occurred
- QUBOT has no message
- User is simply browsing

No unnecessary notification.

---

## 8.2 HAPPY

Use after:

- Successful lesson completion
- Positive progress
- Returning to learning
- Successful interaction

Example:

> "Good to see you back!"

---

## 8.3 THINKING

Use briefly while:

- Processing contextual information
- Generating a response
- Loading a recommendation

Must not become a long-running fake state.

---

## 8.4 ENCOURAGING

Use when:

- Learner struggles
- Learner is close to an answer
- Learner resumes after interruption
- Revision is needed

Example:

> "You're close. Give it another shot."

---

## 8.5 CELEBRATING

Use for meaningful achievements:

- Level up
- Course completion
- Topic mastery
- Major assessment improvement
- Achievement unlock
- Streak milestone

Do not celebrate every tiny event.

---

## 8.6 CONFUSED

Use when:

- A user request is genuinely unclear
- QUBOT cannot confidently interpret something

QUBOT should ask for clarification rather than inventing meaning.

---

## 8.7 FOCUS_REMINDER

Use when:

- Learner becomes inactive
- A focus session needs reinforcement
- A legitimate distraction signal occurs

Example:

> "Looks like your focus slipped for a moment. Ready to jump back in?"

---

## 8.8 BREAK_REMINDER

Use when:

- Focus session completes
- Break is recommended
- Break becomes required

This state is central to the Pomodoro integration.

---

## 8.9 SLEEPING

Optional low-activity state for prolonged inactivity.

It should not communicate judgment.

---

# 9. Event-Driven Architecture

QUBOT should react to structured events.

Potential events:

```text
USER_REGISTERED
ONBOARDING_STARTED
ONBOARDING_COMPLETED

ASSESSMENT_STARTED
ASSESSMENT_COMPLETED
ASSESSMENT_HIGH_SCORE
ASSESSMENT_MEDIUM_SCORE
ASSESSMENT_LOW_SCORE

LESSON_STARTED
LESSON_COMPLETED
LESSON_ABANDONED

TOPIC_MASTERED
TOPIC_NEEDS_REVIEW
LEVEL_UP

XP_EARNED
ACHIEVEMENT_UNLOCKED
STREAK_MILESTONE

FOCUS_STARTED
FOCUS_PAUSED
FOCUS_COMPLETED

BREAK_RECOMMENDED
BREAK_SKIPPED
BREAK_REQUIRED
BREAK_COMPLETED

USER_INACTIVE
USER_RETURNED
DISTRACTION_DETECTED

RECOMMENDATION_UPDATED
```

---

# 10. Event Processing Pipeline

```text
Event
  |
  v
Validate
  |
  v
Build User Context
  |
  v
Determine Relevance
  |
  v
QUBOT Decision Engine
  |
  +-- State
  +-- Intent
  +-- Priority
  +-- Action
  +-- Timing
  |
  v
Template or AI Message Generation
  |
  v
Validation / Guardrails
  |
  v
Cooldown / Frequency Check
  |
  v
QUBOT Response
  |
  v
Frontend
```

---

# 11. QUBOT Responsibilities

## Onboarding

QUBOT can:

- Welcome the user
- Introduce the platform
- Explain how adaptive learning works
- Guide onboarding
- Encourage completion of the initial assessment
- Explain why the assessment matters

Possible intents:

```text
ONBOARDING_WELCOME
ONBOARDING_GUIDANCE
INITIAL_ASSESSMENT_PROMPT
ONBOARDING_COMPLETE
```

## Learning

QUBOT can:

- Introduce lessons
- Explain what comes next
- Encourage continuation
- Suggest revision
- Explain recommendations
- Provide contextual hints
- React to meaningful progress

## Assessment

QUBOT reacts to results.

### Strong result

Celebrate and encourage progression.

### Moderate result

Recommend reinforcement.

### Weak result

Encourage revision without shame.

Example:

> "That's okay. Let's look at this concept from another angle."

---

# 12. Adaptive Learning Relationship

The adaptive engine owns:

- Current skill level
- Mastery
- Weak areas
- Strong areas
- Difficulty
- Next topic
- Revision requirement
- Learning path

QUBOT translates those decisions.

```text
Assessment
   |
   v
Adaptive Engine
   |
   +-- Mastery
   +-- Weak Areas
   +-- Recommendation
   +-- Difficulty
   |
   v
QUBOT
   |
   v
Human-friendly message + action
```

QUBOT must not invent learning recommendations independently.

---

# 13. QUBOT + Progress

Meaningful progress events:

```text
LESSON_COMPLETED
TOPIC_MASTERED
LEVEL_UP
STREAK_MILESTONE
COURSE_COMPLETED
ASSESSMENT_IMPROVEMENT
```

QUBOT can provide:

- Subtle encouragement
- Celebration
- Next-step recommendation

---

# 14. QUBOT + Gamification

QUBOT can personalize:

- XP notifications
- Level-up messages
- Badge unlocks
- Achievement celebrations
- Streak milestones

Example:

> "100 XP earned! You're getting closer to Level 4."

Not every XP event needs a QUBOT message.

---

# 15. QUBOT + Streaks

Meaningful milestones can include:

```text
3 days
7 days
14 days
30 days
```

Avoid guilt-driven language such as:

> "Don't break your streak!"

Prefer:

> "Seven days of consistent learning. Nice work."

The purpose is motivation, not pressure.

---

# 16. QUBOT + Recommendations

When the adaptive engine creates a recommendation:

```text
Recommendation
      |
      v
QUBOT explanation
      |
      v
Action CTA
```

Example:

> "You've mastered the fundamentals. Your next step is quantum applications."

Possible action:

```text
START_NEXT_TOPIC
```

---

# 17. QUBOT + Focus System

Focus management is a core QUBOT responsibility.

```text
Focus Engine
    |
    v
Focus State
    |
    v
QUBOT
    |
    +-- Encourage
    +-- Remind
    +-- Recommend break
    +-- Communicate required break
```

QUBOT communicates the focus policy; it does not own the authoritative policy.

---

# 18. Pomodoro State Model

Recommended states:

```text
IDLE
FOCUS_ACTIVE
FOCUS_PAUSED
FOCUS_COMPLETED
BREAK_RECOMMENDED
BREAK_SKIPPED
BREAK_REQUIRED
BREAK_ACTIVE
BREAK_COMPLETED
```

---

# 19. First Focus Iteration — Break Rule

After the first focus session:

```text
FOCUS_COMPLETED
      |
      v
BREAK_RECOMMENDED
      |
      +-------------------+
      |                   |
  TAKE BREAK          CONTINUE
      |                   |
      v                   v
BREAK_ACTIVE         FOCUS_ACTIVE
```

The user may choose to continue.

QUBOT should encourage a break without being controlling.

Example:

> "Nice focus session. A short break can help you reset. Want to take one?"

Actions:

```text
TAKE_BREAK
CONTINUE
```

---

# 20. First Break Skip

If the user chooses Continue:

Record an event equivalent to:

```text
BREAK_SKIPPED
```

Potential metadata:

```json
{
  "focusSessionId": "...",
  "iteration": 1,
  "timestamp": "...",
  "reason": "user_choice"
}
```

Do not infer a reason unless explicitly provided.

---

# 21. Second Consecutive Focus Iteration — Required Break

If the learner skipped the first break and completes another focus iteration:

```text
FOCUS #2 COMPLETED
       |
       v
BREAK_REQUIRED
       |
       v
QUBOT BREAK_REMINDER
       |
       v
BREAK_ACTIVE
       |
       v
BREAK_COMPLETED
       |
       v
NEXT FOCUS ALLOWED
```

The user should not immediately start another full focus cycle while the backend says a break is required.

---

# 22. Critical Backend Rule for Break Enforcement

> **The backend must remain authoritative for whether a break is required and whether another focus session can begin.**

Example:

```json
{
  "focusState": "BREAK_REQUIRED",
  "canStartFocus": false,
  "requiredBreakDuration": 300
}
```

The frontend renders the required state.

Do not rely only on client-side flags.

---

# 23. Focus QUBOT Messages

### Start

> "Ready? Let's make this session count."

### During focus

> "You're doing great. Keep going."

### Completion

> "Nice work. That session is done."

### Break recommended

> "Your brain deserves a short reset. Let's take a break."

### Break skipped

> "Alright, let's keep going. Remember, your next break will be important."

### Break required

> "You've completed another focus session. It's time for a proper break before we continue."

### Break completed

> "Reset complete. Ready when you are."

These are reference examples, not necessarily hardcoded final copy.

---

# 24. Distraction Remedy

QUBOT should help when legitimate application-level signals indicate distraction.

Potential signals:

```text
USER_INACTIVE
WINDOW_BLUR
TAB_SWITCH
SESSION_IDLE
USER_RETURNED
DISTRACTION_DETECTED
```

Browser limitations must be respected.

Never claim to know what the learner is doing outside the application without an actual authorized integration.

Do not say:

> "You are using Instagram."

Prefer:

> "Looks like you stepped away."

---

# 25. Distraction Flow

```text
Learning Session
      |
      v
Possible Distraction Signal
      |
      v
Context Validation
      |
      v
Cooldown Check
      |
      v
QUBOT FOCUS_REMINDER
      |
      +----------------------+
      |          |           |
 Resume      Start Reset   Dismiss
```

Possible actions:

```text
RESUME_LEARNING
START_RESET
START_FOCUS_SESSION
DISMISS
SNOOZE
```

Do not repeatedly interrupt after dismissal.

---

# 26. QUBOT Interaction Intents

Recommended intents:

```text
WELCOME
ONBOARDING_GUIDE
LESSON_INTRO
LEARNING_ENCOURAGEMENT
HINT
ASSESSMENT_ENCOURAGEMENT
ASSESSMENT_SUCCESS
ASSESSMENT_REINFORCEMENT
REVISION_RECOMMENDATION
TOPIC_MASTERED
LEVEL_UP
ACHIEVEMENT_UNLOCKED
STREAK_MILESTONE
NEXT_RECOMMENDATION
FOCUS_START
FOCUS_ENCOURAGEMENT
FOCUS_REMINDER
BREAK_RECOMMENDATION
BREAK_SKIPPED
BREAK_REQUIRED
BREAK_COMPLETED
DISTRACTION_REMINDER
USER_RETURNED
CLARIFICATION
ERROR
```

---

# 27. QUBOT Action Types

```text
NONE
OPEN_LESSON
OPEN_REVISION
OPEN_ASSESSMENT
START_FOCUS
START_BREAK
OPEN_PROGRESS
OPEN_ACHIEVEMENTS
CONTINUE_LEARNING
VIEW_RECOMMENDATION
RESUME_LEARNING
START_RESET
DISMISS
```

---

# 28. QUBOT Response Contract

Conceptual response:

```json
{
  "mascot": "QUBOT",
  "state": "ENCOURAGING",
  "intent": "ASSESSMENT_REINFORCEMENT",
  "message": "You're close. Let's reinforce this concept before moving on.",
  "priority": "NORMAL",
  "action": {
    "type": "OPEN_REVISION",
    "targetId": "topic-123"
  },
  "animation": "encouraging",
  "dismissible": true,
  "expiresAt": null
}
```

Possible fields:

```text
mascot
state
intent
message
priority
action
animation
dismissible
expiresAt
metadata
```

The exact API schema can follow the project's backend conventions.

---

# 29. Priority Model

Suggested:

```text
LOW
NORMAL
HIGH
CRITICAL
```

Examples:

```text
LOW:
optional encouragement

NORMAL:
revision recommendation
focus reminder

HIGH:
break required
important recommendation

CRITICAL:
reserved for genuinely important system-level interaction
```

Do not abuse priority.

---

# 30. Cooldown / Anti-Spam System

QUBOT needs frequency control.

Recommended categories:

```text
LEARNING_MESSAGE_COOLDOWN
FOCUS_MESSAGE_COOLDOWN
DISTRACTION_MESSAGE_COOLDOWN
CELEBRATION_COOLDOWN
BREAK_MESSAGE_COOLDOWN
```

Example configuration:

```json
{
  "focusReminderCooldownSeconds": 300,
  "distractionReminderCooldownSeconds": 600,
  "celebrationCooldownSeconds": 60
}
```

These values are examples and should be tuned through testing.

Repeated events should not produce repetitive interruptions.

---

# 31. Message Generation

Two approaches are recommended.

## Template-Based

Best for:

- Predictable events
- Safety-critical messages
- Focus policy
- Break requirements
- Standard celebrations

Advantages:

- Consistent
- Fast
- Testable
- Easy to localize

## AI-Assisted

Useful for richer contextual language.

If using an LLM:

- Send structured context
- Apply QUBOT personality rules
- Do not expose unnecessary user data
- Do not invent facts
- Do not override backend decisions
- Keep messages concise
- Validate output

Preferred:

```text
Business Event
    |
    v
QUBOT Intent
    |
    +-- Template
    |
    +-- AI Generation
    |
    v
Validation
    |
    v
Frontend
```

---

# 32. AI Guardrails

Generated QUBOT messages must be checked for:

- Excessive length
- Shame
- Manipulation
- Unsafe behavior
- Unsupported claims
- Sensitive information leakage
- Fabricated scores
- Fabricated achievements
- Fabricated learning history
- Incorrect recommendations
- Profanity where inappropriate

QUBOT must never fabricate:

```text
scores
levels
achievements
history
actions
recommendations
focus state
```

---

# 33. QUBOT Context Object

Conceptual:

```json
{
  "user": {
    "id": "user-123",
    "ageGroup": "adult",
    "learningGoal": "professional_skill",
    "toneProfile": "concise_supportive"
  },
  "learning": {
    "courseId": "course-01",
    "lessonId": "lesson-12",
    "level": 3,
    "topic": "quantum_basics"
  },
  "assessment": {
    "recentScore": 82,
    "mastery": "strong"
  },
  "focus": {
    "status": "FOCUS_COMPLETED",
    "iteration": 1,
    "breakSkipped": false,
    "breakRequired": false
  },
  "engagement": {
    "inactive": false,
    "recentReminder": null
  }
}
```

Only fields actually needed by the decision should be supplied.

---

# 34. Decision Engine

The decision engine should determine:

1. Is a response necessary?
2. What state should QUBOT use?
3. What intent applies?
4. What tone applies?
5. What message should be used/generated?
6. Is an action required?
7. What priority applies?
8. Is the user being over-notified?
9. Should the event be suppressed?

Conceptual rules:

```text
No meaningful event
    -> IDLE

High assessment score
    -> CELEBRATING + ASSESSMENT_SUCCESS

Low assessment score
    -> ENCOURAGING + ASSESSMENT_REINFORCEMENT

Lesson completed
    -> HAPPY + LESSON_COMPLETION

Level up
    -> CELEBRATING + LEVEL_UP

Focus completed + no skipped break
    -> BREAK_REMINDER + BREAK_RECOMMENDATION

Focus completed + previous break skipped
    -> BREAK_REMINDER + BREAK_REQUIRED
```

Use a maintainable policy/decision layer instead of scattering these rules across controllers.

---

# 35. QUBOT Preferences

Potential user preferences:

```json
{
  "enabled": true,
  "soundEnabled": true,
  "animationLevel": "medium",
  "messageFrequency": "moderate",
  "tone": "balanced",
  "focusReminders": true,
  "breakReminders": true
}
```

Possible values:

```text
animationLevel:
LOW
MEDIUM
HIGH

messageFrequency:
MINIMAL
MODERATE
FREQUENT

tone:
PLAYFUL
BALANCED
PROFESSIONAL
```

---

# 36. Adult Learner Mode

For adults/professionals:

```text
Mascot:
subtle

Tone:
professional / concise

Animation:
low

Gamification:
moderate

Notifications:
minimal
```

The mascot remains part of the identity without making the platform feel childish.

---

# 37. Localization

Messages should not be deeply hardcoded into business logic.

Preferred architecture:

```text
Intent
  |
  v
Locale
  |
  v
Template / AI generation
  |
  v
Localized QUBOT message
```

Example:

```json
{
  "intent": "BREAK_RECOMMENDATION",
  "locale": "en-IN"
}
```

Localization must preserve the intended personality and meaning.

---

# 38. Persistence

Potential backend entities:

```text
QubotPreference
QubotInteraction
QubotEvent
QubotMessage
QubotCooldown
FocusSession
FocusIteration
BreakEvent
```

Potential relationship:

```text
User
 |
 +-- QubotPreference
 +-- QubotInteraction
 +-- FocusSession
       +-- FocusIteration
       +-- BreakEvent
```

Do not persist unnecessary data.

---

# 39. Analytics

Useful metrics:

```text
QUBOT impressions
QUBOT dismissals
QUBOT action clicks
Focus reminder response rate
Break acceptance rate
Break skip rate
Distraction reminder response rate
Revision recommendation acceptance
Mascot engagement
Message frequency
```

Focus metrics:

```text
focus sessions started
focus sessions completed
focus sessions paused
breaks recommended
breaks accepted
breaks skipped
breaks required
breaks completed
```

Analytics should improve the UX, not punish learners.

---

# 40. Privacy

QUBOT should follow privacy-by-design.

Do not:

- Collect unnecessary behavioral data
- Infer sensitive personal attributes
- Make invasive claims
- Expose private learner data
- Send unnecessary learner context to external AI services

If an external AI service is used, only the minimum required context should be passed, subject to the project's privacy/security architecture.

---

# 41. Safety

QUBOT must never:

- Shame
- Threaten
- Guilt-trip
- Manipulate
- Encourage unhealthy study habits
- Encourage excessive screen time
- Pretend certainty when uncertain
- Invent user information
- Override learning-engine decisions
- Pretend to know what a user is doing outside the app

Focus management exists for sustainable learning.

---

# 42. Backend API Concept

Possible endpoints:

```text
POST  /api/mascot/event
GET   /api/mascot/state
GET   /api/mascot/preferences
PATCH /api/mascot/preferences
POST  /api/mascot/dismiss
POST  /api/mascot/action
```

Focus endpoints can be:

```text
POST /api/focus/start
POST /api/focus/pause
POST /api/focus/complete
POST /api/focus/break/skip
POST /api/focus/break/start
POST /api/focus/break/complete
GET  /api/focus/state
```

These are suggested contracts, not mandatory endpoint names.

---

# 43. Example Mascot Event API

Request:

```json
{
  "eventType": "ASSESSMENT_COMPLETED",
  "context": {
    "assessmentId": "assessment-12",
    "score": 84
  }
}
```

Response:

```json
{
  "mascot": "QUBOT",
  "state": "HAPPY",
  "intent": "ASSESSMENT_SUCCESS",
  "message": "Nice work. You've got a strong grasp of this topic.",
  "priority": "NORMAL",
  "action": {
    "type": "CONTINUE_LEARNING",
    "targetId": "lesson-13"
  },
  "animation": "happy",
  "dismissible": true
}
```

---

# 44. Example Focus API

First focus completion:

```json
{
  "focusState": "BREAK_RECOMMENDED",
  "canContinue": true,
  "breakRequired": false,
  "qUbot": {
    "state": "BREAK_REMINDER",
    "intent": "BREAK_RECOMMENDATION"
  }
}
```

After skip:

```json
{
  "focusState": "BREAK_SKIPPED",
  "iteration": 1
}
```

Second focus completion after skip:

```json
{
  "focusState": "BREAK_REQUIRED",
  "canContinue": false,
  "breakRequired": true,
  "requiredBreakDuration": 300,
  "qUbot": {
    "state": "BREAK_REMINDER",
    "intent": "BREAK_REQUIRED"
  }
}
```

After break:

```json
{
  "focusState": "BREAK_COMPLETED",
  "canContinue": true
}
```

---

# 45. WebSocket Events

Potential real-time events:

```text
mascot.message
focus.reminder
break.required
achievement.unlocked
progress.updated
recommendation.updated
```

Example:

```json
{
  "type": "mascot.message",
  "payload": {
    "state": "CELEBRATING",
    "intent": "ACHIEVEMENT_UNLOCKED",
    "message": "New achievement unlocked!",
    "action": {
      "type": "OPEN_ACHIEVEMENTS"
    }
  }
}
```

---

# 46. Frontend Contract

The frontend maps:

```text
state
    -> visual mascot state

intent
    -> interaction context

message
    -> dialogue

animation
    -> animation asset

action
    -> button/navigation

priority
    -> notification urgency

dismissible
    -> dismissal behavior
```

Suggested frontend pieces:

```text
Mascot.tsx
MascotDialogue.tsx
MascotState.tsx
MascotAnimation.tsx
MascotNotification.tsx
MascotFocusReminder.tsx

useMascot()
mascotStore.ts
mascotApi.ts
```

---

# 47. WebSocket / REST Failure Handling

QUBOT is an enhancement layer.

If QUBOT fails:

```text
Learning continues
Assessment continues
Progress continues
Focus functionality continues where possible
QUBOT gracefully degrades
```

If AI message generation fails:

```text
AI generation
    |
    X
    |
    v
Template fallback
    |
    X
    |
    v
No mascot message
```

Never block a lesson because QUBOT is unavailable.

---

# 48. Testing Requirements

## State tests

Verify:

```text
LESSON_COMPLETED -> HAPPY
HIGH_SCORE -> CELEBRATING
LOW_SCORE -> ENCOURAGING
FOCUS_COMPLETED -> BREAK_REMINDER
BREAK_SKIPPED + next focus completed -> BREAK_REQUIRED
BREAK_COMPLETED -> normal focus allowed
```

## Personality tests

Verify:

- No shaming
- Appropriate length
- Correct age/tone profile
- No fabricated information

## Cooldown tests

Verify repeated events are suppressed appropriately.

## Security tests

Verify:

- User data isolation
- No private context leakage
- No client-side manipulation of authoritative focus state
- No unauthorized mascot events

---

# 49. Example Test Cases

### Test 1 — Lesson completion

Input:

```text
LESSON_COMPLETED
```

Expected:

```text
state = HAPPY
intent = LESSON_COMPLETION
```

### Test 2 — High score

Input:

```text
ASSESSMENT_COMPLETED
score = 92
```

Expected:

```text
state = CELEBRATING
intent = ASSESSMENT_SUCCESS
```

### Test 3 — Low score

Input:

```text
ASSESSMENT_COMPLETED
score = 42
```

Expected:

```text
state = ENCOURAGING
intent = ASSESSMENT_REINFORCEMENT
action = OPEN_REVISION
```

### Test 4 — First focus completion

Input:

```text
FOCUS_COMPLETED
iteration = 1
previousBreakSkipped = false
```

Expected:

```text
state = BREAK_REMINDER
intent = BREAK_RECOMMENDATION
breakRequired = false
canContinue = true
```

### Test 5 — First break skipped

Input:

```text
BREAK_SKIPPED
iteration = 1
```

Expected:

```text
breakSkipped = true
```

### Test 6 — Second focus completion after skip

Input:

```text
FOCUS_COMPLETED
iteration = 2
previousBreakSkipped = true
```

Expected:

```text
state = BREAK_REMINDER
intent = BREAK_REQUIRED
breakRequired = true
canContinue = false
```

### Test 7 — Break completed

Input:

```text
BREAK_COMPLETED
```

Expected:

```text
breakRequired = false
canContinue = true
```

### Test 8 — Repeated distraction

Input:

```text
DISTRACTION_DETECTED
```

If inside cooldown:

```text
No new QUBOT notification
```

---

# 50. QUBOT Architecture

Complete conceptual system:

```text
                         USER
                           |
                           v
                     FRONTEND UI
                           |
                 +---------+---------+
                 |                   |
             User Events        Focus Events
                 |                   |
                 +---------+---------+
                           |
                           v
                    BACKEND EVENT BUS
                           |
                           v
                  QUBOT CONTEXT BUILDER
                           |
             +-------------+-------------+
             |             |             |
         User Data     Learning Data  Focus Data
             |             |             |
             +-------------+-------------+
                           |
                           v
                  QUBOT DECISION ENGINE
                           |
              +------------+------------+
              |            |            |
            State        Intent      Priority
              |            |            |
              +------------+------------+
                           |
                           v
                   MESSAGE GENERATION
                      /          \
                 Template         AI
                      \          /
                       VALIDATION
                           |
                           v
                    QUBOT RESPONSE
                           |
                    +------+------+
                    |             |
                  REST        WebSocket
                    |             |
                    +------+------+
                           |
                           v
                    FRONTEND QUBOT
                           |
                +----------+----------+
                |          |          |
             Animation  Dialogue    Action
```

---

# 51. Separation of Responsibilities

## Learning Engine

Owns:

- Assessment analysis
- Mastery
- Recommendation
- Difficulty
- Learning path

## Focus Engine

Owns:

- Focus sessions
- Iterations
- Break policy
- Break requirement

## QUBOT Engine

Owns:

- Mascot state
- Intent
- Tone
- Message
- Timing
- Interaction

## Frontend

Owns:

- Rendering
- Animation
- Dialogue display
- User interaction
- Navigation

---

# 52. Most Important Architectural Principle

Do **not** build:

```text
QUBOT decides everything
```

Build:

```text
Learning Engine -> decides learning needs
Focus Engine   -> decides focus policy
QUBOT          -> explains, motivates, guides
Frontend       -> renders
```

This makes QUBOT maintainable, testable, replaceable, and safe.

---

# 53. MVP Scope

First working QUBOT version should prioritize:

1. QUBOT identity
2. Mascot state system
3. Event-driven backend
4. Basic contextual messages
5. Assessment reactions
6. Lesson completion reactions
7. Progress/achievement reactions
8. Pomodoro integration
9. Break recommendation
10. First-break skip tracking
11. Second-iteration required break
12. Distraction reminder
13. Cooldown system
14. Frontend REST/WebSocket contract
15. Fallback behavior

Do not overbuild AI personality before the state/event architecture is stable.

---

# 54. V2 Possibilities

Later:

- AI-generated contextual messages
- Deeper personalization
- Multilingual dialogue
- Voice interaction
- More mascot expressions
- Advanced focus analytics
- A/B testing
- Richer learning-context awareness
- More accessibility modes

---

# 55. QUBOT Product Rules

### Rule 1
**QUBOT is a companion, not a controller.**

### Rule 2
**QUBOT supports learning; it does not replace the learning engine.**

### Rule 3
**QUBOT should speak when it adds value.**

### Rule 4
**QUBOT never shames the learner.**

### Rule 5
**QUBOT adapts its tone to the learner.**

### Rule 6
**The backend is authoritative for business-critical decisions.**

### Rule 7
**Focus management promotes sustainable learning, not endless screen time.**

### Rule 8
**The first skipped Pomodoro break can be tolerated; after another consecutive focus cycle, a break becomes required according to the focus policy.**

### Rule 9
**QUBOT gracefully degrades if its AI/message-generation layer is unavailable.**

### Rule 10
**QUBOT adds personality without making the platform childish or cluttered.**

---

# 56. Canonical QUBOT Definition

> **QUBOT is the intelligent, friendly learning companion of the SIH adaptive learning platform. It sits between backend learning intelligence and the learner-facing interface, translating learning progress, assessment outcomes, recommendations, achievements, and focus events into concise, contextual, supportive interactions. QUBOT adapts its tone to different learner groups, encourages rather than judges, helps learners recover from distraction, and acts as the conversational layer around the platform's Pomodoro/focus system. It does not own authoritative learning, scoring, recommendation, or focus-policy decisions; those remain with the appropriate backend engines.**

---

# END OF QUBOT BACKEND SPECIFICATION
