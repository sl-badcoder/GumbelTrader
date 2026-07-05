import { randomIntInclusive, type RandomNumberGenerator } from "../../shared/utils/random";
import type { QuantCategory, QuantDifficulty, QuantQuestion } from "./quantTypes";

export const quantQuestionBank: QuantQuestion[] = [
  {
    id: "prob-coins-at-least-one-head",
    category: "probability",
    difficulty: "easy",
    tags: ["probability", "coins", "at-least-one"],
    text: "Three fair coins are tossed. What is the probability of getting at least one head? Enter a decimal to 4 places.",
    answer: 0.875,
    explanation: "Use the complement: 1 - P(no heads) = 1 - (1/2)^3 = 7/8."
  },
  {
    id: "prob-dice-sum-nine",
    category: "probability",
    difficulty: "easy",
    tags: ["probability", "dice", "counting"],
    text: "Two fair six-sided dice are rolled. What is the probability that the sum is 9? Enter a decimal to 4 places.",
    answer: 0.1111,
    explanation: "There are 4 favorable outcomes: (3,6), (4,5), (5,4), (6,3), out of 36."
  },
  {
    id: "prob-card-heart-or-king",
    category: "probability",
    difficulty: "easy",
    tags: ["probability", "cards", "counting"],
    text: "One card is drawn from a standard 52-card deck. What is the probability it is a heart or a king? Enter a decimal to 4 places.",
    answer: 0.3077,
    explanation: "There are 13 hearts plus 4 kings minus the king of hearts: 16 favorable cards."
  },
  {
    id: "prob-dependent-two-aces",
    category: "probability",
    difficulty: "medium",
    tags: ["probability", "cards", "dependent-events"],
    text: "Two cards are drawn without replacement from a standard deck. What is the probability both are aces? Enter a decimal to 4 places.",
    answer: 0.0045,
    explanation: "Multiply dependent probabilities: (4/52) x (3/51)."
  },
  {
    id: "prob-conditional-red-given-face",
    category: "probability",
    difficulty: "medium",
    tags: ["probability", "cards", "conditional-probability"],
    text: "A card is known to be a face card. What is the probability it is red? Enter a decimal to 4 places.",
    answer: 0.5,
    explanation: "There are 12 face cards, and 6 of them are red."
  },
  {
    id: "prob-ev-die-payout",
    category: "probability",
    difficulty: "medium",
    tags: ["probability", "expected-value", "dice"],
    text: "A fair die pays $10 on a 6 and $0 otherwise. What is the expected payout in dollars? Enter a decimal to 4 places.",
    answer: 1.6667,
    explanation: "Expected value is 10 x (1/6) + 0 x (5/6)."
  },
  {
    id: "prob-two-dice-at-least-one-six",
    category: "probability",
    difficulty: "medium",
    tags: ["probability", "dice", "at-least-one"],
    text: "Two fair dice are rolled. What is the probability that at least one die shows a 6? Enter a decimal to 4 places.",
    answer: 0.3056,
    explanation: "Use the complement: 1 - P(no sixes) = 1 - (5/6)^2 = 11/36."
  },
  {
    id: "prob-binomial-four-heads",
    category: "probability",
    difficulty: "hard",
    tags: ["probability", "coins", "counting"],
    text: "A fair coin is tossed 6 times. What is the probability of exactly 4 heads? Enter a decimal to 4 places.",
    answer: 0.2344,
    explanation: "Choose the 4 head positions: C(6,4) / 2^6 = 15/64."
  },
  {
    id: "prob-conditional-two-child",
    category: "probability",
    difficulty: "hard",
    tags: ["probability", "conditional-probability", "counting"],
    text: "A family has two children. Given that at least one is a boy, what is the probability both are boys? Enter a decimal to 4 places.",
    answer: 0.3333,
    explanation: "The possible ordered outcomes are BB, BG, and GB; only BB has two boys."
  },
  {
    id: "prob-dice-product-even",
    category: "probability",
    difficulty: "hard",
    tags: ["probability", "dice", "complement-counting"],
    text: "Two fair dice are rolled. What is the probability their product is even? Enter a decimal to 4 places.",
    answer: 0.75,
    explanation: "The product is odd only when both dice are odd, which has probability (3/6)^2."
  },
  {
    id: "comb-arrange-books",
    category: "combinatorics",
    difficulty: "easy",
    tags: ["combinatorics", "permutations", "arrangements"],
    text: "In how many ways can 5 distinct books be arranged on a shelf?",
    answer: 120,
    explanation: "Arrange 5 distinct items: 5! = 120."
  },
  {
    id: "comb-choose-committee",
    category: "combinatorics",
    difficulty: "easy",
    tags: ["combinatorics", "combinations", "group-selection"],
    text: "From 8 candidates, how many 3-person committees can be formed?",
    answer: 56,
    explanation: "Order does not matter, so use C(8,3) = 56."
  },
  {
    id: "comb-permute-code",
    category: "combinatorics",
    difficulty: "easy",
    tags: ["combinatorics", "permutations"],
    text: "How many 3-letter codes can be made from 7 distinct letters if no letter repeats?",
    answer: 210,
    explanation: "There are 7 choices, then 6, then 5: 7P3 = 210."
  },
  {
    id: "comb-arrange-restriction",
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "arrangements-with-restrictions"],
    text: "Six people line up. Two specified people must stand together. How many lineups are possible?",
    answer: 240,
    explanation: "Treat the pair as one block: 5! arrangements times 2 internal orders."
  },
  {
    id: "comb-distribute-identical",
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "distribution-problems"],
    text: "How many ways can 10 identical tokens be distributed among 4 distinct boxes if boxes may be empty?",
    answer: 286,
    explanation: "Stars and bars gives C(10+4-1, 4-1) = C(13,3)."
  },
  {
    id: "comb-team-with-women",
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "combinations", "counting-cases"],
    text: "From 5 women and 4 men, how many 4-person teams contain exactly 2 women?",
    answer: 60,
    explanation: "Choose 2 women and 2 men: C(5,2) x C(4,2)."
  },
  {
    id: "comb-digit-no-repeat",
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "permutations", "arrangements-with-restrictions"],
    text: "How many 4-digit numbers can be formed from digits 0-9 with no repeated digits?",
    answer: 4536,
    explanation: "The first digit has 9 choices, then 9, 8, and 7 choices."
  },
  {
    id: "comb-no-adjacent",
    category: "combinatorics",
    difficulty: "hard",
    tags: ["combinatorics", "arrangements-with-restrictions", "counting-cases"],
    text: "How many ways can the letters A, B, C, D, E be arranged if A and B are not adjacent?",
    answer: 72,
    explanation: "Total 5! minus arrangements with AB as a block: 120 - 2 x 4!."
  },
  {
    id: "comb-at-least-one-woman",
    category: "combinatorics",
    difficulty: "hard",
    tags: ["combinatorics", "complement-counting", "group-selection"],
    text: "From 6 women and 5 men, how many 5-person teams include at least one woman?",
    answer: 461,
    explanation: "Use complement counting: C(11,5) - C(5,5)."
  },
  {
    id: "comb-arrange-mississippi",
    category: "combinatorics",
    difficulty: "hard",
    tags: ["combinatorics", "permutations", "counting"],
    text: "How many distinct arrangements are there of the letters in MISSISSIPPI?",
    answer: 34650,
    explanation: "Use repeated-letter permutations: 11! / (4!4!2!)."
  }
];

export function getQuantQuestion(
  category: QuantCategory,
  difficulty: QuantDifficulty,
  random: RandomNumberGenerator = Math.random
): QuantQuestion {
  const questions = quantQuestionBank.filter((question) => {
    const categoryMatches = category === "mixed" || question.category === category;
    const difficultyMatches = difficulty === "mixed" || question.difficulty === difficulty;
    return categoryMatches && difficultyMatches;
  });
  const usableQuestions = questions.length > 0 ? questions : quantQuestionBank;

  const question = usableQuestions[randomIntInclusive(0, usableQuestions.length - 1, random)];

  if (!question) {
    return quantQuestionBank[0]!;
  }

  return question;
}
