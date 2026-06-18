import { useMemo, useState } from "react";
import "./App.css";
import type { PracticeResult } from "../core/engine/PracticeResult";
import { BrowserStorageAdapter } from "../core/storage/BrowserStorageAdapter";
import type { StorageAdapter } from "../core/storage/StorageAdapter";
import { ArithmeticSessionPage } from "../features/arithmetic/ArithmeticSessionPage";
import { ArithmeticSettingsPage } from "../features/arithmetic/ArithmeticSettingsPage";
import { GamesPage } from "../features/home/GamesPage";
import { HomePage } from "../features/home/HomePage";
import { ResultsSummary } from "../features/results/ResultsSummary";
import { SequenceSessionPage } from "../features/sequences/SequenceSessionPage";
import { SequenceSettingsPage } from "../features/sequences/SequenceSettingsPage";
import {
  defaultArithmeticSettings,
  normalizeArithmeticSettings
} from "../modules/arithmetic/arithmeticSettings";
import type { ArithmeticSettings } from "../modules/arithmetic/arithmeticTypes";
import { availableProblemModules, problemModules } from "../modules";
import {
  defaultSequenceSettings,
  normalizeSequenceSettings
} from "../modules/sequences/sequenceSettings";
import type { SequenceSettings } from "../modules/sequences/sequenceTypes";

const arithmeticSettingsStorageKey = "math-practice:arithmetic-settings";
const sequenceSettingsStorageKey = "math-practice:sequence-settings";

type RestartTarget =
  | { moduleId: "arithmetic"; settings: ArithmeticSettings }
  | { moduleId: "sequences"; settings: SequenceSettings };

type AppView =
  | { name: "home" }
  | { name: "games" }
  | { name: "arithmetic-settings" }
  | { name: "arithmetic-session"; settings: ArithmeticSettings }
  | { name: "sequence-settings" }
  | { name: "sequence-session"; settings: SequenceSettings }
  | { name: "results"; result: PracticeResult; restartTarget: RestartTarget };

export default function App() {
  const storage = useMemo(() => new BrowserStorageAdapter(), []);
  const [arithmeticSettings, setArithmeticSettings] = useState<ArithmeticSettings>(() =>
    loadArithmeticSettings(storage)
  );
  const [sequenceSettings, setSequenceSettings] = useState<SequenceSettings>(() =>
    loadSequenceSettings(storage)
  );
  const [view, setView] = useState<AppView>({ name: "home" });

  const updateArithmeticSettings = (settings: ArithmeticSettings) => {
    setArithmeticSettings(settings);
    storage.setItem(arithmeticSettingsStorageKey, JSON.stringify(settings));
  };

  const updateSequenceSettings = (settings: SequenceSettings) => {
    setSequenceSettings(settings);
    storage.setItem(sequenceSettingsStorageKey, JSON.stringify(settings));
  };

  const startArithmeticSession = (settings: ArithmeticSettings) => {
    const normalizedSettings = normalizeArithmeticSettings(settings);
    updateArithmeticSettings(normalizedSettings);
    setView({ name: "arithmetic-session", settings: normalizedSettings });
  };

  const startSequenceSession = (settings: SequenceSettings) => {
    const normalizedSettings = normalizeSequenceSettings(settings);
    updateSequenceSettings(normalizedSettings);
    setView({ name: "sequence-session", settings: normalizedSettings });
  };

  const restartSession = (target: RestartTarget) => {
    if (target.moduleId === "arithmetic") {
      startArithmeticSession(target.settings);
      return;
    }

    startSequenceSession(target.settings);
  };

  const goHome = () => setView({ name: "home" });
  const goGames = () => setView({ name: "games" });

  const isHome = view.name === "home";
  const isGames = view.name === "games";

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="masthead">
          <button className="site-title" type="button" onClick={goHome}>
            Gumbel Math
          </button>
          <p>Short timed practice for arithmetic and problem solving.</p>
        </div>
        <nav className="top-nav" aria-label="Main navigation">
          <button
            className={isHome ? "nav-link active" : "nav-link"}
            type="button"
            aria-current={isHome ? "page" : undefined}
            onClick={goHome}
          >
            Home
          </button>
          <button
            className={isGames ? "nav-link active" : "nav-link"}
            type="button"
            aria-current={isGames ? "page" : undefined}
            onClick={goGames}
          >
            Games
          </button>
        </nav>
      </header>
      {view.name === "home" ? (
        <HomePage onBrowseGames={goGames} />
      ) : null}
      {view.name === "games" ? (
        <GamesPage
          modules={availableProblemModules}
          onSelectModule={(moduleId) => {
            if (moduleId === problemModules.arithmetic.id) {
              setView({ name: "arithmetic-settings" });
              return;
            }

            if (moduleId === problemModules.sequences.id) {
              setView({ name: "sequence-settings" });
            }
          }}
        />
      ) : null}
      {view.name === "arithmetic-settings" ? (
        <ArithmeticSettingsPage
          settings={arithmeticSettings}
          onChange={updateArithmeticSettings}
          onStart={startArithmeticSession}
          onBack={goGames}
        />
      ) : null}
      {view.name === "arithmetic-session" ? (
        <ArithmeticSessionPage
          settings={view.settings}
          onBack={() => setView({ name: "arithmetic-settings" })}
          onFinish={(result) =>
            setView({
              name: "results",
              result,
              restartTarget: { moduleId: "arithmetic", settings: view.settings }
            })
          }
        />
      ) : null}
      {view.name === "sequence-settings" ? (
        <SequenceSettingsPage
          settings={sequenceSettings}
          onChange={updateSequenceSettings}
          onStart={startSequenceSession}
          onBack={goGames}
        />
      ) : null}
      {view.name === "sequence-session" ? (
        <SequenceSessionPage
          settings={view.settings}
          onBack={() => setView({ name: "sequence-settings" })}
          onFinish={(result) =>
            setView({
              name: "results",
              result,
              restartTarget: { moduleId: "sequences", settings: view.settings }
            })
          }
        />
      ) : null}
      {view.name === "results" ? (
        <ResultsSummary
          result={view.result}
          onRestart={() => restartSession(view.restartTarget)}
          onHome={() => setView({ name: "home" })}
        />
      ) : null}
    </div>
  );
}

function loadArithmeticSettings(storage: StorageAdapter): ArithmeticSettings {
  const storedSettings = storage.getItem(arithmeticSettingsStorageKey);

  if (!storedSettings) {
    return defaultArithmeticSettings;
  }

  try {
    return normalizeArithmeticSettings(JSON.parse(storedSettings) as ArithmeticSettings);
  } catch {
    storage.removeItem(arithmeticSettingsStorageKey);
    return defaultArithmeticSettings;
  }
}

function loadSequenceSettings(storage: StorageAdapter): SequenceSettings {
  const storedSettings = storage.getItem(sequenceSettingsStorageKey);

  if (!storedSettings) {
    return defaultSequenceSettings;
  }

  try {
    return normalizeSequenceSettings(JSON.parse(storedSettings) as SequenceSettings);
  } catch {
    storage.removeItem(sequenceSettingsStorageKey);
    return defaultSequenceSettings;
  }
}
