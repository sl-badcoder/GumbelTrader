import type { ArithmeticSettings } from "./arithmeticTypes";

export const defaultArithmeticSettings: ArithmeticSettings = {
  durationSeconds: 60,
  enabledOperators: ["addition", "subtraction", "multiplication"],
  minNumber: 1,
  maxNumber: 12
};

export function normalizeArithmeticSettings(settings: ArithmeticSettings): ArithmeticSettings {
  const minNumber = Math.trunc(settings.minNumber);
  const maxNumber = Math.trunc(settings.maxNumber);
  const enabledOperators =
    settings.enabledOperators.length > 0
      ? settings.enabledOperators
      : defaultArithmeticSettings.enabledOperators;

  return {
    durationSeconds: Math.max(5, Math.trunc(settings.durationSeconds)),
    enabledOperators,
    minNumber: Math.min(minNumber, maxNumber),
    maxNumber: Math.max(minNumber, maxNumber)
  };
}
