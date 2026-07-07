import type { ValidationResult } from "../../core/engine/ValidationResult";
import type { QuantPrompt } from "./quantTypes";

export function validateQuantAnswer(prompt: QuantPrompt, rawAnswer: string): ValidationResult {
  const trimmedAnswer = rawAnswer.trim();

  if (prompt.category === "probability") {
    return validateProbabilityFraction(prompt, trimmedAnswer);
  }

  const parsedAnswer = Number(trimmedAnswer);

  if (trimmedAnswer.length === 0 || Number.isNaN(parsedAnswer)) {
    return {
      isCorrect: false,
      expectedAnswer: prompt.expectedAnswer,
      message: "Enter a number."
    };
  }

  const isCorrect = parsedAnswer === prompt.answer;

  return {
    isCorrect,
    expectedAnswer: prompt.expectedAnswer,
    message: isCorrect ? "Correct" : `Expected ${prompt.expectedAnswer}`
  };
}

function validateProbabilityFraction(prompt: QuantPrompt, trimmedAnswer: string): ValidationResult {
  const expectedFraction = prompt.answerFraction;
  if (!expectedFraction) {
    return {
      isCorrect: false,
      expectedAnswer: prompt.expectedAnswer,
      message: "Enter a reduced fraction like 3/8."
    };
  }

  const parsedFraction = parseFraction(trimmedAnswer);
  if (!parsedFraction) {
    return {
      isCorrect: false,
      expectedAnswer: prompt.expectedAnswer,
      message: "Enter a reduced fraction like 3/8."
    };
  }

  const reduced = reduceFraction(parsedFraction.numerator, parsedFraction.denominator);
  const isEquivalent =
    reduced.numerator === expectedFraction.numerator &&
    reduced.denominator === expectedFraction.denominator;
  const isReduced =
    parsedFraction.numerator === reduced.numerator &&
    parsedFraction.denominator === reduced.denominator;
  const isCorrect = isEquivalent && isReduced;

  return {
    isCorrect,
    expectedAnswer: prompt.expectedAnswer,
    message: isCorrect
      ? "Correct"
      : isEquivalent
        ? `Reduce the fraction to ${prompt.expectedAnswer}`
        : `Expected ${prompt.expectedAnswer}`
  };
}

function parseFraction(value: string): { numerator: number; denominator: number } | null {
  const match = value.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (!match) {
    return null;
  }

  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator <= 0) {
    return null;
  }

  return { numerator, denominator };
}

function reduceFraction(numerator: number, denominator: number) {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

function gcd(left: number, right: number): number {
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}
