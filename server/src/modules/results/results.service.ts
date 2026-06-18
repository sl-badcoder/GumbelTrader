import { badRequest } from "../../shared/http.js";
import { isKnownGame } from "../games/gameRegistry.js";
import type { CreateResultInput, GameResultRecord } from "./results.types.js";
import type { ResultsRepository } from "./results.repository.js";

export class ResultsService {
  constructor(private readonly results: ResultsRepository) {}

  async create(input: CreateResultInput): Promise<GameResultRecord> {
    if (!isKnownGame(input.gameId)) {
      throw badRequest("Unknown gameId");
    }

    if (input.attempts < 0 || input.correct < 0 || input.correct > input.attempts) {
      throw badRequest("Invalid result counts");
    }

    const expectedAccuracy =
      input.attempts === 0 ? 0 : Math.round((input.correct / input.attempts) * 100);
    if (Math.abs(input.accuracy - expectedAccuracy) > 1) {
      throw badRequest("Invalid accuracy");
    }

    // TODO: Add stronger server-side result verification per game module.
    return this.results.create(input);
  }
}
