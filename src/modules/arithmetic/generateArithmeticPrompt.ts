import { randomIntInclusive, type RandomNumberGenerator } from "../../shared/utils/random";
import type {
  ArithmeticOperandRange,
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

  const range = settings.operandRanges[operator];
  const [left, right] =
    operator === "subtraction"
      ? generateSubtractionOperands(range, random)
      : [
          randomIntInclusive(range.leftMin, range.leftMax, random),
          randomIntInclusive(range.rightMin, range.rightMax, random)
        ];
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
  const range = session.settings.operandRanges.division;
  const divisor = Math.max(1, randomIntInclusive(range.leftMin, range.leftMax, random));
  const quotient = randomIntInclusive(range.rightMin, range.rightMax, random);
  const dividend = divisor * quotient;

  return {
    left: dividend,
    right: divisor,
    operator: "division",
    text: `${dividend} ${operatorSymbols.division} ${divisor}`,
    answer: quotient
  };
}

function generateSubtractionOperands(
  range: ArithmeticOperandRange,
  random?: RandomNumberGenerator
): [number, number] {
  const leftMin = Math.max(range.leftMin, range.rightMin);

  if (leftMin <= range.leftMax) {
    const left = randomIntInclusive(leftMin, range.leftMax, random);
    const right = randomIntInclusive(range.rightMin, Math.min(range.rightMax, left), random);
    return [left, right];
  }

  const firstNumber = randomIntInclusive(range.leftMin, range.leftMax, random);
  const secondNumber = randomIntInclusive(range.rightMin, range.rightMax, random);
  return [Math.max(firstNumber, secondNumber), Math.min(firstNumber, secondNumber)];
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
