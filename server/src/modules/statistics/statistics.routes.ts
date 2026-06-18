import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import type { StatisticsService } from "./statistics.service.js";

export function createStatisticsRoutes(statisticsService: StatisticsService): Router {
  const router = Router();

  router.get("/", requireAuth, async (request, response, next) => {
    try {
      const user = request.user;
      if (!user) {
        throw new Error("Expected authenticated user");
      }

      response.json({ statistics: await statisticsService.getByUser(user.id) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
