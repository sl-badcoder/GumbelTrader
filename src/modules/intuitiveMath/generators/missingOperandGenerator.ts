import { offByDistractors, pickCyclic, uniqueChoices } from "../distractorFactory";
import { randomIntInclusive, type RandomNumberGenerator } from "../../../shared/utils/random";
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
  session: IntuitiveMathSession,
  random?: RandomNumberGenerator
): IntuitiveMathPrompt {
  const promptCase = buildRandomMissingOperandCase(random);
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

function buildRandomMissingOperandCase(random?: RandomNumberGenerator): MissingOperandCase {
  const form = randomIntInclusive(0, 5, random);

  if (form === 0) {
    const addend = randomIntInclusive(8, 79, random);
    const answer = randomIntInclusive(10, 95, random);
    return {
      text: `? + ${addend} = ${answer + addend}`,
      answer,
      wrongInverse: answer + addend + addend,
      explanation: "For ? + a = b, solve ? = b - a."
    };
  }

  if (form === 1) {
    const subtrahend = randomIntInclusive(4, 38, random);
    const answer = randomIntInclusive(12, 99, random);
    return {
      text: `? - ${subtrahend} = ${answer - subtrahend}`,
      answer,
      wrongInverse: answer - subtrahend - subtrahend,
      explanation: "For ? - a = b, solve ? = b + a."
    };
  }

  if (form === 2) {
    const answer = randomIntInclusive(8, 88, random);
    const result = randomIntInclusive(5, 65, random);
    return {
      text: `${answer + result} - ? = ${result}`,
      answer,
      wrongInverse: answer + result + result,
      explanation: "For a - ? = b, solve ? = a - b."
    };
  }

  if (form === 3) {
    const factor = randomIntInclusive(3, 12, random);
    const answer = randomIntInclusive(4, 18, random);
    return {
      text: `? x ${factor} = ${answer * factor}`,
      answer,
      wrongInverse: answer * factor * factor,
      explanation: "For ? x a = b, solve ? = b / a."
    };
  }

  if (form === 4) {
    const divisorTenths = randomIntInclusive(2, 9, random);
    const divisor = divisorTenths / 10;
    const quotient = randomIntInclusive(4, 18, random);
    const answer = divisor * quotient;
    return {
      text: `? / ${formatNumber(divisor)} = ${quotient}`,
      answer,
      wrongInverse: quotient / divisor,
      explanation: "For ? / a = b, solve ? = a x b."
    };
  }

  const divisor = randomIntInclusive(2, 9, random);
  const resultNumerator = randomIntInclusive(1, divisor - 1, random);
  const answer = randomIntInclusive(2, 6, random);
  const dividendNumerator = resultNumerator * answer;
  return {
    text: `${dividendNumerator}/${divisor} / ? = ${resultNumerator}/${divisor}`,
    answer,
    wrongInverse: 1 / answer,
    explanation: "For a / ? = b, solve ? = a / b."
  };
}
