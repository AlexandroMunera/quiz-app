import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "@/context/QuizContext";
import { useAuthContext } from "@/context/AuthContext";
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
  const { user, signInWithGoogle } = useAuthContext();

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
      isGuest={!user}
      signInWithGoogle={signInWithGoogle}
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
  isGuest,
  signInWithGoogle,
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
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
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

        {isGuest && (
          <div className={styles.signInBanner}>
            <div className={styles.signInBannerContent}>
              <span className={styles.signInBannerIcon}>☁️</span>
              <div className={styles.signInBannerText}>
                <span className={styles.signInBannerTitle}>Save your progress</span>
                <span className={styles.signInBannerSub}>Sign in to sync Coach Mode data across devices</span>
              </div>
            </div>
            <button
              onClick={() => void signInWithGoogle()}
              className={styles.signInBannerBtn}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}
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
