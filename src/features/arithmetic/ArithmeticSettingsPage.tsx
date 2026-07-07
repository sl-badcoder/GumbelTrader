import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "../../shared/components/Button";
import { NumberInput } from "../../shared/components/NumberInput";
import type {
  ArithmeticOperandRange,
  ArithmeticOperator,
  ArithmeticSettings
} from "../../modules/arithmetic/arithmeticTypes";
import { defaultArithmeticSettings } from "../../modules/arithmetic/arithmeticSettings";

const operators: Array<{
  id: ArithmeticOperator;
  label: string;
  expression: string;
  leftLabel: string;
  rightLabel: string;
  note: string;
}> = [
  {
    id: "addition",
    label: "Addition",
    expression: "a + b",
    leftLabel: "a",
    rightLabel: "b",
    note: "Both numbers are picked from their own range."
  },
  {
    id: "subtraction",
    label: "Subtraction",
    expression: "a - b",
    leftLabel: "a",
    rightLabel: "b",
    note: "The app keeps a greater than or equal to b."
  },
  {
    id: "multiplication",
    label: "Multiplication",
    expression: "a x b",
    leftLabel: "a",
    rightLabel: "b",
    note: "Use a smaller range for times tables and a larger range for b."
  },
  {
    id: "division",
    label: "Division",
    expression: "(d x q) / d",
    leftLabel: "divisor d",
    rightLabel: "answer q",
    note: "Problems are generated as dividend / divisor, so answers stay whole."
  }
];

type ArithmeticSettingsPageProps = {
  settings: ArithmeticSettings;
  onChange: (settings: ArithmeticSettings) => void;
  leaderboardMode: boolean;
  onLeaderboardModeChange: (enabled: boolean) => void;
  onStart: (settings: ArithmeticSettings) => void;
  onBack: () => void;
};

export function ArithmeticSettingsPage({
  settings,
  onChange,
  leaderboardMode,
  onLeaderboardModeChange,
  onStart,
  onBack
}: ArithmeticSettingsPageProps) {
  const [expandedOperators, setExpandedOperators] = useState<ArithmeticOperator[]>([]);
  const displayedSettings = leaderboardMode ? defaultArithmeticSettings : settings;

  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      durationSeconds: Number(event.target.value)
    });
  };

  const updateRange =
    (operator: ArithmeticOperator, key: keyof ArithmeticOperandRange) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...settings,
        operandRanges: {
          ...settings.operandRanges,
          [operator]: {
            ...settings.operandRanges[operator],
            [key]: Number(event.target.value)
          }
        }
      });
    };

  const toggleOperator = (operator: ArithmeticOperator) => {
    const enabledOperators = displayedSettings.enabledOperators.includes(operator)
      ? displayedSettings.enabledOperators.filter((item) => item !== operator)
      : [...displayedSettings.enabledOperators, operator];

    onChange({
      ...settings,
      enabledOperators
    });
  };

  const toggleRangeVisibility = (operator: ArithmeticOperator) => {
    setExpandedOperators((current) =>
      current.includes(operator)
        ? current.filter((item) => item !== operator)
        : [...current, operator]
    );
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onStart(displayedSettings);
  };

  return (
    <main className="page settings-page">
      <button className="plain-link" type="button" onClick={onBack}>
        Back to games
      </button>

      <form className="panel settings-form" onSubmit={submit}>
        <div className="page-heading">
          <h2>Arithmetic Practice</h2>
          <p>Choose the operators and ranges for this session.</p>
        </div>

        <div className="compact-setting-row">
          <label className="field duration-field">
            <span>Duration</span>
            <NumberInput
              min={5}
              step={5}
              value={displayedSettings.durationSeconds}
              disabled={leaderboardMode}
              onChange={updateDuration}
            />
          </label>
          <p>Seconds per session. Operator rows below control which problems can appear.</p>
        </div>

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
          <legend>Operators and ranges</legend>
          <div className="operator-range-list">
            {operators.map((operator) => {
              const range = displayedSettings.operandRanges[operator.id];
              const isEnabled = displayedSettings.enabledOperators.includes(operator.id);
              const isExpanded = expandedOperators.includes(operator.id);

              return (
                <section
                  className={isEnabled ? "operator-range" : "operator-range muted"}
                  key={operator.id}
                >
                  <div className="operator-range-header">
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        disabled={leaderboardMode}
                        onChange={() => toggleOperator(operator.id)}
                      />
                      <span>{operator.label}</span>
                    </label>
                    <code>{operator.expression}</code>
                  </div>
                  <div className="operator-range-summary">
                    <div>
                      <span>
                        {operator.leftLabel}: {range.leftMin}-{range.leftMax}
                      </span>
                      <span>
                        {operator.rightLabel}: {range.rightMin}-{range.rightMax}
                      </span>
                    </div>
                    <button
                      className="range-toggle-button"
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Hide" : "Show"} ${operator.label} ranges`}
                      onClick={() => toggleRangeVisibility(operator.id)}
                    >
                      {isExpanded ? "▾" : "▸"}
                    </button>
                  </div>
                  {isExpanded ? (
                    <div className="operator-range-body">
                      <div className="range-control-group">
                        <span>{operator.leftLabel} range</span>
                        <div className="mini-range-grid">
                          <label className="field">
                            <span>Min</span>
                            <NumberInput
                              value={range.leftMin}
                              disabled={leaderboardMode}
                              onChange={updateRange(operator.id, "leftMin")}
                            />
                          </label>
                          <label className="field">
                            <span>Max</span>
                            <NumberInput
                              value={range.leftMax}
                              disabled={leaderboardMode}
                              onChange={updateRange(operator.id, "leftMax")}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="range-control-group">
                        <span>{operator.rightLabel} range</span>
                        <div className="mini-range-grid">
                          <label className="field">
                            <span>Min</span>
                            <NumberInput
                              value={range.rightMin}
                              disabled={leaderboardMode}
                              onChange={updateRange(operator.id, "rightMin")}
                            />
                          </label>
                          <label className="field">
                            <span>Max</span>
                            <NumberInput
                              value={range.rightMax}
                              disabled={leaderboardMode}
                              onChange={updateRange(operator.id, "rightMax")}
                            />
                          </label>
                        </div>
                      </div>
                      <p>{operator.note}</p>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </fieldset>

        <Button type="submit">Start session</Button>
      </form>
    </main>
  );
}
