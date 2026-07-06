import { generateStrategyRecognitionPrompt } from "../generators/strategyRecognitionGenerator";
import { createIntuitiveMathModule, defaultChoicePracticeSettings } from "./createIntuitiveMathModule";
import { reasoningGroup } from "../../gameGroupMetadata";

export const strategyRecognitionModule = createIntuitiveMathModule({
  id: "strategy-recognition",
  title: "Strategy Recognition Drill",
  shortDescription: "Choose the most promising proof or problem-solving strategy.",
  iconLabel: "why",
  modeGroup: "practice",
  ...reasoningGroup,
  order: 420,
  defaultSettings: defaultChoicePracticeSettings,
  generator: generateStrategyRecognitionPrompt
});
