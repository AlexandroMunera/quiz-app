import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoAccent}>JS</span> Quiz
          </Link>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
