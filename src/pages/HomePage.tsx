import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import styles from "./HomePage.module.css";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.mascot}>
          <span className={styles.mascotEmoji}>🧑‍💻</span>
          <span className={styles.mascotName}>Meet Jess</span>
        </div>
        <h1 className={styles.title}>
          <span className={styles.gradientText}>JS</span> or{" "}
          <span className={styles.gradientText}>Guess</span>?
          <span className={styles.cursor}>_</span>
        </h1>
        <p className={styles.subtitle}>
          Think you know JavaScript? Jess will put you to the test.
          From fundamentals to advanced concepts — prove you're not just guessing.
        </p>
      </div>

      <Button
        size="lg"
        className={styles.ctaButton}
        onClick={() => navigate("/select-level")}
      >
        <span className={styles.ctaText}>Start Quiz</span>
        <span className={styles.ctaArrow}>→</span>
      </Button>

      <div className={styles.features}>
        <div className={`${styles.featureCard} ${styles.featureCyan}`}>
          <div className={styles.featureIcon}>🎯</div>
          <div className={styles.featureTitle}>3 Levels</div>
          <div className={styles.featureDesc}>Junior, Mid, Senior</div>
        </div>
        <div className={`${styles.featureCard} ${styles.featureMagenta}`}>
          <div className={styles.featureIcon}>📝</div>
          <div className={styles.featureTitle}>10 Questions</div>
          <div className={styles.featureDesc}>Per quiz session</div>
        </div>
        <div className={`${styles.featureCard} ${styles.featureAmber}`}>
          <div className={styles.featureIcon}>💡</div>
          <div className={styles.featureTitle}>Explanations</div>
          <div className={styles.featureDesc}>Learn from each answer</div>
        </div>
      </div>
    </div>
  );
}
