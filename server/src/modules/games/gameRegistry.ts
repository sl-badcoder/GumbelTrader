import type { GameDefinition } from "./game.types.js";

export const gameRegistry: Record<string, GameDefinition> = {
  arithmetic: { id: "arithmetic", title: "Arithmetic Practice" },
  sequences: { id: "sequences", title: "Sequence Practice" },
  "missing-operand": { id: "missing-operand", title: "Missing Operand Drill" },
  "decimal-place": { id: "decimal-place", title: "Decimal Place Drill" },
  "fraction-trap": { id: "fraction-trap", title: "Fraction Trap Drill" },
  "magnitude-sense": { id: "magnitude-sense", title: "Magnitude Sense Drill" },
  "percent-intuition": { id: "percent-intuition", title: "Percent Intuition Drill" },
  "ratio-rate-units": { id: "ratio-rate-units", title: "Ratio / Rate / Units Drill" },
  "fermi-estimation": { id: "fermi-estimation", title: "Fermi Estimation Drill" },
  "strategy-recognition": { id: "strategy-recognition", title: "Strategy Recognition Drill" },
  "mixed-elimination": { id: "mixed-elimination", title: "Mixed Elimination Drill" },
  "typed-hardcore": { id: "typed-hardcore", title: "Typed Hardcore" },
  "eighty-in-eight-mc": { id: "eighty-in-eight-mc", title: "80-in-8 Multiple Choice" },
  probability: { id: "probability", title: "Probability Questions" },
  combinatorics: { id: "combinatorics", title: "Combinatorics Questions" }
};

export function isKnownGame(gameId: string): boolean {
  return gameId in gameRegistry || gameId === "eighty-in-eight";
}
