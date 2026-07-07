import { createSeededRandom, mixSeed, randomIntInclusive, type RandomNumberGenerator } from "../../../shared/utils/random";
import { offByDistractors, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { formatNumber } from "../numberFormatting";
import { generateDecimalPlacePrompt } from "./decimalPlaceGenerator";
import { generateFractionTrapPrompt } from "./fractionTrapGenerator";
import { generateMissingOperandPrompt } from "./missingOperandGenerator";

export function generateEightyInEightMcPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const random = createSeededRandom(mixSeed(session.randomSeed, session.promptIndex));
  const generators = [
    () => generateIntegerArithmeticPrompt(session, random),
    generateMissingOperandPrompt,
    generateDecimalPlacePrompt,
    generateFractionTrapPrompt
  ];
  const generator = generators[randomIntInclusive(0, generators.length - 1, random)] ?? generators[0]!;
  const prompt = generator(session, random);

  return {
    ...prompt,
    id: `eighty-in-eight-mc-${session.promptIndex}`,
    acceptsTypedAnswer: false
  };
}

function generateIntegerArithmeticPrompt(
  session: IntuitiveMathSession,
  random: RandomNumberGenerator
): IntuitiveMathPrompt {
  const form = randomIntInclusive(0, 2, random);
  const left = randomIntInclusive(12, 99, random);
  const right = randomIntInclusive(3, 12, random);
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
