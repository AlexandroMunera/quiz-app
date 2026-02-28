import { MASCOT } from "./mascot.config";
import styles from "./MascotEmpty.module.css";

interface MascotEmptyProps {
  message?: string;
}

export function MascotEmpty({
  message = "Pick a level to get started!",
}: MascotEmptyProps) {
  return (
    <div className={styles.container}>
      <span className={styles.emoji}>{MASCOT.emoji}</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
