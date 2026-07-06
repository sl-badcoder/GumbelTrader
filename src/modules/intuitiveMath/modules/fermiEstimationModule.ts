import { generateFermiPrompt } from "../generators/fermiGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { reasoningGroup } from "../../gameGroupMetadata";

export const fermiEstimationModule = createIntuitiveMathModule({
  id: "fermi-estimation",
  title: "Fermi Estimation Drill",
  shortDescription: "Estimate orders of magnitude, assumptions, and sanity bounds.",
  iconLabel: "~",
  modeGroup: "practice",
  ...reasoningGroup,
  order: 410,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateFermiPrompt
});
