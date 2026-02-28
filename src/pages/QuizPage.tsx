import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard/QuestionCard";
import { MascotLoading } from "@/components/Mascot/MascotLoading";
import { useQuizContext } from "@/context/QuizContext";
import { LEVEL_LABELS } from "@/types/quiz";
import styles from "./QuizPage.module.css";

export function QuizPage() {
  const navigate = useNavigate();
  const {
    state,
    currentQuestion,
    currentAnswer,
    selectAnswer,
    nextQuestion,
  } = useQuizContext();

  useEffect(() => {
    if (!state.level) {
      navigate("/select-level");
      return;
    }
    if (state.isComplete) {
      navigate("/results");
    }
  }, [state.level, state.isComplete, navigate]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = state.answers.length - 1; i >= 0; i--) {
      const answer = state.answers[i];
      const question = state.questions.find((q) => q.id === answer.questionId);
      if (question?.correctOptionId === answer.selectedOptionId) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [state.answers, state.questions]);

  if (!currentQuestion || !state.level) {
    return <MascotLoading message="Loading your quiz…" />;
  }

  const progressValue =
    ((state.currentIndex + (state.hasAnsweredCurrent ? 1 : 0)) /
      state.questions.length) *
    100;

  return (
    <div className={styles.container}>
      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.levelBadge}>
            {LEVEL_LABELS[state.level]}
          </span>
          <span className={styles.counter}>
            {state.currentIndex + 1}
            <span className={styles.counterSlash}>/</span>
            {state.questions.length}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={state.currentIndex + 1}
        totalQuestions={state.questions.length}
        selectedOptionId={currentAnswer?.selectedOptionId ?? null}
        hasAnswered={state.hasAnsweredCurrent}
        onSelectOption={(optionId) =>
          selectAnswer(currentQuestion.id, optionId)
        }
        onNext={nextQuestion}
        isLast={state.currentIndex === state.questions.length - 1}
        streak={currentStreak}
      />
    </div>
  );
}
