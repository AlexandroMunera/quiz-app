import { useCallback, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useThemeContext } from "@/context/ThemeContext";
import styles from "./CodeViewer.module.css";

interface CodeViewerProps {
  code: string;
  language?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  js: "index.js",
  javascript: "index.js",
  ts: "index.ts",
  typescript: "index.ts",
  jsx: "App.jsx",
  tsx: "App.tsx",
};

export function CodeViewer({ code, language = "js" }: CodeViewerProps) {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const [copied, setCopied] = useState(false);

  const prismTheme = isDark ? themes.nightOwl : themes.nightOwlLight;

  const label = LANGUAGE_LABELS[language] ?? language;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleBar}>
        <div className={styles.dots}>
          <span className={styles.dot} data-color="red" />
          <span className={styles.dot} data-color="yellow" />
          <span className={styles.dot} data-color="green" />
        </div>
        <span className={styles.filename}>{label}</span>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          <span className={styles.copyLabel}>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      <Highlight theme={prismTheme} code={code} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className={styles.pre}>
            <code className={styles.code}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className={styles.line}>
                  <span className={styles.lineNumber}>{i + 1}</span>
                  <span className={styles.lineContent}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
