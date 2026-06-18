import { useCallback, useEffect, useMemo, useState } from "react";
import type { PracticeSession } from "../../core/engine/PracticeSession";
import type { ProblemModule } from "../../core/engine/ProblemModule";
import type { ValidationResult } from "../../core/engine/ValidationResult";

type UsePracticeSessionOptions<TSettings, TSession extends PracticeSession, TPrompt> = {
  module: ProblemModule<TSettings, TSession, TPrompt>;
  settings: TSettings;
  durationSeconds: number;
};

export function usePracticeSession<TSettings, TSession extends PracticeSession, TPrompt>({
  module,
  settings,
  durationSeconds
}: UsePracticeSessionOptions<TSettings, TSession, TPrompt>) {
  const [session, setSession] = useState<TSession>(() => module.createSession(settings));
  const [prompt, setPrompt] = useState<TPrompt>(() => module.generatePrompt(session));
  const [answer, setAnswer] = useState("");
  const [lastResult, setLastResult] = useState<ValidationResult | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

  const isEnded = remainingSeconds <= 0;

  const startSession = useCallback(() => {
    const nextSession = module.createSession(settings);
    setSession(nextSession);
    setPrompt(module.generatePrompt(nextSession));
    setAnswer("");
    setLastResult(null);
    setRemainingSeconds(durationSeconds);
  }, [durationSeconds, module, settings]);

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (isEnded) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isEnded]);

  const applyAnswerResult = useCallback(
    (result: ValidationResult) => {
      setSession((currentSession) => {
        const nextSession = module.applyResult(currentSession, prompt, result);
        setPrompt(module.generatePrompt(nextSession));
        return nextSession;
      });
      setLastResult(result);
      setAnswer("");
    },
    [module, prompt]
  );

  const submitAnswer = useCallback(() => {
    if (isEnded) {
      return;
    }

    const result = module.validateAnswer(prompt, answer);
    applyAnswerResult(result);
  }, [answer, applyAnswerResult, isEnded, module, prompt]);

  const changeAnswer = useCallback(
    (nextAnswer: string) => {
      if (isEnded) {
        return;
      }

      setAnswer(nextAnswer);

      const result = module.validateAnswer(prompt, nextAnswer);
      if (result.isCorrect && nextAnswer.trim() === result.expectedAnswer) {
        applyAnswerResult(result);
      }
    },
    [applyAnswerResult, isEnded, module, prompt]
  );

  const accuracy = useMemo(() => {
    if (session.attempts === 0) {
      return 0;
    }

    return Math.round((session.correct / session.attempts) * 100);
  }, [session.attempts, session.correct]);

  return {
    session,
    prompt,
    answer,
    setAnswer: changeAnswer,
    lastResult,
    remainingSeconds,
    isEnded,
    accuracy,
    submitAnswer,
    restart: startSession
  };
}
