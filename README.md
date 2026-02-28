# Jess — JS or Guess?

A React SPA to test your JavaScript knowledge across seniority levels. Pick a difficulty, answer 10 multiple-choice questions, and get instant feedback with detailed explanations. Sign in with Google to sync your progress across devices.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **3 Seniority Levels** — Junior, Mid-Level, and Senior
- **10 Questions Per Quiz** — randomly selected from the question pool
- **6 JavaScript Topics** — Core JS, Functions & Closures, Async, DOM & Browser APIs, ES6+, OOP & Prototypes
- **Instant Feedback** — correct/incorrect highlighting after each answer
- **Detailed Explanations** — learn why each answer is right or wrong
- **Code Viewer** — syntax-highlighted code snippets in questions
- **Score Summary** — final score with percentage and motivational message
- **Answer Review** — review all your answers with explanations at the end
- **Coach Mode** — spaced repetition system that tracks missed questions and resurfaces them at optimal intervals (1 → 2 → 4 → 7 days)
- **Google Sign-In** — authenticate with your Google account in one click
- **Cloud Sync** — Coach Mode progress is automatically synced to Firestore when signed in
- **Offline-First** — works fully offline with localStorage; cloud sync is optional
- **Smart Nudges** — contextual sign-in prompts via mascot (Jess) on the home page, level select, and results page
- **Dark/Light Theme** — toggle with preference persisted in localStorage
- **Keyboard Navigation** — navigate quizzes with keyboard shortcuts

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 + CSS Modules |
| UI Components | shadcn/ui (Button, Card, RadioGroup, Progress, Badge, Alert, Avatar, DropdownMenu) |
| Auth | Firebase Authentication (Google sign-in) |
| Database | Cloud Firestore (coach progress sync) |
| Routing | React Router 7 (HashRouter for GitHub Pages) |
| Package Manager | pnpm |
| Deployment | GitHub Pages via GitHub Actions |

## Project Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── CodeViewer/             # Syntax-highlighted code display
│   ├── Layout/                 # Header + content wrapper + auth controls
│   ├── Mascot/                 # Jess mascot (bubble, loading, empty states)
│   └── QuestionCard/           # Question display with answer options
├── context/
│   ├── AuthContext.tsx          # Firebase Auth provider (Google sign-in)
│   ├── QuizContext.tsx          # React context for shared quiz state
│   └── ThemeContext.tsx         # Dark/light theme toggle
├── data/
│   └── questions.ts            # 30 questions (10 per level × 3 levels)
├── hooks/
│   ├── useCoachStore.ts        # Coach Mode SRS logic + cloud sync
│   ├── useKeyboardNav.ts       # Keyboard navigation for quizzes
│   ├── useQuiz.ts              # Quiz state management hook
│   └── useTheme.ts             # Theme toggle hook
├── lib/
│   ├── coachSync.ts            # Firestore read/write for coach progress
│   ├── firebase.ts             # Firebase app initialization
│   └── utils.ts                # shadcn cn() helper
├── pages/
│   ├── HomePage.tsx             # Landing page with sign-in nudge
│   ├── LevelSelectPage.tsx      # Level picker + Coach Mode card
│   ├── QuizPage.tsx             # Question flow with progress bar
│   ├── ResultsPage.tsx          # Score summary + answer review + sign-in CTA
│   └── NotFoundPage.tsx         # 404 page
├── types/
│   └── quiz.ts                  # TypeScript types & constants
├── App.tsx                      # Route definitions
├── main.tsx                     # Entry point with providers
└── index.css                    # Tailwind + CSS variables + theme tokens
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/AlexandroMunera/quiz-app.git
cd quiz-app

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase config values in .env

# Start the development server
pnpm dev
```

The app will be available at **http://localhost:5173/quiz-app/**.

### Environment Variables

Create a `.env` file based on `.env.example` with your Firebase project credentials:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
```

> The app works without Firebase credentials — auth and cloud sync features simply won't be available.

### Build for Production

```bash
pnpm build
pnpm preview
```

## How It Works

1. **Home** — Meet Jess, your quiz mascot. Click "Start Quiz" to begin
2. **Select Level** — Choose Junior, Mid-Level, or Senior. Coach Mode appears once you've missed questions
3. **Quiz** — Answer 10 questions one at a time. After selecting an answer, you'll see whether it's correct and a detailed explanation
4. **Results** — View your score, a motivational message, and a full review of every question with explanations
5. **Coach Mode** — Missed questions are tracked with spaced repetition. Come back to practice them at optimal intervals
6. **Cloud Sync** — Sign in with Google to sync Coach Mode progress across devices automatically

## Adding Questions

Questions are defined in `src/data/questions.ts`. Each question follows this structure:

```ts
{
  id: "unique-id",
  text: "What does `typeof null` return?",
  topic: "core-js",           // core-js | functions-closures | async | dom | es6+ | oop-prototypes
  level: "junior",            // junior | mid | senior
  options: [
    { id: "opt-a", text: '"null"' },
    { id: "opt-b", text: '"object"' },
    { id: "opt-c", text: '"undefined"' },
    { id: "opt-d", text: '"boolean"' },
  ],
  correctOptionId: "opt-b",
  explanation: "typeof null returns 'object' due to a legacy bug in JavaScript.",
}
```

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |

## License

MIT

