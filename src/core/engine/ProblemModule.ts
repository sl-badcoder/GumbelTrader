import type { ValidationResult } from "./ValidationResult";

export type ProblemModuleMetadata = {
  id: string;
  title: string;
  shortDescription: string;
  iconLabel: string;
};

export type ProblemModule<TSettings, TSession, TPrompt> = ProblemModuleMetadata & {
  defaultSettings: TSettings;
  createSession: (settings: TSettings) => TSession;
  generatePrompt: (session: TSession) => TPrompt;
  validateAnswer: (prompt: TPrompt, rawAnswer: string) => ValidationResult;
  applyResult: (
    session: TSession,
    prompt: TPrompt,
    result: ValidationResult
  ) => TSession;
};
