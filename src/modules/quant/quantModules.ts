import {
  defaultCombinatoricsSettings,
  defaultProbabilitySettings
} from "./quantSettings";
import { createQuantModule } from "./quantModule";
import { reasoningGroup } from "../gameGroupMetadata";

export const probabilityModule = createQuantModule({
  id: "probability",
  title: "Probability Questions",
  shortDescription: "Focused dice, cards, coins, conditional probability, and expected value drills.",
  iconLabel: "P(A)",
  modeGroup: "practice",
  ...reasoningGroup,
  order: 430,
  defaultSettings: defaultProbabilitySettings
});

export const combinatoricsModule = createQuantModule({
  id: "combinatorics",
  title: "Combinatorics Questions",
  shortDescription: "Permutations, combinations, restrictions, distributions, and complement counting.",
  iconLabel: "nCr",
  modeGroup: "practice",
  ...reasoningGroup,
  order: 440,
  defaultSettings: defaultCombinatoricsSettings
});
