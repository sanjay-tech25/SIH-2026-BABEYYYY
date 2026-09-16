## 1. Frontend Vision

The experience must balance:
- Professional product design
- Minimal visual clutter
- Strong information hierarchy
- Smooth, purposeful animation
- Accessibility
- Responsive behavior across desktop, tablet and mobile
- Personalized learning without making the interface feel complicated

---

# 1. Core Frontend Principles

### 2.1 Visual-first
Use visual hierarchy, cards, progress indicators, diagrams, illustrations and concise copy instead of dense blocks of text.

### 2.2 Minimal but expressive

### 2.3 Professional tone
The interface should be suitable for:
- Students
- College learners
- Working professionals
- Young learners
- Adult / millennial learners
- Teachers and institutions

### 2.4 Seamless animation
Animations should communicate:
- State changes
- Progress
- Feedback
- Navigation
- Learning completion

Avoid animation that exists only for decoration.

### 2.5 Responsive by default
Every component should be designed for:
- Desktop
- Laptop
- Tablet
- Mobile

### 2.6 Accessibility
Support:
- Keyboard navigation
- Screen readers
- Adequate contrast
- Reduced-motion preferences
- Clear focus states
- Meaningful labels
- Accessible error messages

---

# 2. Application Shell

The application shell is shared across authenticated pages.

## Desktop

### Sidebar
Contains:
- Dashboard
- Learn
- Roadmap / Learning Path
- Practice
- Progress
- Achievements
- Settings

### Top Bar
Contains:
- Page title / breadcrumb
- Search
- Notifications
- Profile
- Optional contextual action

### Main Content
Uses a responsive max-width container with flexible columns.

- Floating companion
- Inline learning assistant
- Empty-state guide
- Progress celebration
- Focus reminder

## Mobile

Use:
- Compact top bar
- Bottom navigation or collapsible navigation
- Stacked cards
- Full-width content
- Bottom sheets for secondary actions

---

# 3. Required Pages

## 4.1 Landing / Marketing Page

Purpose:
Introduce the platform and communicate why adaptive learning is different.

Sections:
1. Hero
3. How adaptive learning works
4. Personalized learning flow
5. Learning-path preview
7. Progress visualization
8. Audience / age adaptability
9. Benefits
10. CTA
11. Footer

Primary CTA:
**Start Learning**

Secondary CTA:
**Explore How It Works**

---

# 4. Authentication

## 5.1 Sign Up

Fields:
- Name
- Email
- Password
- Optional age / learner category
- Terms acceptance

Optional:
- Google / supported OAuth provider

## 5.2 Login

Fields:
- Email
- Password
- Remember me
- Forgot password

## 5.3 Forgot / Reset Password

Provide:
- Email input
- Verification state
- New password state
- Success state

---

# 5. Onboarding

Onboarding should personalize the platform without feeling like a long form.

## Step 1 — About You
Collect only useful information.

## Step 2 — Learning Goal
Examples:
- Academic learning
- Skill development
- Career preparation
- Curiosity / exploration
- Exam preparation

## Step 3 — Experience Level
- Beginner
- Intermediate
- Advanced

## Step 4 — Learning Preferences
Examples:
- Visual
- Reading
- Practice-first
- Explanation-first
- Mixed

## Step 5 — Time Availability
Allow users to select realistic daily learning time.

## Completion
Show:
- Personalized learning path
- First recommended lesson

---

# 6. Dashboard

The dashboard is the user's primary home.

## Header
Show:
- Greeting
- Current learning goal

## Primary Learning Card
Display:
- Current course/topic
- Current lesson
- Progress
- Estimated completion
- Continue button

## Today's Plan
Show:
- Recommended learning activities
- Estimated duration
- Priority
- Completion status

## Progress Overview
Include:
- Daily progress
- Weekly progress
- Learning streak
- Completed lessons
- Practice performance

Show:
- Start Focus button

- Greeting
- Encouraging
- Thinking
- Celebrating
- Resting
- Concerned about excessive continuous learning

---

# 7. Learning / Course Page

## Course Header
Include:
- Course title
- Description
- Difficulty
- Overall progress
- Estimated time

## Curriculum
Organize:
- Modules
- Chapters
- Lessons
- Practice sections
- Assessments

Use collapsible curriculum groups.

## Lesson Cards
Each card may show:
- Lesson title
- Duration
- Completion state
- Difficulty
- Locked/unlocked state

---

# 8. Lesson Experience

This is one of the most important screens.

## Layout

Desktop:
- Main learning content
- Secondary progress / navigation panel

Mobile:
- Single-column content
- Sticky lesson navigation

## Lesson Components

Support:
- Text
- Images
- Diagrams
- Videos
- Interactive examples
- Code blocks where applicable
- Knowledge checks
- Practice questions
- Mini quizzes

- Explain difficult content
- Give hints
- Ask reflective questions
- Encourage the learner
- Detect repeated mistakes
- Recommend revision
- Celebrate completion

---

# 9. Adaptive Learning Layer

The UI should visually communicate personalization without exposing complex AI logic.

Possible states:

### Recommended

### Review
"You may want to revisit this concept."

### Challenge
"Ready for a harder problem?"

### Mastered
"You've demonstrated strong understanding."

### Needs Practice
"Let's strengthen this concept."

Use badges, progress indicators and subtle contextual messaging.

---

# 10. Practice Module

Purpose:
Turn learning into active recall and application.

Supported activities:
- MCQs
- True / False
- Fill in the blank
- Matching
- Scenario-based questions
- Short answers
- Problem solving

## Question Screen
Display:
- Question
- Progress
- Answer options
- Submit
- Hint

## Feedback

After submission:
- Correct / incorrect state
- Explanation
- Why the answer is correct
- Next question

Avoid overwhelming the learner with too much information.

---

# 11. Assessment / Quiz Results

Show:
- Score
- Accuracy
- Time
- Concepts mastered
- Weak concepts
- Recommended next actions

Possible actions:
- Retry
- Review mistakes
- Continue course
- Practice weak concepts

---

# 12. Learning Roadmap

Visualize the learner's journey.

Components:
- Current goal
- Milestones
- Topics
- Dependencies
- Completed concepts
- Current concept
- Upcoming concepts

Use a visual path instead of a conventional table whenever possible.

---

# 13. Progress Page

## Metrics

Display:
- Overall learning progress
- Weekly activity
- Daily activity
- Streak
- Lessons completed
- Practice accuracy
- Time spent
- Topics mastered

## Visualizations

Recommended:
- Progress rings
- Line charts
- Bar charts
- Heatmaps
- Milestone timelines

Do not overload the screen with charts.

---

# 14. Achievements

Gamification should remain mature and professional.

Examples:
- First Lesson
- 7-Day Streak
- Concept Master
- Practice Pro
- Deep Focus
- Consistent Learner

Achievement presentation:
- Icon
- Name
- Description
- Unlock condition
- Unlock animation

---

# 15. Navigation

Primary navigation:

- Dashboard
- Learn
- Roadmap
- Practice
- Focus
- Progress
- Achievements
- Settings

Use active-state indicators.

Navigation should never rely only on color.

---

# 16. Search

Search should support:
- Courses
- Topics
- Lessons
- Concepts
- Practice

Search UI:
- Input
- Suggestions
- Recent searches
- Result categories
- Empty state

---

# 17. Notifications

Notification categories:
- Learning reminders
- Recommended lessons
- Achievement unlocks
- Streak information
- System notifications

Allow users to control notification preferences.

---

# 18. Profile

Show:
- Profile information
- Learning goals
- Current level
- Progress summary
- Streak
- Achievements

Actions:
- Edit profile
- Change learning preferences
- Manage notifications
- Settings

---

# 19. Settings

Sections:

### Account
- Name
- Email
- Password

### Learning
- Goals
- Difficulty
- Learning preferences

### Appearance
- Light / dark / system
- UI preferences

### Notifications
- Learning reminders
- Achievement notifications

### Accessibility
- Reduced motion
- Text sizing where supported
- Contrast preferences

### Privacy
- Data controls
- Account management

---

# 20. Empty States

Every empty state should be intentional.

Examples:
- No courses
- No achievements
- No practice history
- No notifications
- No search results

Use:
- Short explanation
- One clear CTA

---

# 21. Loading States

Use skeleton loading for:
- Dashboard cards
- Course lists
- Progress charts
- Lesson content

---

# 22. Error States

Errors should be:
- Clear
- Human-readable
- Actionable

Example structure:
- What happened
- What the user can do
- Retry button

---

# 23. Responsive Design

## Desktop
Multi-column layouts are allowed.

## Tablet
Reduce side navigation and card density.

## Mobile
Use:
- Single-column layout
- Bottom navigation
- Sticky actions
- Full-screen lesson experience
- Bottom sheets

Touch targets should be sufficiently large.

---

# 24. Design System

## Typography

Use a modern sans-serif system with:
- Strong display hierarchy
- Clear body typography
- Compact labels
- Accessible line height

Suggested hierarchy:
- Display
- H1
- H2
- H3
- Body Large
- Body
- Body Small
- Caption

## Spacing

Use a consistent spacing scale.

Recommended base:
`4px`

Common values:
- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64

## Radius

Use moderate rounded corners.

Recommended:
- Inputs: 10–12px
- Cards: 14–18px
- Large panels: 20–24px
- Pills: fully rounded

---

# 25. Color System

The visual identity should be based on:
- Primary brand color
- Secondary accent
- Neutral background
- Surface
- Text
- Muted text
- Border
- Success
- Warning
- Error
- Information

Do not use excessive gradients or saturated colors.

---

# 26. Components

Core reusable components:

### Layout
- AppShell
- Sidebar
- TopBar
- BottomNavigation
- PageContainer

### Navigation
- NavItem
- Breadcrumb
- Tabs
- Stepper

### Content
- Card
- CourseCard
- LessonCard
- ProgressCard
- AchievementCard
- RecommendationCard

### Learning
- LessonRenderer
- Quiz
- Question
- AnswerOption
- FeedbackPanel
- ConceptCard

### Progress
- ProgressRing
- ProgressBar
- ActivityChart
- StreakCard
- Milestone

### Focus
- SessionControls
- BreakPrompt
- FocusSummary

### System
- Modal
- Drawer
- BottomSheet
- Toast
- Tooltip
- Skeleton
- EmptyState
- ErrorState

---

# 27. Frontend State Architecture

Separate state into:

## Server State
Examples:
- User data
- Courses
- Lessons
- Progress
- Assessments
- Achievements

Use an appropriate server-state/data-fetching layer.

## Client State
Examples:
- Sidebar state
- Modal state
- Timer state
- Temporary UI preferences

## Persistent Local State
Examples:
- Theme preference
- Dismissed contextual prompts
- Accessibility preferences

Avoid duplicating server state unnecessarily.

---

# 28. API Integration

The frontend should communicate with the backend through a typed API layer.

Recommended structure:

`UI → Hooks / Services → API Client → Backend`

Do not put API calls directly inside presentation components.

Handle:
- Loading
- Success
- Empty
- Error
- Retry
- Unauthorized
- Validation errors

---

# 29. Detailed Frontend File Structure

```text
frontend/
│
├── public/
│   ├── favicon/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.*
│   │   ├── main.*
│   │   ├── routes/
│   │   │   ├── index.*
│   │   │   ├── publicRoutes.*
│   │   │   └── protectedRoutes.*
│   │   ├── layouts/
│   │   │   ├── PublicLayout.*
│   │   │   ├── AuthLayout.*
│   │   │   └── AppLayout.*
│   │   └── providers/
│   │       ├── AuthProvider.*
│   │       ├── ThemeProvider.*
│   │       ├── QueryProvider.*
│   │       └── AccessibilityProvider.*
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── illustrations/
│   │   ├── icons/
│   │   └── qbot/
│   │       ├── base/
│   │       ├── full-body/
│   │       ├── expressions/
│   │       ├── poses/
│   │       └── animations/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.*
│   │   │   ├── Input.*
│   │   │   ├── Select.*
│   │   │   ├── Checkbox.*
│   │   │   ├── Radio.*
│   │   │   ├── Card.*
│   │   │   ├── Badge.*
│   │   │   ├── Avatar.*
│   │   │   ├── Modal.*
│   │   │   ├── Drawer.*
│   │   │   ├── BottomSheet.*
│   │   │   ├── Tooltip.*
│   │   │   ├── Toast.*
│   │   │   ├── Progress.*
│   │   │   ├── Skeleton.*
│   │   │   └── Tabs.*
│   │   │
│   │   ├── navigation/
│   │   │   ├── Sidebar.*
│   │   │   ├── TopBar.*
│   │   │   ├── BottomNavigation.*
│   │   │   ├── NavItem.*
│   │   │   └── Breadcrumb.*
│   │   │
│   │   ├── learning/
│   │   │   ├── CourseCard.*
│   │   │   ├── LessonCard.*
│   │   │   ├── ModuleCard.*
│   │   │   ├── RecommendationCard.*
│   │   │   ├── ConceptCard.*
│   │   │   └── LearningProgress.*
│   │   │
│   │   ├── practice/
│   │   │   ├── Question.*
│   │   │   ├── AnswerOption.*
│   │   │   ├── QuizProgress.*
│   │   │   ├── Hint.*
│   │   │   └── FeedbackPanel.*
│   │   │
│   │   ├── progress/
│   │   │   ├── ProgressRing.*
│   │   │   ├── ProgressBar.*
│   │   │   ├── ActivityChart.*
│   │   │   ├── StreakCard.*
│   │   │   └── Milestone.*
│   │   │
│   │
│   ├── features/
│   │   │
│   │   ├── landing/
│   │   │   ├── pages/
│   │   │   │   └── LandingPage.*
│   │   │   ├── components/
│   │   │   │   ├── Hero.*
│   │   │   │   ├── AdaptiveLearning.*
│   │   │   │   ├── Benefits.*
│   │   │   │   └── CTA.*
│   │   │   └── data.*
│   │   │
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.*
│   │   │   │   ├── SignupPage.*
│   │   │   │   ├── ForgotPasswordPage.*
│   │   │   │   └── ResetPasswordPage.*
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── schemas/
│   │   │
│   │   ├── onboarding/
│   │   │   ├── pages/
│   │   │   │   └── OnboardingPage.*
│   │   │   ├── components/
│   │   │   │   ├── OnboardingStepper.*
│   │   │   │   ├── GoalSelection.*
│   │   │   │   ├── ExperienceSelection.*
│   │   │   │   ├── LearningPreference.*
│   │   │   │   ├── TimeAvailability.*
│   │   │   └── state.*
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.*
│   │   │   ├── components/
│   │   │   │   ├── WelcomeHeader.*
│   │   │   │   ├── ContinueLearning.*
│   │   │   │   ├── TodaysPlan.*
│   │   │   │   ├── ProgressOverview.*
│   │   │   │   ├── FocusCard.*
│   │   │   └── hooks.*
│   │   │
│   │   ├── courses/
│   │   │   ├── pages/
│   │   │   │   ├── CoursesPage.*
│   │   │   │   └── CourseDetailsPage.*
│   │   │   ├── components/
│   │   │   │   ├── CourseHeader.*
│   │   │   │   ├── Curriculum.*
│   │   │   │   ├── Module.*
│   │   │   │   └── LessonList.*
│   │   │   └── hooks.*
│   │   │
│   │   ├── lessons/
│   │   │   ├── pages/
│   │   │   │   └── LessonPage.*
│   │   │   ├── components/
│   │   │   │   ├── LessonRenderer.*
│   │   │   ├── LessonHeader.*
│   │   │   ├── LessonNavigation.*
│   │   │   ├── KnowledgeCheck.*
│   │   │   └── LessonCompletion.*
│   │   │   ├── hooks.*
│   │   │   └── services.*
│   │   │
│   │   ├── practice/
│   │   │   ├── pages/
│   │   │   │   ├── PracticePage.*
│   │   │   │   ├── PracticeSessionPage.*
│   │   │   │   └── PracticeResultsPage.*
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services.*
│   │   │
│   │   ├── roadmap/
│   │   │   ├── pages/
│   │   │   │   └── RoadmapPage.*
│   │   │   ├── components/
│   │   │   │   ├── LearningPath.*
│   │   │   │   ├── RoadmapNode.*
│   │   │   │   └── Milestone.*
│   │   │   └── hooks.*
│   │   │
│   │   ├── progress/
│   │   │   ├── pages/
│   │   │   │   └── ProgressPage.*
│   │   │   ├── components/
│   │   │   │   ├── Overview.*
│   │   │   │   ├── Activity.*
│   │   │   │   ├── Accuracy.*
│   │   │   │   └── Mastery.*
│   │   │   └── hooks.*
│   │   │
│   │   ├── achievements/
│   │   │   ├── pages/
│   │   │   │   └── AchievementsPage.*
│   │   │   ├── components/
│   │   │   │   ├── AchievementGrid.*
│   │   │   │   └── AchievementUnlock.*
│   │   │   └── hooks.*
│   │   │
│   │   │
│   │   ├── profile/
│   │   │   ├── pages/
│   │   │   │   └── ProfilePage.*
│   │   │   ├── components/
│   │   │   └── hooks.*
│   │   │
│   │   └── settings/
│   │       ├── pages/
│   │       │   └── SettingsPage.*
│   │       ├── components/
│   │       │   ├── AccountSettings.*
│   │       │   ├── LearningSettings.*
│   │       │   ├── AppearanceSettings.*
│   │       │   ├── NotificationSettings.*
│   │       │   ├── AccessibilitySettings.*
│   │       │   └── PrivacySettings.*
│   │       └── hooks.*
│   │
│   ├── hooks/
│   │   ├── useAuth.*
│   │   ├── useDebounce.*
│   │   ├── useMediaQuery.*
│   │   ├── useReducedMotion.*
│   │   ├── useLocalStorage.*
│   │   └── useNotifications.*
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.*
│   │   │   ├── authApi.*
│   │   │   ├── userApi.*
│   │   │   ├── courseApi.*
│   │   │   ├── lessonApi.*
│   │   │   ├── practiceApi.*
│   │   │   ├── progressApi.*
│   │   │   ├── achievementApi.*
│   │   │   └── recommendationApi.*
│   │   ├── storage/
│   │   └── analytics/
│   │
│   ├── state/
│   │   ├── auth.*
│   │   ├── ui.*
│   │   └── preferences.*
│   │
│   ├── types/
│   │   ├── user.*
│   │   ├── course.*
│   │   ├── lesson.*
│   │   ├── practice.*
│   │   ├── progress.*
│   │   ├── achievement.*
│   │
│   ├── constants/
│   │   ├── routes.*
│   │   ├── navigation.*
│   │   ├── qbot.*
│   │   └── app.*
│   │
│   ├── utils/
│   │   ├── formatting.*
│   │   ├── validation.*
│   │   ├── date.*
│   │   ├── accessibility.*
│   │   └── analytics.*
│   │
│   ├── styles/
│   │   ├── globals.*
│   │   ├── tokens.*
│   │   ├── typography.*
│   │   ├── animations.*
│   │   └── responsive.*
│   │
│   └── config/
│       ├── environment.*
│       └── featureFlags.*
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── .env.example
├── package.json
├── README.md
└── [framework configuration files]
```

## File Structure Rules

### Feature ownership
Feature-specific UI, hooks and logic should stay inside the relevant `features/` directory.

### Shared components
Only genuinely reusable components belong in `components/`.

### API isolation
API communication belongs in `services/api/`, not directly inside UI components.

### State isolation
Global state should contain only state that genuinely needs to be shared.

### Types
Keep domain models centralized so the UI and API layers use consistent contracts.

### Constants

### Tests
Prioritize testing:
- Authentication
- Onboarding
- Lesson completion
- Practice scoring
- Progress updates
- Break-skipping logic
- Protected routes

# 30. Routing Structure

Suggested routes:

```text
/
├── /login
├── /signup
├── /forgot-password
├── /onboarding
│
└── /app
    ├── /dashboard
    ├── /learn
    ├── /learn/:courseId
    ├── /lesson/:lessonId
    ├── /roadmap
    ├── /practice
    ├── /practice/:practiceId
    ├── /focus
    ├── /progress
    ├── /achievements
    ├── /profile
    └── /settings
```

---

# 31. UX Rules

### Rule 1
One primary action per major screen.

### Rule 2
Do not overwhelm users with AI-generated information.

### Rule 3

### Rule 4
Progress should always be understandable.

### Rule 5
Learning should require active interaction.

### Rule 6
Break reminders should be supportive rather than punitive.

### Rule 7
Errors should always provide recovery.

### Rule 8
Use consistent terminology across the entire platform.

---

# 32. Animation Guidelines

Use:
- Fade
- Slide
- Scale
- Small bounce
- Progress transitions
- Skeleton shimmer

Avoid:
- Excessive parallax
- Constant floating objects
- Long page transitions
- Excessive particle effects

Animation duration guidelines:
- Micro interaction: ~120–200ms
- Component transition: ~200–300ms
- Larger transition: ~300–500ms

Always provide reduced-motion behavior.

---

# 33. Performance

Prioritize:
- Lazy-loaded routes
- Image optimization
- Code splitting
- Cached API data
- Skeleton states
- Minimal unnecessary re-renders
- Efficient chart rendering
- Deferred non-critical animations

---

# 34. Security

Frontend must:
- Never expose secrets
- Never store sensitive credentials insecurely
- Validate user input
- Handle expired sessions
- Protect authenticated routes
- Avoid rendering unsafe HTML
- Respect backend authorization

Frontend validation is for UX; backend validation remains authoritative.

---

# 35. Accessibility Checklist

Every page should support:

- Keyboard navigation
- Visible focus
- Semantic HTML
- ARIA only where needed
- Alt text
- Accessible forms
- Color-independent status communication
- Reduced motion
- Sufficient contrast
- Screen-reader-friendly progress information

---

# 36. Final UX Flow

```text
Landing
   ↓
Authentication
   ↓
Onboarding
   ↓
Personalized Dashboard
   ↓
Learning Roadmap
   ↓
Lesson
   ↓
Practice
   ↓
Assessment
   ↓
Progress
   ↓
Recommendation
   ↓
Next Lesson
```

```text
                 │                     │
                 │                     │
                 └── Achievements ─────┘
```

---

# 37. Definition of Done

The frontend is considered complete when:

- All primary routes are implemented
- Authentication flow works
- Onboarding works
- Dashboard is functional
- Course and lesson experiences work
- Practice and assessment flows work
- Roadmap is visualized
- Progress is displayed
- Achievements work
- Break logic works across iterations
- Responsive layouts work
- Loading states exist
- Empty states exist
- Error states exist
- Accessibility requirements are addressed
- API integration is separated from UI components
- Performance is optimized
- The visual system remains consistent across the application

---

# 36. Product Experience Summary

The final frontend should feel like:

**A professional adaptive-learning platform that makes learning clear, personal and continuous.**

The interface should help the learner:

**Discover → Learn → Practice → Assess → Understand progress → Continue with the next best learning step.**

The core web application should remain independent from any separate companion or mascot product/module. This keeps the learning frontend focused, scalable and easy to maintain.
