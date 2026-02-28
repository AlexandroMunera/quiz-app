import { Link } from "react-router-dom";
import { MascotBubble } from "@/components/Mascot/MascotBubble";
import { MASCOT } from "@/components/Mascot/mascot.config";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <div className={styles.container}>
      <span className={styles.emoji}>{MASCOT.emoji}</span>

      <h1 className={styles.code}>404</h1>
      <p className={styles.title}>Page not found</p>

      <MascotBubble
        message="Even I can't find this page… 🤷"
        size="lg"
        variant="info"
      />

      <Link to="/" className={styles.homeLink}>
        ← Back to Home
      </Link>
    </div>
  );
}
