import type { GameStatistics } from "../../api/statisticsApi";

type GameStatisticsCardProps = {
  title: string;
  statistics: GameStatistics;
};

export function GameStatisticsCard({ title, statistics }: GameStatisticsCardProps) {
  return (
    <article className="panel statistic-card">
      <h3>{title}</h3>
      <dl className="result-list">
        <div>
          <dt>Best score</dt>
          <dd>{statistics.bestScore}</dd>
        </div>
        <div>
          <dt>Sessions</dt>
          <dd>{statistics.totalSessions}</dd>
        </div>
        <div>
          <dt>Average score</dt>
          <dd>{statistics.averageScore.toFixed(1)}</dd>
        </div>
        <div>
          <dt>Total attempts</dt>
          <dd>{statistics.totalAttempts}</dd>
        </div>
        <div>
          <dt>Total correct</dt>
          <dd>{statistics.totalCorrect}</dd>
        </div>
        <div>
          <dt>Average accuracy</dt>
          <dd>{statistics.averageAccuracy.toFixed(1)}%</dd>
        </div>
      </dl>
    </article>
  );
}
