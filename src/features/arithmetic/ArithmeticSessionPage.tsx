import { useEffect, useRef } from "react";
import type { PracticeResult } from "../../core/engine/PracticeResult";
import { arithmeticModule } from "../../modules/arithmetic/arithmeticModule";
import type { ArithmeticSettings } from "../../modules/arithmetic/arithmeticTypes";
import { Button } from "../../shared/components/Button";
import { PracticeSessionView } from "../practice/PracticeSessionView";
import { usePracticeSession } from "../practice/usePracticeSession";

type ArithmeticSessionPageProps = {
  settings: ArithmeticSettings;
  onFinish: (result: PracticeResult) => void;
  onBack: () => void;
};

export function ArithmeticSessionPage({
  settings,
  onFinish,
  onBack
}: ArithmeticSessionPageProps) {
  const practice = usePracticeSession({
    module: arithmeticModule,
    settings,
    durationSeconds: settings.durationSeconds
  });
  const hasFinished = useRef(false);

  useEffect(() => {
    if (!practice.isEnded || hasFinished.current) {
      return;
    }

    hasFinished.current = true;
    onFinish({
      moduleId: arithmeticModule.id,
      moduleTitle: arithmeticModule.title,
      score: practice.session.score,
      attempts: practice.session.attempts,
      correct: practice.session.correct,
      accuracy: practice.accuracy,
      durationSeconds: settings.durationSeconds
    });
  }, [
    onFinish,
    practice.accuracy,
    practice.isEnded,
    practice.session.attempts,
    practice.session.correct,
    practice.session.score,
    settings.durationSeconds
  ]);

  return (
    <main className="page practice-page">
      <div className="session-heading">
        <div>
          <h2>{arithmeticModule.title}</h2>
          <p>Type the answer. Correct answers advance automatically.</p>
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
        remainingSeconds={practice.remainingSeconds}
        isEnded={practice.isEnded}
        feedback={practice.lastResult?.message ?? null}
        feedbackTone={
          practice.lastResult ? (practice.lastResult.isCorrect ? "success" : "error") : null
        }
        onAnswerChange={practice.setAnswer}
        onSubmit={practice.submitAnswer}
      />
    </main>
  );
}
