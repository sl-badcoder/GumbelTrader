import { useMemo, useState } from "react";
import type { StorageAdapter } from "../../core/storage/StorageAdapter";
import { arithmeticModule } from "../../modules/arithmetic/arithmeticModule";
import {
  defaultArithmeticSettings,
  normalizeArithmeticSettings
} from "../../modules/arithmetic/arithmeticSettings";
import type { ArithmeticSettings } from "../../modules/arithmetic/arithmeticTypes";
import { SettingsPanel } from "./settings/SettingsPanel";
import { PracticeSessionView } from "./PracticeSessionView";
import { ResultsSummary } from "./results/ResultsSummary";
import { usePracticeSession } from "./usePracticeSession";

const settingsStorageKey = "math-practice:arithmetic-settings";

type PracticePageProps = {
  storage: StorageAdapter;
};

export function PracticePage({ storage }: PracticePageProps) {
  const [settings, setSettings] = useState<ArithmeticSettings>(() =>
    loadSettings(storage)
  );
  const normalizedSettings = useMemo(
    () => normalizeArithmeticSettings(settings),
    [settings]
  );
  const practice = usePracticeSession({
    module: arithmeticModule,
    settings: normalizedSettings,
    durationSeconds: normalizedSettings.durationSeconds
  });

  const updateSettings = (nextSettings: ArithmeticSettings) => {
    setSettings(nextSettings);
    storage.setItem(settingsStorageKey, JSON.stringify(nextSettings));
  };

  const feedback = practice.lastResult?.message ?? null;

  return (
    <main className="app-main">
      <SettingsPanel
        settings={settings}
        onChange={updateSettings}
        onStart={practice.restart}
      />

      <div className="practice-stack">
        <PracticeSessionView
          prompt={practice.prompt}
          answer={practice.answer}
          score={practice.session.score}
          attempts={practice.session.attempts}
          remainingSeconds={practice.remainingSeconds}
          isEnded={practice.isEnded}
          feedback={feedback}
          onAnswerChange={practice.setAnswer}
          onSubmit={practice.submitAnswer}
        />

        {practice.isEnded ? (
          <ResultsSummary
            score={practice.session.score}
            attempts={practice.session.attempts}
            correct={practice.session.correct}
            accuracy={practice.accuracy}
            onRestart={practice.restart}
          />
        ) : null}
      </div>
    </main>
  );
}

function loadSettings(storage: StorageAdapter): ArithmeticSettings {
  const storedSettings = storage.getItem(settingsStorageKey);

  if (!storedSettings) {
    return defaultArithmeticSettings;
  }

  try {
    const parsedSettings = JSON.parse(storedSettings) as ArithmeticSettings;
    return normalizeArithmeticSettings(parsedSettings);
  } catch {
    storage.removeItem(settingsStorageKey);
    return defaultArithmeticSettings;
  }
}
