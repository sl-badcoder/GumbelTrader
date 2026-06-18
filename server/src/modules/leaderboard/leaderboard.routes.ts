import { Router } from "express";
import { requireString } from "../../shared/validation.js";
import type { LeaderboardService } from "./leaderboard.service.js";

export function createLeaderboardRoutes(leaderboardService: LeaderboardService): Router {
  const router = Router();

  router.get("/", async (request, response, next) => {
    try {
      response.json({
        leaderboard: await leaderboardService.getForGame(
          requireString(request.query.gameId, "gameId")
        )
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
