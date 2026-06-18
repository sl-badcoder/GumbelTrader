import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { optionalObject, requireNumber, requireString } from "../../shared/validation.js";
import type { ResultsService } from "./results.service.js";

export function createResultsRoutes(resultsService: ResultsService): Router {
  const router = Router();

  router.post("/", requireAuth, async (request, response, next) => {
    try {
      const body = request.body as Record<string, unknown>;
      const user = request.user;
      if (!user) {
        throw new Error("Expected authenticated user");
      }

      const result = await resultsService.create({
        userId: user.id,
        gameId: requireString(body.gameId, "gameId"),
        score: Math.trunc(requireNumber(body.score, "score")),
        attempts: Math.trunc(requireNumber(body.attempts, "attempts")),
        correct: Math.trunc(requireNumber(body.correct, "correct")),
        durationSeconds: Math.trunc(requireNumber(body.durationSeconds, "durationSeconds")),
        accuracy: requireNumber(body.accuracy, "accuracy"),
        settings: optionalObject(body.settings, "settings"),
        details: optionalObject(body.details, "details")
      });

      response.status(201).json({ result });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
