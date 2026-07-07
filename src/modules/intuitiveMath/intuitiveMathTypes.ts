import type { PracticeSession } from "../../core/engine/PracticeSession";

export type QuestionSkillTag =
  | "exactArithmetic"
  | "missingOperand"
  | "decimalPlace"
  | "magnitudeSense"
  | "fractionSimplification"
  | "commonDenominator"
  | "reciprocalDivision"
  | "percentIntuition"
  | "reversePercentage"
  | "percentageChain"
  | "ratioRateUnits"
  | "fermiEstimation"
  | "probabilityExpectedValue"
  | "strategyRecognition"
  | "optionElimination";

export type QuestionTrapTag =
  | "decimalShift"
  | "forgotReciprocal"
  | "wrongInverseOperation"
  | "offByOne"
  | "denominatorMistake"
  | "unsimplifiedEquivalent"
  | "magnitudeError"
  | "additivePercentChain"
  | "baseRateConfusion";

export type IntuitiveMathPrompt = {
  id: string;
  text: string;
  answer: string | number;
  choices?: string[];
  explanation?: string;
  skillTags?: QuestionSkillTag[];
  trapTags?: QuestionTrapTag[];
  acceptsTypedAnswer?: boolean;
};

export type IntuitiveMathSettings = {
  durationSeconds: number | null;
  questionLimit: number | null;
  immediateFeedback: boolean;
  acceptsTypedAnswer: boolean;
  startCountdownSeconds?: number;
};

export type IntuitiveMathSession = PracticeSession & {
  settings: IntuitiveMathSettings;
  promptIndex: number;
  randomSeed: number;
};

export type IntuitiveMathGenerator = (
  session: IntuitiveMathSession
) => IntuitiveMathPrompt;
