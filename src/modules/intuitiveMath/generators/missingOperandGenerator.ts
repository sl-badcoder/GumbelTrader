import { offByDistractors, pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { formatNumber } from "../numberFormatting";

type MissingOperandCase = {
  text: string;
  answer: number;
  wrongInverse: number;
  explanation: string;
};

export function buildMissingOperandCase(formIndex: number): MissingOperandCase {
  const cases: MissingOperandCase[] = [
    {
      text: "? + 17 = 42",
      answer: 25,
      wrongInverse: 59,
      explanation: "For ? + a = b, solve ? = b - a."
    },
    {
      text: "? - 8 = 19",
      answer: 27,
      wrongInverse: 11,
      explanation: "For ? - a = b, solve ? = b + a."
    },
    {
      text: "53 - ? = 21",
      answer: 32,
      wrongInverse: 74,
      explanation: "For a - ? = b, solve ? = a - b."
    },
    {
      text: "? x 7 = 63",
      answer: 9,
      wrongInverse: 441,
      explanation: "For ? x a = b, solve ? = b / a."
    },
    {
      text: "? / 0.4 = 12",
      answer: 4.8,
      wrongInverse: 30,
      explanation: "For ? / a = b, solve ? = a x b."
    },
    {
      text: "3/4 / ? = 3/8",
      answer: 2,
      wrongInverse: 0.5,
      explanation: "For a / ? = b, solve ? = a / b."
    }
  ];

  return pickCyclic(cases, formIndex);
}

export function generateMissingOperandPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const promptCase = buildMissingOperandCase(session.promptIndex);
  const answer = formatNumber(promptCase.answer);

  return {
    id: `missing-operand-${session.promptIndex}`,
    text: promptCase.text,
    answer,
    choices: uniqueChoices(answer, [
      formatNumber(promptCase.wrongInverse),
      ...offByDistractors(promptCase.answer)
    ]),
    explanation: promptCase.explanation,
    skillTags: ["missingOperand", "optionElimination"],
    trapTags: ["wrongInverseOperation", "offByOne"],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}
