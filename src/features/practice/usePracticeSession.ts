import { useCallback, useEffect, useMemo, useState } from "react";
import type { PracticeSession } from "../../core/engine/PracticeSession";
import type { ProblemModule } from "../../core/engine/ProblemModule";
import type { ValidationResult } from "../../core/engine/ValidationResult";

type UsePracticeSessionOptions<TSettings, TSession extends PracticeSession, TPrompt> = {
  module: ProblemModule<TSettings, TSession, TPrompt>;
  settings: TSettings;
  durationSeconds: number | null;
  questionLimit?: number | null;
  autoAdvanceOnCorrectAnswer?: boolean;
  isActive?: boolean;
};

export function usePracticeSession<TSettings, TSession extends PracticeSession, TPrompt>({
  module,
  settings,
  durationSeconds,
  questionLimit = null,
  autoAdvanceOnCorrectAnswer = true,
  isActive = true
}: UsePracticeSessionOptions<TSettings, TSession, TPrompt>) {
  const [session, setSession] = useState<TSession>(() => module.createSession(settings));
  const [prompt, setPrompt] = useState<TPrompt>(() => module.generatePrompt(session));
  const [answer, setAnswer] = useState("");
  const [lastResult, setLastResult] = useState<ValidationResult | null>(null);
  const [lastPrompt, setLastPrompt] = useState<TPrompt | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(durationSeconds);

  const isTimeEnded = remainingSeconds !== null && remainingSeconds <= 0;
  const isQuestionLimitEnded = questionLimit !== null && session.attempts >= questionLimit;
  const isEnded = isTimeEnded || isQuestionLimitEnded;

  const startSession = useCallback(() => {
    const nextSession = module.createSession(settings);
    setSession(nextSession);
    setPrompt(module.generatePrompt(nextSession));
    setAnswer("");
    setLastResult(null);
    setLastPrompt(null);
    setRemainingSeconds(durationSeconds);
  }, [durationSeconds, module, settings]);

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (!isActive || isEnded || remainingSeconds === null) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((current) => (current === null ? null : Math.max(0, current - 1)));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isActive, isEnded, remainingSeconds]);

  const applyAnswerResult = useCallback(
    (result: ValidationResult) => {
      setSession((currentSession) => {
        const nextSession = module.applyResult(currentSession, prompt, result);
        setPrompt(module.generatePrompt(nextSession));
        return nextSession;
      });
      setLastResult(result);
      setLastPrompt(prompt);
      setAnswer("");
    },
    [module, prompt]
  );

  const submitAnswer = useCallback(() => {
    if (!isActive || isEnded) {
      return;
    }

    const result = module.validateAnswer(prompt, answer);
    applyAnswerResult(result);
  }, [answer, applyAnswerResult, isActive, isEnded, module, prompt]);

  const changeAnswer = useCallback(
    (nextAnswer: string) => {
      if (!isActive || isEnded) {
        return;
      }

      setAnswer(nextAnswer);

      const result = module.validateAnswer(prompt, nextAnswer);
      if (
        autoAdvanceOnCorrectAnswer &&
        result.isCorrect &&
        nextAnswer.trim() === result.expectedAnswer
      ) {
        applyAnswerResult(result);
      }
    },
    [applyAnswerResult, autoAdvanceOnCorrectAnswer, isActive, isEnded, module, prompt]
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
    lastPrompt,
    remainingSeconds,
    isEnded,
    accuracy,
    submitAnswer,
    restart: startSession
  };
}
