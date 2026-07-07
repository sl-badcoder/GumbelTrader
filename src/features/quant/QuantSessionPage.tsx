import { useEffect, useRef } from "react";
import type { PracticeResult } from "../../core/engine/PracticeResult";
import type { ProblemModule } from "../../core/engine/ProblemModule";
import type {
  QuantPrompt,
  QuantSession,
  QuantSettings
} from "../../modules/quant/quantTypes";
import { Button } from "../../shared/components/Button";
import { PracticeSessionView } from "../practice/PracticeSessionView";
import { usePracticeSession } from "../practice/usePracticeSession";

type QuantSessionPageProps = {
  module: ProblemModule<QuantSettings, QuantSession, QuantPrompt>;
  settings: QuantSettings;
  onFinish: (result: PracticeResult) => void;
  onBack: () => void;
};

export function QuantSessionPage({
  module,
  settings,
  onFinish,
  onBack
}: QuantSessionPageProps) {
  const practice = usePracticeSession({
    module,
    settings,
    durationSeconds: settings.timerEnabled ? settings.durationSeconds : null,
    questionLimit: settings.questionCount,
    autoAdvanceOnCorrectAnswer: settings.autoAdvanceOnCorrectAnswer
  });
  const hasFinished = useRef(false);

  useEffect(() => {
    if (!practice.isEnded || hasFinished.current) {
      return;
    }

    hasFinished.current = true;
    const elapsedSeconds = Math.max(
      0,
      Math.round((Date.now() - practice.session.startedAt) / 1000)
    );
    const isTimerExpired = practice.remainingSeconds !== null && practice.remainingSeconds <= 0;
    const resultDuration = isTimerExpired ? settings.durationSeconds : elapsedSeconds;

    onFinish({
      moduleId: module.id,
      moduleTitle: module.title,
      score: practice.session.score,
      attempts: practice.session.attempts,
      correct: practice.session.correct,
      incorrect: Math.max(0, practice.session.attempts - practice.session.correct),
      accuracy: practice.accuracy,
      durationSeconds: resultDuration,
      totalQuestions: settings.questionCount,
      averageSecondsPerQuestion:
        practice.session.attempts > 0 ? resultDuration / practice.session.attempts : 0,
      canReviewMissed: settings.reviewMissedAfterGame && practice.session.missedQuestions.length > 0
    });
  }, [
    module.id,
    module.title,
    onFinish,
    practice.accuracy,
    practice.isEnded,
    practice.session.attempts,
    practice.session.correct,
    practice.session.missedQuestions.length,
    practice.session.score,
    practice.session.startedAt,
    practice.remainingSeconds,
    settings.questionCount,
    settings.reviewMissedAfterGame,
    settings.durationSeconds,
    settings.timerEnabled
  ]);

  const feedback =
    practice.lastResult && settings.showExplanationAfterAnswer
      ? `${practice.lastResult.message ?? ""}. ${practice.lastPrompt?.explanation ?? ""}`
      : practice.lastResult?.message ?? null;

  return (
    <main className="page practice-page">
      <div className="session-heading">
        <div>
          <h2>{module.title}</h2>
          <p>
            Probability answers use reduced fractions like 3/8. Combinatorics answers use integers.
          </p>
        </div>
        <Button className="secondary-button" onClick={onBack}>
          Change settings
        </Button>
      </div>

      <PracticeSessionView
        prompt={practice.prompt}
        answer={practice.answer}
        score={practice.session.score}
        attempts={practice.session.attempts}
        correct={practice.session.correct}
        incorrect={Math.max(0, practice.session.attempts - practice.session.correct)}
        totalQuestions={settings.questionCount}
        remainingSeconds={practice.remainingSeconds}
        isEnded={practice.isEnded}
        feedback={feedback}
        feedbackTone={
          practice.lastResult ? (practice.lastResult.isCorrect ? "success" : "error") : null
        }
        promptClassName="quant-prompt"
        onAnswerChange={practice.setAnswer}
        onSubmit={practice.submitAnswer}
      />
    </main>
  );
}
