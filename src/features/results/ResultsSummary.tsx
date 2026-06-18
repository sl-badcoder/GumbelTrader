import type { PracticeResult } from "../../core/engine/PracticeResult";
import { Button } from "../../shared/components/Button";

type ResultsSummaryProps = {
  result: PracticeResult;
  onRestart: () => void;
  onHome: () => void;
};

export function ResultsSummary({ result, onRestart, onHome }: ResultsSummaryProps) {
  return (
    <main className="page narrow-page">
      <section className="panel results-summary">
        <h2>{result.moduleTitle} Results</h2>
        <p>
          {result.correct} correct out of {result.attempts} attempts in{" "}
          {result.durationSeconds} seconds.
        </p>
        <dl className="result-list">
          <div>
            <dt>Score</dt>
            <dd>{result.score}</dd>
          </div>
          <div>
            <dt>Accuracy</dt>
            <dd>{result.accuracy}%</dd>
          </div>
        </dl>
        <div className="button-row">
          <Button onClick={onRestart}>Try again</Button>
          <Button className="secondary-button" onClick={onHome}>
            Back to games
          </Button>
        </div>
      </section>
    </main>
  );
}
