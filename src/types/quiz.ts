import {
  siCss,
  siDocker,
  siHtml5,
  siJavascript,
  siReact,
  siTypescript,
} from "simple-icons";

export type Level = "junior" | "mid" | "senior";

export type QuizMode = "standard" | "coach";

export type Category =
  | "javascript"
  | "devops"
  | "web-fundamentals"
  | "css"
  | "typescript"
  | "react";

export type Topic =
  | "core-js"
  | "functions-closures"
  | "async"
  | "dom"
  | "es6+"
  | "oop-prototypes"
  | "ci-cd"
  | "docker"
  | "kubernetes"
  | "infrastructure"
  | "apis"
  | "networking-monitoring"
  | "http"
  | "dns-hosting"
  | "security"
  | "browser"
  | "performance"
  | "selectors-specificity"
  | "layout-flexbox"
  | "layout-grid"
  | "responsive"
  | "animations"
  | "variables-modern"
  | "basic-types"
  | "generics"
  | "utility-types"
  | "type-narrowing"
  | "interfaces-vs-types"
  | "advanced-patterns"
  | "hooks"
  | "state-management"
  | "rendering"
  | "patterns"
  | "effects-lifecycle"
  | "react-performance";

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  category: Category;
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
  category: Category | null;
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

export const CATEGORY_LABELS: Record<Category, string> = {
  javascript: "JavaScript",
  devops: "DevOps",
  "web-fundamentals": "Web Fundamentals",
  css: "CSS",
  typescript: "TypeScript",
  react: "React",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  javascript: "Core language fundamentals, browser APIs, and advanced JavaScript behavior.",
  devops: "Delivery pipelines, containers, cloud-native operations, and production practices.",
  "web-fundamentals": "HTTP, APIs, DNS, browser behavior, and modern web architecture basics.",
  css: "Selectors, layout systems, responsive UI, and modern styling techniques.",
  typescript: "Type systems, generics, narrowing, and advanced type-safe patterns.",
  react: "Hooks, rendering, effects, component design, and UI performance practices.",
};

export const CATEGORY_ICONS = {
  javascript: siJavascript,
  devops: siDocker,
  "web-fundamentals": siHtml5,
  css: siCss,
  typescript: siTypescript,
  react: siReact,
} as const satisfies Record<Category, { path: string; hex: string }>;

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  junior: "Foundational concepts, common terms, and practical basics.",
  mid: "Intermediate patterns, workflows, and troubleshooting scenarios.",
  senior: "Advanced internals, tradeoffs, and production edge cases.",
};

export const TOPIC_LABELS: Record<Topic, string> = {
  "core-js": "Core JS",
  "functions-closures": "Functions & Closures",
  async: "Async",
  dom: "DOM & Browser APIs",
  "es6+": "ES6+",
  "oop-prototypes": "OOP & Prototypes",
  "ci-cd": "CI/CD",
  docker: "Docker",
  kubernetes: "Kubernetes",
  infrastructure: "Infrastructure",
  apis: "APIs",
  "networking-monitoring": "Networking & Monitoring",
  http: "HTTP",
  "dns-hosting": "DNS & Hosting",
  security: "Web Security",
  browser: "Browser",
  performance: "Performance",
  "selectors-specificity": "Selectors & Specificity",
  "layout-flexbox": "Flexbox",
  "layout-grid": "Grid",
  responsive: "Responsive Design",
  animations: "Animations",
  "variables-modern": "CSS Variables",
  "basic-types": "Basic Types",
  generics: "Generics",
  "utility-types": "Utility Types",
  "type-narrowing": "Type Narrowing",
  "interfaces-vs-types": "Interfaces vs Types",
  "advanced-patterns": "Advanced Patterns",
  hooks: "Hooks",
  "state-management": "State Management",
  rendering: "Rendering",
  patterns: "Component Patterns",
  "effects-lifecycle": "Effects & Lifecycle",
  "react-performance": "React Performance",
};
