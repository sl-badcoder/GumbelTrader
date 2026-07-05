import type { ValidationResult } from "../../core/engine/ValidationResult";
import type { QuantPrompt } from "./quantTypes";

export function validateQuantAnswer(prompt: QuantPrompt, rawAnswer: string): ValidationResult {
  const trimmedAnswer = rawAnswer.trim();
  const parsedAnswer = Number(trimmedAnswer);

  if (trimmedAnswer.length === 0 || Number.isNaN(parsedAnswer)) {
    return {
      isCorrect: false,
      expectedAnswer: prompt.expectedAnswer,
      message: "Enter a number."
    };
  }

  const tolerance = Math.abs(prompt.answer) < 1 ? 0.0001 : 0;
  const isCorrect = Math.abs(parsedAnswer - prompt.answer) <= tolerance;

  return {
    isCorrect,
    expectedAnswer: prompt.expectedAnswer,
    message: isCorrect ? "Correct" : `Expected ${prompt.expectedAnswer}`
  };
}
