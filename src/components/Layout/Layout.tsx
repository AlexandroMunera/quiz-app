import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Loader2, LogOut } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuthContext } from "@/context/AuthContext";
import { MASCOT } from "@/components/Mascot/mascot.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useThemeContext();
  const { user, authLoading, signInWithGoogle, signOut } = useAuthContext();

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoJess}>Jess</span>
            <span className={styles.logoDivider}>—</span>
            <span className={styles.logoTagline}>JS or Guess?</span>
          </Link>

          <div className={styles.headerActions}>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {authLoading ? (
              <div className={styles.authSpinner} aria-label="Loading auth">
                <Loader2 size={18} className={styles.spinIcon} />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={styles.avatarButton}
                    aria-label="Account menu"
                  >
                    <Avatar className={styles.avatar}>
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={styles.dropdownContent}>
                  <DropdownMenuLabel className={styles.dropdownLabel}>
                    <span className={styles.dropdownName}>{user.displayName ?? "Signed in"}</span>
                    <span className={styles.dropdownEmail}>{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => void signOut()}
                    className={styles.dropdownSignOut}
                  >
                    <LogOut size={14} />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => void signInWithGoogle()}
                className={styles.signInButton}
                aria-label="Sign in with Google"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className={styles.signInLabel}>Sign in</span>
              </button>
            )}
          </div>
        </div>
        <div className={styles.headerGlow} />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Built with ❤️ by Freud — no, not that one. Assisted by {MASCOT.name}{" "}
          {MASCOT.emoji}
        </span>
      </footer>
    </div>
  );
}
