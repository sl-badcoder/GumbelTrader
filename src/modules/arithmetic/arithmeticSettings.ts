import type {
  ArithmeticOperandRange,
  ArithmeticOperator,
  ArithmeticSettings
} from "./arithmeticTypes";

export const defaultArithmeticSettings: ArithmeticSettings = {
  durationSeconds: 60,
  enabledOperators: ["addition", "subtraction", "multiplication"],
  operandRanges: {
    addition: { leftMin: 2, leftMax: 100, rightMin: 2, rightMax: 100 },
    subtraction: { leftMin: 2, leftMax: 100, rightMin: 2, rightMax: 100 },
    multiplication: { leftMin: 2, leftMax: 12, rightMin: 2, rightMax: 100 },
    division: { leftMin: 2, leftMax: 12, rightMin: 2, rightMax: 100 }
  }
};

type LegacyArithmeticSettings = Partial<ArithmeticSettings> & {
  minNumber?: number;
  maxNumber?: number;
};

const operators: ArithmeticOperator[] = [
  "addition",
  "subtraction",
  "multiplication",
  "division"
];

export function normalizeArithmeticSettings(
  settings: LegacyArithmeticSettings
): ArithmeticSettings {
  const enabledOperators =
    settings.enabledOperators && settings.enabledOperators.length > 0
      ? settings.enabledOperators
      : defaultArithmeticSettings.enabledOperators;

  return {
    durationSeconds: Math.max(
      5,
      Math.trunc(settings.durationSeconds ?? defaultArithmeticSettings.durationSeconds)
    ),
    enabledOperators,
    operandRanges: operators.reduce(
      (ranges, operator) => ({
        ...ranges,
        [operator]: normalizeRange(getRangeForOperator(settings, operator))
      }),
      {} as Record<ArithmeticOperator, ArithmeticOperandRange>
    )
  };
}

function getRangeForOperator(
  settings: LegacyArithmeticSettings,
  operator: ArithmeticOperator
): ArithmeticOperandRange {
  const configuredRange = settings.operandRanges?.[operator];

  if (configuredRange) {
    return configuredRange;
  }

  if (settings.minNumber !== undefined && settings.maxNumber !== undefined) {
    return {
      leftMin: settings.minNumber,
      leftMax: settings.maxNumber,
      rightMin: settings.minNumber,
      rightMax: settings.maxNumber
    };
  }

  return defaultArithmeticSettings.operandRanges[operator];
}

function normalizeRange(range: ArithmeticOperandRange): ArithmeticOperandRange {
  const leftMin = Math.trunc(range.leftMin);
  const leftMax = Math.trunc(range.leftMax);
  const rightMin = Math.trunc(range.rightMin);
  const rightMax = Math.trunc(range.rightMax);

  return {
    leftMin: Math.min(leftMin, leftMax),
    leftMax: Math.max(leftMin, leftMax),
    rightMin: Math.min(rightMin, rightMax),
    rightMax: Math.max(rightMin, rightMax)
  };
}
