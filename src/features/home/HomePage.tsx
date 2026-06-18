import { Button } from "../../shared/components/Button";

type HomePageProps = {
  onBrowseGames: () => void;
};

export function HomePage({ onBrowseGames }: HomePageProps) {
  return (
    <main className="page narrow-page">
      <section className="intro">
        <h2>Mathematics practice, kept simple.</h2>
        <p>
          Gumbel Math is a small place to practice mathematical speed, accuracy,
          and problem solving. The project starts with arithmetic drills and is
          structured so more problem types can be added over time.
        </p>
        <p>
          Sessions are intentionally direct: pick a module, configure the
          exercise, then work through problems without extra ceremony.
        </p>
        <div className="intro-actions">
          <Button onClick={onBrowseGames}>Browse games</Button>
        </div>
      </section>
    </main>
  );
}
