import { pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";
import { formatNumber, formatPercent } from "../numberFormatting";

export function generatePercentIntuitionPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const cases = [
    {
      text: "37.5% of 64",
      answer: "24",
      distractors: ["18", "32", "27"],
      explanation: "37.5% is 3/8, and 3/8 of 64 is 24.",
      skills: ["percentIntuition"] as const,
      traps: ["baseRateConfusion"] as const
    },
    {
      text: "24 is 12.5% of what?",
      answer: "192",
      distractors: ["3", "96", "300"],
      explanation: "12.5% is 1/8, so the original is 24 x 8 = 192.",
      skills: ["reversePercentage"] as const,
      traps: ["wrongInverseOperation"] as const
    },
    {
      text: "After +20% and then -20%, what percentage of the original remains?",
      answer: "96%",
      distractors: ["100%", "80%", "104%"],
      explanation: "+20% then -20% is 1.2 x 0.8 = 0.96, not 1.0.",
      skills: ["percentageChain"] as const,
      traps: ["additivePercentChain"] as const
    },
    {
      text: "66.7% of 90 is closest to",
      answer: "60",
      distractors: ["30", "45", "75"],
      explanation: "66.7% is about 2/3, and 2/3 of 90 is 60.",
      skills: ["percentIntuition"] as const,
      traps: ["baseRateConfusion"] as const
    }
  ];
  const promptCase = pickCyclic(cases, session.promptIndex);

  return {
    id: `percent-intuition-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, promptCase.distractors),
    explanation: promptCase.explanation,
    skillTags: [...promptCase.skills, "optionElimination"],
    trapTags: [...promptCase.traps],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}

export function solveReversePercentage(finalValue: number, percent: number): number {
  return finalValue / (percent / 100);
}

export function solvePercentChain(originalPercent: number, changes: number[]): string {
  const remaining = changes.reduce((current, change) => current * (1 + change / 100), 1);
  return formatPercent(originalPercent * remaining);
}

export function solvePercentOf(percent: number, value: number): string {
  return formatNumber((percent / 100) * value);
}
