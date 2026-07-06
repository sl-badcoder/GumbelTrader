import { useEffect, useRef, useState } from "react";
import type { PracticeResult } from "../../core/engine/PracticeResult";
import { getIntuitiveMathModule } from "../../modules/intuitiveMath/modules";
import type {
  IntuitiveMathPrompt,
  IntuitiveMathSession,
  IntuitiveMathSettings
} from "../../modules/intuitiveMath/intuitiveMathTypes";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { PracticeSessionView } from "../practice/PracticeSessionView";
import { usePracticeSession } from "../practice/usePracticeSession";

type IntuitiveMathSessionPageProps = {
  moduleId: string;
  onFinish: (result: PracticeResult) => void;
  onBack: () => void;
};

export function IntuitiveMathSessionPage({
  moduleId,
  onFinish,
  onBack
}: IntuitiveMathSessionPageProps) {
  const module = getIntuitiveMathModule(moduleId);

  if (!module) {
    return (
      <main className="page practice-page">
        <div className="session-heading">
          <div>
            <h2>Practice module not found</h2>
            <p>Return to games and choose another module.</p>
          </div>
          <Button className="secondary-button" onClick={onBack}>
            Back to games
          </Button>
        </div>
      </main>
    );
  }

  return <LoadedIntuitiveMathSessionPage module={module} onFinish={onFinish} onBack={onBack} />;
}

type LoadedIntuitiveMathSessionPageProps = {
  module: ReturnType<typeof getIntuitiveMathModule> extends infer T ? NonNullable<T> : never;
  onFinish: (result: PracticeResult) => void;
  onBack: () => void;
};

function LoadedIntuitiveMathSessionPage({
  module,
  onFinish,
  onBack
}: LoadedIntuitiveMathSessionPageProps) {
  const settings = module.defaultSettings;
  const countdownSeconds = settings.startCountdownSeconds ?? 0;
  const needsStart = countdownSeconds > 0;
  const [startState, setStartState] = useState<"idle" | "countdown" | "running">(
    needsStart ? "idle" : "running"
  );
  const [countdownValue, setCountdownValue] = useState(countdownSeconds);
  const isActive = startState === "running";
  const practice = usePracticeSession<
    IntuitiveMathSettings,
    IntuitiveMathSession,
    IntuitiveMathPrompt
  >({
    module,
    settings,
    durationSeconds: settings.durationSeconds,
    questionLimit: settings.questionLimit,
    autoAdvanceOnCorrectAnswer: false,
    isActive
  });
  const hasFinished = useRef(false);
  const hasActivated = useRef(!needsStart);

  useEffect(() => {
    if (startState !== "countdown") {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setCountdownValue((current) => {
        if (current > 1) {
          return current - 1;
        }

        if (current === 1) {
          return 0;
        }

        window.clearInterval(timerId);
        setStartState("running");
        return current;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [startState]);

  useEffect(() => {
    if (!isActive || hasActivated.current) {
      return;
    }

    hasActivated.current = true;
    practice.restart();
  }, [isActive, practice]);

  useEffect(() => {
    if (!isActive || !practice.isEnded || hasFinished.current) {
      return;
    }

    hasFinished.current = true;
    const elapsedSeconds = Math.max(
      0,
      Math.round((Date.now() - practice.session.startedAt) / 1000)
    );
    const durationSeconds = settings.durationSeconds ?? elapsedSeconds;

    onFinish({
      moduleId: module.id,
      moduleTitle: module.title,
      score: practice.session.score,
      attempts: practice.session.attempts,
      correct: practice.session.correct,
      incorrect: Math.max(0, practice.session.attempts - practice.session.correct),
      accuracy: practice.accuracy,
      durationSeconds,
      totalQuestions: settings.questionLimit ?? undefined,
      averageSecondsPerQuestion:
        practice.session.attempts > 0 ? durationSeconds / practice.session.attempts : 0
    });
  }, [
    module.id,
    module.title,
    onFinish,
    isActive,
    practice.accuracy,
    practice.isEnded,
    practice.session.attempts,
    practice.session.correct,
    practice.session.score,
    practice.session.startedAt,
    settings.durationSeconds,
    settings.questionLimit
  ]);

  const feedback = settings.immediateFeedback
    ? [
        practice.lastResult?.message,
        !practice.lastResult?.isCorrect && practice.lastPrompt?.explanation
          ? practice.lastPrompt.explanation
          : null
      ]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <main className="page practice-page">
      <div className="session-heading">
        <div>
          <h2>{module.title}</h2>
          <p>
            {settings.questionLimit
              ? "Choose the best answer. Feedback is shown after the final score."
              : "Choose the best answer. Feedback appears after each response."}
          </p>
        </div>
        <Button className="secondary-button" onClick={onBack}>
          Back to games
        </Button>
      </div>

      {startState === "idle" ? (
        <Card className="practice-card countdown-card">
          <span>Ready</span>
          <strong>{settings.questionLimit} in 8</strong>
          <Button
            onClick={() => {
              setCountdownValue(countdownSeconds);
              setStartState("countdown");
            }}
          >
            Start
          </Button>
        </Card>
      ) : null}

      {startState === "countdown" ? (
        <Card className="practice-card countdown-card" aria-live="polite">
          <span>Starting in</span>
          <strong>{countdownValue > 0 ? countdownValue : "Go"}</strong>
        </Card>
      ) : null}

      {startState === "running" ? (
        <PracticeSessionView
          prompt={practice.prompt}
          answer={practice.answer}
          score={practice.session.score}
          attempts={practice.session.attempts}
          correct={practice.session.correct}
          incorrect={Math.max(0, practice.session.attempts - practice.session.correct)}
          totalQuestions={settings.questionLimit ?? undefined}
          remainingSeconds={practice.remainingSeconds}
          isEnded={practice.isEnded}
          feedback={feedback}
          onAnswerChange={practice.setAnswer}
          onSubmit={practice.submitAnswer}
        />
      ) : null}
    </main>
  );
}
