import type { Db } from "../../db/db.js";
import type { CreateResultInput, GameResultRecord } from "./results.types.js";

type ResultRow = {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  attempts: number;
  correct: number;
  duration_seconds: number;
  accuracy: number;
  settings_json: Record<string, unknown> | null;
  details_json: Record<string, unknown> | null;
  created_at: Date;
};

export interface ResultsRepository {
  create(input: CreateResultInput): Promise<GameResultRecord>;
}

export class PostgresResultsRepository implements ResultsRepository {
  constructor(private readonly db: Db) {}

  async create(input: CreateResultInput): Promise<GameResultRecord> {
    const result = await this.db.query<ResultRow>(
      `
        insert into game_results (
          user_id,
          game_id,
          score,
          attempts,
          correct,
          duration_seconds,
          accuracy,
          settings_json,
          details_json
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning
          id,
          user_id,
          game_id,
          score,
          attempts,
          correct,
          duration_seconds,
          accuracy,
          settings_json,
          details_json,
          created_at
      `,
      [
        input.userId,
        input.gameId,
        input.score,
        input.attempts,
        input.correct,
        input.durationSeconds,
        input.accuracy,
        input.settings,
        input.details
      ]
    );

    return mapResultRow(result.rows[0]);
  }
}

function mapResultRow(row: ResultRow | undefined): GameResultRecord {
  if (!row) {
    throw new Error("Expected result row");
  }

  return {
    id: row.id,
    userId: row.user_id,
    gameId: row.game_id,
    score: row.score,
    attempts: row.attempts,
    correct: row.correct,
    durationSeconds: row.duration_seconds,
    accuracy: row.accuracy,
    settings: row.settings_json,
    details: row.details_json,
    createdAt: row.created_at.toISOString()
  };
}
