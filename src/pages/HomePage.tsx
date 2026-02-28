import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import styles from "./HomePage.module.css";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Test Your <span className={styles.accent}>JavaScript</span> Knowledge
        </h1>
        <p className={styles.subtitle}>
          Challenge yourself with questions across all seniority levels. From
          fundamentals to advanced concepts — find out where you stand.
        </p>
      </div>

      <Button size="lg" onClick={() => navigate("/select-level")}>
        Start Quiz
      </Button>

      <div className={styles.features}>
        <Card className={styles.featureCard}>
          <CardContent className="p-0">
            <div className={styles.featureIcon}>🎯</div>
            <div className={styles.featureTitle}>3 Levels</div>
            <div className={styles.featureDesc}>
              Junior, Mid, Senior
            </div>
          </CardContent>
        </Card>
        <Card className={styles.featureCard}>
          <CardContent className="p-0">
            <div className={styles.featureIcon}>📝</div>
            <div className={styles.featureTitle}>10 Questions</div>
            <div className={styles.featureDesc}>
              Per quiz session
            </div>
          </CardContent>
        </Card>
        <Card className={styles.featureCard}>
          <CardContent className="p-0">
            <div className={styles.featureIcon}>💡</div>
            <div className={styles.featureTitle}>Explanations</div>
            <div className={styles.featureDesc}>
              Learn from each answer
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
