import { apiRequest } from "./apiClient";

export type GameStatistics = {
  gameId: string;
  bestScore: number;
  totalSessions: number;
  averageScore: number;
  totalAttempts: number;
  totalCorrect: number;
  averageAccuracy: number;
};

export function getStatistics(): Promise<{ statistics: GameStatistics[] }> {
  return apiRequest("/statistics");
}
