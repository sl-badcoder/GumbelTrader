import { randomIntInclusive, type RandomNumberGenerator } from "../../shared/utils/random";
import { formatNumber } from "./numberFormatting";

export function shuffle<T>(
  values: T[],
  random: RandomNumberGenerator = Math.random
): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIntInclusive(0, index, random);
    const currentValue = shuffled[index];
    const swapValue = shuffled[swapIndex];
    if (currentValue !== undefined && swapValue !== undefined) {
      shuffled[index] = swapValue;
      shuffled[swapIndex] = currentValue;
    }
  }

  return shuffled;
}

export function pickCyclic<T>(values: readonly T[], index: number): T {
  const value = values[index % values.length];

  if (value === undefined) {
    throw new Error("Cannot pick from an empty list.");
  }

  return value;
}

export function uniqueChoices(
  answer: string,
  distractors: string[],
  count = 4,
  random?: RandomNumberGenerator
): string[] {
  const choices: string[] = [];

  for (const choice of [answer, ...distractors]) {
    if (!choices.includes(choice)) {
      choices.push(choice);
    }
  }

  let fillerOffset = 1;
  while (choices.length < count) {
    const filler = `${answer} ${fillerOffset > 0 ? "+" : ""}${fillerOffset}`;
    if (!choices.includes(filler)) {
      choices.push(filler);
    }
    fillerOffset += 1;
  }

  return shuffle(choices.slice(0, count), random);
}

export function decimalShiftDistractors(answer: number): string[] {
  return [answer * 10, answer / 10, answer * 100, answer / 100].map(formatNumber);
}

export function offByDistractors(answer: number): string[] {
  return [answer - 2, answer - 1, answer + 1, answer + 2].map(formatNumber);
}

export function magnitudeBucketDistractors(answer: string): string[] {
  const match = answer.match(/^10\^(\d+)$/);

  if (!match) {
    return [];
  }

  const exponent = Number(match[1]);
  return [`10^${exponent - 2}`, `10^${exponent - 1}`, `10^${exponent + 1}`, `10^${exponent + 2}`];
}
