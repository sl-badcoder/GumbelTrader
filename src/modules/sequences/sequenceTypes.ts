import type { PracticeSession } from "../../core/engine/PracticeSession";

export type SequenceDifficulty = "easy" | "medium" | "hard";

export type SequenceSettings = {
  durationSeconds: number;
  difficulty: SequenceDifficulty;
};

export type SequenceSession = PracticeSession & {
  settings: SequenceSettings;
};

export type SequencePrompt = {
  values: [number, number, number, number, number];
  answer: number;
  text: string;
  patternId: string;
  difficulty: SequenceDifficulty;
};

export type GeneratedSequence = {
  values: [number, number, number, number, number, number];
  patternId: string;
  difficulty: SequenceDifficulty;
};
