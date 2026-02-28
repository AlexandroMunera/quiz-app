/**
 * Mascot configuration — change the name, emoji, or personality here
 * and it will propagate across the entire app.
 */

export const MASCOT = {
  name: "Jess",
  emoji: "🧑‍💻",
  greeting: "Meet Jess",
} as const;

/** Reactions shown on correct quiz answers */
export const CORRECT_REACTIONS = [
  "Nice one! 🎯",
  "You got this! 💪",
  "Nailed it! ✨",
  "Spot on! 🙌",
  "Exactly right! ⚡",
];

/** Reactions shown on incorrect quiz answers */
export const INCORRECT_REACTIONS = [
  "Tricky one! 😅",
  "Almost! 🤏",
  "We learn from these! 📚",
  "Next time! 🔄",
  "Good try! Keep going 💡",
];

/** Milestone reactions during the quiz */
export const MILESTONE_REACTIONS = {
  halfway: "Halfway there! Keep it up ⚡",
  streak3: "You're on fire! 🔥🔥🔥",
  streak5: "Unstoppable! 🚀",
  firstQuestion: "Let's go! You got this 💪",
};

/** Score-based mascot expressions for the results page */
export const SCORE_REACTIONS: Record<
  string,
  { emoji: string; message: string; hint: string | null }
> = {
  perfect: {
    emoji: "🏆",
    message: `Perfect score! ${MASCOT.name} is impressed!`,
    hint: null,
  },
  excellent: {
    emoji: "🔥",
    message: `Excellent! ${MASCOT.name} says you really know your stuff!`,
    hint: "So close to perfection — one more try? 🎯",
  },
  good: {
    emoji: "💪",
    message: `Good job! ${MASCOT.name} says keep learning!`,
    hint: "You're almost there — review and retry! ⚡",
  },
  okay: {
    emoji: "📚",
    message: `Not bad! ${MASCOT.name} suggests reviewing the topics you missed.`,
    hint: "A little more practice and you'll nail it! 🎯",
  },
  low: {
    emoji: "🌱",
    message: `Keep going! ${MASCOT.name} believes in you!`,
    hint: "Each attempt makes you stronger — try again! 💪",
  },
  veryLow: {
    emoji: "🚀",
    message: `Don't give up! ${MASCOT.name} says every expert was once a beginner!`,
    hint: "Each attempt makes you stronger — try again! 💪",
  },
};

export function getScoreReaction(percentage: number) {
  if (percentage === 100) return SCORE_REACTIONS.perfect;
  if (percentage >= 80) return SCORE_REACTIONS.excellent;
  if (percentage >= 60) return SCORE_REACTIONS.good;
  if (percentage >= 40) return SCORE_REACTIONS.okay;
  if (percentage >= 20) return SCORE_REACTIONS.low;
  return SCORE_REACTIONS.veryLow;
}

export function getRandomReaction(isCorrect: boolean): string {
  const pool = isCorrect ? CORRECT_REACTIONS : INCORRECT_REACTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}
