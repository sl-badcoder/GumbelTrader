import { apiRequest } from "./apiClient";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  bestScore: number;
  accuracy: number;
  achievedAt: string;
};

export function getLeaderboard(
  gameId: string
): Promise<{ leaderboard: LeaderboardEntry[] }> {
  return apiRequest(`/leaderboard?gameId=${encodeURIComponent(gameId)}`);
}
