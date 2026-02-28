import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "@/context/QuizContext";
import { LEVEL_LABELS, TOPIC_LABELS } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
import { getScoreReaction } from "@/components/Mascot/mascot.config";
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

  if (!state.isComplete || !state.level) {
    return null;
  }

  const results = getResults();
  const score = getScore();
  const total = state.questions.length;
  const percentage = Math.round((score / total) * 100);
  const reaction = getScoreReaction(percentage);

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

        <h1 className={styles.scoreTitle}>Quiz Complete!</h1>

        <MascotBubble
          message={reaction.message}
          size="md"
          variant={percentage >= 60 ? "success" : percentage >= 40 ? "info" : "error"}
        />

        {reaction.hint && <p className={styles.motivationalHint}>{reaction.hint}</p>}

        <span className={styles.levelBadge}>
          {LEVEL_LABELS[state.level]} Level
        </span>

        <div className={styles.actions}>
          <button
            className={styles.outlineBtn}
            onClick={() => {
              resetQuiz();
              navigate("/select-level");
            }}
          >
            Try Another Level
          </button>
          <Button
            className={styles.primaryBtn}
            onClick={() => {
              resetQuiz();
              navigate("/");
            }}
          >
            Back to Home
          </Button>
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
