import type { PracticeResult } from "../../core/engine/PracticeResult";
import { Button } from "../../shared/components/Button";

type ResultsSummaryProps = {
  result: PracticeResult;
  onRestart: () => void;
  onHome: () => void;
  saveMessage?: string | null;
};

export function ResultsSummary({
  result,
  onRestart,
  onHome,
  saveMessage
}: ResultsSummaryProps) {
  const incorrect = result.incorrect ?? Math.max(0, result.attempts - result.correct);

  return (
    <main className="page narrow-page">
      <section className="panel results-summary">
        <h2>{result.moduleTitle} Results</h2>
        <p>
          {result.correct} correct out of {result.attempts} attempts in{" "}
          {result.durationSeconds} seconds.
        </p>
        {saveMessage ? <p>{saveMessage}</p> : null}
        <dl className="result-list">
          <div>
            <dt>Score</dt>
            <dd>{result.score}</dd>
          </div>
          <div>
            <dt>Accuracy</dt>
            <dd>{result.accuracy}%</dd>
          </div>
          <div>
            <dt>Attempted</dt>
            <dd>
              {result.attempts}
              {result.totalQuestions ? ` / ${result.totalQuestions}` : ""}
            </dd>
          </div>
          <div>
            <dt>Correct / Incorrect</dt>
            <dd>
              {result.correct} / {incorrect}
            </dd>
          </div>
          {result.averageSecondsPerQuestion !== undefined ? (
            <div>
              <dt>Average Time</dt>
              <dd>{result.averageSecondsPerQuestion.toFixed(1)}s</dd>
            </div>
          ) : null}
        </dl>
        <div className="button-row">
          <Button className="quiz-action-button is-primary" onClick={onRestart}>
            Try again
          </Button>
          <Button className="secondary-button" onClick={onHome}>
            Back to games
          </Button>
        </div>
      </section>
    </main>
  );
}
