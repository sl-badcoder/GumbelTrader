import type { ProblemModuleMetadata } from "../../core/engine/ProblemModule";
import { Button } from "../../shared/components/Button";

type GameCardProps = {
  module: ProblemModuleMetadata;
  onSelect: (moduleId: string) => void;
};

export function GameCard({ module, onSelect }: GameCardProps) {
  const buttonLabel = module.modeGroup === "test" ? "Start Test" : "Start Game";

  return (
    <article className="game-card">
      <div className="game-card-main">
        <div className="game-icon" aria-hidden="true">
          {module.iconLabel}
        </div>
        <div>
          <h3>{module.title}</h3>
          <p>{module.shortDescription}</p>
        </div>
      </div>
      <Button onClick={() => onSelect(module.id)}>{buttonLabel}</Button>
    </article>
  );
}
