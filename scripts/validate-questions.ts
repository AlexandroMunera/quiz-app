import { questions } from "../src/data/questions";

type ValidationIssue = {
  level: "error" | "warning";
  message: string;
};

function validateQuestions() {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const optionIds = new Set<string>();

  for (const question of questions) {
    if (ids.has(question.id)) {
      issues.push({
        level: "error",
        message: `Duplicate question id: ${question.id}`,
      });
    }
    ids.add(question.id);

    if (question.options.length !== 4) {
      issues.push({
        level: "error",
        message: `Question ${question.id} has ${question.options.length} options (expected 4).`,
      });
    }

    const hasCorrectOption = question.options.some(
      (option: { id: string }) => option.id === question.correctOptionId
    );

    if (!hasCorrectOption) {
      issues.push({
        level: "error",
        message: `Question ${question.id} has invalid correctOptionId: ${question.correctOptionId}`,
      });
    }

    for (const option of question.options) {
      if (optionIds.has(option.id)) {
        issues.push({
          level: "error",
          message: `Duplicate option id: ${option.id}`,
        });
      }
      optionIds.add(option.id);

      if (!option.id.startsWith(question.id)) {
        issues.push({
          level: "warning",
          message: `Option id ${option.id} does not start with question id ${question.id}`,
        });
      }
    }
  }

  const countsByCategoryLevel = new Map<string, number>();
  for (const question of questions) {
    const key = `${question.category}:${question.level}`;
    countsByCategoryLevel.set(key, (countsByCategoryLevel.get(key) ?? 0) + 1);
  }

  for (const [key, count] of countsByCategoryLevel.entries()) {
    if (count !== 10) {
      issues.push({
        level: "error",
        message: `Expected 10 questions for ${key}, found ${count}.`,
      });
    }
  }

  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");

  if (warnings.length > 0) {
    console.warn("Question validation warnings:");
    for (const warning of warnings) {
      console.warn(`  - ${warning.message}`);
    }
  }

  if (errors.length > 0) {
    console.error("Question validation failed:");
    for (const error of errors) {
      console.error(`  - ${error.message}`);
    }
    process.exit(1);
  }

  console.log(
    `Question validation passed: ${questions.length} questions, ${ids.size} unique IDs, ${optionIds.size} unique option IDs.`
  );
}

validateQuestions();
