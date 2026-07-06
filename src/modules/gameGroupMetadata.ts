import type { ProblemModuleMetadata } from "../core/engine/ProblemModule";

export const speedMathGroup: Pick<
  ProblemModuleMetadata,
  "groupId" | "groupTitle" | "groupDescription" | "groupIcon"
> = {
  groupId: "speed-math",
  groupTitle: "Speed Math",
  groupDescription: "Timed arithmetic, fast recognition, and sprint-style drills.",
  groupIcon: ">>"
};

export const numberSenseGroup: Pick<
  ProblemModuleMetadata,
  "groupId" | "groupTitle" | "groupDescription" | "groupIcon"
> = {
  groupId: "number-sense",
  groupTitle: "Number Sense",
  groupDescription: "Magnitude, decimal place, and answer-elimination practice.",
  groupIcon: "10^"
};

export const percentagesRatesGroup: Pick<
  ProblemModuleMetadata,
  "groupId" | "groupTitle" | "groupDescription" | "groupIcon"
> = {
  groupId: "percentages-rates",
  groupTitle: "Percentages & Rates",
  groupDescription: "Percent intuition, ratios, rates, and unit-aware calculations.",
  groupIcon: "%"
};

export const fractionsGroup: Pick<
  ProblemModuleMetadata,
  "groupId" | "groupTitle" | "groupDescription" | "groupIcon"
> = {
  groupId: "fractions",
  groupTitle: "Fractions",
  groupDescription: "Fraction simplification, denominators, and reciprocal traps.",
  groupIcon: "a/b"
};

export const reasoningGroup: Pick<
  ProblemModuleMetadata,
  "groupId" | "groupTitle" | "groupDescription" | "groupIcon"
> = {
  groupId: "reasoning",
  groupTitle: "Reasoning",
  groupDescription: "Estimation, probability, combinatorics, and strategy recognition.",
  groupIcon: "?"
};
