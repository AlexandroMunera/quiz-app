import { useCallback, useState } from "react";
import type { Level, QuizAnswer, QuizResult, QuizState } from "@/types/quiz";
import { questions as allQuestions } from "@/data/questions";

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
    const selected = shuffled.slice(0, QUESTIONS_PER_QUIZ);

    setState({
      level,
      questions: selected,
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
    selectAnswer,
    nextQuestion,
    getResults,
    getScore,
    resetQuiz,
  };
}
