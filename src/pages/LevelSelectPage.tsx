import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuizContext } from "@/context/QuizContext";
import { useAuthContext } from "@/context/AuthContext";
import type { Category, Level } from "@/types/quiz";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  LEVEL_DESCRIPTIONS,
  LEVEL_LABELS,
} from "@/types/quiz";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
import { questions as allQuestions } from "@/data/questions";
import {
  getCoachQueueCountForCategory,
  getDueCountForCategory,
  getCoachQueueCount,
  getDueCount,
  selectCoachQuestions,
} from "@/hooks/useCoachStore";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { cn } from "@/lib/utils";
import styles from "./LevelSelectPage.module.css";

const levels: Level[] = ["junior", "mid", "senior"];
const categories: Category[] = [
  "javascript",
  "devops",
  "web-fundamentals",
  "css",
  "typescript",
  "react",
];

const levelIcons: Record<Level, string> = {
  junior: "🌱",
  mid: "⚡",
  senior: "🔥",
};

const levelAccent: Record<Level, string> = {
  junior: styles.accentCyan,
  mid: styles.accentAmber,
  senior: styles.accentMagenta,
};

export function LevelSelectPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { startQuiz, startCoachMode } = useQuizContext();
  const { user } = useAuthContext();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [navSection, setNavSection] = useState<"categories" | "actions">("categories");

  const coachTotal = selectedCategory
    ? getCoachQueueCountForCategory(allQuestions, selectedCategory)
    : getCoachQueueCount();
  const globalCoachTotal = getCoachQueueCount();
  const coachDue = selectedCategory
    ? getDueCountForCategory(allQuestions, selectedCategory)
    : getDueCount();
  const coachEnabled = coachTotal > 0;
  const showingPriorityReviewHint = coachEnabled && coachDue === 0;

  // Total items: 3 level cards + 1 coach CTA
  const totalItems = levels.length + 1;

  function handleSelectLevel(level: Level) {
    if (!selectedCategory) return;
    startQuiz(level, selectedCategory);
    navigate("/quiz");
  }

  function handleStartCoach() {
    if (!coachEnabled) return;
    const selected = selectCoachQuestions(allQuestions, selectedCategory ?? undefined);
    if (selected.length === 0) return;
    startCoachMode(selected);
    navigate("/quiz");
  }

  const handleKeySelect = useCallback(
    (index: number) => {
      if (index < levels.length) {
        handleSelectLevel(levels[index]);
      } else if (index === levels.length) {
        handleStartCoach();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coachEnabled, selectedCategory],
  );

  const {
    highlightedIndex,
    setHighlightedIndex,
  } = useKeyboardNav({
    itemCount: totalItems,
    onSelect: handleKeySelect,
    enabled: navSection === "actions",
  });

  const {
    highlightedIndex: categoryHighlightedIndex,
    setHighlightedIndex: setCategoryHighlightedIndex,
  } = useKeyboardNav({
    itemCount: categories.length,
    onSelect: (index) => {
      const category = categories[index];
      if (!category) return;
      applySelectedCategory(category);
    },
    enabled: navSection === "categories",
  });

  function applySelectedCategory(category: Category) {
    setSelectedCategory(category);
    setNavSection("actions");
    setHighlightedIndex(0);

    const next = new URLSearchParams(searchParams);
    next.set("category", category);
    next.set("section", "actions");
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (!urlCategory) return;
    if (!categories.includes(urlCategory as Category)) return;

    const normalized = urlCategory as Category;
    setSelectedCategory(normalized);
  }, [searchParams]);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section !== "categories" && section !== "actions") return;
    if (section === navSection) return;
    setNavSection(section);
  }, [searchParams, navSection]);

  useEffect(() => {
    const current = searchParams.get("section");
    if (current === navSection) return;
    const next = new URLSearchParams(searchParams);
    next.set("section", navSection);
    setSearchParams(next, { replace: true });
  }, [navSection, searchParams, setSearchParams]);

  useEffect(() => {
    if (navSection !== "categories") return;
    if (categoryHighlightedIndex !== null) return;
    setCategoryHighlightedIndex(0);
  }, [navSection, categoryHighlightedIndex, setCategoryHighlightedIndex]);

  useEffect(() => {
    if (navSection !== "actions") return;
    if (highlightedIndex !== null) return;
    setHighlightedIndex(0);
  }, [navSection, highlightedIndex, setHighlightedIndex]);

  useEffect(() => {
    function handleTabSwitch(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      e.preventDefault();
      setNavSection((prev) => {
        const nextSection = prev === "categories" ? "actions" : "categories";
        const next = new URLSearchParams(searchParams);
        next.set("section", nextSection);
        setSearchParams(next, { replace: true });
        return nextSection;
      });
    }

    window.addEventListener("keydown", handleTabSwitch);
    return () => window.removeEventListener("keydown", handleTabSwitch);
  }, [searchParams, setSearchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerBubble}>
          <MascotBubble
            message="Pick your challenge! 🎮"
            size="md"
            variant="info"
          />
        </div>
        <h1 className={styles.title}>Choose Your Level</h1>
        <p className={styles.subtitle}>
          Pick a topic first, then select the difficulty
        </p>
      </div>

      <div className={styles.categories}>
        {categories.map((category, index) => {
          const categoryIcon = CATEGORY_ICONS[category];

          return (
            <button
              key={category}
              type="button"
              className={cn(
                styles.categoryCard,
                selectedCategory === category && styles.categoryCardSelected,
                navSection === "categories" &&
                  categoryHighlightedIndex === index &&
                  styles.categoryCardHighlighted,
              )}
              onClick={() => applySelectedCategory(category)}
            >
              <div className={styles.categoryHeader}>
                <span
                  className={styles.categoryIcon}
                  style={{ color: `#${categoryIcon.hex}` }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d={categoryIcon.path} />
                  </svg>
                </span>
                <span className={styles.categoryTitle}>{CATEGORY_LABELS[category]}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.levels}>
        {levels.map((level, index) => (
          <div
            key={level}
            className={cn(
              styles.levelCard,
              levelAccent[level],
              !selectedCategory && styles.levelCardDisabled,
              highlightedIndex === index && styles.levelCardHighlighted,
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleSelectLevel(level)}
          >
            <div className={styles.levelHeader}>
              <span className={styles.levelIcon}>{levelIcons[level]}</span>
              <span className={styles.levelTitle}>{LEVEL_LABELS[level]}</span>
              <span className={styles.levelBadge}>{LEVEL_LABELS[level]}</span>
            </div>
            <p className={styles.levelDescription}>
              {LEVEL_DESCRIPTIONS[level]}
            </p>
            <div className={styles.levelAction}>
              <span className={styles.levelButton}>
                {selectedCategory
                  ? `Start ${LEVEL_LABELS[level]} Quiz →`
                  : "Select a topic first"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Coach Mode CTA */}
      <div
        className={cn(
          styles.coachCard,
          !coachEnabled && styles.coachCardDisabled,
          highlightedIndex === levels.length && styles.levelCardHighlighted,
        )}
        onClick={handleStartCoach}
      >
        <div className={styles.coachHeader}>
          <span className={styles.coachIcon}>🧠</span>
          <span className={styles.coachTitle}>Coach Mode</span>
          {coachEnabled && (
            <span className={cn(
              styles.syncBadge,
              user ? styles.syncBadgeSynced : styles.syncBadgeLocal,
            )}>
              {user ? "☁️ Synced" : "💾 Local only"}
            </span>
          )}
          {coachEnabled ? (
            <span className={styles.coachBadge}>
              {coachDue > 0 ? `${coachDue} due` : `${coachTotal} to review`}
            </span>
          ) : (
            <span className={styles.coachDisabledBadge}>🔒 Locked</span>
          )}
        </div>
        <p className={styles.coachDescription}>
          {selectedCategory && !coachEnabled && globalCoachTotal > 0
            ? `No ${CATEGORY_LABELS[selectedCategory]} items yet. Miss one in a ${CATEGORY_LABELS[selectedCategory]} quiz to add it.`
            : coachEnabled
            ? selectedCategory
              ? `Review missed ${CATEGORY_LABELS[selectedCategory]} questions with spaced repetition.`
              : "Review missed questions with spaced repetition."
            : "Miss a question in any quiz to unlock Coach Mode."}
        </p>
        {showingPriorityReviewHint && (
          <p className={styles.coachSyncHint}>
            Nothing due now, showing priority items.
          </p>
        )}
        {!user && (
          <p className={cn(styles.coachSyncHint, styles.coachHintMeta)}>
            ☁️ Sign in to sync progress across devices.
          </p>
        )}
        {!coachEnabled && (
          <div className={styles.coachMascot}>
            <MascotBubble
              message="Take a quiz first. I will coach the tricky ones. 💪"
              size="sm"
              variant="info"
            />
          </div>
        )}
      </div>
    </div>
  );
}
