import type { ChangeEvent } from "react";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { NumberInput } from "../../../shared/components/NumberInput";
import type {
  ArithmeticOperator,
  ArithmeticSettings
} from "../../../modules/arithmetic/arithmeticTypes";

const operators: Array<{ id: ArithmeticOperator; label: string }> = [
  { id: "addition", label: "Addition" },
  { id: "subtraction", label: "Subtraction" },
  { id: "multiplication", label: "Multiplication" },
  { id: "division", label: "Division" }
];

type SettingsPanelProps = {
  settings: ArithmeticSettings;
  onChange: (settings: ArithmeticSettings) => void;
  onStart: () => void;
};

export function SettingsPanel({ settings, onChange, onStart }: SettingsPanelProps) {
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

  return (
    <Card className="settings-panel">
      <div className="section-heading">
        <h2>Settings</h2>
        <Button onClick={onStart}>Start</Button>
      </div>

      <label className="field">
        <span>Duration</span>
        <NumberInput
          min={5}
          step={5}
          value={settings.durationSeconds}
          onChange={updateNumber("durationSeconds")}
        />
      </label>

      <div className="field">
        <span>Operators</span>
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
      </div>

      <div className="range-grid">
        <label className="field">
          <span>Min</span>
          <NumberInput value={settings.minNumber} onChange={updateNumber("minNumber")} />
        </label>
        <label className="field">
          <span>Max</span>
          <NumberInput value={settings.maxNumber} onChange={updateNumber("maxNumber")} />
        </label>
      </div>
    </Card>
  );
}
