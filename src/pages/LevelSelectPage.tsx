import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "@/context/QuizContext";
import type { Level } from "@/types/quiz";
import { LEVEL_LABELS, LEVEL_DESCRIPTIONS } from "@/types/quiz";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
import { questions as allQuestions } from "@/data/questions";
import {
  getCoachQueueCount,
  getDueCount,
  selectCoachQuestions,
} from "@/hooks/useCoachStore";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { cn } from "@/lib/utils";
import styles from "./LevelSelectPage.module.css";

const levels: Level[] = ["junior", "mid", "senior"];

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
  const { startQuiz, startCoachMode } = useQuizContext();

  const coachTotal = getCoachQueueCount();
  const coachDue = getDueCount();
  const coachEnabled = coachTotal > 0;

  // Total items: 3 level cards + 1 coach CTA
  const totalItems = levels.length + 1;

  function handleSelectLevel(level: Level) {
    startQuiz(level);
    navigate("/quiz");
  }

  function handleStartCoach() {
    if (!coachEnabled) return;
    const selected = selectCoachQuestions(allQuestions);
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
    [coachEnabled],
  );

  const { highlightedIndex } = useKeyboardNav({
    itemCount: totalItems,
    onSelect: handleKeySelect,
    enabled: true,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MascotBubble
          message="Pick your challenge! 🎮"
          size="md"
          variant="info"
        />
        <h1 className={styles.title}>Choose Your Level</h1>
        <p className={styles.subtitle}>
          Select the difficulty that matches your experience
        </p>
      </div>

      <div className={styles.levels}>
        {levels.map((level, index) => (
          <div
            key={level}
            className={cn(
              styles.levelCard,
              levelAccent[level],
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
                Start {LEVEL_LABELS[level]} Quiz →
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
          {coachEnabled ? (
            <span className={styles.coachBadge}>
              {coachDue > 0 ? `${coachDue} due` : `${coachTotal} to review`}
            </span>
          ) : (
            <span className={styles.coachDisabledBadge}>🔒 Locked</span>
          )}
        </div>
        <p className={styles.coachDescription}>
          {coachEnabled
            ? "Practice questions you've missed before. Powered by spaced repetition."
            : "Complete a quiz and miss a question to unlock Coach Mode."}
        </p>
        {!coachEnabled && (
          <div className={styles.coachMascot}>
            <MascotBubble
              message="Take a quiz first — I'll coach you on the tricky ones! 💪"
              size="sm"
              variant="info"
            />
          </div>
        )}
      </div>
    </div>
  );
}
