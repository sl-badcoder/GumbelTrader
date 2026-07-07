import type { PracticeSession } from "../../core/engine/PracticeSession";

export type QuantDifficulty = "easy" | "medium" | "hard" | "mixed";

export type QuantCategory = "probability" | "combinatorics" | "mixed";

export type QuantSettings = {
  questionCount: number;
  durationSeconds: number;
  timerEnabled: boolean;
  difficulty: QuantDifficulty;
  category: QuantCategory;
  showExplanationAfterAnswer: boolean;
  showExplanationsAtEnd: boolean;
  autoAdvanceOnCorrectAnswer: boolean;
  reviewMissedAfterGame: boolean;
};

export type QuantQuestion = {
  id: string;
  category: Exclude<QuantCategory, "mixed">;
  difficulty: Exclude<QuantDifficulty, "mixed">;
  tags: string[];
  text: string;
  answer: number;
  answerFraction?: {
    numerator: number;
    denominator: number;
  };
  explanation: string;
};

export type QuantPrompt = QuantQuestion & {
  expectedAnswer: string;
};

export type QuantSession = PracticeSession & {
  settings: QuantSettings;
  missedQuestions: QuantPrompt[];
};
