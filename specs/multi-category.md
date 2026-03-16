# Multi-Category Quiz Support

## Summary

Extend the quiz from JavaScript-only to multiple categories. First implementation slice adds a category selector and end-to-end support for JavaScript and DevOps.

## Problem

The app currently only supports JavaScript questions. Users cannot choose another programming topic.

## Goals

- Add category selection before level selection on the same page
- Support category-aware quiz sessions
- Preserve current JS behavior
- Add initial DevOps category and questions

## Non-goals (Phase 1)

- Full 6-category content rollout
- Per-category Coach Mode filtering
- URL-based category routing

## Implementation Plan

### 1. Type and State Model

- Add `Category` type in `src/types/quiz.ts`
- Add `category` to `Question`
- Add `category` to `QuizState`
- Add `CATEGORY_LABELS`, `CATEGORY_DESCRIPTIONS`, `CATEGORY_ICONS`
- Extend `Topic` and `TOPIC_LABELS` with DevOps topics

### 2. Questions Data

- Keep existing JS questions and set `category: "javascript"`
- Add DevOps question set (30 questions, 10 per level)
- Export single combined questions array

### 3. Quiz Flow Logic

- Change `startQuiz(level)` to `startQuiz(level, category)`
- Filter questions by `level` and `category`
- Persist selected category in quiz state
- Keep coach mode behavior unchanged for now

### 4. UI

- Update level select page with category cards above levels
- Disable level cards until a category is selected
- Update quiz header to show category badge
- Update results header to show category + level context
- Update home subtitle/features to mention multi-topic quizzes

### 5. Validation

- `pnpm build`
- `pnpm lint`
- Manual flow:
  - JavaScript -> Junior -> Quiz -> Results
  - DevOps -> Mid -> Quiz -> Results

### 6. CI Job Spec (PR Checks)

- Add a lightweight PR check step that runs:
  - `pnpm install --frozen-lockfile`
  - `pnpm validate:questions`
- This check should fail the PR if:
  - duplicate question IDs are detected
  - duplicate option IDs are detected
  - any question has invalid `correctOptionId`
  - any category-level bucket is not exactly 10 questions
- Keep this check independent from lint to provide fast, content-specific feedback for quiz data changes.

## Data Model Decisions

- Start with categories:
  - `javascript`
  - `devops`
- Keep three levels for each category:
  - `junior`, `mid`, `senior`
- Use explicit category field on each question

## Files In Scope

- `src/types/quiz.ts`
- `src/data/questions.ts`
- `src/hooks/useQuiz.ts`
- `src/context/QuizContext.tsx`
- `src/pages/LevelSelectPage.tsx`
- `src/pages/LevelSelectPage.module.css`
- `src/pages/QuizPage.tsx`
- `src/pages/ResultsPage.tsx`
- `src/pages/HomePage.tsx`

## Acceptance Criteria

- User can select JavaScript or DevOps on Level Select page
- User can only start a level after selecting category
- Quiz serves 10 random questions from selected category and level
- Quiz and results pages clearly display selected category
- Existing JS behavior remains intact
