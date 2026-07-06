import { pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateFermiPrompt(session: IntuitiveMathSession): IntuitiveMathPrompt {
  const cases = [
    {
      text: "About how many minutes are in a year?",
      answer: "10^5",
      choices: ["10^3", "10^4", "10^5", "10^6"],
      explanation: "Use 365 x 24 x 60. The dominant scale is about 5 x 10^5 minutes."
    },
    {
      text: "Which assumption matters most when estimating annual coffee cups sold by one cafe?",
      answer: "Customers per day",
      choices: ["Cup color", "Customers per day", "Calendar month names", "Street name length"],
      explanation: "The dominant variables are customers per day and cups per customer."
    },
    {
      text: "A city has 1 million people. If 1 in 10 rides a bus daily, daily bus rides are closest to",
      answer: "10^5",
      choices: ["10^3", "10^4", "10^5", "10^6"],
      explanation: "1,000,000 x 0.1 = 100,000, so the order is 10^5."
    },
    {
      text: "A rough upper bound for seconds in a day is",
      answer: "10^5",
      choices: ["10^3", "10^4", "10^5", "10^7"],
      explanation: "24 x 60 x 60 = 86,400, so 10^5 is a simple upper-order bound."
    }
  ];
  const promptCase = pickCyclic(cases, session.promptIndex);

  return {
    id: `fermi-estimation-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, promptCase.choices.filter((choice) => choice !== promptCase.answer)),
    explanation: promptCase.explanation,
    skillTags: ["fermiEstimation", "magnitudeSense", "optionElimination"],
    trapTags: ["magnitudeError"],
    acceptsTypedAnswer: false
  };
}
