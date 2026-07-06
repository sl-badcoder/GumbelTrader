import { describe, expect, it } from "vitest";
import type { ProblemModuleMetadata } from "../core/engine/ProblemModule";
import { availableProblemModules } from ".";
import { groupProblemModules } from "./gameGroups";

describe("game module registry and groups", () => {
  it("does not expose the old 80-in-8 module in the visible module list", () => {
    expect(availableProblemModules.map((module) => module.id)).not.toContain("eighty-in-eight");
  });

  it("exposes the new 80-in-8 exactly once with the countdown icon metadata", () => {
    const matches = availableProblemModules.filter((module) => module.id === "eighty-in-eight-mc");

    expect(matches).toHaveLength(1);
    expect(matches[0]?.title).toBe("80-in-8 Multiple Choice");
    expect(matches[0]?.iconLabel).toBe("8:00");
    expect(matches[0]?.groupId).toBe("speed-math");
  });

  it("generates visible game groups from module metadata", () => {
    const groups = groupProblemModules(availableProblemModules);
    const speedMath = groups.find((group) => group.id === "speed-math");
    const numberSense = groups.find((group) => group.id === "number-sense");
    const reasoning = groups.find((group) => group.id === "reasoning");

    expect(groups.every((group) => group.modules.length > 0)).toBe(true);
    expect(speedMath?.modules.map((module) => module.id)).toEqual(
      expect.arrayContaining(["eighty-in-eight-mc", "typed-hardcore", "arithmetic"])
    );
    expect(numberSense?.modules.map((module) => module.id)).toEqual(
      expect.arrayContaining(["magnitude-sense", "decimal-place", "mixed-elimination"])
    );
    expect(reasoning?.modules.map((module) => module.id)).toEqual(
      expect.arrayContaining(["fermi-estimation", "strategy-recognition", "probability", "combinatorics"])
    );
  });

  it("does not create empty groups and falls back only for ungrouped modules", () => {
    const modules: ProblemModuleMetadata[] = [
      {
        id: "custom",
        title: "Custom",
        shortDescription: "Ungrouped module",
        iconLabel: "C",
        modeGroup: "practice"
      }
    ];

    expect(groupProblemModules([])).toHaveLength(0);
    expect(groupProblemModules(modules)).toEqual([
      expect.objectContaining({
        id: "other",
        title: "Other",
        modules
      })
    ]);
  });

  it("keeps direct lookup data for visible games", () => {
    expect(availableProblemModules.some((module) => module.id === "eighty-in-eight-mc")).toBe(true);
    expect(availableProblemModules.some((module) => module.id === "probability")).toBe(true);
  });
});
