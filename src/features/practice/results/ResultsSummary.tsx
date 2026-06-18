import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";

type ResultsSummaryProps = {
  score: number;
  attempts: number;
  correct: number;
  accuracy: number;
  onRestart: () => void;
};

export function ResultsSummary({
  score,
  attempts,
  correct,
  accuracy,
  onRestart
}: ResultsSummaryProps) {
  return (
    <Card className="results-summary">
      <div>
        <h2>Results</h2>
        <p>
          {correct} correct out of {attempts} attempts.
        </p>
      </div>
      <div className="stats-grid">
        <div>
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
      </div>
      <Button onClick={onRestart}>Try again</Button>
    </Card>
  );
}
