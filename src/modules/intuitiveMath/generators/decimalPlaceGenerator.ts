import { randomIntInclusive } from "../../../shared/utils/random";
import { decimalShiftDistractors, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { formatNumber } from "../numberFormatting";

export function generateDecimalPlacePrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const promptCase = buildDecimalPlaceCase();
  const answer = formatNumber(promptCase.answer);

  return {
    id: `decimal-place-${session.promptIndex}`,
    text: promptCase.text,
    answer,
    choices: uniqueChoices(answer, decimalShiftDistractors(promptCase.answer)),
    explanation: promptCase.explanation,
    skillTags: ["decimalPlace", "magnitudeSense", "optionElimination"],
    trapTags: ["decimalShift", "magnitudeError"],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}

function buildDecimalPlaceCase() {
  const form = randomIntInclusive(0, 3);

  if (form === 0) {
    const left = randomIntInclusive(12, 98) / 100;
    const right = randomIntInclusive(2, 9) / 1000;
    const answer = left * right;
    return {
      text: `${formatNumber(left)} x ${formatNumber(right)}`,
      answer,
      explanation: "Multiply the whole-number parts first, then place the combined decimal digits."
    };
  }

  if (form === 1) {
    const left = randomIntInclusive(35, 99) / 100;
    const right = randomIntInclusive(11, Math.floor(left * 100) - 1) / 1000;
    const answer = left - right;
    return {
      text: `${formatNumber(left)} - ${formatNumber(right)}`,
      answer,
      explanation: "Align decimal points before subtracting."
    };
  }

  if (form === 2) {
    const divisor = randomIntInclusive(2, 9) / 100;
    const quotient = randomIntInclusive(4, 18);
    const dividend = divisor * quotient;
    return {
      text: `${formatNumber(dividend)} / ${formatNumber(divisor)}`,
      answer: quotient,
      explanation: "Scale both numbers by the same power of 10, then divide."
    };
  }

  const left = randomIntInclusive(12, 99) / 10;
  const right = randomIntInclusive(2, 9) / 100;
  return {
    text: `${formatNumber(left)} x ${formatNumber(right)}`,
    answer: left * right,
    explanation: "Estimate the size first, then place the decimal point in the exact product."
  };
}
