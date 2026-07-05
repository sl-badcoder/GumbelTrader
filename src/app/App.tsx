import { useMemo, useState } from "react";
import "./App.css";
import type { PracticeResult } from "../core/engine/PracticeResult";
import { BrowserStorageAdapter } from "../core/storage/BrowserStorageAdapter";
import type { StorageAdapter } from "../core/storage/StorageAdapter";
import { ArithmeticSessionPage } from "../features/arithmetic/ArithmeticSessionPage";
import { ArithmeticSettingsPage } from "../features/arithmetic/ArithmeticSettingsPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { useAuth } from "../features/auth/AuthContext";
import { EightyInEightSessionPage } from "../features/eightyInEight/EightyInEightSessionPage";
import { GamesPage } from "../features/home/GamesPage";
import { HomePage } from "../features/home/HomePage";
import { LeaderboardPage } from "../features/leaderboard/LeaderboardPage";
import { QuantSessionPage } from "../features/quant/QuantSessionPage";
import { QuantSettingsPage } from "../features/quant/QuantSettingsPage";
import { ResultsSummary } from "../features/results/ResultsSummary";
import { SequenceSessionPage } from "../features/sequences/SequenceSessionPage";
import { SequenceSettingsPage } from "../features/sequences/SequenceSettingsPage";
import { StatisticsPage } from "../features/statistics/StatisticsPage";
import {
  defaultArithmeticSettings,
  normalizeArithmeticSettings
} from "../modules/arithmetic/arithmeticSettings";
import type { ArithmeticSettings } from "../modules/arithmetic/arithmeticTypes";
import { availableProblemModules, problemModules } from "../modules";
import {
  defaultCombinatoricsSettings,
  defaultProbabilitySettings,
  normalizeQuantSettings
} from "../modules/quant/quantSettings";
import type { QuantSettings } from "../modules/quant/quantTypes";
import {
  defaultSequenceSettings,
  normalizeSequenceSettings
} from "../modules/sequences/sequenceSettings";
import type { SequenceSettings } from "../modules/sequences/sequenceTypes";
import { saveResult } from "../api/resultsApi";

const arithmeticSettingsStorageKey = "math-practice:arithmetic-settings:v2";
const sequenceSettingsStorageKey = "math-practice:sequence-settings";
const probabilitySettingsStorageKey = "math-practice:probability-settings";
const combinatoricsSettingsStorageKey = "math-practice:combinatorics-settings";

type RestartTarget =
  | { moduleId: "arithmetic"; settings: ArithmeticSettings }
  | { moduleId: "sequences"; settings: SequenceSettings }
  | { moduleId: "eightyInEight" }
  | { moduleId: "probability"; settings: QuantSettings }
  | { moduleId: "combinatorics"; settings: QuantSettings };

type AppView =
  | { name: "home" }
  | { name: "games" }
  | { name: "leaderboard" }
  | { name: "login" }
  | { name: "register" }
  | { name: "statistics" }
  | { name: "arithmetic-settings" }
  | { name: "arithmetic-session"; settings: ArithmeticSettings }
  | { name: "sequence-settings" }
  | { name: "sequence-session"; settings: SequenceSettings }
  | { name: "eighty-in-eight-session" }
  | { name: "probability-settings" }
  | { name: "probability-session"; settings: QuantSettings }
  | { name: "combinatorics-settings" }
  | { name: "combinatorics-session"; settings: QuantSettings }
  | { name: "results"; result: PracticeResult; restartTarget: RestartTarget };

export default function App() {
  const auth = useAuth();
  const storage = useMemo(() => new BrowserStorageAdapter(), []);
  const [arithmeticSettings, setArithmeticSettings] = useState<ArithmeticSettings>(() =>
    loadArithmeticSettings(storage)
  );
  const [sequenceSettings, setSequenceSettings] = useState<SequenceSettings>(() =>
    loadSequenceSettings(storage)
  );
  const [probabilitySettings, setProbabilitySettings] = useState<QuantSettings>(() =>
    loadQuantSettings(storage, probabilitySettingsStorageKey, defaultProbabilitySettings)
  );
  const [combinatoricsSettings, setCombinatoricsSettings] = useState<QuantSettings>(() =>
    loadQuantSettings(storage, combinatoricsSettingsStorageKey, defaultCombinatoricsSettings)
  );
  const [view, setView] = useState<AppView>({ name: "home" });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const updateArithmeticSettings = (settings: ArithmeticSettings) => {
    setArithmeticSettings(settings);
    storage.setItem(arithmeticSettingsStorageKey, JSON.stringify(settings));
  };

  const updateSequenceSettings = (settings: SequenceSettings) => {
    setSequenceSettings(settings);
    storage.setItem(sequenceSettingsStorageKey, JSON.stringify(settings));
  };

  const updateProbabilitySettings = (settings: QuantSettings) => {
    setProbabilitySettings(settings);
    storage.setItem(probabilitySettingsStorageKey, JSON.stringify(settings));
  };

  const updateCombinatoricsSettings = (settings: QuantSettings) => {
    setCombinatoricsSettings(settings);
    storage.setItem(combinatoricsSettingsStorageKey, JSON.stringify(settings));
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

  const startQuantSession = (
    moduleId: "probability" | "combinatorics",
    settings: QuantSettings
  ) => {
    const defaults = problemModules[moduleId].defaultSettings;
    const normalizedSettings = normalizeQuantSettings(settings, defaults);

    if (moduleId === "probability") {
      updateProbabilitySettings(normalizedSettings);
      setView({ name: "probability-session", settings: normalizedSettings });
      return;
    }

    updateCombinatoricsSettings(normalizedSettings);
    setView({ name: "combinatorics-session", settings: normalizedSettings });
  };

  const restartSession = (target: RestartTarget) => {
    if (target.moduleId === "arithmetic") {
      startArithmeticSession(target.settings);
      return;
    }

    if (target.moduleId === "sequences") {
      startSequenceSession(target.settings);
      return;
    }

    if (target.moduleId === "eightyInEight") {
      setView({ name: "eighty-in-eight-session" });
      return;
    }

    startQuantSession(target.moduleId, target.settings);
  };

  const goHome = () => setView({ name: "home" });
  const goGames = () => setView({ name: "games" });
  const completeSession = (result: PracticeResult, restartTarget: RestartTarget) => {
    setSaveMessage(auth.user ? "Saving result..." : "Log in to save your progress.");
    setView({ name: "results", result, restartTarget });

    if (!auth.user) {
      return;
    }

    void saveResult({
      result,
      settings:
        "settings" in restartTarget
          ? (restartTarget.settings as unknown as Record<string, unknown>)
          : {}
    })
      .then(() => setSaveMessage("Result saved."))
      .catch(() => setSaveMessage("Could not save this result."));
  };

  const isHome = view.name === "home";
  const isGames = view.name === "games";
  const isLeaderboard = view.name === "leaderboard";
  const isStatistics = view.name === "statistics";

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
            className={isLeaderboard ? "nav-link active" : "nav-link"}
            type="button"
            aria-current={isLeaderboard ? "page" : undefined}
            onClick={() => setView({ name: "leaderboard" })}
          >
            Leaderboard
          </button>
          {auth.user ? (
            <button
              className={isStatistics ? "nav-link active" : "nav-link"}
              type="button"
              aria-current={isStatistics ? "page" : undefined}
              onClick={() => setView({ name: "statistics" })}
            >
              Statistics
            </button>
          ) : null}
          <span className="nav-spacer" />
          {auth.user ? (
            <>
              <span className="nav-user">{auth.user.displayName}</span>
              <button
                className="nav-link"
                type="button"
                onClick={() => {
                  void auth.logout();
                  setView({ name: "home" });
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-link" type="button" onClick={() => setView({ name: "login" })}>
                Login
              </button>
              <button className="nav-link" type="button" onClick={() => setView({ name: "register" })}>
                Register
              </button>
            </>
          )}
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
              return;
            }

            if (moduleId === problemModules.eightyInEight.id) {
              setView({ name: "eighty-in-eight-session" });
              return;
            }

            if (moduleId === problemModules.probability.id) {
              setView({ name: "probability-settings" });
              return;
            }

            if (moduleId === problemModules.combinatorics.id) {
              setView({ name: "combinatorics-settings" });
            }
          }}
        />
      ) : null}
      {view.name === "leaderboard" ? <LeaderboardPage /> : null}
      {view.name === "login" ? (
        <LoginPage onDone={goHome} onRegister={() => setView({ name: "register" })} />
      ) : null}
      {view.name === "register" ? (
        <RegisterPage onDone={goHome} onLogin={() => setView({ name: "login" })} />
      ) : null}
      {view.name === "statistics" ? <StatisticsPage /> : null}
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
            completeSession(result, { moduleId: "arithmetic", settings: view.settings })
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
            completeSession(result, { moduleId: "sequences", settings: view.settings })
          }
        />
      ) : null}
      {view.name === "eighty-in-eight-session" ? (
        <EightyInEightSessionPage
          onBack={goGames}
          onFinish={(result) =>
            completeSession(result, { moduleId: "eightyInEight" })
          }
        />
      ) : null}
      {view.name === "probability-settings" ? (
        <QuantSettingsPage
          module={problemModules.probability}
          settings={probabilitySettings}
          onChange={updateProbabilitySettings}
          onStart={(settings) => startQuantSession("probability", settings)}
          onBack={goGames}
        />
      ) : null}
      {view.name === "probability-session" ? (
        <QuantSessionPage
          module={problemModules.probability}
          settings={view.settings}
          onBack={() => setView({ name: "probability-settings" })}
          onFinish={(result) =>
            completeSession(result, { moduleId: "probability", settings: view.settings })
          }
        />
      ) : null}
      {view.name === "combinatorics-settings" ? (
        <QuantSettingsPage
          module={problemModules.combinatorics}
          settings={combinatoricsSettings}
          onChange={updateCombinatoricsSettings}
          onStart={(settings) => startQuantSession("combinatorics", settings)}
          onBack={goGames}
        />
      ) : null}
      {view.name === "combinatorics-session" ? (
        <QuantSessionPage
          module={problemModules.combinatorics}
          settings={view.settings}
          onBack={() => setView({ name: "combinatorics-settings" })}
          onFinish={(result) =>
            completeSession(result, { moduleId: "combinatorics", settings: view.settings })
          }
        />
      ) : null}
      {view.name === "results" ? (
        <ResultsSummary
          result={view.result}
          onRestart={() => restartSession(view.restartTarget)}
          onHome={() => setView({ name: "home" })}
          saveMessage={saveMessage}
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

function loadQuantSettings(
  storage: StorageAdapter,
  storageKey: string,
  defaults: QuantSettings
): QuantSettings {
  const storedSettings = storage.getItem(storageKey);

  if (!storedSettings) {
    return defaults;
  }

  try {
    return normalizeQuantSettings(JSON.parse(storedSettings) as Partial<QuantSettings>, defaults);
  } catch {
    storage.removeItem(storageKey);
    return defaults;
  }
}
