import { describe, expect, it } from "vitest";
import { StatisticsService } from "./statistics.service.js";
import type { StatisticsRepository } from "./statistics.repository.js";

describe("StatisticsService", () => {
  it("returns grouped game statistics from the repository", async () => {
    const repository: StatisticsRepository = {
      getByUser: async () => [
        {
          gameId: "arithmetic",
          bestScore: 10,
          totalSessions: 2,
          averageScore: 6,
          totalAttempts: 20,
          totalCorrect: 15,
          averageAccuracy: 75
        }
      ]
    };
    const service = new StatisticsService(repository);

    await expect(service.getByUser("user-1")).resolves.toEqual([
      {
        gameId: "arithmetic",
        bestScore: 10,
        totalSessions: 2,
        averageScore: 6,
        totalAttempts: 20,
        totalCorrect: 15,
        averageAccuracy: 75
      }
    ]);
  });
});
