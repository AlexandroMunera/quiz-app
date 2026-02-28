import type { Question } from "@/types/quiz";

const STORAGE_KEY = "js-quiz-coach-v1";
const QUESTIONS_PER_SESSION = 10;
const DAY_MS = 86_400_000;

export interface CoachItem {
  seenCount: number;
  wrongCount: number;
  correctStreak: number;
  lastAnsweredAt: number;
  dueAt: number;
  intervalDays: number;
}

export interface CoachStoreV1 {
  version: 1;
  items: Record<string, CoachItem>;
}

function emptyStore(): CoachStoreV1 {
  return { version: 1, items: {} };
}

export function getCoachStore(): CoachStoreV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as CoachStoreV1;
    if (parsed.version !== 1 || typeof parsed.items !== "object") {
      return emptyStore();
    }
    return parsed;
  } catch {
    return emptyStore();
  }
}

function saveStore(store: CoachStoreV1): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/**
 * Upsert an item in the coach store and apply SRS scheduling rules.
 *
 * - Incorrect (any mode): reset streak, set interval to 1 day.
 * - Correct (coach mode only): increase streak and interval.
 */
export function updateItem(
  questionId: string,
  isCorrect: boolean,
  isCoachMode: boolean,
): void {
  const store = getCoachStore();
  const now = Date.now();

  const existing: CoachItem = store.items[questionId] ?? {
    seenCount: 0,
    wrongCount: 0,
    correctStreak: 0,
    lastAnsweredAt: 0,
    dueAt: 0,
    intervalDays: 1,
  };

  existing.seenCount++;
  existing.lastAnsweredAt = now;

  if (!isCorrect) {
    existing.wrongCount++;
    existing.correctStreak = 0;
    existing.intervalDays = 1;
    existing.dueAt = now + DAY_MS;
  } else if (isCoachMode) {
    existing.correctStreak++;
    if (existing.correctStreak >= 3) {
      existing.intervalDays = 7;
    } else if (existing.correctStreak === 2) {
      existing.intervalDays = 4;
    } else {
      existing.intervalDays = 2;
    }
    existing.dueAt = now + existing.intervalDays * DAY_MS;
  }

  store.items[questionId] = existing;
  saveStore(store);
}

/** Items whose dueAt is in the past (or now). */
export function getDueItems(): Array<[string, CoachItem]> {
  const store = getCoachStore();
  const now = Date.now();
  return Object.entries(store.items).filter(([, item]) => item.dueAt <= now);
}

/** Count of items available for a coach session (due + fallback). */
export function getCoachQueueCount(): number {
  const store = getCoachStore();
  return Object.keys(store.items).length;
}

/** Count of due items specifically. */
export function getDueCount(): number {
  return getDueItems().length;
}

/**
 * Select up to 10 questions for a coach session.
 *
 * Priority:
 * 1. Due items (dueAt <= now), sorted by dueAt ascending (most overdue first).
 * 2. Fallback: remaining items sorted by wrongCount desc, then lastAnsweredAt desc.
 */
export function selectCoachQuestions(
  allQuestions: Question[],
): Question[] {
  const store = getCoachStore();
  const now = Date.now();

  const entries = Object.entries(store.items);
  if (entries.length === 0) return [];

  // Separate due and non-due
  const due = entries
    .filter(([, item]) => item.dueAt <= now)
    .sort(([, a], [, b]) => a.dueAt - b.dueAt);

  const notDue = entries
    .filter(([, item]) => item.dueAt > now)
    .sort(([, a], [, b]) => {
      if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
      return b.lastAnsweredAt - a.lastAnsweredAt;
    });

  const selectedIds: string[] = [];

  for (const [id] of due) {
    if (selectedIds.length >= QUESTIONS_PER_SESSION) break;
    selectedIds.push(id);
  }

  for (const [id] of notDue) {
    if (selectedIds.length >= QUESTIONS_PER_SESSION) break;
    selectedIds.push(id);
  }

  const idSet = new Set(selectedIds);
  return allQuestions.filter((q) => idSet.has(q.id));
}
