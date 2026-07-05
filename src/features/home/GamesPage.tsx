import type { ProblemModuleMetadata } from "../../core/engine/ProblemModule";
import { GameCard } from "./GameCard";

type GamesPageProps = {
  modules: ProblemModuleMetadata[];
  onSelectModule: (moduleId: string) => void;
};

export function GamesPage({ modules, onSelectModule }: GamesPageProps) {
  const practiceModules = modules.filter((module) => module.modeGroup === "practice");
  const testModules = modules.filter((module) => module.modeGroup === "test");

  return (
    <main className="page">
      <section className="game-list" aria-labelledby="available-games">
        <div className="list-heading">
          <h2 id="available-games">Games</h2>
          <span>{modules.length} available</span>
        </div>
        <p className="list-intro">
          Choose a focused practice mode or a fixed-format test simulation.
        </p>
        <GameSection
          title="Practice"
          description="Build speed and accuracy by topic with configurable drills."
          modules={practiceModules}
          onSelectModule={onSelectModule}
        />
        <GameSection
          title="Test Simulations"
          description="Run fixed-format timed tests under assessment-style constraints."
          modules={testModules}
          onSelectModule={onSelectModule}
        />
      </section>
    </main>
  );
}

type GameSectionProps = {
  title: string;
  description: string;
  modules: ProblemModuleMetadata[];
  onSelectModule: (moduleId: string) => void;
};

function GameSection({
  title,
  description,
  modules,
  onSelectModule
}: GameSectionProps) {
  if (modules.length === 0) {
    return null;
  }

  const headingId = `game-section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className="game-section" aria-labelledby={headingId}>
      <div className="game-section-heading">
        <h3 id={headingId}>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="game-list-items">
        {modules.map((module) => (
          <GameCard key={module.id} module={module} onSelect={onSelectModule} />
        ))}
      </div>
    </section>
  );
}
