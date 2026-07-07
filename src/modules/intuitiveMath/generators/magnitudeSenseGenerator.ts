import { randomIntInclusive, type RandomNumberGenerator } from "../../../shared/utils/random";
import { magnitudeBucketDistractors, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateMagnitudeSensePrompt(
  session: IntuitiveMathSession,
  random?: RandomNumberGenerator
): IntuitiveMathPrompt {
  const promptCase = buildMagnitudeSenseCase(random);

  return {
    id: `magnitude-sense-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, magnitudeBucketDistractors(promptCase.answer)),
    explanation: promptCase.explanation,
    skillTags: ["magnitudeSense", "optionElimination"],
    trapTags: ["magnitudeError", "decimalShift"],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}

function buildMagnitudeSenseCase(random?: RandomNumberGenerator) {
  const form = randomIntInclusive(0, 2, random);

  if (form === 0) {
    const left = randomIntInclusive(20, 90, random);
    const right = randomIntInclusive(20, 90, random);
    const third = randomIntInclusive(10, 90, random);
    const value = left * right * third;
    return {
      text: `${left} x ${right} x ${third} is closest to which bucket?`,
      answer: bucket(value),
      explanation: "Estimate the product and choose the nearest power-of-10 bucket."
    };
  }

  if (form === 1) {
    const base = randomIntInclusive(20, 95, random);
    const power = randomIntInclusive(2, 3, random);
    return {
      text: `${base}^${power} is closest to 10^?`,
      answer: bucket(base ** power),
      explanation: "Rewrite the base as a one-digit number times a power of 10."
    };
  }

  const left = randomIntInclusive(11, 99, random) / 100;
  const right = randomIntInclusive(2, 9, random) / 1000;
  return {
    text: `${left.toFixed(2)} x ${right.toFixed(3)} is closest to which bucket?`,
    answer: bucket(left * right),
    explanation: "Use a nearby one-digit estimate, then track the decimal powers."
  };
}

function bucket(value: number): string {
  return `10^${Math.round(Math.log10(Math.abs(value)))}`;
}
