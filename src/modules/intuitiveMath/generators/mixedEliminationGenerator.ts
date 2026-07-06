import { pickCyclic } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { generateDecimalPlacePrompt } from "./decimalPlaceGenerator";
import { generateFractionTrapPrompt } from "./fractionTrapGenerator";
import { generateMagnitudeSensePrompt } from "./magnitudeSenseGenerator";
import { generateMissingOperandPrompt } from "./missingOperandGenerator";
import { generatePercentIntuitionPrompt } from "./percentIntuitionGenerator";

export function generateMixedEliminationPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const generators = [
    generateMissingOperandPrompt,
    generateDecimalPlacePrompt,
    generateFractionTrapPrompt,
    generateMagnitudeSensePrompt,
    generatePercentIntuitionPrompt
  ];
  const generator = pickCyclic(generators, session.promptIndex);
  const prompt = generator(session);

  return {
    ...prompt,
    id: `mixed-elimination-${session.promptIndex}`,
    skillTags: [...(prompt.skillTags ?? []), "optionElimination"]
  };
}
