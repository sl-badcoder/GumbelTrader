import { randomIntInclusive } from "../../../shared/utils/random";
import { uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { formatNumber, formatPercent } from "../numberFormatting";

export function generatePercentIntuitionPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const promptCase = buildPercentIntuitionCase();

  return {
    id: `percent-intuition-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, promptCase.distractors),
    explanation: promptCase.explanation,
    skillTags: [...promptCase.skills, "optionElimination"],
    trapTags: [...promptCase.traps],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}

function buildPercentIntuitionCase() {
  const form = randomIntInclusive(0, 3);
  const commonPercents = [
    { percent: 12.5, denominator: 8 },
    { percent: 20, denominator: 5 },
    { percent: 25, denominator: 4 },
    { percent: 37.5, denominator: 8, numerator: 3 },
    { percent: 50, denominator: 2 },
    { percent: 75, denominator: 4, numerator: 3 }
  ];
  const item = commonPercents[randomIntInclusive(0, commonPercents.length - 1)] ?? commonPercents[0]!;
  const numerator = item.numerator ?? 1;

  if (form === 0) {
    const value = item.denominator * randomIntInclusive(6, 30);
    const answer = (value / item.denominator) * numerator;
    return {
      text: `${item.percent}% of ${value}`,
      answer: formatNumber(answer),
      distractors: [formatNumber(value / item.denominator), formatNumber(value - answer), formatNumber(answer + item.denominator)],
      explanation: `${item.percent}% can be treated as ${numerator}/${item.denominator}.`,
      skills: ["percentIntuition"] as const,
      traps: ["baseRateConfusion"] as const
    };
  }

  if (form === 1) {
    const original = item.denominator * randomIntInclusive(8, 28);
    const finalValue = (original / item.denominator) * numerator;
    return {
      text: `${formatNumber(finalValue)} is ${item.percent}% of what?`,
      answer: formatNumber(original),
      distractors: [formatNumber(finalValue * item.denominator), formatNumber(finalValue / item.denominator), formatNumber(original - finalValue)],
      explanation: `Divide by ${item.percent}% to recover the original value.`,
      skills: ["reversePercentage"] as const,
      traps: ["wrongInverseOperation"] as const
    };
  }

  if (form === 2) {
    const change = [10, 20, 25, 50][randomIntInclusive(0, 3)] ?? 20;
    const answer = solvePercentChain(100, [change, -change]);
    return {
      text: `After +${change}% and then -${change}%, what percentage of the original remains?`,
      answer,
      distractors: ["100%", `${100 - change}%`, `${100 + change}%`],
      explanation: `The changes compound: ${(1 + change / 100).toFixed(2)} x ${(1 - change / 100).toFixed(2)}.`,
      skills: ["percentageChain"] as const,
      traps: ["additivePercentChain"] as const
    };
  }

  const base = item.denominator * randomIntInclusive(8, 40);
  const answer = (base / item.denominator) * numerator;
  return {
    text: `${item.percent}% of ${base} is closest to`,
    answer: formatNumber(answer),
    distractors: [formatNumber(answer / 2), formatNumber(answer + base / item.denominator), formatNumber(base - answer)],
    explanation: `Use the nearby fraction ${numerator}/${item.denominator}.`,
    skills: ["percentIntuition"] as const,
    traps: ["baseRateConfusion"] as const
  };
}

export function solveReversePercentage(finalValue: number, percent: number): number {
  return finalValue / (percent / 100);
}

export function solvePercentChain(originalPercent: number, changes: number[]): string {
  const remaining = changes.reduce((current, change) => current * (1 + change / 100), 1);
  return formatPercent(originalPercent * remaining);
}

export function solvePercentOf(percent: number, value: number): string {
  return formatNumber((percent / 100) * value);
}
