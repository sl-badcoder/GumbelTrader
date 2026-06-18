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
import {
  defaultArithmeticSettings,
  normalizeArithmeticSettings
} from "../modules/arithmetic/arithmeticSettings";
import type { ArithmeticSettings } from "../modules/arithmetic/arithmeticTypes";
import { availableProblemModules, problemModules } from "../modules";

const settingsStorageKey = "math-practice:arithmetic-settings";

type AppView =
  | { name: "home" }
  | { name: "games" }
  | { name: "arithmetic-settings" }
  | { name: "arithmetic-session"; settings: ArithmeticSettings }
  | { name: "results"; result: PracticeResult; settings: ArithmeticSettings };

export default function App() {
  const storage = useMemo(() => new BrowserStorageAdapter(), []);
  const [arithmeticSettings, setArithmeticSettings] = useState<ArithmeticSettings>(() =>
    loadArithmeticSettings(storage)
  );
  const [view, setView] = useState<AppView>({ name: "home" });

  const updateArithmeticSettings = (settings: ArithmeticSettings) => {
    setArithmeticSettings(settings);
    storage.setItem(settingsStorageKey, JSON.stringify(settings));
  };

  const startArithmeticSession = (settings: ArithmeticSettings) => {
    const normalizedSettings = normalizeArithmeticSettings(settings);
    updateArithmeticSettings(normalizedSettings);
    setView({ name: "arithmetic-session", settings: normalizedSettings });
  };

  const goHome = () => setView({ name: "home" });
  const goGames = () => setView({ name: "games" });
  const goArithmeticSettings = () => setView({ name: "arithmetic-settings" });

  const isHome = view.name === "home";
  const isGames = view.name === "games";
  const isArithmetic =
    view.name === "arithmetic-settings" ||
    view.name === "arithmetic-session" ||
    (view.name === "results" && view.result.moduleId === problemModules.arithmetic.id);

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
          <button
            className={isArithmetic ? "nav-link active" : "nav-link"}
            type="button"
            aria-current={isArithmetic ? "page" : undefined}
            onClick={goArithmeticSettings}
          >
            Arithmetic Practice
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
          onFinish={(result) => setView({ name: "results", result, settings: view.settings })}
        />
      ) : null}
      {view.name === "results" ? (
        <ResultsSummary
          result={view.result}
          onRestart={() => startArithmeticSession(view.settings)}
          onHome={() => setView({ name: "home" })}
        />
      ) : null}
    </div>
  );
}

function loadArithmeticSettings(storage: StorageAdapter): ArithmeticSettings {
  const storedSettings = storage.getItem(settingsStorageKey);

  if (!storedSettings) {
    return defaultArithmeticSettings;
  }

  try {
    return normalizeArithmeticSettings(JSON.parse(storedSettings) as ArithmeticSettings);
  } catch {
    storage.removeItem(settingsStorageKey);
    return defaultArithmeticSettings;
  }
}
