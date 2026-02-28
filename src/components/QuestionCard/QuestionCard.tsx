import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/quiz";
import { TOPIC_LABELS } from "@/types/quiz";
import { Badge } from "@/components/ui/badge";
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
}: QuestionCardProps) {
  const { text, code } = parseQuestionText(question.text);
  const isCorrect = selectedOptionId === question.correctOptionId;

  return (
    <Card className={styles.card}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className={styles.questionNumber}>
            Question {questionNumber} of {totalQuestions}
          </span>
          <Badge variant="outline">{TOPIC_LABELS[question.topic]}</Badge>
        </div>
        <div className={styles.questionText}>
          {text}
          {code && <pre className={styles.codeBlock}>{code}</pre>}
        </div>
      </CardHeader>

      <CardContent>
        <div className={styles.options}>
          {question.options.map((option) => {
            let optionStyle = styles.optionLabel;

            if (hasAnswered) {
              if (option.id === question.correctOptionId) {
                optionStyle = cn(styles.optionLabel, styles.optionCorrect);
              } else if (
                option.id === selectedOptionId &&
                option.id !== question.correctOptionId
              ) {
                optionStyle = cn(styles.optionLabel, styles.optionIncorrect);
              } else {
                optionStyle = cn(styles.optionLabel, styles.optionDisabled);
              }
            }

            return (
              <label
                key={option.id}
                className={optionStyle}
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
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    selectedOptionId === option.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {selectedOptionId === option.id && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                <span>{option.text}</span>
              </label>
            );
          })}
        </div>

        {hasAnswered && (
          <Alert
            className={styles.explanation}
            variant={isCorrect ? "default" : "destructive"}
          >
            <AlertTitle>{isCorrect ? "✅ Correct!" : "❌ Incorrect"}</AlertTitle>
            <AlertDescription>{question.explanation}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className={styles.footer}>
        <div />
        {hasAnswered && (
          <Button onClick={onNext}>
            {isLast ? "See Results" : "Next Question →"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
