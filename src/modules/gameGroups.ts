import type { ProblemModuleMetadata } from "../core/engine/ProblemModule";

export type GameGroup = {
  id: string;
  title: string;
  description: string;
  iconLabel: string;
  order: number;
  modules: ProblemModuleMetadata[];
};

const fallbackGroup = {
  id: "other",
  title: "Other",
  description: "Additional practice modes.",
  iconLabel: "...",
  order: 999
};

export function groupProblemModules(modules: ProblemModuleMetadata[]): GameGroup[] {
  const groups = new Map<string, GameGroup>();

  for (const module of modules) {
    const groupId = module.groupId ?? fallbackGroup.id;
    const existingGroup = groups.get(groupId);
    const group = existingGroup ?? {
      id: groupId,
      title: module.groupTitle ?? fallbackGroup.title,
      description: module.groupDescription ?? fallbackGroup.description,
      iconLabel: module.groupIcon ?? fallbackGroup.iconLabel,
      order: module.order ?? fallbackGroup.order,
      modules: []
    };

    group.order = Math.min(group.order, module.order ?? group.order);
    group.modules.push(module);
    groups.set(groupId, group);
  }

  return [...groups.values()]
    .filter((group) => group.modules.length > 0)
    .map((group) => ({
      ...group,
      modules: [...group.modules].sort((left, right) => {
        const orderDelta = (left.order ?? 999) - (right.order ?? 999);
        return orderDelta === 0 ? left.title.localeCompare(right.title) : orderDelta;
      })
    }))
    .sort((left, right) => {
      const orderDelta = left.order - right.order;
      return orderDelta === 0 ? left.title.localeCompare(right.title) : orderDelta;
    });
}
