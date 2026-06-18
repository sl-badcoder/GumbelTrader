import { randomIntInclusive, type RandomNumberGenerator } from "../../shared/utils/random";
import type {
  ArithmeticOperator,
  ArithmeticPrompt,
  ArithmeticSession
} from "./arithmeticTypes";

const operatorSymbols: Record<ArithmeticOperator, string> = {
  addition: "+",
  subtraction: "-",
  multiplication: "x",
  division: "/"
};

export function generateArithmeticPrompt(
  session: ArithmeticSession,
  random?: RandomNumberGenerator
): ArithmeticPrompt {
  const { settings } = session;
  const operator =
    settings.enabledOperators[
      randomIntInclusive(0, settings.enabledOperators.length - 1, random)
    ] ?? "addition";

  if (operator === "division") {
    return generateDivisionPrompt(session, random);
  }

  const left = randomIntInclusive(settings.minNumber, settings.maxNumber, random);
  const right = randomIntInclusive(settings.minNumber, settings.maxNumber, random);
  const answer = calculateAnswer(left, right, operator);

  return {
    left,
    right,
    operator,
    text: `${left} ${operatorSymbols[operator]} ${right}`,
    answer
  };
}

function generateDivisionPrompt(
  session: ArithmeticSession,
  random?: RandomNumberGenerator
): ArithmeticPrompt {
  const { minNumber, maxNumber } = session.settings;
  const divisor = Math.max(1, randomIntInclusive(minNumber, maxNumber, random));
  const quotient = randomIntInclusive(minNumber, maxNumber, random);
  const dividend = divisor * quotient;

  return {
    left: dividend,
    right: divisor,
    operator: "division",
    text: `${dividend} ${operatorSymbols.division} ${divisor}`,
    answer: quotient
  };
}

function calculateAnswer(left: number, right: number, operator: ArithmeticOperator): number {
  switch (operator) {
    case "addition":
      return left + right;
    case "subtraction":
      return left - right;
    case "multiplication":
      return left * right;
    case "division":
      return left / right;
  }
}
