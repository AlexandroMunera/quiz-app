import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
import { useAuthContext } from "@/context/AuthContext";
import { getCoachQueueCount } from "@/hooks/useCoachStore";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/types/quiz";
import type { Category } from "@/types/quiz";
import styles from "./HomePage.module.css";

const SESSION_KEY = "jess-signin-nudge-shown";

const categories: Category[] = [
  "javascript",
  "devops",
  "web-fundamentals",
  "css",
  "typescript",
  "react",
];

export function HomePage() {
  const navigate = useNavigate();
  const { user, authLoading } = useAuthContext();
  const [activeCategory, setActiveCategory] = useState<Category>("javascript");
  const shouldShowNudge =
    !authLoading &&
    !user &&
    !sessionStorage.getItem(SESSION_KEY);

  const hasCoachData = getCoachQueueCount() > 0;
  const nudgeMessage = shouldShowNudge
    ? hasCoachData
      ? "Welcome back! Your progress is saved only on this device — sign in to back it up. ☁️"
      : "Hey! Sign in so I can remember your progress next time 🔐"
    : null;

  useEffect(() => {
    if (!shouldShowNudge) return;
    sessionStorage.setItem(SESSION_KEY, "1");
  }, [shouldShowNudge]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.mascot}>
          <span className={styles.mascotEmoji}>🧑‍💻</span>
          <span className={styles.mascotName}>Meet Jess</span>
        </div>
        <h1 className={styles.title}>
          Prove Your Skills in the <span className={styles.gradientText}>Tech Arena</span>
          <span className={styles.cursor}>_</span>
        </h1>
        <p className={styles.subtitle}>
          Choose your stack, take on smart questions, and sharpen your edge with
          instant explanations after every answer.
        </p>
      </div>

      <div className={styles.categoryShowcase}>
        {categories.map((category) => {
          const categoryIcon = CATEGORY_ICONS[category];

          return (
            <button
              key={category}
              type="button"
              className={`${styles.categoryPill} ${
                activeCategory === category ? styles.categoryPillActive : ""
              }`}
              onMouseEnter={() => setActiveCategory(category)}
              onFocus={() => setActiveCategory(category)}
              onClick={() =>
                navigate(`/select-level?category=${category}&section=actions`)
              }
            >
              <span
                className={styles.categoryPillIcon}
                style={{ color: `#${categoryIcon.hex}` }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d={categoryIcon.path} />
                </svg>
              </span>
              <span>{CATEGORY_LABELS[category]}</span>
            </button>
          );
        })}
      </div>

      {nudgeMessage && (
        <div className={styles.nudgeBubble}>
          <MascotBubble message={nudgeMessage} size="sm" variant="info" />
        </div>
      )}

      <Button
        size="lg"
        className={styles.ctaButton}
        onClick={() =>
          navigate(`/select-level?category=${activeCategory}&section=actions`)
        }
      >
        <span className={styles.ctaText}>Start {CATEGORY_LABELS[activeCategory]} Challenge</span>
        <span className={styles.ctaArrow}>→</span>
      </Button>

      <div className={styles.features}>
        <div className={`${styles.featureCard} ${styles.featureCyan}`}>
          <div className={styles.featureIcon}>🎯</div>
          <div className={styles.featureTitle}>6 Focused Tracks</div>
          <div className={styles.featureDesc}>From JavaScript to React and beyond</div>
        </div>
        <div className={`${styles.featureCard} ${styles.featureMagenta}`}>
          <div className={styles.featureIcon}>📝</div>
          <div className={styles.featureTitle}>10 Curated Questions</div>
          <div className={styles.featureDesc}>A focused sprint every session</div>
        </div>
        <div className={`${styles.featureCard} ${styles.featureAmber}`}>
          <div className={styles.featureIcon}>💡</div>
          <div className={styles.featureTitle}>Instant Feedback</div>
          <div className={styles.featureDesc}>Learn the why, not just the what</div>
        </div>
      </div>
    </div>
  );
}
