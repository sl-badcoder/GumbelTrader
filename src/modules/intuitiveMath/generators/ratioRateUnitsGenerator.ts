import { randomIntInclusive } from "../../../shared/utils/random";
import { uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateRatioRateUnitsPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const promptCase = buildRatioRateUnitsCase();

  return {
    id: `ratio-rate-units-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, promptCase.distractors),
    explanation: promptCase.explanation,
    skillTags: ["ratioRateUnits", "optionElimination"],
    trapTags: ["wrongInverseOperation", "baseRateConfusion"],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}

function buildRatioRateUnitsCase() {
  const form = randomIntInclusive(0, 3);

  if (form === 0) {
    const machines = randomIntInclusive(2, 8);
    const minutes = randomIntInclusive(3, 12);
    const rate = randomIntInclusive(1, 6);
    const units = machines * minutes * rate;
    return {
      text: `${machines} machines make ${units} units in ${minutes} minutes. Units per machine per minute?`,
      answer: String(rate),
      distractors: [String(units / machines), String(units / minutes), String(rate * machines)],
      explanation: "Divide units by machines and by minutes."
    };
  }

  if (form === 1) {
    const hoursTenths = randomIntInclusive(10, 40);
    const speed = randomIntInclusive(30, 110);
    const distance = (hoursTenths / 10) * speed;
    return {
      text: `A car travels ${distance} km in ${hoursTenths / 10} hours. What is the speed in km/hour?`,
      answer: String(speed),
      distractors: [String(Math.round(distance)), String(Math.round(speed / 2)), String(Math.round(speed * 1.25))],
      explanation: "Speed is distance divided by time."
    };
  }

  if (form === 2) {
    const grams = [250, 500, 750, 1250][randomIntInclusive(0, 3)] ?? 750;
    const pricePerKg = randomIntInclusive(4, 18);
    const price = (grams / 1000) * pricePerKg;
    return {
      text: `A ${grams} g bag costs $${formatMoney(price)}. What is the price per kg?`,
      answer: `$${formatMoney(pricePerKg)}`,
      distractors: [`$${formatMoney(price)}`, `$${formatMoney(pricePerKg / 2)}`, `$${formatMoney(pricePerKg + 2)}`],
      explanation: "Convert grams to kilograms, then divide price by kilograms."
    };
  }

  const workers = randomIntInclusive(2, 8);
  const hours = randomIntInclusive(2, 8);
  const rate = randomIntInclusive(1, 5);
  const tasks = workers * hours * rate;
  return {
    text: `${workers} workers finish ${tasks} tasks in ${hours} hours. Tasks per worker per hour?`,
    answer: String(rate),
    distractors: [String(tasks / workers), String(tasks / hours), String(rate * hours)],
    explanation: "Divide tasks by workers and hours."
  };
}

function formatMoney(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, "");
}
