import { randomIntInclusive, type RandomNumberGenerator } from "../../../shared/utils/random";
import { uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateFermiPrompt(
  session: IntuitiveMathSession,
  random?: RandomNumberGenerator
): IntuitiveMathPrompt {
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
    },
    {
      text: "About how many seconds are in an hour?",
      answer: "10^3",
      choices: ["10^2", "10^3", "10^4", "10^5"],
      explanation: "60 x 60 = 3,600, which is on the order of 10^3."
    },
    {
      text: "About how many hours are in a year?",
      answer: "10^4",
      choices: ["10^2", "10^3", "10^4", "10^5"],
      explanation: "365 x 24 is about 8,800 hours."
    },
    {
      text: "A country has 80 million people. If 1 in 100 buys an item, purchases are closest to",
      answer: "10^6",
      choices: ["10^4", "10^5", "10^6", "10^8"],
      explanation: "80,000,000 / 100 = 800,000, which is closest to 10^6."
    },
    {
      text: "Which assumption matters most when estimating monthly revenue for a gym?",
      answer: "Members and average monthly fee",
      choices: ["Wall color", "Members and average monthly fee", "Logo font", "Number of mirrors"],
      explanation: "Revenue is driven mainly by member count times average fee."
    }
  ];
  const promptCase = cases[randomIntInclusive(0, cases.length - 1, random)] ?? cases[0]!;

  return {
    id: `fermi-estimation-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(
      promptCase.answer,
      promptCase.choices.filter((choice) => choice !== promptCase.answer),
      4,
      random
    ),
    explanation: promptCase.explanation,
    skillTags: ["fermiEstimation", "magnitudeSense", "optionElimination"],
    trapTags: ["magnitudeError"],
    acceptsTypedAnswer: false
  };
}
