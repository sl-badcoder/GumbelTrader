import { useMemo } from "react";
import type { ProblemModuleMetadata } from "../../core/engine/ProblemModule";
import { groupProblemModules } from "../../modules/gameGroups";
import { GameCard } from "./GameCard";

type GamesPageProps = {
  modules: ProblemModuleMetadata[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onBackToGroups: () => void;
  onSelectModule: (moduleId: string) => void;
};

export function GamesPage({
  modules,
  selectedGroupId,
  onSelectGroup,
  onBackToGroups,
  onSelectModule
}: GamesPageProps) {
  const groups = useMemo(() => groupProblemModules(modules), [modules]);
  const selectedGroup = groups.find((group) => group.id === selectedGroupId);

  return (
    <main className="page">
      <section className="game-list" aria-labelledby="available-games">
        <div className="list-heading">
          <h2 id="available-games">Games</h2>
          <span>{modules.length} available</span>
        </div>
        {selectedGroup ? (
          <GameGroupDetail
            group={selectedGroup}
            onBack={onBackToGroups}
            onSelectModule={onSelectModule}
          />
        ) : (
          <>
            <p className="list-intro">
              Choose a category, then pick a focused practice mode or fixed-format test.
            </p>
            <div className="game-group-grid">
              {groups.map((group) => (
                <button
                  className="game-group-card"
                  key={group.id}
                  type="button"
                  onClick={() => onSelectGroup(group.id)}
                >
                  <span className="game-icon" aria-hidden="true">
                    {group.iconLabel}
                  </span>
                  <span className="game-group-card-main">
                    <strong>{group.title}</strong>
                    <span>{group.description}</span>
                  </span>
                  <span className="game-count">
                    {group.modules.length} {group.modules.length === 1 ? "game" : "games"}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

type GameGroupDetailProps = {
  group: ReturnType<typeof groupProblemModules>[number];
  onBack: () => void;
  onSelectModule: (moduleId: string) => void;
};

function GameGroupDetail({
  group,
  onBack,
  onSelectModule
}: GameGroupDetailProps) {
  const headingId = `game-group-${group.id}`;

  return (
    <section className="game-section" aria-labelledby={headingId}>
      <div className="game-section-heading">
        <button className="plain-link" type="button" onClick={onBack}>
          Back to categories
        </button>
        <h3 id={headingId}>{group.title}</h3>
        <p>{group.description}</p>
      </div>
      <div className="game-list-items">
        {group.modules.map((module) => (
          <GameCard key={module.id} module={module} onSelect={onSelectModule} />
        ))}
      </div>
    </section>
  );
}
