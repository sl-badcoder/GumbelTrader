import { pickCyclic, uniqueChoices } from "../distractorFactory";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "../intuitiveMathTypes";

export function generateStrategyRecognitionPrompt(
  session: IntuitiveMathSession
): IntuitiveMathPrompt {
  const cases = [
    {
      text: "You need to show that among 13 people, two were born in the same month. Which strategy is most promising?",
      answer: "Pigeonhole principle",
      distractors: ["Induction", "Symmetry", "Extremal principle"],
      explanation: "There are 13 people and 12 months, so two people must share a month."
    },
    {
      text: "A problem asks you to prove a statement for all positive integers after checking how n leads to n + 1. Which strategy fits?",
      answer: "Induction",
      distractors: ["Contradiction", "Counting two ways", "Symmetry"],
      explanation: "A base case plus an n to n + 1 step is the structure of induction."
    },
    {
      text: "A counting problem has rows and columns, and either direction counts the same objects. Which strategy is most promising?",
      answer: "Counting two ways",
      distractors: ["Working backwards", "Extremal principle", "Invariant"],
      explanation: "Counting the same set by rows and columns often gives the target relation."
    },
    {
      text: "A process changes a board repeatedly, but parity never changes. Which strategy should you test first?",
      answer: "Invariant",
      distractors: ["Pigeonhole principle", "Symmetry", "Working backwards"],
      explanation: "A quantity that cannot change under allowed moves is an invariant."
    }
  ];
  const promptCase = pickCyclic(cases, session.promptIndex);

  return {
    id: `strategy-recognition-${session.promptIndex}`,
    text: promptCase.text,
    answer: promptCase.answer,
    choices: uniqueChoices(promptCase.answer, promptCase.distractors),
    explanation: promptCase.explanation,
    skillTags: ["strategyRecognition", "optionElimination"],
    acceptsTypedAnswer: false
  };
}
