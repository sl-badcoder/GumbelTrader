import type { PracticeSession } from "../../core/engine/PracticeSession";

export type ArithmeticOperator = "addition" | "subtraction" | "multiplication" | "division";

export type ArithmeticSettings = {
  durationSeconds: number;
  enabledOperators: ArithmeticOperator[];
  minNumber: number;
  maxNumber: number;
};

export type ArithmeticSession = PracticeSession & {
  settings: ArithmeticSettings;
};

export type ArithmeticPrompt = {
  left: number;
  right: number;
  operator: ArithmeticOperator;
  text: string;
  answer: number;
};
