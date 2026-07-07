import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../shared/components/Button";
import { NumberInput } from "../../shared/components/NumberInput";
import type {
  SequenceDifficulty,
  SequenceSettings
} from "../../modules/sequences/sequenceTypes";
import { defaultSequenceSettings } from "../../modules/sequences/sequenceSettings";

const difficulties: Array<{ id: SequenceDifficulty; label: string; description: string }> = [
  { id: "easy", label: "Easy", description: "Arithmetic, geometric, Fibonacci, and prime patterns." },
  { id: "medium", label: "Medium", description: "Larger ranges, sign flips, distractions, and Tribonacci." },
  { id: "hard", label: "Hard", description: "Shifted, Pascal, custom-start, and interwoven patterns." }
];

type SequenceSettingsPageProps = {
  settings: SequenceSettings;
  onChange: (settings: SequenceSettings) => void;
  leaderboardMode: boolean;
  onLeaderboardModeChange: (enabled: boolean) => void;
  onStart: (settings: SequenceSettings) => void;
  onBack: () => void;
};

export function SequenceSettingsPage({
  settings,
  onChange,
  leaderboardMode,
  onLeaderboardModeChange,
  onStart,
  onBack
}: SequenceSettingsPageProps) {
  const displayedSettings = leaderboardMode ? defaultSequenceSettings : settings;
  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      durationSeconds: Number(event.target.value)
    });
  };

  const updateDifficulty = (difficulty: SequenceDifficulty) => {
    onChange({
      ...settings,
      difficulty
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onStart(displayedSettings);
  };

  return (
    <main className="page narrow-page">
      <button className="plain-link" type="button" onClick={onBack}>
        Back to games
      </button>

      <form className="panel settings-form" onSubmit={submit}>
        <div className="page-heading">
          <h2>Sequence Practice</h2>
          <p>Find the sixth number from five visible terms.</p>
        </div>

        <label className="field">
          <span>Duration in seconds</span>
          <NumberInput
            min={10}
            step={5}
            value={displayedSettings.durationSeconds}
            disabled={leaderboardMode}
            onChange={updateDuration}
          />
        </label>

        <label className="checkbox-row leaderboard-mode-row">
          <input
            type="checkbox"
            checked={leaderboardMode}
            onChange={(event) => onLeaderboardModeChange(event.target.checked)}
          />
          <span>
            <strong>Show my score on the leaderboard</strong>
            <small>Uses the default settings so scores are comparable.</small>
          </span>
        </label>

        <fieldset className="fieldset">
          <legend>Difficulty</legend>
          <div className="difficulty-list">
            {difficulties.map((difficulty) => (
              <label key={difficulty.id} className="radio-row">
                <input
                  type="radio"
                  name="sequence-difficulty"
                  checked={displayedSettings.difficulty === difficulty.id}
                  disabled={leaderboardMode}
                  onChange={() => updateDifficulty(difficulty.id)}
                />
                <span>
                  <strong>{difficulty.label}</strong>
                  <small>{difficulty.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit">Start session</Button>
      </form>
    </main>
  );
}
