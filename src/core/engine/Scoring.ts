import type { ValidationResult } from "./ValidationResult";

export function scoreResult(currentScore: number, result: ValidationResult): number {
  return result.isCorrect ? currentScore + 1 : currentScore;
}
