import type { ValidationResult } from "../../core/engine/ValidationResult";
import type { IntuitiveMathPrompt } from "./intuitiveMathTypes";
import { parseFractionAnswer } from "./numberFormatting";

export function validateIntuitiveMathAnswer(
  prompt: IntuitiveMathPrompt,
  rawAnswer: string
): ValidationResult {
  const trimmedAnswer = rawAnswer.trim();
  const expectedAnswer = String(prompt.answer);

  if (trimmedAnswer.length === 0) {
    return {
      isCorrect: false,
      expectedAnswer,
      message: "Choose or enter an answer."
    };
  }

  if (prompt.choices) {
    const isCorrect = trimmedAnswer === expectedAnswer;
    return {
      isCorrect,
      expectedAnswer,
      message: isCorrect ? "Correct" : `Expected ${expectedAnswer}`
    };
  }

  const numericAnswer = Number(trimmedAnswer);
  const numericExpected = Number(expectedAnswer);

  if (!Number.isNaN(numericAnswer) && !Number.isNaN(numericExpected)) {
    const tolerance = Number.isInteger(numericExpected) ? 0 : 0.000001;
    const isCorrect = Math.abs(numericAnswer - numericExpected) <= tolerance;
    return {
      isCorrect,
      expectedAnswer,
      message: isCorrect ? "Correct" : `Expected ${expectedAnswer}`
    };
  }

  const fractionAnswer = parseFractionAnswer(trimmedAnswer);
  const expectedFraction = parseFractionAnswer(expectedAnswer);

  if (fractionAnswer && expectedFraction) {
    const isCorrect =
      fractionAnswer.numerator * expectedFraction.denominator ===
      expectedFraction.numerator * fractionAnswer.denominator;
    return {
      isCorrect,
      expectedAnswer,
      message: isCorrect ? "Correct" : `Expected ${expectedAnswer}`
    };
  }

  const isCorrect = trimmedAnswer === expectedAnswer;
  return {
    isCorrect,
    expectedAnswer,
    message: isCorrect ? "Correct" : `Expected ${expectedAnswer}`
  };
}
