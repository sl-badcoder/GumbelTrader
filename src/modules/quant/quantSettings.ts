import type { QuantCategory, QuantDifficulty, QuantSettings } from "./quantTypes";

export const defaultProbabilitySettings: QuantSettings = {
  questionCount: 20,
  durationSeconds: 480,
  timerEnabled: false,
  difficulty: "mixed",
  category: "probability",
  showExplanationAfterAnswer: true,
  showExplanationsAtEnd: false,
  autoAdvanceOnCorrectAnswer: true,
  reviewMissedAfterGame: true
};

export const defaultCombinatoricsSettings: QuantSettings = {
  ...defaultProbabilitySettings,
  category: "combinatorics"
};

const difficulties: QuantDifficulty[] = ["easy", "medium", "hard", "mixed"];
const categories: QuantCategory[] = ["probability", "combinatorics", "mixed"];

export function normalizeQuantSettings(
  settings: Partial<QuantSettings>,
  defaults: QuantSettings
): QuantSettings {
  const questionCount = Math.max(1, Math.min(200, Math.trunc(settings.questionCount ?? defaults.questionCount)));
  const durationSeconds = Math.max(30, Math.trunc(settings.durationSeconds ?? defaults.durationSeconds));
  const difficulty = settings.difficulty && difficulties.includes(settings.difficulty)
    ? settings.difficulty
    : defaults.difficulty;
  const category = settings.category && categories.includes(settings.category)
    ? settings.category
    : defaults.category;

  return {
    questionCount,
    durationSeconds,
    timerEnabled: settings.timerEnabled ?? defaults.timerEnabled,
    difficulty,
    category,
    showExplanationAfterAnswer:
      settings.showExplanationAfterAnswer ?? defaults.showExplanationAfterAnswer,
    showExplanationsAtEnd: settings.showExplanationsAtEnd ?? defaults.showExplanationsAtEnd,
    autoAdvanceOnCorrectAnswer:
      settings.autoAdvanceOnCorrectAnswer ?? defaults.autoAdvanceOnCorrectAnswer,
    reviewMissedAfterGame: settings.reviewMissedAfterGame ?? defaults.reviewMissedAfterGame
  };
}
