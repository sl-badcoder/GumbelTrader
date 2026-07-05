export type PracticeResult = {
  moduleId: string;
  moduleTitle: string;
  score: number;
  attempts: number;
  correct: number;
  accuracy: number;
  durationSeconds: number;
  incorrect?: number;
  totalQuestions?: number;
  averageSecondsPerQuestion?: number;
  canReviewMissed?: boolean;
};
