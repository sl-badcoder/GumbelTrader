import { useEffect, useState } from "react";
import { getStatistics, type GameStatistics } from "../../api/statisticsApi";
import { problemModules } from "../../modules";
import { GameStatisticsCard } from "./GameStatisticsCard";

export function StatisticsPage() {
  const [statistics, setStatistics] = useState<GameStatistics[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStatistics()
      .then((result) => setStatistics(result.statistics))
      .catch((caughtError) =>
        setError(caughtError instanceof Error ? caughtError.message : "Could not load statistics")
      );
  }, []);

  return (
    <main className="page">
      <section className="intro">
        <h2>Statistics</h2>
        <p>Your saved results grouped by game.</p>
      </section>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="statistics-grid">
        {statistics.map((item) => (
          <GameStatisticsCard
            key={item.gameId}
            statistics={item}
            title={problemModules[item.gameId as keyof typeof problemModules]?.title ?? item.gameId}
          />
        ))}
      </div>
    </main>
  );
}
