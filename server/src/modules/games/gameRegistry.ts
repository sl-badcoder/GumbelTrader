import type { GameDefinition } from "./game.types.js";

export const gameRegistry: Record<string, GameDefinition> = {
  arithmetic: { id: "arithmetic", title: "Arithmetic Practice" },
  sequences: { id: "sequences", title: "Sequence Practice" },
  "eighty-in-eight-mc": { id: "eighty-in-eight-mc", title: "80-in-8 Multiple Choice" },
  probability: { id: "probability", title: "Probability Questions" },
  combinatorics: { id: "combinatorics", title: "Combinatorics Questions" }
};

export function isKnownGame(gameId: string): boolean {
  return gameId in gameRegistry || gameId === "eighty-in-eight";
}
