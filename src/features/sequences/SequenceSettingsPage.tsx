import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../shared/components/Button";
import { NumberInput } from "../../shared/components/NumberInput";
import type {
  SequenceDifficulty,
  SequenceSettings
} from "../../modules/sequences/sequenceTypes";

const difficulties: Array<{ id: SequenceDifficulty; label: string; description: string }> = [
  { id: "easy", label: "Easy", description: "Constant steps, simple multiplication, squares." },
  { id: "medium", label: "Medium", description: "Changing steps, alternation, Fibonacci-like rules." },
  { id: "hard", label: "Hard", description: "Quadratic rules, prime increments, interleaved sequences." }
];

type SequenceSettingsPageProps = {
  settings: SequenceSettings;
  onChange: (settings: SequenceSettings) => void;
  onStart: (settings: SequenceSettings) => void;
  onBack: () => void;
};

export function SequenceSettingsPage({
  settings,
  onChange,
  onStart,
  onBack
}: SequenceSettingsPageProps) {
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
    onStart(settings);
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
            value={settings.durationSeconds}
            onChange={updateDuration}
          />
        </label>

        <fieldset className="fieldset">
          <legend>Difficulty</legend>
          <div className="difficulty-list">
            {difficulties.map((difficulty) => (
              <label key={difficulty.id} className="radio-row">
                <input
                  type="radio"
                  name="sequence-difficulty"
                  checked={settings.difficulty === difficulty.id}
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
