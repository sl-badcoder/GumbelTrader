import { generateMixedEliminationPrompt } from "../generators/mixedEliminationGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { numberSenseGroup } from "../../gameGroupMetadata";

export const mixedEliminationModule = createIntuitiveMathModule({
  id: "mixed-elimination",
  title: "Mixed Elimination Drill",
  shortDescription: "Train which answers can even be true across arithmetic traps.",
  iconLabel: "MC",
  modeGroup: "practice",
  ...numberSenseGroup,
  order: 130,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateMixedEliminationPrompt
});
