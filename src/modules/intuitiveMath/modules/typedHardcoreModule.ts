import { generateMixedEliminationPrompt } from "../generators/mixedEliminationGenerator";
import { createIntuitiveMathModule, typedHardcoreSettings } from "./createIntuitiveMathModule";
import { speedMathGroup } from "../../gameGroupMetadata";

export const typedHardcoreModule = createIntuitiveMathModule({
  id: "typed-hardcore",
  title: "Typed Hardcore",
  shortDescription: "The same recognition templates without answer choices.",
  iconLabel: "type",
  modeGroup: "practice",
  ...speedMathGroup,
  order: 40,
  defaultSettings: typedHardcoreSettings,
  generator: (session) => {
    const prompt = generateMixedEliminationPrompt(session);
    return {
      ...prompt,
      choices: undefined,
      acceptsTypedAnswer: true
    };
  }
});
