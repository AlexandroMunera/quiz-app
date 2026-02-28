# Project Guidelines — Jess (JS or Guess?)

React 19 SPA quiz app built with TypeScript 5.9, Vite 7, Tailwind CSS 4, and shadcn/ui. Deployed to GitHub Pages.

## Build and Test

```bash
pnpm install          # install deps (requires pnpm 10+, Node 18+)
pnpm dev              # start dev server
pnpm build            # tsc -b && vite build
pnpm lint             # eslint (flat config, ESLint 9)
pnpm preview          # preview production build
```

No test framework is configured yet. If adding tests, use Vitest (already Vite-based).

## Code Style

- **TypeScript strict mode** with `verbatimModuleSyntax` — always use `import type` for type-only imports.
- **Named exports** for all components and hooks. Only `App` uses a default export.
- **Function declarations** (`export function Foo()`) preferred over arrow functions for components.
- Path alias: `@/` → `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).
- ESLint flat config in `eslint.config.js` — extends TS-ESLint recommended + react-hooks + react-refresh.

## Architecture

### Routing (`src/App.tsx`)
`HashRouter` (GitHub Pages compatible) with routes: `/` → `/select-level` → `/quiz` → `/results`. All routes wrapped in `<Layout>`. Guard redirects via `useEffect` in page components.

### State Management
Two React Contexts provided in `src/main.tsx`:
- **QuizContext** (`src/context/QuizContext.tsx`) — wraps `useQuiz()` hook; manages quiz flow, answers, scoring. Context type derived via `ReturnType<typeof useQuiz>`.
- **ThemeContext** (`src/context/ThemeContext.tsx`) — dark/light toggle persisted in localStorage (`js-quiz-theme`).

No external state libraries. Pure `useState` + `useCallback` + `useMemo`.

### Data
Questions live in `src/data/questions.ts` — 30 total (10 per level × 3 levels), covering 6 topics. Types in `src/types/quiz.ts`.

## Project Conventions

### Component structure
```
ComponentName/
  ComponentName.tsx          # named export
  ComponentName.module.css   # co-located CSS Module
```
Pages follow the same pattern in `src/pages/`. shadcn/ui primitives live flat in `src/components/ui/`.

### Styling (hybrid approach)
- **CSS Modules** for all custom components and pages — import as `styles`.
- **Tailwind + shadcn/ui** for standard interactive elements (`Button`, `RadioGroup`, `Progress`, `Badge`, `Alert`) using `cn()` from `src/lib/utils.ts`.
- **CSS variables** in `src/index.css` for theming: neon colors (`--neon-cyan`, `--neon-magenta`, etc.), glow shadows, glass-morphism tokens.
- Dark mode via `.dark` class on `<html>`, toggled by ThemeContext.
- Fonts: `JetBrains Mono` (display/code) and `Outfit` (body) loaded from Google Fonts in `index.html`.

### Mascot system (`src/components/Mascot/`)
Config centralized in `mascot.config.ts` (`MASCOT` object with `as const`). Three UI variants: `MascotBubble`, `MascotLoading`, `MascotEmpty`. Change `MASCOT.name`/`MASCOT.emoji` to rebrand globally. SVG assets in `src/assets/mascot-options/` are available but currently unused.

### shadcn/ui (`components.json`)
Style: `new-york`, base color: `neutral`, icons: `lucide`. Add new components via `pnpm dlx shadcn@latest add <component>`.

## Security

- No backend — static SPA with no auth, API keys, or sensitive data.
- Vite base path set to `/quiz-app/` for GitHub Pages; update if deployment target changes.
