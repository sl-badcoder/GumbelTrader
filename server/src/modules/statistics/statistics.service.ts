import type { StatisticsRepository } from "./statistics.repository.js";
import type { GameStatistics } from "./statistics.types.js";

export class StatisticsService {
  constructor(private readonly statistics: StatisticsRepository) {}

  getByUser(userId: string): Promise<GameStatistics[]> {
    return this.statistics.getByUser(userId);
  }
}
