import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "@/components/QuestionCard/QuestionCard";
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

  if (!currentQuestion || !state.level) {
    return null;
  }

  const progressValue =
    ((state.currentIndex + (state.hasAnsweredCurrent ? 1 : 0)) /
      state.questions.length) *
    100;

  return (
    <div className={styles.container}>
      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <Badge variant="outline">
            {LEVEL_LABELS[state.level]}
          </Badge>
          <span>
            {state.currentIndex + 1} / {state.questions.length}
          </span>
        </div>
        <Progress value={progressValue} />
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
      />
    </div>
  );
}
