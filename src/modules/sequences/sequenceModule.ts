import type { ProblemModule } from "../../core/engine/ProblemModule";
import { scoreResult } from "../../core/engine/Scoring";
import type { ValidationResult } from "../../core/engine/ValidationResult";
import { generateSequencePrompt } from "./generateSequencePrompt";
import { defaultSequenceSettings, normalizeSequenceSettings } from "./sequenceSettings";
import type {
  SequencePrompt,
  SequenceSession,
  SequenceSettings
} from "./sequenceTypes";
import { validateSequenceAnswer } from "./validateSequenceAnswer";

export const sequenceModule: ProblemModule<
  SequenceSettings,
  SequenceSession,
  SequencePrompt
> = {
  id: "sequences",
  title: "Sequence Practice",
  shortDescription: "Find the next number in arithmetic, geometric, and mixed sequences.",
  iconLabel: "1,2,?",
  modeGroup: "practice",
  defaultSettings: defaultSequenceSettings,
  createSession: (settings) => ({
    settings: normalizeSequenceSettings(settings),
    score: 0,
    attempts: 0,
    correct: 0,
    startedAt: Date.now()
  }),
  generatePrompt: generateSequencePrompt,
  validateAnswer: validateSequenceAnswer,
  applyResult: (
    session: SequenceSession,
    _prompt: SequencePrompt,
    result: ValidationResult
  ) => ({
    ...session,
    score: scoreResult(session.score, result),
    attempts: session.attempts + 1,
    correct: result.isCorrect ? session.correct + 1 : session.correct
  })
};
