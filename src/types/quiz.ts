export type Level = "junior" | "mid" | "senior";

export type QuizMode = "standard" | "coach";

export type Topic =
  | "core-js"
  | "functions-closures"
  | "async"
  | "dom"
  | "es6+"
  | "oop-prototypes";

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  topic: Topic;
  level: Level;
  options: Option[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizState {
  mode: QuizMode;
  level: Level | null;
  questions: Question[];
  currentIndex: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  hasAnsweredCurrent: boolean;
}

export interface QuizResult {
  question: Question;
  selectedOptionId: string;
  isCorrect: boolean;
}

export const LEVEL_LABELS: Record<Level, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
};

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  junior:
    "Fundamentals of JavaScript — variables, types, basic operators, and simple control flow.",
  mid: "Intermediate concepts — closures, async patterns, ES6+ features, and DOM manipulation.",
  senior:
    "Advanced topics — prototypal inheritance, event loop internals, performance, and design patterns.",
};

export const TOPIC_LABELS: Record<Topic, string> = {
  "core-js": "Core JS",
  "functions-closures": "Functions & Closures",
  async: "Async",
  dom: "DOM & Browser APIs",
  "es6+": "ES6+",
  "oop-prototypes": "OOP & Prototypes",
};
