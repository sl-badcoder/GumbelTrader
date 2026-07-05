import { useEffect, useRef, useState } from "react";
import type { PracticeResult } from "../../core/engine/PracticeResult";
import {
  eightyInEightDurationSeconds,
  eightyInEightModule,
  eightyInEightQuestionCount,
  eightyInEightSettings
} from "../../modules/eightyInEight/eightyInEightModule";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { PracticeSessionView } from "../practice/PracticeSessionView";
import { usePracticeSession } from "../practice/usePracticeSession";

type EightyInEightSessionPageProps = {
  onFinish: (result: PracticeResult) => void;
  onBack: () => void;
};

export function EightyInEightSessionPage({
  onFinish,
  onBack
}: EightyInEightSessionPageProps) {
  const [countdown, setCountdown] = useState(5);
  const hasStarted = useRef(false);
  const isStarted = countdown <= 0;
  const practice = usePracticeSession({
    module: eightyInEightModule,
    settings: eightyInEightSettings,
    durationSeconds: eightyInEightDurationSeconds,
    questionLimit: eightyInEightQuestionCount,
    isActive: isStarted
  });
  const hasFinished = useRef(false);

  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [countdown]);

  useEffect(() => {
    if (!isStarted || hasStarted.current) {
      return;
    }

    hasStarted.current = true;
    practice.restart();
  }, [isStarted, practice]);

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
    const resultDuration = isTimerExpired ? eightyInEightDurationSeconds : elapsedSeconds;

    onFinish({
      moduleId: eightyInEightModule.id,
      moduleTitle: eightyInEightModule.title,
      score: practice.session.score,
      attempts: practice.session.attempts,
      correct: practice.session.correct,
      incorrect: Math.max(0, practice.session.attempts - practice.session.correct),
      accuracy: practice.accuracy,
      durationSeconds: resultDuration,
      totalQuestions: eightyInEightQuestionCount,
      averageSecondsPerQuestion:
        practice.session.attempts > 0 ? resultDuration / practice.session.attempts : 0
    });
  }, [
    onFinish,
    practice.accuracy,
    practice.isEnded,
    practice.remainingSeconds,
    practice.session.attempts,
    practice.session.correct,
    practice.session.score,
    practice.session.startedAt
  ]);

  return (
    <main className="page practice-page">
      <div className="session-heading">
        <div>
          <h2>{eightyInEightModule.title}</h2>
          <p>Optiver-style arithmetic. 80 questions, 8 minutes, +1 correct and -1 incorrect.</p>
        </div>
        <Button className="secondary-button" onClick={onBack}>
          Back to games
        </Button>
      </div>

      {isStarted ? (
        <PracticeSessionView
          prompt={practice.prompt}
          answer={practice.answer}
          score={practice.session.score}
          attempts={practice.session.attempts}
          correct={practice.session.correct}
          incorrect={Math.max(0, practice.session.attempts - practice.session.correct)}
          totalQuestions={eightyInEightQuestionCount}
          remainingSeconds={practice.remainingSeconds}
          isEnded={practice.isEnded}
          feedback={practice.lastResult?.message ?? null}
          onAnswerChange={practice.setAnswer}
          onSubmit={practice.submitAnswer}
        />
      ) : (
        <Card className="practice-card countdown-card">
          <span>Starting in</span>
          <strong>{countdown}</strong>
        </Card>
      )}
    </main>
  );
}
