import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "@/context/QuizContext";
import type { Level } from "@/types/quiz";
import { LEVEL_LABELS, LEVEL_DESCRIPTIONS } from "@/types/quiz";
import styles from "./LevelSelectPage.module.css";

const levels: Level[] = ["junior", "mid", "senior"];

const levelColors: Record<Level, string> = {
  junior: "default",
  mid: "secondary",
  senior: "destructive",
};

const levelIcons: Record<Level, string> = {
  junior: "🌱",
  mid: "⚡",
  senior: "🔥",
};

export function LevelSelectPage() {
  const navigate = useNavigate();
  const { startQuiz } = useQuizContext();

  function handleSelectLevel(level: Level) {
    startQuiz(level);
    navigate("/quiz");
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose Your Level</h1>
        <p className={styles.subtitle}>
          Select the difficulty that matches your experience
        </p>
      </div>

      <div className={styles.levels}>
        {levels.map((level) => (
          <Card
            key={level}
            className={styles.levelCard}
            onClick={() => handleSelectLevel(level)}
          >
            <CardHeader className={styles.levelHeader}>
              <span className={styles.levelTitle}>
                {levelIcons[level]} {LEVEL_LABELS[level]}
              </span>
              <Badge
                variant={
                  levelColors[level] as
                    | "default"
                    | "secondary"
                    | "destructive"
                }
              >
                {LEVEL_LABELS[level]}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className={styles.levelDescription}>
                {LEVEL_DESCRIPTIONS[level]}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Start {LEVEL_LABELS[level]} Quiz
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
