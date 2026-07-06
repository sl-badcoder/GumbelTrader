import { generateMissingOperandPrompt } from "../generators/missingOperandGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { speedMathGroup } from "../../gameGroupMetadata";

export const missingOperandModule = createIntuitiveMathModule({
  id: "missing-operand",
  title: "Missing Operand Drill",
  shortDescription: "Solve for the hidden operand by identifying equation direction first.",
  iconLabel: "?=",
  modeGroup: "practice",
  ...speedMathGroup,
  order: 30,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateMissingOperandPrompt
});
