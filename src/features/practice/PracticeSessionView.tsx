import { useEffect, useRef, type FormEvent } from "react";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Card";
import { NumberInput } from "../../shared/components/NumberInput";

type PracticeSessionViewProps<TPrompt extends { text: string }> = {
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
  promptClassName?: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
};

export function PracticeSessionView<TPrompt extends { text: string }>({
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
  promptClassName = "",
  onAnswerChange,
  onSubmit
}: PracticeSessionViewProps<TPrompt>) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEnded) {
      inputRef.current?.focus();
    }
  }, [isEnded, prompt]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Card className="practice-card">
      <div className="practice-stats">
        <div>
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>{totalQuestions ? "Answered" : "Attempts"}</span>
          <strong>{attempts}</strong>
        </div>
        {correct !== undefined ? (
          <div>
            <span>Correct</span>
            <strong>{correct}</strong>
          </div>
        ) : null}
        {incorrect !== undefined ? (
          <div>
            <span>Incorrect</span>
            <strong>{incorrect}</strong>
          </div>
        ) : null}
        {totalQuestions ? (
          <div>
            <span>Remaining</span>
            <strong>{Math.max(0, totalQuestions - attempts)}</strong>
          </div>
        ) : null}
        <div>
          <span>Time</span>
          <strong>{remainingSeconds === null ? "Off" : `${remainingSeconds}s`}</strong>
        </div>
      </div>

      <form className="prompt-form" onSubmit={submit}>
        <div className={`prompt ${promptClassName}`.trim()} aria-live="polite">
          {prompt.text}
        </div>
        <div className="answer-row">
          <NumberInput
            ref={inputRef}
            aria-label="Answer"
            value={answer}
            disabled={isEnded}
            onChange={(event) => onAnswerChange(event.target.value)}
          />
          <Button disabled={isEnded} type="submit">
            Submit
          </Button>
        </div>
        {feedback ? <p className="feedback">{feedback}</p> : null}
      </form>
    </Card>
  );
}
