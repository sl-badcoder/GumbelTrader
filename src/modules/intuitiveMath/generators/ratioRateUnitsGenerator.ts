import { pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateRatioRateUnitsPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const cases = [
    {
      text: "3 machines make 18 units in 6 minutes. Units per machine per minute?",
      answer: "1",
      distractors: ["3", "6", "9"],
      explanation: "The target unit is units per machine per minute: 18 / 3 / 6 = 1."
    },
    {
      text: "A car travels 150 km in 2.5 hours. What is the speed in km/hour?",
      answer: "60",
      distractors: ["37.5", "75", "150"],
      explanation: "Speed is distance divided by time: 150 / 2.5 = 60 km/hour."
    },
    {
      text: "A 750 g bag costs $6. What is the price per kg?",
      answer: "$8",
      distractors: ["$4.50", "$6.75", "$10"],
      explanation: "750 g is 0.75 kg, so $6 / 0.75 = $8 per kg."
    },
    {
      text: "5 workers finish 40 tasks in 4 hours. Tasks per worker per hour?",
      answer: "2",
      distractors: ["8", "10", "20"],
      explanation: "Divide tasks by workers and hours: 40 / 5 / 4 = 2."
    }
  ];
  const promptCase = pickCyclic(cases, session.promptIndex);

  return {
    id: `ratio-rate-units-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, promptCase.distractors),
    explanation: promptCase.explanation,
    skillTags: ["ratioRateUnits", "optionElimination"],
    trapTags: ["wrongInverseOperation", "baseRateConfusion"],
    acceptsTypedAnswer: session.settings.acceptsTypedAnswer
  };
}
