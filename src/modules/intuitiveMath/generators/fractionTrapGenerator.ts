import { pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateFractionTrapPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const cases = [
    {
      text: "5/9 + 2/9",
      answer: "7/9",
      distractors: ["7/18", "3/9", "1/9"],
      explanation: "With the same denominator, add numerators and keep the denominator."
    },
    {
      text: "5/6 - 1/24",
      answer: "19/24",
      distractors: ["4/18", "4/24", "20/24"],
      explanation: "Use denominator 24: 20/24 - 1/24 = 19/24."
    },
    {
      text: "3/8 / 9/16",
      answer: "2/3",
      distractors: ["27/128", "3/2", "12/72"],
      explanation: "Dividing by a fraction means multiplying by its reciprocal."
    },
    {
      text: "? x 2/3 = 5/6",
      answer: "5/4",
      distractors: ["5/9", "10/18", "1/4"],
      explanation: "Solve ? = 5/6 divided by 2/3, so ? = 5/6 x 3/2 = 5/4."
    }
  ];
  const promptCase = pickCyclic(cases, session.promptIndex);

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
