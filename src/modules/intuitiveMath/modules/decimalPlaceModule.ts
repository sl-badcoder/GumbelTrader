import { generateDecimalPlacePrompt } from "../generators/decimalPlaceGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { numberSenseGroup } from "../../gameGroupMetadata";

export const decimalPlaceModule = createIntuitiveMathModule({
  id: "decimal-place",
  title: "Decimal Place Drill",
  shortDescription: "Train decimal-place counting, scaling, and magnitude sanity checks.",
  iconLabel: ".0",
  modeGroup: "practice",
  ...numberSenseGroup,
  order: 120,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateDecimalPlacePrompt
});
