import { useNavigate } from "react-router-dom";
import { useQuizContext } from "@/context/QuizContext";
import type { Level } from "@/types/quiz";
import { LEVEL_LABELS, LEVEL_DESCRIPTIONS } from "@/types/quiz";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
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
  const { startQuiz } = useQuizContext();

  function handleSelectLevel(level: Level) {
    startQuiz(level);
    navigate("/quiz");
  }

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
            className={`${styles.levelCard} ${levelAccent[level]}`}
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
    </div>
  );
}
