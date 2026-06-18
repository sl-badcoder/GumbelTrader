import type { ValidationResult } from "../../core/engine/ValidationResult";
import type { SequencePrompt } from "./sequenceTypes";

export function validateSequenceAnswer(
  prompt: SequencePrompt,
  rawAnswer: string
): ValidationResult {
  const trimmedAnswer = rawAnswer.trim();
  const parsedAnswer = Number(trimmedAnswer);
  const expectedAnswer = String(prompt.answer);

  if (trimmedAnswer.length === 0 || Number.isNaN(parsedAnswer)) {
    return {
      isCorrect: false,
      expectedAnswer,
      message: "Enter a number."
    };
  }

  return {
    isCorrect: parsedAnswer === prompt.answer,
    expectedAnswer,
    message: parsedAnswer === prompt.answer ? "Correct" : `Expected ${expectedAnswer}`
  };
}
