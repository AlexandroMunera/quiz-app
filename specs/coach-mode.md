# Quiz Enhancements Spec

Date: 2026-02-28
Last updated: 2026-02-28

## Overview

Add four UX/behavior enhancements to Jess (JS or Guess?) while keeping it a static SPA (no backend) and preserving the current route flow.

## Goals

- Always shuffle quiz questions.
- Always shuffle answer options (stable within a run).
- Add **Coach Mode**: a persisted "missed questions" practice flow using a simple spaced repetition system (SRS).
- Show celebration confetti on **perfect score** (100%), respecting `prefers-reduced-motion`.
- Make the app **keyboard-first**: Arrow keys + number keys + Enter across **all interactive screens**.

## Non-goals

- No new backend services.
- No new routes/pages beyond the existing flow unless unavoidable.
- No "explanations editor" or content authoring UI.

## Implementation Order

1. **Always Shuffle Answers** — small, foundational change in `useQuiz`.
2. **Keyboard Navigation** — standalone, no data model changes.
3. **Perfect-Score Confetti** — standalone, small.
4. **Coach Mode** — largest feature, new data model + localStorage + SRS logic.

## Existing Architecture Notes (reference)

- Question selection currently happens in `startQuiz(level)` and already shuffles the filtered pool via Fisher-Yates: see `src/hooks/useQuiz.ts` (lines 7-13, 32).
- Options are currently rendered in source order: see `src/components/QuestionCard/QuestionCard.tsx` (line 90). A/B/C/D labels use `String.fromCharCode(65 + index)` (line 115). Correctness checks use `option.id`, not index.
- Perfect score is detected by `percentage === 100`: see `src/pages/ResultsPage.tsx` (line 38) and `src/components/Mascot/mascot.config.ts` (line 85, `getScoreReaction`).
- `QuizContext` type is `ReturnType<typeof useQuiz>` — any new functions added to the hook are automatically available in context.
- Only existing `localStorage` key: `js-quiz-theme` (dark/light toggle). No conflicts.

---

## 1) Always Shuffle Questions (already done)

### Status

Already implemented. Fisher-Yates shuffle in `src/hooks/useQuiz.ts` (lines 7-13). No code path bypasses it.

### Behavior

- Each time a user starts a quiz, the question order is randomized.
- Quiz length stays at 10.

### Acceptance Criteria

- Starting the same level twice in a row produces a different question order (unless randomness coincidentally matches).

---

## 2) Always Shuffle Answers (Options)

### Behavior

- For each question in a quiz session, shuffle the display order of its `options`.
- The shuffled option order must be **stable for that question within the session** (do not reshuffle on re-render).
- Correctness must remain based on the option **id**, not the display index.

### UX Notes

- A/B/C/D labels should reflect the **shuffled** order.

### Acceptance Criteria

- Reloading/advancing within the same run does not change the option order for the current question.
- Selecting an option still scores correctly.

### Implementation Notes

- Shuffle options once inside `startQuiz()` (and `startCoachMode()`) — after selecting and shuffling questions, map over them and shuffle each question's `options` array using the existing `shuffleArray` helper. Store the shuffled-options version in state.
- No changes needed in `QuestionCard.tsx` — it already renders `question.options.map(...)` and checks correctness by `option.id`.
- Do **not** shuffle inside render loops.

---

## 3) Coach Mode (Missed Questions + SRS)

### Entry Point

- Add a "Coach Mode" card/CTA on the Level Select screen (`/select-level`), below the level cards grid.
- Coach Mode reuses the existing quiz screen (`/quiz`) but starts with a different question set and state `mode: "coach"`.

### CTA Behavior

- **Disabled** (greyed out) when the user has 0 missed questions total (brand new user or all items graduated).
- When disabled, show a Jess mascot message: *"No questions to review — keep quizzing!"*.
- When enabled, show a **badge with the count of due/available items** (e.g., "5 to review").
- Clicking the enabled CTA: call `selectCoachQuestions(allQuestions)` then `startCoachMode(result)` then `navigate("/quiz")`.

### What Coach Mode Uses

- Coach Mode pulls from **missed questions across all past runs and all levels** (persisted in `localStorage`).
- Coach session length: **10 questions**.

### Type Changes

Add to `src/types/quiz.ts`:

```ts
type QuizMode = "standard" | "coach";
```

Modify `QuizState`:

```ts
type QuizState = {
  mode: QuizMode;           // NEW — default "standard"
  level: Level | null;      // CHANGED — null in coach mode (questions from all levels)
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  hasAnsweredCurrent: boolean;
};
```

### Data Model (Local Storage)

- Storage key: `js-quiz-coach-v1`.

```ts
type CoachItem = {
  seenCount: number;
  wrongCount: number;
  correctStreak: number;
  lastAnsweredAt: number;   // epoch ms
  dueAt: number;            // epoch ms
  intervalDays: number;     // current interval in days
};

type CoachStoreV1 = {
  version: 1;
  items: Record<string, CoachItem>; // keyed by questionId
};
```

### Coach Store Hook (new file: `src/hooks/useCoachStore.ts`)

Manages `localStorage` key `js-quiz-coach-v1` with the `CoachStoreV1` schema.

Exports:

- `getCoachStore(): CoachStoreV1` — read from localStorage (with fallback to empty store).
- `updateItem(questionId: string, isCorrect: boolean, isCoachMode: boolean): void` — upsert item and apply SRS rules.
- `getDueItems(): CoachItem[]` — items where `dueAt <= now`.
- `getCoachQueueCount(): number` — count of items available for a coach session (due + fallback).
- `selectCoachQuestions(allQuestions: Question[]): Question[]` — selects up to 10 questions (due first, then fallback).

### SRS Scheduling Rules (Simple + Transparent)

- When a user answers **incorrectly** (in **any** mode):
  - `wrongCount++`, `correctStreak = 0`
  - `intervalDays = 1`
  - `dueAt = now + 1 day`
- When a user answers **correctly** in **Coach Mode only**:
  - `correctStreak++`
  - Increase `intervalDays` using a small ladder:
    - streak 1 -> 2 days
    - streak 2 -> 4 days
    - streak 3+ -> 7 days
  - `dueAt = now + intervalDays days`
- Correct answers in standard mode do **not** update the coach store.

### Selecting Coach Questions

- Eligible items: `dueAt <= now`.
- If fewer than 10 are due:
  - Fill remaining slots with the most recently missed items (highest `wrongCount`, then newest `lastAnsweredAt`).
- Coach questions should still be shuffled before presenting.
- Answer options are still shuffled (same rule as standard quiz).

### Updating the Store

- On quiz completion (any mode), compute per-question correctness from answers.
- For each incorrect answer: upsert/update the item in the coach store.
- For Coach Mode correct answers: update SRS intervals as above.

### Quiz Hook Changes (`src/hooks/useQuiz.ts`)

- Add `startCoachMode(questions: Question[])` alongside `startQuiz(level)`. Sets `mode: "coach"`, `level: null`, shuffles questions and their options.
- On quiz completion, iterate answers and call `updateItem()` for each incorrect answer (all modes) and each correct answer (coach mode only).
- New function automatically surfaces in `QuizContext` via `ReturnType<typeof useQuiz>`.

### Quiz Page Indicator

- When `state.mode === "coach"`, show a subtle "Coach Mode" badge/label in the quiz UI so the user knows they're in practice mode.

### Results Page (Coach Mode Feedback)

- When `state.mode === "coach"`, render **summary badges at the top of results** using the shadcn `Badge` component:
  - **Mastered** (green): items with `correctStreak >= 3`
  - **Improving** (yellow): items with `correctStreak >= 1` (but < 3)
  - **Needs practice** (red): items with `correctStreak === 0`
- Format: *"3 mastered - 4 improving - 3 need practice"*

### Edge Cases

- Direct navigation to `/quiz` without starting a quiz: existing guard redirect to `/select-level` handles this.
- Coach Mode with 0 items: CTA is disabled, so users can't enter. No empty state screen needed.

### Acceptance Criteria

- Missing a question in a standard quiz makes it appear in future Coach Mode sessions.
- Coach Mode prioritizes "due" items but can still fill to 10.
- Store survives refresh and new sessions.
- Disabled CTA with mascot message when no items exist.
- Badge shows due count when items are available.
- Results page shows SRS summary badges in coach mode.

---

## 4) Perfect-Score Confetti (Respect Reduced Motion)

### Library

**`canvas-confetti`** (~6 KB, imperative API, fire-and-forget, self-cleaning canvas).

### Trigger

- Only when `percentage === 100` on the Results screen.
- Fire via `useEffect` (runs once on mount when conditions are met).

### Reduced Motion

- Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- If active: **do not render confetti at all** (skip the `useEffect` entirely).

### Implementation Notes

- Install: `pnpm add canvas-confetti` + `pnpm add -D @types/canvas-confetti`.
- In `ResultsPage.tsx`, add a `useEffect` that checks `percentage === 100` and reduced motion preference, then fires `confetti()`.
- No new components needed — `canvas-confetti` handles its own canvas lifecycle.

### Acceptance Criteria

- 100% score shows confetti.
- With reduced motion enabled, there is no confetti animation.

---

## 5) Keyboard-First Navigation (All Screens)

### Scope

Keyboard bindings apply to **all interactive screens**, not just the quiz:

- **Quiz screen** — full arrow/number/Enter navigation.
- **Level Select screen** — arrow keys across level cards + Coach Mode CTA, Enter to select.
- **Results screen** — arrow keys across action buttons, Enter to activate.

### Quiz Screen Behavior

- `ArrowUp/ArrowDown` (and `ArrowLeft/ArrowRight`) moves a **highlight** across options (cycles 0-3).
- `1-4` sets the highlight to the corresponding option (highlight only; does not submit).
- `Enter`:
  - If the question is unanswered and an option is highlighted -> submits the highlighted option.
  - If the question is answered -> triggers Next (same as clicking "Next Question / See Results").

### Highlight Style

- **Visible outline/ring** (`2px` ring using `--neon-cyan`) on the highlighted option.
- Must be visually distinct from:
  - Unselected state (no ring).
  - Selected/radio-checked state (filled indicator).
  - Correct/incorrect post-answer states (green/red backgrounds).
- Reset `highlightedIndex` to `null` when advancing to the next question.

### Level Select Behavior

- `ArrowUp/ArrowDown` (or `ArrowLeft/ArrowRight`) moves highlight across level cards and the Coach Mode CTA.
- `Enter` selects the highlighted card (starts quiz or coach mode).

### Results Screen Behavior

- `ArrowLeft/ArrowRight` (or `ArrowUp/ArrowDown`) moves highlight across action buttons.
- `Enter` activates the highlighted button.

### Focus + Event Handling

- Keyboard handling via `useEffect` with `keydown` listener, active when the relevant component is mounted.
- Guard: early-return if `event.target` is an `<input>` or `<textarea>` (prevent interference with potential text fields).

### Implementation Notes

- Add `highlightedIndex` state (`useState<number | null>(null)`) to each screen component.
- Consider a shared `useKeyboardNav` hook or inline `useEffect` per screen (decide during implementation).

### Acceptance Criteria

- A user can complete the entire app flow (select level -> answer quiz -> view results -> retry) without using a mouse.
- Highlighting does not submit until `Enter`.
- After answering, `Enter` advances.
- Highlight ring is visible and distinct from all other option states.

---

## Design Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Confetti library | `canvas-confetti` | ~6 KB, imperative, self-cleaning canvas, most popular |
| Keyboard scope | All interactive screens | Full keyboard-first UX, not just quiz |
| Keyboard highlight style | Outline/ring (`--neon-cyan`) | Accessible, distinct from selected/correct/incorrect states |
| Coach Mode when empty | Disabled CTA + mascot message | User sees the feature exists, gets encouragement to keep quizzing |
| Coach Mode badge | Due count on CTA | Quick visibility into review queue size |
| Coach Mode results | Summary badges (mastered/improving/needs practice) | Informative without overwhelming; uses existing `Badge` component |
| Implementation order | Shuffle, Keyboard, Confetti, Coach | Validates core mechanics first; Coach Mode is largest and most independent |

## Notes

- `Math.random()` is fine for shuffles. If deterministic shuffles are needed later (sharing/debugging), introduce a seeded RNG.
- Coach Mode UI copy should stay minimal — no new screens, just CTA on level select and badges on results.
- Question shuffle (Feature 1) is already implemented and verified — no work needed.
