import type { Db } from "../../db/db.js";
import type { LeaderboardEntry } from "./leaderboard.types.js";

type LeaderboardRow = {
  user_id: string;
  display_name: string;
  best_score: number;
  accuracy: number;
  achieved_at: Date;
};

export interface LeaderboardRepository {
  getForGame(gameId: string, limit: number): Promise<LeaderboardEntry[]>;
}

export class PostgresLeaderboardRepository implements LeaderboardRepository {
  constructor(private readonly db: Db) {}

  async getForGame(gameId: string, limit: number): Promise<LeaderboardEntry[]> {
    const result = await this.db.query<LeaderboardRow>(
      `
        select distinct on (gr.user_id)
          gr.user_id,
          u.display_name,
          gr.score as best_score,
          gr.accuracy,
          gr.created_at as achieved_at
        from game_results gr
        join users u on u.id = gr.user_id
        where gr.game_id = $1
        order by gr.user_id, gr.score desc, gr.accuracy desc, gr.created_at asc
      `,
      [gameId]
    );

    return result.rows
      .sort((left, right) => {
        if (right.best_score !== left.best_score) {
          return right.best_score - left.best_score;
        }
        if (right.accuracy !== left.accuracy) {
          return right.accuracy - left.accuracy;
        }
        return left.achieved_at.getTime() - right.achieved_at.getTime();
      })
      .slice(0, limit)
      .map((row, index) => ({
        rank: index + 1,
        userId: row.user_id,
        displayName: row.display_name,
        bestScore: row.best_score,
        accuracy: row.accuracy,
        achievedAt: row.achieved_at.toISOString()
      }));
  }
}
