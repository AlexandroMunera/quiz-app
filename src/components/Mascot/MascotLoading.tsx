import { MASCOT } from "./mascot.config";
import styles from "./MascotLoading.module.css";

interface MascotLoadingProps {
  message?: string;
}

export function MascotLoading({
  message = `${MASCOT.name} is thinking...`,
}: MascotLoadingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.emojiWrap}>
        <span className={styles.emoji}>{MASCOT.emoji}</span>
        <span className={styles.thought}>💭</span>
      </div>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
