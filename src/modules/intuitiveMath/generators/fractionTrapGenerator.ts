import { randomIntInclusive, type RandomNumberGenerator } from "../../../shared/utils/random";
import { uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateFractionTrapPrompt(
  session: IntuitiveMathSession,
  random?: RandomNumberGenerator
): IntuitiveMathPrompt {
  const promptCase = buildFractionTrapCase(random);

  return {
    id: `fraction-trap-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, promptCase.distractors),
    explanation: promptCase.explanation,
    skillTags: ["fractionSimplification", "commonDenominator", "reciprocalDivision"],
    trapTags: ["forgotReciprocal", "denominatorMistake", "unsimplifiedEquivalent"],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}

function buildFractionTrapCase(random?: RandomNumberGenerator) {
  const form = randomIntInclusive(0, 3, random);

  if (form === 0) {
    const denominator = randomIntInclusive(5, 16, random);
    const left = randomIntInclusive(1, denominator - 2, random);
    const right = randomIntInclusive(1, denominator - left - 1, random);
    const answer = reduceFraction(left + right, denominator);
    return {
      text: `${left}/${denominator} + ${right}/${denominator}`,
      answer,
      distractors: [`${left + right}/${denominator * 2}`, `${Math.abs(left - right)}/${denominator}`, `${left + right}/${denominator + denominator}`],
      explanation: "With the same denominator, add numerators and keep the denominator."
    };
  }

  if (form === 1) {
    const denominator = randomIntInclusive(4, 12, random);
    const scale = randomIntInclusive(2, 4, random);
    const leftNumerator = randomIntInclusive(2, denominator - 1, random);
    const rightNumerator = randomIntInclusive(1, leftNumerator * scale - 1, random);
    const commonDenominator = denominator * scale;
    const answer = reduceFraction(leftNumerator * scale - rightNumerator, commonDenominator);
    return {
      text: `${leftNumerator}/${denominator} - ${rightNumerator}/${commonDenominator}`,
      answer,
      distractors: [`${leftNumerator - rightNumerator}/${commonDenominator}`, `${leftNumerator * scale}/${commonDenominator}`, `${rightNumerator}/${commonDenominator}`],
      explanation: "Convert to a common denominator before subtracting."
    };
  }

  if (form === 2) {
    const a = randomIntInclusive(2, 8, random);
    const b = randomIntInclusive(a + 1, 12, random);
    const c = randomIntInclusive(2, 8, random);
    const d = randomIntInclusive(c + 1, 12, random);
    const answer = reduceFraction(a * d, b * c);
    return {
      text: `${a}/${b} / ${c}/${d}`,
      answer,
      distractors: [reduceFraction(a * c, b * d), reduceFraction(b * c, a * d), reduceFraction(a * d, b * d)],
      explanation: "Dividing by a fraction means multiplying by its reciprocal."
    };
  }

  const multiplierNumerator = randomIntInclusive(2, 6, random);
  const multiplierDenominator = randomIntInclusive(multiplierNumerator + 1, 10, random);
  const answerNumerator = randomIntInclusive(2, 8, random);
  const answerDenominator = randomIntInclusive(answerNumerator + 1, 12, random);
  const product = reduceFraction(answerNumerator * multiplierNumerator, answerDenominator * multiplierDenominator);
  const answer = reduceFraction(answerNumerator, answerDenominator);
  return {
    text: `? x ${multiplierNumerator}/${multiplierDenominator} = ${product}`,
    answer,
    distractors: [
      reduceFraction(answerNumerator * multiplierNumerator, answerDenominator * multiplierDenominator),
      reduceFraction(answerNumerator * multiplierDenominator, answerDenominator * multiplierNumerator),
      reduceFraction(answerNumerator, answerDenominator * multiplierDenominator)
    ],
    explanation: "Divide by the known fraction, which means multiplying by its reciprocal."
  };
}

function reduceFraction(numerator: number, denominator: number): string {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return `${numerator / divisor}/${denominator / divisor}`;
}

function gcd(left: number, right: number): number {
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}
