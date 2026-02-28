import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuizContext } from "@/context/QuizContext";
import { LEVEL_LABELS, TOPIC_LABELS } from "@/types/quiz";
import { cn } from "@/lib/utils";
import styles from "./ResultsPage.module.css";

function getScoreMessage(percentage: number): string {
  if (percentage >= 80) return "Excellent! You really know your stuff! 🎉";
  if (percentage >= 60) return "Good job! Keep learning and improving! 💪";
  if (percentage >= 40) return "Not bad! Review the topics you missed. 📚";
  return "Keep practicing! Every expert was once a beginner. 🌱";
}

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

  return (
    <div className={styles.container}>
      <div className={styles.scoreSection}>
        <div className={cn(styles.scoreCircle, getScoreClass(percentage))}>
          {score}/{total}
          <span className={styles.scoreLabel}>{percentage}%</span>
        </div>

        <h1 className={styles.scoreTitle}>Quiz Complete!</h1>
        <p className={styles.scoreSubtitle}>
          {getScoreMessage(percentage)}
        </p>

        <Badge variant="outline">{LEVEL_LABELS[state.level]} Level</Badge>

        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={() => {
              resetQuiz();
              navigate("/select-level");
            }}
          >
            Try Another Level
          </Button>
          <Button
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
            <Card
              key={result.question.id}
              className={cn(
                styles.reviewCard,
                result.isCorrect
                  ? styles.reviewCorrect
                  : styles.reviewIncorrect
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Question {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {TOPIC_LABELS[result.question.topic]}
                    </Badge>
                    <Badge
                      variant={result.isCorrect ? "default" : "destructive"}
                    >
                      {result.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
