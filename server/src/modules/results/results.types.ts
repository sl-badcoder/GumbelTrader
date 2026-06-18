export type CreateResultInput = {
  userId: string;
  gameId: string;
  score: number;
  attempts: number;
  correct: number;
  durationSeconds: number;
  accuracy: number;
  settings: Record<string, unknown> | null;
  details: Record<string, unknown> | null;
};

export type GameResultRecord = CreateResultInput & {
  id: string;
  createdAt: string;
};
