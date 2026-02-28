# JS Quiz App

A React SPA to test your JavaScript knowledge across seniority levels. Pick a difficulty, answer 10 multiple-choice questions, and get instant feedback with detailed explanations.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **3 Seniority Levels** — Junior, Mid-Level, and Senior
- **10 Questions Per Quiz** — randomly selected from the question pool
- **6 JavaScript Topics** — Core JS, Functions & Closures, Async, DOM & Browser APIs, ES6+, OOP & Prototypes
- **Instant Feedback** — correct/incorrect highlighting after each answer
- **Detailed Explanations** — learn why each answer is right or wrong
- **Score Summary** — final score with percentage and motivational message
- **Answer Review** — review all your answers with explanations at the end
- **Linear Flow** — one question at a time, focused and distraction-free

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 + CSS Modules |
| UI Components | shadcn/ui (Button, Card, RadioGroup, Progress, Badge, Alert) |
| Routing | React Router 7 |
| Package Manager | pnpm |

## Project Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Layout/                 # Header + content wrapper
│   └── QuestionCard/           # Question display with answer options
├── context/
│   └── QuizContext.tsx          # React context for shared quiz state
├── data/
│   └── questions.ts            # 30 mock questions (10 per level)
├── hooks/
│   └── useQuiz.ts              # Quiz state management hook
├── pages/
│   ├── HomePage.tsx             # Landing page
│   ├── LevelSelectPage.tsx      # Level picker (Junior/Mid/Senior)
│   ├── QuizPage.tsx             # Question flow with progress bar
│   └── ResultsPage.tsx          # Score summary + answer review
├── types/
│   └── quiz.ts                  # TypeScript types & constants
├── lib/
│   └── utils.ts                 # shadcn cn() helper
├── App.tsx                      # Route definitions
├── main.tsx                     # Entry point with providers
└── index.css                    # Tailwind + CSS variables
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

# Start the development server
pnpm dev
```

The app will be available at **http://localhost:5173/**.

### Build for Production

```bash
pnpm build
pnpm preview
```

## How It Works

1. **Home** — Click "Start Quiz" to begin
2. **Select Level** — Choose Junior, Mid-Level, or Senior
3. **Quiz** — Answer 10 questions one at a time. After selecting an answer, you'll see whether it's correct and a detailed explanation
4. **Results** — View your score, a motivational message, and a full review of every question with explanations

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

