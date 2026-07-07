import { randomIntInclusive } from "../../../shared/utils/random";
import { offByDistractors, pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { formatNumber } from "../numberFormatting";
import { generateDecimalPlacePrompt } from "./decimalPlaceGenerator";
import { generateFractionTrapPrompt } from "./fractionTrapGenerator";
import { generateMagnitudeSensePrompt } from "./magnitudeSenseGenerator";
import { generateMissingOperandPrompt } from "./missingOperandGenerator";
import { generatePercentIntuitionPrompt } from "./percentIntuitionGenerator";

export function generateEightyInEightMcPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const generators = [
    () => generateIntegerArithmeticPrompt(session),
    generateMissingOperandPrompt,
    generateDecimalPlacePrompt,
    generateFractionTrapPrompt,
    generateMagnitudeSensePrompt,
    generatePercentIntuitionPrompt
  ];
  const prompt = pickCyclic(generators, session.promptIndex)(session);

  return {
    ...prompt,
    id: `eighty-in-eight-mc-${session.promptIndex}`,
    acceptsTypedAnswer: false
  };
}

function generateIntegerArithmeticPrompt(session: IntuitiveMathSession): IntuitiveMathPrompt {
  const form = randomIntInclusive(0, 2);
  const left = randomIntInclusive(12, 99);
  const right = randomIntInclusive(3, 12);
  const answer = form === 0 ? left * right : form === 1 ? left + right : left - right;
  const symbol = form === 0 ? "x" : form === 1 ? "+" : "-";
  const formattedAnswer = formatNumber(answer);

  return {
    id: `eighty-mc-arithmetic-${session.promptIndex}`,
    text: `${left} ${symbol} ${right}`,
    answer: formattedAnswer,
    choices: uniqueChoices(formattedAnswer, [
      ...offByDistractors(answer),
      formatNumber(form === 0 ? (left + right) * right : answer + 10)
    ]),
    explanation: `Compute ${left} ${symbol} ${right} exactly.`,
    skillTags: ["exactArithmetic", "optionElimination"],
    trapTags: ["offByOne"],
    acceptsTypedAnswer: false
  };
}
