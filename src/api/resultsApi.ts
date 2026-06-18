import type { PracticeResult } from "../core/engine/PracticeResult";
import { apiRequest } from "./apiClient";

export function saveResult(input: {
  result: PracticeResult;
  settings: Record<string, unknown> | null;
  details?: Record<string, unknown> | null;
}): Promise<unknown> {
  return apiRequest("/results", {
    method: "POST",
    body: JSON.stringify({
      gameId: input.result.moduleId,
      score: input.result.score,
      attempts: input.result.attempts,
      correct: input.result.correct,
      durationSeconds: input.result.durationSeconds,
      accuracy: input.result.accuracy,
      settings: input.settings,
      details: input.details ?? null
    })
  });
}
