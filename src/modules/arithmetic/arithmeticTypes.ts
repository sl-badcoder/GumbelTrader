import type { PracticeSession } from "../../core/engine/PracticeSession";

export type ArithmeticOperator = "addition" | "subtraction" | "multiplication" | "division";

export type ArithmeticOperandRange = {
  leftMin: number;
  leftMax: number;
  rightMin: number;
  rightMax: number;
};

export type ArithmeticSettings = {
  durationSeconds: number;
  enabledOperators: ArithmeticOperator[];
  operandRanges: Record<ArithmeticOperator, ArithmeticOperandRange>;
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
