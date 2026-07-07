import { useEffect, useRef, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { NumberInput } from "../../shared/components/NumberInput";

type PracticeSessionViewProps<TPrompt extends { text: string; choices?: string[] }> = {
  prompt: TPrompt;
  answer: string;
  score: number;
  attempts: number;
  correct?: number;
  incorrect?: number;
  totalQuestions?: number;
  remainingSeconds: number | null;
  isEnded: boolean;
  feedback: string | null;
  feedbackTone?: "success" | "error" | null;
  promptClassName?: string;
  answerInputMode?: "numeric" | "text";
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
};

export function PracticeSessionView<TPrompt extends { text: string; choices?: string[] }>({
  prompt,
  answer,
  score,
  attempts,
  correct,
  incorrect,
  totalQuestions,
  remainingSeconds,
  isEnded,
  feedback,
  feedbackTone = null,
  promptClassName = "",
  answerInputMode = "numeric",
  onAnswerChange,
  onSubmit
}: PracticeSessionViewProps<TPrompt>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasChoices = prompt.choices !== undefined && prompt.choices.length > 0;
  const isLongPrompt = prompt.text.length > 34;

  useEffect(() => {
    if (!isEnded && !hasChoices) {
      inputRef.current?.focus();
    }
  }, [hasChoices, isEnded, prompt]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const submitChoiceWithEnter = (event: KeyboardEvent<HTMLFormElement>) => {
    if (!hasChoices || event.key !== "Enter" || answer.length === 0 || isEnded) {
      return;
    }

    event.preventDefault();
    onSubmit();
  };

  return (
    <Card className="practice-card quiz-panel">
      <div className="practice-stats quiz-status-grid" aria-label="Practice status">
        <div className="quiz-status-card">
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div className="quiz-status-card">
          <span>{totalQuestions ? "Answered" : "Attempts"}</span>
          <strong>{attempts}</strong>
        </div>
        {correct !== undefined ? (
          <div className="quiz-status-card">
            <span>Correct</span>
            <strong>{correct}</strong>
          </div>
        ) : null}
        {incorrect !== undefined ? (
          <div className="quiz-status-card">
            <span>Incorrect</span>
            <strong>{incorrect}</strong>
          </div>
        ) : null}
        {totalQuestions ? (
          <div className="quiz-status-card">
            <span>Remaining</span>
            <strong>{Math.max(0, totalQuestions - attempts)}</strong>
          </div>
        ) : null}
        <div className="quiz-status-card">
          <span>Time</span>
          <strong>{remainingSeconds === null ? "Off" : `${remainingSeconds}s`}</strong>
        </div>
      </div>

      <form className="prompt-form" onKeyDown={submitChoiceWithEnter} onSubmit={submit}>
        <div
          className={`prompt quiz-question-card quiz-question ${
            isLongPrompt ? "is-long" : ""
          } ${promptClassName}`.trim()}
          aria-live="polite"
        >
          {prompt.text}
        </div>
        {hasChoices ? (
          <div className="choice-grid quiz-answer-grid" role="radiogroup" aria-label="Answer choices">
            {prompt.choices?.map((choice) => (
              <button
                className={
                  answer === choice
                    ? "choice-button quiz-answer-button selected is-selected"
                    : "choice-button quiz-answer-button"
                }
                disabled={isEnded}
                key={choice}
                type="button"
                role="radio"
                aria-checked={answer === choice}
                onClick={() => onAnswerChange(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <div className="answer-row">
            {answerInputMode === "text" ? (
              <input
                ref={inputRef}
                className="number-input"
                aria-label="Answer"
                inputMode="text"
                value={answer}
                disabled={isEnded}
                onChange={(event) => onAnswerChange(event.target.value)}
              />
            ) : (
              <NumberInput
                ref={inputRef}
                aria-label="Answer"
                value={answer}
                disabled={isEnded}
                onChange={(event) => onAnswerChange(event.target.value)}
              />
            )}
            <Button className="quiz-action-button is-primary" disabled={isEnded} type="submit">
              Submit
            </Button>
          </div>
        )}
        {hasChoices ? (
          <div className="answer-row choice-submit-row">
            <Button
              className="quiz-action-button is-primary"
              disabled={isEnded || answer.length === 0}
              type="submit"
            >
              Submit
            </Button>
          </div>
        ) : null}
        {feedback ? (
          <p
            className={`feedback quiz-feedback ${
              feedbackTone === "success"
                ? "is-success"
                : feedbackTone === "error"
                  ? "is-error"
                  : ""
            }`.trim()}
            aria-live="polite"
          >
            {feedback}
          </p>
        ) : null}
      </form>
    </Card>
  );
}
