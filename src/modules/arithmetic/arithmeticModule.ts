import type { ProblemModule } from "../../core/engine/ProblemModule";
import { scoreResult } from "../../core/engine/Scoring";
import type { ValidationResult } from "../../core/engine/ValidationResult";
import { defaultArithmeticSettings, normalizeArithmeticSettings } from "./arithmeticSettings";
import { generateArithmeticPrompt } from "./generateArithmeticPrompt";
import type {
  ArithmeticPrompt,
  ArithmeticSession,
  ArithmeticSettings
} from "./arithmeticTypes";
import { validateArithmeticAnswer } from "./validateArithmeticAnswer";

export const arithmeticModule: ProblemModule<
  ArithmeticSettings,
  ArithmeticSession,
  ArithmeticPrompt
> = {
  id: "arithmetic",
  title: "Arithmetic Practice",
  shortDescription: "Quick arithmetic drills with configurable operators and number ranges.",
  iconLabel: "+-x/",
  defaultSettings: defaultArithmeticSettings,
  createSession: (settings) => ({
    settings: normalizeArithmeticSettings(settings),
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
