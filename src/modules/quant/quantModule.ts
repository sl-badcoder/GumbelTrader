import type { ProblemModule } from "../../core/engine/ProblemModule";
import { scoreResult } from "../../core/engine/Scoring";
import type { ValidationResult } from "../../core/engine/ValidationResult";
import { getQuantQuestion } from "./quantQuestionBank";
import { normalizeQuantSettings } from "./quantSettings";
import type { QuantPrompt, QuantSession, QuantSettings } from "./quantTypes";
import { validateQuantAnswer } from "./validateQuantAnswer";

type QuantModuleConfig = {
  id: string;
  title: string;
  shortDescription: string;
  iconLabel: string;
  modeGroup: "practice" | "test";
  defaultSettings: QuantSettings;
  groupId?: string;
  groupTitle?: string;
  groupDescription?: string;
  groupIcon?: string;
  order?: number;
};

export function createQuantModule(
  config: QuantModuleConfig
): ProblemModule<QuantSettings, QuantSession, QuantPrompt> {
  return {
    ...config,
    createSession: (settings) => ({
      settings: normalizeQuantSettings(settings, config.defaultSettings),
      score: 0,
      attempts: 0,
      correct: 0,
      startedAt: Date.now(),
      missedQuestions: []
    }),
    generatePrompt: (session) => {
      const question = getQuantQuestion(session.settings.category, session.settings.difficulty);
      return {
        ...question,
        expectedAnswer:
          question.category === "probability" && question.answerFraction
            ? `${question.answerFraction.numerator}/${question.answerFraction.denominator}`
            : formatQuantAnswer(question.answer)
      };
    },
    validateAnswer: validateQuantAnswer,
    applyResult: (
      session: QuantSession,
      prompt: QuantPrompt,
      result: ValidationResult
    ) => ({
      ...session,
      score: scoreResult(session.score, result),
      attempts: session.attempts + 1,
      correct: result.isCorrect ? session.correct + 1 : session.correct,
      missedQuestions: result.isCorrect
        ? session.missedQuestions
        : [...session.missedQuestions, prompt]
    })
  };
}

export function formatQuantAnswer(answer: number): string {
  return Number.isInteger(answer) ? String(answer) : answer.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatQuantPromptAnswer(prompt: QuantPrompt): string {
  if (prompt.category === "probability" && prompt.answerFraction) {
    return `${prompt.answerFraction.numerator}/${prompt.answerFraction.denominator}`;
  }

  return formatQuantAnswer(prompt.answer);
}
