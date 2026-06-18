import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../shared/components/Button";
import { NumberInput } from "../../shared/components/NumberInput";
import type {
  ArithmeticOperator,
  ArithmeticSettings
} from "../../modules/arithmetic/arithmeticTypes";

const operators: Array<{ id: ArithmeticOperator; label: string }> = [
  { id: "addition", label: "Addition" },
  { id: "subtraction", label: "Subtraction" },
  { id: "multiplication", label: "Multiplication" },
  { id: "division", label: "Division" }
];

type ArithmeticSettingsPageProps = {
  settings: ArithmeticSettings;
  onChange: (settings: ArithmeticSettings) => void;
  onStart: (settings: ArithmeticSettings) => void;
  onBack: () => void;
};

export function ArithmeticSettingsPage({
  settings,
  onChange,
  onStart,
  onBack
}: ArithmeticSettingsPageProps) {
  const updateNumber = (key: keyof Pick<
    ArithmeticSettings,
    "durationSeconds" | "minNumber" | "maxNumber"
  >) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      [key]: Number(event.target.value)
    });
  };

  const toggleOperator = (operator: ArithmeticOperator) => {
    const enabledOperators = settings.enabledOperators.includes(operator)
      ? settings.enabledOperators.filter((item) => item !== operator)
      : [...settings.enabledOperators, operator];

    onChange({
      ...settings,
      enabledOperators
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
          <h2>Arithmetic Practice</h2>
          <p>Choose the size and mix of problems for this session.</p>
        </div>

        <label className="field">
          <span>Duration in seconds</span>
          <NumberInput
            min={5}
            step={5}
            value={settings.durationSeconds}
            onChange={updateNumber("durationSeconds")}
          />
        </label>

        <fieldset className="fieldset">
          <legend>Enabled operators</legend>
          <div className="operator-grid">
            {operators.map((operator) => (
              <label key={operator.id} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={settings.enabledOperators.includes(operator.id)}
                  onChange={() => toggleOperator(operator.id)}
                />
                <span>{operator.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="range-grid">
          <label className="field">
            <span>Minimum number</span>
            <NumberInput value={settings.minNumber} onChange={updateNumber("minNumber")} />
          </label>
          <label className="field">
            <span>Maximum number</span>
            <NumberInput value={settings.maxNumber} onChange={updateNumber("maxNumber")} />
          </label>
        </div>

        <Button type="submit">Start session</Button>
      </form>
    </main>
  );
}
