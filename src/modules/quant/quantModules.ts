import {
  defaultCombinatoricsSettings,
  defaultProbabilitySettings
} from "./quantSettings";
import { createQuantModule } from "./quantModule";

export const probabilityModule = createQuantModule({
  id: "probability",
  title: "Probability Questions",
  shortDescription: "Focused dice, cards, coins, conditional probability, and expected value drills.",
  iconLabel: "P(A)",
  modeGroup: "practice",
  defaultSettings: defaultProbabilitySettings
});

export const combinatoricsModule = createQuantModule({
  id: "combinatorics",
  title: "Combinatorics Questions",
  shortDescription: "Permutations, combinations, restrictions, distributions, and complement counting.",
  iconLabel: "nCr",
  modeGroup: "practice",
  defaultSettings: defaultCombinatoricsSettings
});
