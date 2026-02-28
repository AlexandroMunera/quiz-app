import { useEffect, useState, useCallback } from "react";

interface UseKeyboardNavOptions {
  /** Total number of navigable items */
  itemCount: number;
  /** Called when Enter is pressed on a highlighted item */
  onSelect: (index: number) => void;
  /** Whether the hook should be active */
  enabled?: boolean;
  /** Allow number keys (1-based) to set highlight */
  allowNumberKeys?: boolean;
  /** Called on any navigation (optional) */
  onNavigate?: (index: number) => void;
}

export function useKeyboardNav({
  itemCount,
  onSelect,
  enabled = true,
  allowNumberKeys = false,
  onNavigate,
}: UseKeyboardNavOptions) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(
    null,
  );

  const resetHighlight = useCallback(() => {
    setHighlightedIndex(null);
  }, []);

  useEffect(() => {
    if (!enabled || itemCount === 0) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Guard: don't interfere with text inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight": {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev === null ? 0 : (prev + 1) % itemCount;
            onNavigate?.(next);
            return next;
          });
          break;
        }
        case "ArrowUp":
        case "ArrowLeft": {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next =
              prev === null
                ? itemCount - 1
                : (prev - 1 + itemCount) % itemCount;
            onNavigate?.(next);
            return next;
          });
          break;
        }
        case "Enter": {
          e.preventDefault();
          setHighlightedIndex((current) => {
            if (current !== null) {
              onSelect(current);
            }
            return current;
          });
          break;
        }
        default: {
          if (allowNumberKeys) {
            const num = parseInt(e.key, 10);
            if (num >= 1 && num <= itemCount) {
              e.preventDefault();
              const idx = num - 1;
              setHighlightedIndex(idx);
              onNavigate?.(idx);
            }
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, itemCount, onSelect, allowNumberKeys, onNavigate]);

  return { highlightedIndex, setHighlightedIndex, resetHighlight };
}
