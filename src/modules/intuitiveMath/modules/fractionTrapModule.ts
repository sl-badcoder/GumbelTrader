import { generateFractionTrapPrompt } from "../generators/fractionTrapGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { fractionsGroup } from "../../gameGroupMetadata";

export const fractionTrapModule = createIntuitiveMathModule({
  id: "fraction-trap",
  title: "Fraction Trap Drill",
  shortDescription: "Practice denominator, simplification, and reciprocal traps.",
  iconLabel: "a/b",
  modeGroup: "practice",
  ...fractionsGroup,
  order: 310,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateFractionTrapPrompt
});
