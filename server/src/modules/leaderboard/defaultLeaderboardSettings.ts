const defaultArithmeticSettings = {
  durationSeconds: 120,
  enabledOperators: ["addition", "subtraction", "multiplication"],
  operandRanges: {
    addition: { leftMin: 2, leftMax: 100, rightMin: 2, rightMax: 100 },
    subtraction: { leftMin: 2, leftMax: 100, rightMin: 2, rightMax: 100 },
    multiplication: { leftMin: 2, leftMax: 12, rightMin: 2, rightMax: 100 },
    division: { leftMin: 2, leftMax: 12, rightMin: 2, rightMax: 100 }
  }
};

const defaultSequenceSettings = {
  durationSeconds: 90,
  difficulty: "easy"
};

const defaultProbabilitySettings = {
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

const defaultCombinatoricsSettings = {
  ...defaultProbabilitySettings,
  category: "combinatorics"
};

export const defaultLeaderboardSettingsByGame: Record<string, Record<string, unknown>> = {
  arithmetic: defaultArithmeticSettings,
  sequences: defaultSequenceSettings,
  probability: defaultProbabilitySettings,
  combinatorics: defaultCombinatoricsSettings
};
