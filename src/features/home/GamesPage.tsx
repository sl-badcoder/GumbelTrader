import type { ProblemModuleMetadata } from "../../core/engine/ProblemModule";
import { GameCard } from "./GameCard";

type GamesPageProps = {
  modules: ProblemModuleMetadata[];
  onSelectModule: (moduleId: string) => void;
};

export function GamesPage({ modules, onSelectModule }: GamesPageProps) {
  return (
    <main className="page">
      <section className="game-list" aria-labelledby="available-games">
        <div className="list-heading">
          <h2 id="available-games">Games</h2>
          <span>{modules.length} available</span>
        </div>
        <p className="list-intro">
          Choose a practice module. Each game can define its own settings and
          session flow while using the same core practice structure.
        </p>
        <div className="game-list-items">
          {modules.map((module) => (
            <GameCard key={module.id} module={module} onSelect={onSelectModule} />
          ))}
        </div>
      </section>
    </main>
  );
}
