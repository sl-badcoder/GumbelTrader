import type { GameDefinition } from "./game.types.js";

export const gameRegistry: Record<string, GameDefinition> = {
  arithmetic: { id: "arithmetic", title: "Arithmetic Practice" },
  sequences: { id: "sequences", title: "Sequence Practice" }
};

export function isKnownGame(gameId: string): boolean {
  return gameId in gameRegistry;
}
