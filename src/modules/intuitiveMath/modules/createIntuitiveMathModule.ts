import type { ProblemModule } from "../../../core/engine/ProblemModule";
import { scoreResult } from "../../../core/engine/Scoring";
import type { ValidationResult } from "../../../core/engine/ValidationResult";
import type {
  IntuitiveMathGenerator,
  IntuitiveMathPrompt,
  IntuitiveMathSession,
  IntuitiveMathSettings
} from "../intuitiveMathTypes";
import { validateIntuitiveMathAnswer } from "../validateIntuitiveMathAnswer";

type CreateIntuitiveMathModuleOptions = {
  id: string;
  title: string;
  shortDescription: string;
  iconLabel: string;
  modeGroup: "practice" | "test";
  defaultSettings: IntuitiveMathSettings;
  generator: IntuitiveMathGenerator;
  groupId?: string;
  groupTitle?: string;
  groupDescription?: string;
  groupIcon?: string;
  order?: number;
};

export function createIntuitiveMathModule({
  id,
  title,
  shortDescription,
  iconLabel,
  modeGroup,
  defaultSettings,
  generator,
  groupId,
  groupTitle,
  groupDescription,
  groupIcon,
  order
}: CreateIntuitiveMathModuleOptions): ProblemModule<
  IntuitiveMathSettings,
  IntuitiveMathSession,
  IntuitiveMathPrompt
> {
  return {
    id,
    title,
    shortDescription,
    iconLabel,
    modeGroup,
    groupId,
    groupTitle,
    groupDescription,
    groupIcon,
    order,
    defaultSettings,
    createSession: (settings) => ({
      settings,
      score: 0,
      attempts: 0,
      correct: 0,
      promptIndex: 0,
      randomSeed: Math.floor(Math.random() * 2 ** 32),
      startedAt: Date.now()
    }),
    generatePrompt: generator,
    validateAnswer: validateIntuitiveMathAnswer,
    applyResult: (
      session: IntuitiveMathSession,
      _prompt: IntuitiveMathPrompt,
      result: ValidationResult
    ) => ({
      ...session,
      score: scoreResult(session.score, result),
      attempts: session.attempts + 1,
      correct: result.isCorrect ? session.correct + 1 : session.correct,
      promptIndex: session.promptIndex + 1
    })
  };
}

export const defaultChoicePracticeSettings: IntuitiveMathSettings = {
  durationSeconds: null,
  questionLimit: null,
  immediateFeedback: true,
  acceptsTypedAnswer: false
};

export const typedHardcoreSettings: IntuitiveMathSettings = {
  durationSeconds: null,
  questionLimit: null,
  immediateFeedback: true,
  acceptsTypedAnswer: true
};

export const eightyInEightMcSettings: IntuitiveMathSettings = {
  durationSeconds: 480,
  questionLimit: 80,
  immediateFeedback: false,
  acceptsTypedAnswer: false,
  startCountdownSeconds: 5
};
