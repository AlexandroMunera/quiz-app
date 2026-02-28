import { useCallback, useState } from "react";
import type { Level, Question, QuizAnswer, QuizResult, QuizState } from "@/types/quiz";
import { questions as allQuestions } from "@/data/questions";
import { updateItem as updateCoachItem } from "@/hooks/useCoachStore";

const QUESTIONS_PER_QUIZ = 10;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const initialState: QuizState = {
  mode: "standard",
  level: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  isComplete: false,
  hasAnsweredCurrent: false,
};

export function useQuiz() {
  const [state, setState] = useState<QuizState>(initialState);

  const startQuiz = useCallback((level: Level) => {
    const filtered = allQuestions.filter((q) => q.level === level);
    const shuffled = shuffleArray(filtered);
    const selected = shuffled.slice(0, QUESTIONS_PER_QUIZ).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setState({
      mode: "standard",
      level,
      questions: selected,
      currentIndex: 0,
      answers: [],
      isComplete: false,
      hasAnsweredCurrent: false,
    });
  }, []);

  const startCoachMode = useCallback((questions: Question[]) => {
    const prepared = shuffleArray(questions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setState({
      mode: "coach",
      level: null,
      questions: prepared,
      currentIndex: 0,
      answers: [],
      isComplete: false,
      hasAnsweredCurrent: false,
    });
  }, []);

  const selectAnswer = useCallback(
    (questionId: string, selectedOptionId: string) => {
      setState((prev) => {
        if (prev.hasAnsweredCurrent) return prev;

        const answer: QuizAnswer = { questionId, selectedOptionId };
        return {
          ...prev,
          answers: [...prev.answers, answer],
          hasAnsweredCurrent: true,
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        // Quiz is complete — update coach store
        for (const answer of prev.answers) {
          const question = prev.questions.find(
            (q) => q.id === answer.questionId
          );
          if (!question) continue;
          const isCorrect =
            question.correctOptionId === answer.selectedOptionId;
          // Update coach store: incorrect in any mode, correct only in coach mode
          if (!isCorrect || prev.mode === "coach") {
            updateCoachItem(question.id, isCorrect, prev.mode === "coach");
          }
        }
        return { ...prev, isComplete: true };
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        hasAnsweredCurrent: false,
      };
    });
  }, []);

  const getResults = useCallback((): QuizResult[] => {
    return state.questions.map((question) => {
      const answer = state.answers.find(
        (a) => a.questionId === question.id
      );
      return {
        question,
        selectedOptionId: answer?.selectedOptionId ?? "",
        isCorrect: answer?.selectedOptionId === question.correctOptionId,
      };
    });
  }, [state.questions, state.answers]);

  const getScore = useCallback((): number => {
    return state.answers.filter((answer) => {
      const question = state.questions.find(
        (q) => q.id === answer.questionId
      );
      return question?.correctOptionId === answer.selectedOptionId;
    }).length;
  }, [state.questions, state.answers]);

  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);

  const currentQuestion =
    state.questions.length > 0
      ? state.questions[state.currentIndex]
      : null;

  const currentAnswer = currentQuestion
    ? state.answers.find((a) => a.questionId === currentQuestion.id)
    : null;

  return {
    state,
    currentQuestion,
    currentAnswer,
    startQuiz,
    startCoachMode,
    selectAnswer,
    nextQuestion,
    getResults,
    getScore,
    resetQuiz,
  };
}
