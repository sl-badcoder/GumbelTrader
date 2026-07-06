import { decimalShiftDistractors, pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { formatNumber } from "../numberFormatting";

export function generateDecimalPlacePrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const cases = [
    {
      text: "0.19 x 0.003",
      answer: 0.00057,
      explanation:
        "0.19 has 2 decimal places and 0.003 has 3, so the product has 5 decimal places."
    },
    {
      text: "0.58 - 0.023",
      answer: 0.557,
      explanation: "Align decimal points before subtracting: 0.580 - 0.023 = 0.557."
    },
    {
      text: "0.66 / 0.06",
      answer: 11,
      explanation: "Scale both numbers by 100: 66 / 6 = 11."
    },
    {
      text: "4.8 x 0.07",
      answer: 0.336,
      explanation: "48 x 7 = 336, then place 3 decimal digits: 0.336."
    }
  ];
  const promptCase = pickCyclic(cases, session.promptIndex);
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
