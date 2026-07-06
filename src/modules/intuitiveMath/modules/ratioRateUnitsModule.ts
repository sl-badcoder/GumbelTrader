import { generateRatioRateUnitsPrompt } from "../generators/ratioRateUnitsGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { percentagesRatesGroup } from "../../gameGroupMetadata";

export const ratioRateUnitsModule = createIntuitiveMathModule({
  id: "ratio-rate-units",
  title: "Ratio / Rate / Units Drill",
  shortDescription: "Derive the target unit before calculating rates and conversions.",
  iconLabel: "u/t",
  modeGroup: "practice",
  ...percentagesRatesGroup,
  order: 220,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateRatioRateUnitsPrompt
});
