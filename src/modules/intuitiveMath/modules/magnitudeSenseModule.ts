import { generateMagnitudeSensePrompt } from "../generators/magnitudeSenseGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { numberSenseGroup } from "../../gameGroupMetadata";

export const magnitudeSenseModule = createIntuitiveMathModule({
  id: "magnitude-sense",
  title: "Magnitude Sense Drill",
  shortDescription: "Pick plausible buckets before doing exact arithmetic.",
  iconLabel: "10^",
  modeGroup: "practice",
  ...numberSenseGroup,
  order: 110,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateMagnitudeSensePrompt
});
