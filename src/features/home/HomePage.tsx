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

        <p> 
          We also have a discord server for the community, please join to find other trading enthusiasts and to get
          free resources which will prepare you for your quant carreer.
        </p>
        <div className="intro-actions">
          <Button onClick={onBrowseGames}>Browse games</Button>
          <a
            className="discord-link"
            href="https://discord.gg/nEPHjMa2B"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              aria-hidden="true"
              className="discord-icon"
              viewBox="0 0 24 24"
              focusable="false"
            >
              <path d="M20.3 4.4A17.2 17.2 0 0 0 16 3.1l-.2.4c1.5.4 2.2 1 2.2 1a14.4 14.4 0 0 0-12 0s.8-.7 2.4-1.1L8.1 3a17 17 0 0 0-4.3 1.3C1.1 8.4.4 12.4.8 16.3a17.4 17.4 0 0 0 5.3 2.7l.7-1.1c-1.2-.4-1.7-1-1.7-1l.4.2a13.8 13.8 0 0 0 13 0l.4-.2s-.6.6-1.8 1l.7 1.1a17.4 17.4 0 0 0 5.3-2.7c.5-4.5-.7-8.4-2.8-11.9ZM8.7 14.6c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
            </svg>
            Join Discord
          </a>
        </div>
      </section>
    </main>
  );
}
