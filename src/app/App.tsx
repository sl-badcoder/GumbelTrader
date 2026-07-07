import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import type { PracticeResult } from "../core/engine/PracticeResult";
import { BrowserStorageAdapter } from "../core/storage/BrowserStorageAdapter";
import type { StorageAdapter } from "../core/storage/StorageAdapter";
import { ArithmeticSessionPage } from "../features/arithmetic/ArithmeticSessionPage";
import { ArithmeticSettingsPage } from "../features/arithmetic/ArithmeticSettingsPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { useAuth } from "../features/auth/AuthContext";
import { GamesPage } from "../features/home/GamesPage";
import { HomePage } from "../features/home/HomePage";
import { IntuitiveMathSessionPage } from "../features/intuitiveMath/IntuitiveMathSessionPage";
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
import { isIntuitiveMathModuleId } from "../modules/intuitiveMath/modules";
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
const arithmeticLeaderboardModeStorageKey = "math-practice:arithmetic-leaderboard-mode";
const sequenceLeaderboardModeStorageKey = "math-practice:sequence-leaderboard-mode";
const probabilityLeaderboardModeStorageKey = "math-practice:probability-leaderboard-mode";
const combinatoricsLeaderboardModeStorageKey = "math-practice:combinatorics-leaderboard-mode";

type RestartTarget =
  | { kind: "arithmetic"; settings: ArithmeticSettings }
  | { kind: "sequences"; settings: SequenceSettings }
  | { kind: "intuitiveMath"; moduleId: string }
  | { kind: "probability"; settings: QuantSettings }
  | { kind: "combinatorics"; settings: QuantSettings };

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
  | { name: "intuitive-math-session"; moduleId: string }
  | { name: "probability-settings" }
  | { name: "probability-session"; settings: QuantSettings }
  | { name: "combinatorics-settings" }
  | { name: "combinatorics-session"; settings: QuantSettings }
  | { name: "results"; result: PracticeResult; restartTarget: RestartTarget };

type AppHistoryState = {
  view: AppView;
  selectedGameGroupId: string | null;
};

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
  const [arithmeticLeaderboardMode, setArithmeticLeaderboardMode] = useState<boolean>(() =>
    loadBoolean(storage, arithmeticLeaderboardModeStorageKey, true)
  );
  const [sequenceLeaderboardMode, setSequenceLeaderboardMode] = useState<boolean>(() =>
    loadBoolean(storage, sequenceLeaderboardModeStorageKey, true)
  );
  const [probabilityLeaderboardMode, setProbabilityLeaderboardMode] = useState<boolean>(() =>
    loadBoolean(storage, probabilityLeaderboardModeStorageKey, true)
  );
  const [combinatoricsLeaderboardMode, setCombinatoricsLeaderboardMode] = useState<boolean>(() =>
    loadBoolean(storage, combinatoricsLeaderboardModeStorageKey, true)
  );
  const [view, setView] = useState<AppView>({ name: "home" });
  const [selectedGameGroupId, setSelectedGameGroupId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const isApplyingHistory = useRef(false);

  const navigate = useCallback(
    (
      nextView: AppView,
      nextSelectedGameGroupId = selectedGameGroupId,
      historyMode: "push" | "replace" = "push"
    ) => {
      setView(nextView);
      setSelectedGameGroupId(nextSelectedGameGroupId);

      if (isApplyingHistory.current || typeof window === "undefined") {
        return;
      }

      const historyState: AppHistoryState = {
        view: nextView,
        selectedGameGroupId: nextSelectedGameGroupId
      };

      if (historyMode === "replace") {
        window.history.replaceState(historyState, "");
        return;
      }

      window.history.pushState(historyState, "");
    },
    [selectedGameGroupId]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const initialState: AppHistoryState = {
      view,
      selectedGameGroupId
    };
    window.history.replaceState(initialState, "");

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as Partial<AppHistoryState> | null;

      if (!state?.view) {
        return;
      }

      isApplyingHistory.current = true;
      setView(state.view);
      setSelectedGameGroupId(state.selectedGameGroupId ?? null);
      window.setTimeout(() => {
        isApplyingHistory.current = false;
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  const updateArithmeticLeaderboardMode = (enabled: boolean) => {
    setArithmeticLeaderboardMode(enabled);
    storage.setItem(arithmeticLeaderboardModeStorageKey, JSON.stringify(enabled));
  };

  const updateSequenceLeaderboardMode = (enabled: boolean) => {
    setSequenceLeaderboardMode(enabled);
    storage.setItem(sequenceLeaderboardModeStorageKey, JSON.stringify(enabled));
  };

  const updateProbabilityLeaderboardMode = (enabled: boolean) => {
    setProbabilityLeaderboardMode(enabled);
    storage.setItem(probabilityLeaderboardModeStorageKey, JSON.stringify(enabled));
  };

  const updateCombinatoricsLeaderboardMode = (enabled: boolean) => {
    setCombinatoricsLeaderboardMode(enabled);
    storage.setItem(combinatoricsLeaderboardModeStorageKey, JSON.stringify(enabled));
  };

  const startArithmeticSession = (settings: ArithmeticSettings) => {
    const normalizedSettings = normalizeArithmeticSettings(settings);
    updateArithmeticSettings(normalizedSettings);
    navigate({ name: "arithmetic-session", settings: normalizedSettings });
  };

  const startSequenceSession = (settings: SequenceSettings) => {
    const normalizedSettings = normalizeSequenceSettings(settings);
    updateSequenceSettings(normalizedSettings);
    navigate({ name: "sequence-session", settings: normalizedSettings });
  };

  const startQuantSession = (
    moduleId: "probability" | "combinatorics",
    settings: QuantSettings
  ) => {
    const defaults = problemModules[moduleId].defaultSettings;
    const normalizedSettings = normalizeQuantSettings(settings, defaults);

    if (moduleId === "probability") {
      updateProbabilitySettings(normalizedSettings);
      navigate({ name: "probability-session", settings: normalizedSettings });
      return;
    }

    updateCombinatoricsSettings(normalizedSettings);
    navigate({ name: "combinatorics-session", settings: normalizedSettings });
  };

  const restartSession = (target: RestartTarget) => {
    if (target.kind === "arithmetic") {
      startArithmeticSession(target.settings);
      return;
    }

    if (target.kind === "sequences") {
      startSequenceSession(target.settings);
      return;
    }

    if (target.kind === "intuitiveMath") {
      navigate({ name: "intuitive-math-session", moduleId: target.moduleId });
      return;
    }

    if (target.kind === "probability" || target.kind === "combinatorics") {
      startQuantSession(target.kind, target.settings);
    }
  };

  const goHome = () => navigate({ name: "home" }, null);
  const goGames = () => navigate({ name: "games" }, null);
  const completeSession = (result: PracticeResult, restartTarget: RestartTarget) => {
    setSaveMessage(auth.user ? "Saving result..." : "Log in to save your progress.");
    navigate({ name: "results", result, restartTarget });

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
            onClick={() => navigate({ name: "leaderboard" }, null)}
          >
            Leaderboard
          </button>
          {auth.user ? (
            <button
              className={isStatistics ? "nav-link active" : "nav-link"}
              type="button"
              aria-current={isStatistics ? "page" : undefined}
              onClick={() => navigate({ name: "statistics" }, null)}
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
                  navigate({ name: "home" }, null);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-link" type="button" onClick={() => navigate({ name: "login" }, null)}>
                Login
              </button>
              <button className="nav-link" type="button" onClick={() => navigate({ name: "register" }, null)}>
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
          selectedGroupId={selectedGameGroupId}
          onSelectGroup={(groupId) => navigate({ name: "games" }, groupId)}
          onBackToGroups={() => navigate({ name: "games" }, null)}
          onSelectModule={(moduleId) => {
            if (moduleId === problemModules.arithmetic.id) {
              navigate({ name: "arithmetic-settings" });
              return;
            }

            if (moduleId === problemModules.sequences.id) {
              navigate({ name: "sequence-settings" });
              return;
            }

            if (moduleId === "eighty-in-eight") {
              navigate({ name: "intuitive-math-session", moduleId: problemModules.eightyInEightMc.id });
              return;
            }

            if (isIntuitiveMathModuleId(moduleId)) {
              navigate({ name: "intuitive-math-session", moduleId });
              return;
            }

            if (moduleId === problemModules.probability.id) {
              navigate({ name: "probability-settings" });
              return;
            }

            if (moduleId === problemModules.combinatorics.id) {
              navigate({ name: "combinatorics-settings" });
            }
          }}
        />
      ) : null}
      {view.name === "leaderboard" ? <LeaderboardPage /> : null}
      {view.name === "login" ? (
        <LoginPage onDone={goHome} onRegister={() => navigate({ name: "register" }, null)} />
      ) : null}
      {view.name === "register" ? (
        <RegisterPage onDone={goHome} onLogin={() => navigate({ name: "login" }, null)} />
      ) : null}
      {view.name === "statistics" ? <StatisticsPage /> : null}
      {view.name === "arithmetic-settings" ? (
        <ArithmeticSettingsPage
          settings={arithmeticSettings}
          onChange={updateArithmeticSettings}
          leaderboardMode={arithmeticLeaderboardMode}
          onLeaderboardModeChange={updateArithmeticLeaderboardMode}
          onStart={(settings) =>
            startArithmeticSession(arithmeticLeaderboardMode ? defaultArithmeticSettings : settings)
          }
          onBack={goGames}
        />
      ) : null}
      {view.name === "arithmetic-session" ? (
        <ArithmeticSessionPage
          settings={view.settings}
          onBack={() => navigate({ name: "arithmetic-settings" })}
          onFinish={(result) =>
            completeSession(result, { kind: "arithmetic", settings: view.settings })
          }
        />
      ) : null}
      {view.name === "sequence-settings" ? (
        <SequenceSettingsPage
          settings={sequenceSettings}
          onChange={updateSequenceSettings}
          leaderboardMode={sequenceLeaderboardMode}
          onLeaderboardModeChange={updateSequenceLeaderboardMode}
          onStart={(settings) =>
            startSequenceSession(sequenceLeaderboardMode ? defaultSequenceSettings : settings)
          }
          onBack={goGames}
        />
      ) : null}
      {view.name === "sequence-session" ? (
        <SequenceSessionPage
          settings={view.settings}
          onBack={() => navigate({ name: "sequence-settings" })}
          onFinish={(result) =>
            completeSession(result, { kind: "sequences", settings: view.settings })
          }
        />
      ) : null}
      {view.name === "intuitive-math-session" ? (
        <IntuitiveMathSessionPage
          moduleId={view.moduleId}
          onBack={goGames}
          onFinish={(result) =>
            completeSession(result, { kind: "intuitiveMath", moduleId: view.moduleId })
          }
        />
      ) : null}
      {view.name === "probability-settings" ? (
        <QuantSettingsPage
          module={problemModules.probability}
          settings={probabilitySettings}
          onChange={updateProbabilitySettings}
          leaderboardMode={probabilityLeaderboardMode}
          onLeaderboardModeChange={updateProbabilityLeaderboardMode}
          onStart={(settings) =>
            startQuantSession(
              "probability",
              probabilityLeaderboardMode ? defaultProbabilitySettings : settings
            )
          }
          onBack={goGames}
        />
      ) : null}
      {view.name === "probability-session" ? (
        <QuantSessionPage
          module={problemModules.probability}
          settings={view.settings}
          onBack={() => navigate({ name: "probability-settings" })}
          onFinish={(result) =>
            completeSession(result, { kind: "probability", settings: view.settings })
          }
        />
      ) : null}
      {view.name === "combinatorics-settings" ? (
        <QuantSettingsPage
          module={problemModules.combinatorics}
          settings={combinatoricsSettings}
          onChange={updateCombinatoricsSettings}
          leaderboardMode={combinatoricsLeaderboardMode}
          onLeaderboardModeChange={updateCombinatoricsLeaderboardMode}
          onStart={(settings) =>
            startQuantSession(
              "combinatorics",
              combinatoricsLeaderboardMode ? defaultCombinatoricsSettings : settings
            )
          }
          onBack={goGames}
        />
      ) : null}
      {view.name === "combinatorics-session" ? (
        <QuantSessionPage
          module={problemModules.combinatorics}
          settings={view.settings}
          onBack={() => navigate({ name: "combinatorics-settings" })}
          onFinish={(result) =>
            completeSession(result, { kind: "combinatorics", settings: view.settings })
          }
        />
      ) : null}
      {view.name === "results" ? (
        <ResultsSummary
          result={view.result}
          onRestart={() => restartSession(view.restartTarget)}
          onHome={() => navigate({ name: "home" }, null)}
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

function loadBoolean(storage: StorageAdapter, storageKey: string, fallback: boolean): boolean {
  const storedValue = storage.getItem(storageKey);

  if (storedValue === null) {
    return fallback;
  }

  try {
    return Boolean(JSON.parse(storedValue));
  } catch {
    storage.removeItem(storageKey);
    return fallback;
  }
}
