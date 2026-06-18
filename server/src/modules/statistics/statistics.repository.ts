import type { Db } from "../../db/db.js";
import type { GameStatistics } from "./statistics.types.js";

type StatisticsRow = {
  game_id: string;
  best_score: number;
  total_sessions: string;
  average_score: string;
  total_attempts: string;
  total_correct: string;
  average_accuracy: string;
};

export interface StatisticsRepository {
  getByUser(userId: string): Promise<GameStatistics[]>;
}

export class PostgresStatisticsRepository implements StatisticsRepository {
  constructor(private readonly db: Db) {}

  async getByUser(userId: string): Promise<GameStatistics[]> {
    const result = await this.db.query<StatisticsRow>(
      `
        select
          game_id,
          max(score) as best_score,
          count(*) as total_sessions,
          avg(score) as average_score,
          sum(attempts) as total_attempts,
          sum(correct) as total_correct,
          avg(accuracy) as average_accuracy
        from game_results
        where user_id = $1
        group by game_id
        order by game_id asc
      `,
      [userId]
    );

    return result.rows.map((row) => ({
      gameId: row.game_id,
      bestScore: Number(row.best_score),
      totalSessions: Number(row.total_sessions),
      averageScore: Number(row.average_score),
      totalAttempts: Number(row.total_attempts),
      totalCorrect: Number(row.total_correct),
      averageAccuracy: Number(row.average_accuracy)
    }));
  }
}
