import type { ChangeEvent, FormEvent } from "react";
import type { ProblemModuleMetadata } from "../../core/engine/ProblemModule";
import type { QuantDifficulty, QuantSettings } from "../../modules/quant/quantTypes";
import { Button } from "../../shared/components/Button";
import { NumberInput } from "../../shared/components/NumberInput";

const difficulties: Array<{ id: QuantDifficulty; label: string; description: string }> = [
  { id: "mixed", label: "Mixed", description: "A rotating set of easy, medium, and hard questions." },
  { id: "easy", label: "Easy", description: "Direct counting and one-step probability setups." },
  { id: "medium", label: "Medium", description: "Dependent events, restrictions, and casework." },
  { id: "hard", label: "Hard", description: "Complement counting and denser quant-prep traps." }
];

type QuantSettingsPageProps = {
  module: ProblemModuleMetadata;
  settings: QuantSettings;
  onChange: (settings: QuantSettings) => void;
  onStart: (settings: QuantSettings) => void;
  onBack: () => void;
};

export function QuantSettingsPage({
  module,
  settings,
  onChange,
  onStart,
  onBack
}: QuantSettingsPageProps) {
  const updateNumber =
    (key: "questionCount" | "durationSeconds") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...settings,
        [key]: Number(event.target.value)
      });
    };

  const updateBoolean = (key: keyof QuantSettings) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      [key]: event.target.checked
    });
  };

  const updateDifficulty = (difficulty: QuantDifficulty) => {
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
          <h2>{module.title}</h2>
          <p>{module.shortDescription}</p>
        </div>

        <label className="field">
          <span>Number of questions</span>
          <NumberInput
            min={1}
            max={200}
            value={settings.questionCount}
            onChange={updateNumber("questionCount")}
          />
        </label>

        <fieldset className="fieldset">
          <legend>Timer</legend>
          <div className="settings-form">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={settings.timerEnabled}
                onChange={updateBoolean("timerEnabled")}
              />
              <span>Enable countdown timer</span>
            </label>
            <label className="field">
              <span>Duration in seconds</span>
              <NumberInput
                min={30}
                step={5}
                value={settings.durationSeconds}
                disabled={!settings.timerEnabled}
                onChange={updateNumber("durationSeconds")}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>Difficulty</legend>
          <div className="difficulty-list">
            {difficulties.map((difficulty) => (
              <label key={difficulty.id} className="radio-row">
                <input
                  type="radio"
                  name={`${module.id}-difficulty`}
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

        <fieldset className="fieldset">
          <legend>Answer behavior</legend>
          <div className="operator-grid">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={settings.showExplanationAfterAnswer}
                onChange={updateBoolean("showExplanationAfterAnswer")}
              />
              <span>Show explanation after each answer</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={settings.showExplanationsAtEnd}
                onChange={updateBoolean("showExplanationsAtEnd")}
              />
              <span>Show explanations only at the end</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={settings.autoAdvanceOnCorrectAnswer}
                onChange={updateBoolean("autoAdvanceOnCorrectAnswer")}
              />
              <span>Auto-advance after correct answer</span>
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={settings.reviewMissedAfterGame}
                onChange={updateBoolean("reviewMissedAfterGame")}
              />
              <span>Review missed questions after game</span>
            </label>
          </div>
        </fieldset>

        <Button type="submit">Start session</Button>
      </form>
    </main>
  );
}
