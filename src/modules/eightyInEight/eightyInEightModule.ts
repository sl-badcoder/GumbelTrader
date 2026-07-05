import type { ProblemModule } from "../../core/engine/ProblemModule";
import { scoreResult } from "../../core/engine/Scoring";
import type { ValidationResult } from "../../core/engine/ValidationResult";
import {
  defaultArithmeticSettings,
  normalizeArithmeticSettings
} from "../arithmetic/arithmeticSettings";
import type {
  ArithmeticPrompt,
  ArithmeticSession,
  ArithmeticSettings
} from "../arithmetic/arithmeticTypes";
import { generateArithmeticPrompt } from "../arithmetic/generateArithmeticPrompt";
import { validateArithmeticAnswer } from "../arithmetic/validateArithmeticAnswer";

export const eightyInEightQuestionCount = 80;
export const eightyInEightDurationSeconds = 480;

export const eightyInEightSettings: ArithmeticSettings = normalizeArithmeticSettings({
  ...defaultArithmeticSettings,
  durationSeconds: eightyInEightDurationSeconds
});

export const eightyInEightModule: ProblemModule<
  ArithmeticSettings,
  ArithmeticSession,
  ArithmeticPrompt
> = {
  id: "eighty-in-eight",
  title: "80 in 8 Mode",
  shortDescription: "Optiver-style arithmetic sprint: 80 questions in 8 minutes.",
  iconLabel: "80/8",
  modeGroup: "test",
  defaultSettings: eightyInEightSettings,
  createSession: () => ({
    settings: eightyInEightSettings,
    score: 0,
    attempts: 0,
    correct: 0,
    startedAt: Date.now()
  }),
  generatePrompt: generateArithmeticPrompt,
  validateAnswer: validateArithmeticAnswer,
  applyResult: (
    session: ArithmeticSession,
    _prompt: ArithmeticPrompt,
    result: ValidationResult
  ) => ({
    ...session,
    score: scoreResult(session.score, result),
    attempts: session.attempts + 1,
    correct: result.isCorrect ? session.correct + 1 : session.correct
  })
};
