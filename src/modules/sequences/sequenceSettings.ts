import type { SequenceDifficulty, SequenceSettings } from "./sequenceTypes";

export const defaultSequenceSettings: SequenceSettings = {
  durationSeconds: 90,
  difficulty: "easy"
};

const difficulties: SequenceDifficulty[] = ["easy", "medium", "hard"];

export function normalizeSequenceSettings(settings: SequenceSettings): SequenceSettings {
  return {
    durationSeconds: Math.max(10, Math.trunc(settings.durationSeconds)),
    difficulty: difficulties.includes(settings.difficulty)
      ? settings.difficulty
      : defaultSequenceSettings.difficulty
  };
}
