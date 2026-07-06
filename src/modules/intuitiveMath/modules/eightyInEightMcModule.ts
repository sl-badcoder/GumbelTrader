import { generateEightyInEightMcPrompt } from "../generators/eightyInEightMcGenerator";
import { createIntuitiveMathModule, eightyInEightMcSettings } from "./createIntuitiveMathModule";
import { speedMathGroup } from "../../gameGroupMetadata";

export const eightyInEightMcModule = createIntuitiveMathModule({
  id: "eighty-in-eight-mc",
  title: "80-in-8 Multiple Choice",
  shortDescription: "80 multiple-choice recognition questions in 8 minutes, final score only.",
  iconLabel: "8:00",
  modeGroup: "test",
  ...speedMathGroup,
  order: 10,
  defaultSettings: eightyInEightMcSettings,
  generator: generateEightyInEightMcPrompt
});
