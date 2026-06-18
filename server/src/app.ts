import express from "express";
import type { ServerEnv } from "./config/env.js";
import type { Db } from "./db/db.js";
import { PostgresUserRepository } from "./modules/users/user.repository.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { createAuthRoutes } from "./modules/auth/auth.routes.js";
import { optionalAuth } from "./middleware/optionalAuth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { PostgresResultsRepository } from "./modules/results/results.repository.js";
import { ResultsService } from "./modules/results/results.service.js";
import { createResultsRoutes } from "./modules/results/results.routes.js";
import { PostgresStatisticsRepository } from "./modules/statistics/statistics.repository.js";
import { StatisticsService } from "./modules/statistics/statistics.service.js";
import { createStatisticsRoutes } from "./modules/statistics/statistics.routes.js";
import { PostgresLeaderboardRepository } from "./modules/leaderboard/leaderboard.repository.js";
import { LeaderboardService } from "./modules/leaderboard/leaderboard.service.js";
import { createLeaderboardRoutes } from "./modules/leaderboard/leaderboard.routes.js";

export function createApp(env: ServerEnv, db: Db): express.Express {
  const app = express();
  const users = new PostgresUserRepository(db);
  const authService = new AuthService(users, env);
  const resultsService = new ResultsService(new PostgresResultsRepository(db));
  const statisticsService = new StatisticsService(new PostgresStatisticsRepository(db));
  const leaderboardService = new LeaderboardService(new PostgresLeaderboardRepository(db));

  app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", env.clientOrigin);
    response.header("Access-Control-Allow-Credentials", "true");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    response.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (request.method === "OPTIONS") {
      response.status(204).send();
      return;
    }
    next();
  });
  app.use(express.json({ limit: "64kb" }));
  app.use(optionalAuth(authService, env));

  app.get("/api/health", (_request, response) => response.json({ ok: true }));
  app.use("/api/auth", createAuthRoutes(authService, env));
  app.use("/api/results", createResultsRoutes(resultsService));
  app.use("/api/statistics", createStatisticsRoutes(statisticsService));
  app.use("/api/leaderboard", createLeaderboardRoutes(leaderboardService));

  // TODO: Add production-grade rate limiting for auth and result submission endpoints.
  app.use(errorHandler);

  return app;
}
