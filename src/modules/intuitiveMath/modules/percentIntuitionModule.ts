import { generatePercentIntuitionPrompt } from "../generators/percentIntuitionGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { percentagesRatesGroup } from "../../gameGroupMetadata";

export const percentIntuitionModule = createIntuitiveMathModule({
  id: "percent-intuition",
  title: "Percent Intuition Drill",
  shortDescription: "Use friendly fractions, reverse percentages, and multiplicative chains.",
  iconLabel: "%",
  modeGroup: "practice",
  ...percentagesRatesGroup,
  order: 210,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generatePercentIntuitionPrompt
});
