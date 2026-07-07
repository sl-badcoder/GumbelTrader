import { randomIntInclusive } from "../../../shared/utils/random";
import { magnitudeBucketDistractors, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateMagnitudeSensePrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const promptCase = buildMagnitudeSenseCase();

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

function buildMagnitudeSenseCase() {
  const form = randomIntInclusive(0, 2);

  if (form === 0) {
    const left = randomIntInclusive(20, 90);
    const right = randomIntInclusive(20, 90);
    const third = randomIntInclusive(10, 90);
    const value = left * right * third;
    return {
      text: `${left} x ${right} x ${third} is closest to which bucket?`,
      answer: bucket(value),
      explanation: "Estimate the product and choose the nearest power-of-10 bucket."
    };
  }

  if (form === 1) {
    const base = randomIntInclusive(20, 95);
    const power = randomIntInclusive(2, 3);
    return {
      text: `${base}^${power} is closest to 10^?`,
      answer: bucket(base ** power),
      explanation: "Rewrite the base as a one-digit number times a power of 10."
    };
  }

  const left = randomIntInclusive(11, 99) / 100;
  const right = randomIntInclusive(2, 9) / 1000;
  return {
    text: `${left.toFixed(2)} x ${right.toFixed(3)} is closest to which bucket?`,
    answer: bucket(left * right),
    explanation: "Use a nearby one-digit estimate, then track the decimal powers."
  };
}

function bucket(value: number): string {
  return `10^${Math.round(Math.log10(Math.abs(value)))}`;
}
