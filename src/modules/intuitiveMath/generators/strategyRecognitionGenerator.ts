import { randomIntInclusive } from "../../../shared/utils/random";
import { uniqueChoices } from "../distractorFactory";
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
    },
    {
      text: "A geometry problem has two equal-looking halves after a reflection. Which strategy is most promising?",
      answer: "Symmetry",
      distractors: ["Induction", "Pigeonhole principle", "Generating functions"],
      explanation: "Reflection or rotation symmetry can reduce the amount that must be checked."
    },
    {
      text: "A problem asks for the maximum possible value, and one extreme object seems forced. Which strategy fits?",
      answer: "Extremal principle",
      distractors: ["Counting two ways", "Induction", "Modulo arithmetic"],
      explanation: "Choosing the largest, smallest, leftmost, or rightmost object often exposes a constraint."
    },
    {
      text: "A final state is easy to describe, but forward moves branch heavily. Which strategy should you try?",
      answer: "Working backwards",
      distractors: ["Symmetry", "Pigeonhole principle", "Counting two ways"],
      explanation: "When the end condition is tighter than the start, reverse moves can simplify the search."
    },
    {
      text: "A counting identity has a left side that selects a chair first and a right side that selects a team first. Which strategy fits?",
      answer: "Counting two ways",
      distractors: ["Invariant", "Contradiction", "Extremal principle"],
      explanation: "Both expressions count the same objects with different first choices."
    }
  ];
  const promptCase = cases[randomIntInclusive(0, cases.length - 1)] ?? cases[0]!;

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
