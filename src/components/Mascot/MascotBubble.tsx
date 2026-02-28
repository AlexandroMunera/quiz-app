import { MASCOT } from "./mascot.config";
import styles from "./MascotBubble.module.css";
import { cn } from "@/lib/utils";

interface MascotBubbleProps {
  message: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "error" | "info";
  showEmoji?: boolean;
  className?: string;
  animate?: boolean;
}

export function MascotBubble({
  message,
  size = "md",
  variant = "default",
  showEmoji = true,
  className,
  animate = true,
}: MascotBubbleProps) {
  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        animate && styles.animate,
        className
      )}
    >
      {showEmoji && (
        <span className={styles.emoji}>{MASCOT.emoji}</span>
      )}
      <div className={cn(styles.bubble, styles[variant])}>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
}
