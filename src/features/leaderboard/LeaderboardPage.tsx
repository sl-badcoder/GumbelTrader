import { useEffect, useState } from "react";
import { getLeaderboard, type LeaderboardEntry } from "../../api/leaderboardApi";
import { availableProblemModules } from "../../modules";

export function LeaderboardPage() {
  const [gameId, setGameId] = useState(availableProblemModules[0]?.id ?? "arithmetic");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    getLeaderboard(gameId)
      .then((result) => setEntries(result.leaderboard))
      .catch((caughtError) =>
        setError(caughtError instanceof Error ? caughtError.message : "Could not load leaderboard")
      );
  }, [gameId]);

  return (
    <main className="page">
      <section className="panel settings-form">
        <div className="page-heading">
          <h2>Leaderboard</h2>
          <p>Top saved scores for each game.</p>
        </div>
        <label className="field leaderboard-select">
          <span>Game</span>
          <select value={gameId} onChange={(event) => setGameId(event.target.value)}>
            {availableProblemModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Best score</th>
              <th>Accuracy</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={`${entry.userId}-${entry.rank}`}>
                <td>{entry.rank}</td>
                <td>{entry.displayName}</td>
                <td>{entry.bestScore}</td>
                <td>{entry.accuracy}%</td>
                <td>{new Date(entry.achievedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
