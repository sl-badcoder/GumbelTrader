import { pickCyclic } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { generateDecimalPlacePrompt } from "./decimalPlaceGenerator";
import { generateFractionTrapPrompt } from "./fractionTrapGenerator";
import { generateMagnitudeSensePrompt } from "./magnitudeSenseGenerator";
import { generateMissingOperandPrompt } from "./missingOperandGenerator";
import { generatePercentIntuitionPrompt } from "./percentIntuitionGenerator";

export function generateEightyInEightMcPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const integerArithmeticPrompts: IntuitiveMathPrompt[] = [
    {
      id: `eighty-mc-arithmetic-${session.promptIndex}`,
      text: "48 x 7",
      answer: "336",
      choices: ["326", "335", "336", "384"],
      explanation: "48 x 7 = 40 x 7 + 8 x 7 = 336.",
      skillTags: ["exactArithmetic", "optionElimination"],
      trapTags: ["offByOne"],
      acceptsTypedAnswer: false
    },
    {
      id: `eighty-mc-arithmetic-${session.promptIndex}`,
      text: "625 / 25",
      answer: "25",
      choices: ["15", "20", "25", "35"],
      explanation: "25 x 25 = 625.",
      skillTags: ["exactArithmetic", "optionElimination"],
      trapTags: ["wrongInverseOperation"],
      acceptsTypedAnswer: false
    }
  ];
  const generators = [
    () => pickCyclic(integerArithmeticPrompts, session.promptIndex),
    generateMissingOperandPrompt,
    generateDecimalPlacePrompt,
    generateFractionTrapPrompt,
    generateMagnitudeSensePrompt,
    generatePercentIntuitionPrompt
  ];
  const prompt = pickCyclic(generators, session.promptIndex)(session);

  return {
    ...prompt,
    id: `eighty-in-eight-mc-${session.promptIndex}`,
    acceptsTypedAnswer: false
  };
}
