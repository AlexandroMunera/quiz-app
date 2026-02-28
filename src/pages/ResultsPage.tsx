import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "@/context/QuizContext";
import { LEVEL_LABELS, TOPIC_LABELS } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
import { getScoreReaction } from "@/components/Mascot/mascot.config";
import { getCoachStore } from "@/hooks/useCoachStore";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import confetti from "canvas-confetti";
import styles from "./ResultsPage.module.css";

function getScoreClass(percentage: number): string {
  if (percentage >= 70) return styles.scoreHigh;
  if (percentage >= 40) return styles.scoreMedium;
  return styles.scoreLow;
}

export function ResultsPage() {
  const navigate = useNavigate();
  const { state, getResults, getScore, resetQuiz } = useQuizContext();

  useEffect(() => {
    if (!state.isComplete) {
      navigate("/select-level");
    }
  }, [state.isComplete, navigate]);

  const isCoach = state.mode === "coach";

  if (!state.isComplete || (!state.level && !isCoach)) {
    return null;
  }

  const results = getResults();
  const score = getScore();
  const total = state.questions.length;
  const percentage = Math.round((score / total) * 100);
  const reaction = getScoreReaction(percentage);

  // Coach mode SRS summary
  let coachSummary: { mastered: number; improving: number; needsPractice: number } | null = null;
  if (isCoach) {
    const store = getCoachStore();
    let mastered = 0;
    let improving = 0;
    let needsPractice = 0;
    for (const q of state.questions) {
      const item = store.items[q.id];
      if (!item || item.correctStreak === 0) {
        needsPractice++;
      } else if (item.correctStreak >= 3) {
        mastered++;
      } else {
        improving++;
      }
    }
    coachSummary = { mastered, improving, needsPractice };
  }

  // Action buttons for keyboard nav
  const actions = [
    {
      label: isCoach ? "Back to Levels" : "Try Another Level",
      primary: false,
      handler: () => {
        navigate("/select-level");
        resetQuiz();
      },
    },
    {
      label: "Back to Home",
      primary: true,
      handler: () => {
        navigate("/");
        resetQuiz();
      },
    },
  ];

  return (
    <ResultsContent
      percentage={percentage}
      score={score}
      total={total}
      reaction={reaction}
      results={results}
      isCoach={isCoach}
      level={state.level}
      coachSummary={coachSummary}
      actions={actions}
    />
  );
}

/** Inner component so hooks can run unconditionally. */
function ResultsContent({
  percentage,
  score,
  total,
  reaction,
  results,
  isCoach,
  level,
  coachSummary,
  actions,
}: {
  percentage: number;
  score: number;
  total: number;
  reaction: { emoji: string; message: string; hint: string | null };
  results: ReturnType<ReturnType<typeof useQuizContext>["getResults"]>;
  isCoach: boolean;
  level: import("@/types/quiz").Level | null;
  coachSummary: { mastered: number; improving: number; needsPractice: number } | null;
  actions: Array<{ label: string; primary: boolean; handler: () => void }>;
}) {
  // Perfect-score confetti
  useEffect(() => {
    if (percentage !== 100) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, [percentage]);

  // Keyboard nav for action buttons
  const handleActionSelect = useCallback(
    (index: number) => {
      actions[index]?.handler();
    },
    [actions],
  );

  const { highlightedIndex } = useKeyboardNav({
    itemCount: actions.length,
    onSelect: handleActionSelect,
    enabled: true,
  });

  return (
    <div className={styles.container}>
      <div className={styles.scoreSection}>
        <div className={styles.scoreEmoji}>{reaction.emoji}</div>
        <div className={cn(styles.scoreRingWrapper, getScoreClass(percentage))}>
          <svg className={styles.scoreRingSvg} viewBox="0 0 120 120">
            <circle
              className={styles.scoreRingBg}
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="6"
            />
            <circle
              className={styles.scoreRingFill}
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className={styles.scoreValue}>
            <span className={styles.scoreNumber}>{score}/{total}</span>
            <span className={styles.scorePercent}>{percentage}%</span>
          </div>
        </div>

        <h1 className={styles.scoreTitle}>
          {isCoach ? "Coach Session Complete!" : "Quiz Complete!"}
        </h1>

        <MascotBubble
          message={reaction.message}
          size="md"
          variant={percentage >= 60 ? "success" : percentage >= 40 ? "info" : "error"}
        />

        {reaction.hint && <p className={styles.motivationalHint}>{reaction.hint}</p>}

        {/* Coach Mode SRS summary badges */}
        {coachSummary && (
          <div className={styles.coachSummary}>
            <span className={cn(styles.srsBadge, styles.srsMastered)}>
              ✓ {coachSummary.mastered} mastered
            </span>
            <span className={styles.srsSeparator}>·</span>
            <span className={cn(styles.srsBadge, styles.srsImproving)}>
              ↗ {coachSummary.improving} improving
            </span>
            <span className={styles.srsSeparator}>·</span>
            <span className={cn(styles.srsBadge, styles.srsNeedsPractice)}>
              ✗ {coachSummary.needsPractice} need practice
            </span>
          </div>
        )}

        {!isCoach && level && (
          <span className={styles.levelBadge}>
            {LEVEL_LABELS[level]} Level
          </span>
        )}
        {isCoach && (
          <span className={styles.levelBadge}>🧠 Coach Mode</span>
        )}

        <div className={styles.actions}>
          {actions.map((action, index) =>
            action.primary ? (
              <Button
                key={action.label}
                className={cn(
                  styles.primaryBtn,
                  highlightedIndex === index && styles.actionHighlighted,
                )}
                onClick={action.handler}
              >
                {action.label}
              </Button>
            ) : (
              <button
                key={action.label}
                className={cn(
                  styles.outlineBtn,
                  highlightedIndex === index && styles.actionHighlighted,
                )}
                onClick={action.handler}
              >
                {action.label}
              </button>
            ),
          )}
        </div>
      </div>

      <div className={styles.reviewSection}>
        <h2 className={styles.reviewTitle}>Answer Review</h2>

        {results.map((result, index) => {
          const selectedOption = result.question.options.find(
            (o) => o.id === result.selectedOptionId
          );
          const correctOption = result.question.options.find(
            (o) => o.id === result.question.correctOptionId
          );

          return (
            <div
              key={result.question.id}
              className={cn(
                styles.reviewCard,
                result.isCorrect
                  ? styles.reviewCorrect
                  : styles.reviewIncorrect
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={styles.reviewCardHeader}>
                <span className={styles.reviewIndex}>Q{index + 1}</span>
                <span className={styles.reviewTopic}>
                  {TOPIC_LABELS[result.question.topic]}
                </span>
                <span
                  className={cn(
                    styles.reviewBadge,
                    result.isCorrect
                      ? styles.reviewBadgeCorrect
                      : styles.reviewBadgeIncorrect
                  )}
                >
                  {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>

              <p className={styles.reviewQuestion}>
                {result.question.text.replace(/```[\w]*\n[\s\S]*?```/g, "")}
              </p>

              <div className={styles.reviewAnswer}>
                <strong>Your answer:</strong> {selectedOption?.text ?? "—"}
              </div>

              {!result.isCorrect && (
                <div className={styles.reviewAnswer}>
                  <strong>Correct answer:</strong>{" "}
                  {correctOption?.text ?? "—"}
                </div>
              )}

              <div className={styles.reviewExplanation}>
                {result.question.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
