import { Button } from "../../shared/components/Button";

type HomePageProps = {
  onBrowseGames: () => void;
};

export function HomePage({ onBrowseGames }: HomePageProps) {
  return (
    <main className="page narrow-page">
      <section className="intro">
        <h1>GumbelTrader</h1>

        <p>
          GumbelTrader is a focused practice platform for quantitative trading
          preparation. Train mental math, numerical speed, memory, and pattern
          recognition through short, customizable drills.
        </p>

        <p>
          Start with arithmetic practice, then expand into fractions, percentages,
          sequences, memorization, and mixed challenge modes. Each session is designed
          to be fast, measurable, and distraction-free.
        </p>

        <p>
          Choose a mode, configure your settings, and improve through repeated
          practice.
        </p>
        <div className="intro-actions">
          <Button onClick={onBrowseGames}>Browse games</Button>
        </div>
      </section>
    </main>
  );
}
