import { badRequest } from "../../shared/http.js";
import { isKnownGame } from "../games/gameRegistry.js";
import type { LeaderboardRepository } from "./leaderboard.repository.js";
import type { LeaderboardEntry } from "./leaderboard.types.js";

export class LeaderboardService {
  constructor(private readonly leaderboard: LeaderboardRepository) {}

  getForGame(gameId: string): Promise<LeaderboardEntry[]> {
    if (!isKnownGame(gameId)) {
      throw badRequest("Unknown gameId");
    }

    return this.leaderboard.getForGame(gameId, 20);
  }
}
