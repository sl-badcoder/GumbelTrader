import { magnitudeBucketDistractors, pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateMagnitudeSensePrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const cases = [
    {
      text: "60 x 60 x 60 is closest to which bucket?",
      answer: "10^5",
      explanation: "60^3 = 6^3 x 10^3 = 216,000, so 10^5 is the right bucket."
    },
    {
      text: "300 x 400 x 50 is closest to which bucket?",
      answer: "10^6",
      explanation: "3 x 4 x 5 = 60 and 10^2 x 10^2 x 10 = 10^5, giving 6,000,000."
    },
    {
      text: "80^3 is closest to 10^?",
      answer: "10^6",
      explanation: "80^3 = 512,000, which is closer to 10^6 than 10^5."
    },
    {
      text: "0.19 x 0.003 is closest to which bucket?",
      answer: "10^-4",
      explanation: "0.2 x 0.003 = 0.0006, which sits near 10^-4."
    }
  ];
  const promptCase = pickCyclic(cases, session.promptIndex);

  return {
    id: `magnitude-sense-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, magnitudeBucketDistractors(promptCase.answer)),
    explanation: promptCase.explanation,
    skillTags: ["magnitudeSense", "optionElimination"],
    trapTags: ["magnitudeError", "decimalShift"],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}
