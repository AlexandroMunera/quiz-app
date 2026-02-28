import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/quiz";
import { TOPIC_LABELS } from "@/types/quiz";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
import { getRandomReaction, MILESTONE_REACTIONS } from "@/components/Mascot/mascot.config";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  hasAnswered: boolean;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  isLast: boolean;
  streak?: number;
  highlightedIndex?: number | null;
}

function parseQuestionText(text: string) {
  const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);

  if (match) {
    const before = text.substring(0, match.index).trim();
    const code = match[1].trim();
    return { text: before, code };
  }

  return { text, code: null };
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  hasAnswered,
  onSelectOption,
  onNext,
  isLast,
  streak = 0,
  highlightedIndex = null,
}: QuestionCardProps) {
  const { text, code } = parseQuestionText(question.text);
  const isCorrect = selectedOptionId === question.correctOptionId;

  const mascotMessage = useMemo(() => {
    if (!hasAnswered) {
      if (questionNumber === 1) return MILESTONE_REACTIONS.firstQuestion;
      if (questionNumber === Math.ceil(totalQuestions / 2) + 1)
        return MILESTONE_REACTIONS.halfway;
      return null;
    }
    // After answering — show streak or reaction
    if (isCorrect && streak >= 5) return MILESTONE_REACTIONS.streak5;
    if (isCorrect && streak >= 3) return MILESTONE_REACTIONS.streak3;
    return getRandomReaction(isCorrect);
  }, [hasAnswered, isCorrect, streak, questionNumber, totalQuestions]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerRow}>
          <span className={styles.questionNumber}>
            Q{questionNumber}
            <span className={styles.questionTotal}>/{totalQuestions}</span>
          </span>
          <span className={styles.topicBadge}>
            {TOPIC_LABELS[question.topic]}
          </span>
        </div>
        <div className={styles.questionText}>
          {text}
          {code && (
            <div className={styles.codeWrapper}>
              <div className={styles.codeHeader}>
                <span className={styles.codeDot} />
                <span className={styles.codeDot} />
                <span className={styles.codeDot} />
              </div>
              <pre className={styles.codeBlock}>{code}</pre>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.options}>
          {question.options.map((option, index) => {
            let optionClass = styles.optionLabel;
            const isHighlighted = highlightedIndex === index && !hasAnswered;

            if (hasAnswered) {
              if (option.id === question.correctOptionId) {
                optionClass = cn(styles.optionLabel, styles.optionCorrect);
              } else if (
                option.id === selectedOptionId &&
                option.id !== question.correctOptionId
              ) {
                optionClass = cn(styles.optionLabel, styles.optionIncorrect);
              } else {
                optionClass = cn(styles.optionLabel, styles.optionDisabled);
              }
            } else if (isHighlighted) {
              optionClass = cn(styles.optionLabel, styles.optionHighlighted);
            }

            return (
              <label
                key={option.id}
                className={optionClass}
                data-state={selectedOptionId === option.id ? "checked" : ""}
                onClick={() => !hasAnswered && onSelectOption(option.id)}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={selectedOptionId === option.id}
                  onChange={() => !hasAnswered && onSelectOption(option.id)}
                  disabled={hasAnswered}
                  className="sr-only"
                />
                <span className={styles.optionIndex}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>{option.text}</span>
              </label>
            );
          })}
        </div>

        {hasAnswered && (
          <div
            className={cn(
              styles.explanation,
              isCorrect ? styles.explanationCorrect : styles.explanationIncorrect
            )}
          >
            <div className={styles.explanationHeader}>
              <span className={styles.explanationIcon}>
                {isCorrect ? "✓" : "✗"}
              </span>
              <span className={styles.explanationTitle}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            <p className={styles.explanationText}>{question.explanation}</p>
          </div>
        )}
      </div>

      {mascotMessage && (
        <div className={styles.mascotRow}>
          <MascotBubble
            message={mascotMessage}
            size="sm"
            variant={
              !hasAnswered
                ? "info"
                : isCorrect
                  ? "success"
                  : "error"
            }
          />
        </div>
      )}

      {hasAnswered && (
        <div className={styles.cardFooter}>
          <Button onClick={onNext} className={styles.nextButton}>
            {isLast ? "See Results" : "Next Question"}
            <span className={styles.nextArrow}>→</span>
          </Button>
        </div>
      )}
    </div>
  );
}
