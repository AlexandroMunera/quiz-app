import { useEffect, useRef } from "react";
import type { User } from "firebase/auth";
import type { Category, Question } from "@/types/quiz";
import { useAuthContext } from "@/context/AuthContext";
import { fetchCloudProgress, writeCloudProgress } from "@/lib/coachSync";
import { questions as allQuestions } from "@/data/questions";

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

function mergeCoachItem(current: CoachItem | undefined, incoming: CoachItem): CoachItem {
  if (!current) return incoming;

  return {
    seenCount: Math.max(current.seenCount, incoming.seenCount),
    wrongCount: Math.max(current.wrongCount, incoming.wrongCount),
    correctStreak: Math.max(current.correctStreak, incoming.correctStreak),
    lastAnsweredAt: Math.max(current.lastAnsweredAt, incoming.lastAnsweredAt),
    dueAt: Math.max(current.dueAt, incoming.dueAt),
    intervalDays: Math.max(current.intervalDays, incoming.intervalDays),
  };
}

function normalizeQuestionId(id: string, validIds: Set<string>): string | null {
  if (validIds.has(id)) return id;

  // Legacy-prefixed JS IDs from earlier plan drafts (js-j1, js-m1, js-s10)
  if (id.startsWith("js-")) {
    const trimmed = id.slice(3);
    if (validIds.has(trimmed)) return trimmed;
  }

  return null;
}

function migrateStoreItems(items: Record<string, CoachItem>): {
  items: Record<string, CoachItem>;
  changed: boolean;
} {
  const validIds = new Set(allQuestions.map((question) => question.id));
  const migratedItems: Record<string, CoachItem> = {};
  let changed = false;

  for (const [rawId, item] of Object.entries(items)) {
    const normalizedId = normalizeQuestionId(rawId, validIds);
    if (!normalizedId) {
      changed = true;
      continue;
    }

    if (normalizedId !== rawId) {
      changed = true;
    }

    migratedItems[normalizedId] = mergeCoachItem(migratedItems[normalizedId], item);
  }

  return { items: migratedItems, changed };
}

export function getCoachStore(): CoachStoreV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as CoachStoreV1;
    if (parsed.version !== 1 || typeof parsed.items !== "object") {
      return emptyStore();
    }

    const migrated = migrateStoreItems(parsed.items);
    const normalizedStore: CoachStoreV1 = {
      version: 1,
      items: migrated.items,
    };

    if (migrated.changed) {
      saveStore(normalizedStore);
    }

    return normalizedStore;
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
 * - If a signed-in user is provided, fires a fire-and-forget cloud write.
 */
export function updateItem(
  questionId: string,
  isCorrect: boolean,
  isCoachMode: boolean,
  user?: User | null,
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

  // Fire-and-forget cloud write when user is signed in
  if (user) {
    writeCloudProgress(user.uid, store.items).catch((err) => {
      console.error("[coachSync] write failed:", err);
    });
  }
}

/**
 * React hook that syncs coach progress from Firestore on sign-in.
 * Cloud wins on conflict: cloud data overwrites localStorage.
 * On sign-out, localStorage is left untouched.
 */
export function useCoachSync(): void {
  const { user } = useAuthContext();
  // Track previous user to detect the null → user transition (sign-in event)
  const prevUserRef = useRef<User | null>(null);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    if (user && prevUser === null) {
      // Signed in: pull cloud progress and overwrite local if present
      fetchCloudProgress(user.uid)
        .then((cloudItems) => {
          if (cloudItems !== null) {
            const store: CoachStoreV1 = { version: 1, items: cloudItems };
            saveStore(store);
          }
        })
        .catch((err) => {
          console.error("[coachSync] fetch failed:", err);
        });
    }
  }, [user]);
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

export function getCoachQueueCountForCategory(
  allQuestions: Question[],
  category: Category,
): number {
  const store = getCoachStore();
  const idSet = new Set(
    allQuestions
      .filter((question) => question.category === category)
      .map((question) => question.id)
  );
  return Object.keys(store.items).filter((id) => idSet.has(id)).length;
}

export function getDueCountForCategory(
  allQuestions: Question[],
  category: Category,
): number {
  const idSet = new Set(
    allQuestions
      .filter((question) => question.category === category)
      .map((question) => question.id)
  );
  return getDueItems().filter(([id]) => idSet.has(id)).length;
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
  category?: Category,
): Question[] {
  const store = getCoachStore();
  const now = Date.now();

  const filteredQuestions = category
    ? allQuestions.filter((question) => question.category === category)
    : allQuestions;

  const allowedIds = new Set(filteredQuestions.map((question) => question.id));

  const entries = Object.entries(store.items).filter(([id]) => allowedIds.has(id));
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
  return filteredQuestions.filter((q) => idSet.has(q.id));
}
