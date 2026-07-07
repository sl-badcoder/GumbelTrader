import { randomIntInclusive, type RandomNumberGenerator } from "../../shared/utils/random";
import type { QuantCategory, QuantDifficulty, QuantQuestion } from "./quantTypes";

export const quantQuestionBank: QuantQuestion[] = [
  {
    id: "prob-coins-at-least-one-head",
    category: "probability",
    difficulty: "easy",
    tags: ["probability", "coins", "at-least-one"],
    text: "Three fair coins are tossed. What is the probability of getting at least one head? Enter a reduced fraction like a/b.",
    answer: 7 / 8,
    answerFraction: { numerator: 7, denominator: 8 },
    explanation: "Use the complement: 1 - P(no heads) = 1 - (1/2)^3 = 7/8."
  },
  {
    id: "prob-dice-sum-nine",
    category: "probability",
    difficulty: "easy",
    tags: ["probability", "dice", "counting"],
    text: "Two fair six-sided dice are rolled. What is the probability that the sum is 9? Enter a reduced fraction like a/b.",
    answer: 1 / 9,
    answerFraction: { numerator: 1, denominator: 9 },
    explanation: "There are 4 favorable outcomes: (3,6), (4,5), (5,4), (6,3), out of 36."
  },
  {
    id: "prob-card-heart-or-king",
    category: "probability",
    difficulty: "easy",
    tags: ["probability", "cards", "counting"],
    text: "One card is drawn from a standard 52-card deck. What is the probability it is a heart or a king? Enter a reduced fraction like a/b.",
    answer: 4 / 13,
    answerFraction: { numerator: 4, denominator: 13 },
    explanation: "There are 13 hearts plus 4 kings minus the king of hearts: 16 favorable cards."
  },
  {
    id: "prob-dependent-two-aces",
    category: "probability",
    difficulty: "medium",
    tags: ["probability", "cards", "dependent-events"],
    text: "Two cards are drawn without replacement from a standard deck. What is the probability both are aces? Enter a reduced fraction like a/b.",
    answer: 1 / 221,
    answerFraction: { numerator: 1, denominator: 221 },
    explanation: "Multiply dependent probabilities: (4/52) x (3/51)."
  },
  {
    id: "prob-conditional-red-given-face",
    category: "probability",
    difficulty: "medium",
    tags: ["probability", "cards", "conditional-probability"],
    text: "A card is known to be a face card. What is the probability it is red? Enter a reduced fraction like a/b.",
    answer: 1 / 2,
    answerFraction: { numerator: 1, denominator: 2 },
    explanation: "There are 12 face cards, and 6 of them are red."
  },
  {
    id: "prob-two-dice-at-least-one-six",
    category: "probability",
    difficulty: "medium",
    tags: ["probability", "dice", "at-least-one"],
    text: "Two fair dice are rolled. What is the probability that at least one die shows a 6? Enter a reduced fraction like a/b.",
    answer: 11 / 36,
    answerFraction: { numerator: 11, denominator: 36 },
    explanation: "Use the complement: 1 - P(no sixes) = 1 - (5/6)^2 = 11/36."
  },
  {
    id: "prob-binomial-four-heads",
    category: "probability",
    difficulty: "hard",
    tags: ["probability", "coins", "counting"],
    text: "A fair coin is tossed 6 times. What is the probability of exactly 4 heads? Enter a reduced fraction like a/b.",
    answer: 15 / 64,
    answerFraction: { numerator: 15, denominator: 64 },
    explanation: "Choose the 4 head positions: C(6,4) / 2^6 = 15/64."
  },
  {
    id: "prob-conditional-two-child",
    category: "probability",
    difficulty: "hard",
    tags: ["probability", "conditional-probability", "counting"],
    text: "A family has two children. Given that at least one is a boy, what is the probability both are boys? Enter a reduced fraction like a/b.",
    answer: 1 / 3,
    answerFraction: { numerator: 1, denominator: 3 },
    explanation: "The possible ordered outcomes are BB, BG, and GB; only BB has two boys."
  },
  {
    id: "prob-dice-product-even",
    category: "probability",
    difficulty: "hard",
    tags: ["probability", "dice", "complement-counting"],
    text: "Two fair dice are rolled. What is the probability their product is even? Enter a reduced fraction like a/b.",
    answer: 3 / 4,
    answerFraction: { numerator: 3, denominator: 4 },
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
  const generatedQuestion = generateQuantQuestion(category, difficulty, random);
  if (generatedQuestion) {
    return generatedQuestion;
  }

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

function generateQuantQuestion(
  category: QuantCategory,
  difficulty: QuantDifficulty,
  random: RandomNumberGenerator
): QuantQuestion | null {
  const resolvedCategory =
    category === "mixed"
      ? (randomIntInclusive(0, 1, random) === 0 ? "probability" : "combinatorics")
      : category;
  const resolvedDifficulty =
    difficulty === "mixed"
      ? (["easy", "medium", "hard"] as const)[randomIntInclusive(0, 2, random)] ?? "easy"
      : difficulty;

  return resolvedCategory === "probability"
    ? generateProbabilityQuestion(resolvedDifficulty, random)
    : generateCombinatoricsQuestion(resolvedDifficulty, random);
}

function generateProbabilityQuestion(
  difficulty: Exclude<QuantDifficulty, "mixed">,
  random: RandomNumberGenerator
): QuantQuestion {
  const templates =
    difficulty === "easy"
      ? [coinAtLeastOneHead, diceExactSum, dieAtLeastValue]
      : difficulty === "medium"
        ? [cardsSameSuit, diceAtLeastOneTarget, coinExactlyHeads]
        : [conditionalDieSum, cardsWithoutReplacement, binomialAtLeastHeads];
  return templates[randomIntInclusive(0, templates.length - 1, random)]!(random);
}

function makeProbabilityQuestion(
  question: Omit<QuantQuestion, "answer" | "answerFraction">,
  numerator: number,
  denominator: number
): QuantQuestion {
  const reduced = reduceFraction(numerator, denominator);
  return {
    ...question,
    answer: reduced.numerator / reduced.denominator,
    answerFraction: reduced
  };
}

function coinAtLeastOneHead(random: RandomNumberGenerator): QuantQuestion {
  const tosses = randomIntInclusive(2, 7, random);
  const denominator = 2 ** tosses;
  return makeProbabilityQuestion(
    {
      id: `prob-coin-at-least-one-${tosses}`,
      category: "probability",
      difficulty: "easy",
      tags: ["probability", "coins", "complement-counting"],
      text: `${tosses} fair coins are tossed. What is the probability of getting at least one head? Enter a reduced fraction like a/b.`,
      explanation: `Use the complement: 1 - P(no heads) = 1 - (1/2)^${tosses}.`
    },
    denominator - 1,
    denominator
  );
}

function diceExactSum(random: RandomNumberGenerator): QuantQuestion {
  const sum = randomIntInclusive(3, 11, random);
  const favorable = countDiceSum(sum);
  return makeProbabilityQuestion(
    {
      id: `prob-dice-sum-${sum}`,
      category: "probability",
      difficulty: "easy",
      tags: ["probability", "dice", "counting"],
      text: `Two fair six-sided dice are rolled. What is the probability that the sum is ${sum}? Enter a reduced fraction like a/b.`,
      explanation: `There are ${favorable} favorable outcomes out of 36 equally likely rolls.`
    },
    favorable,
    36
  );
}

function dieAtLeastValue(random: RandomNumberGenerator): QuantQuestion {
  const threshold = randomIntInclusive(2, 6, random);
  const favorable = 7 - threshold;
  return makeProbabilityQuestion(
    {
      id: `prob-die-at-least-${threshold}`,
      category: "probability",
      difficulty: "easy",
      tags: ["probability", "dice", "counting"],
      text: `A fair six-sided die is rolled. What is the probability of rolling at least ${threshold}? Enter a reduced fraction like a/b.`,
      explanation: `${favorable} faces are at least ${threshold}, out of 6 total faces.`
    },
    favorable,
    6
  );
}

function cardsSameSuit(random: RandomNumberGenerator): QuantQuestion {
  const draws = randomIntInclusive(2, 4, random);
  let numerator = 1;
  let denominator = 1;
  for (let draw = 1; draw < draws; draw += 1) {
    numerator *= 13 - draw;
    denominator *= 52 - draw;
  }
  return makeProbabilityQuestion(
    {
      id: `prob-cards-same-suit-${draws}`,
      category: "probability",
      difficulty: "medium",
      tags: ["probability", "cards", "dependent-events"],
      text: `${draws} cards are drawn without replacement from a standard deck. What is the probability they are all the same suit? Enter a reduced fraction like a/b.`,
      explanation: "After the first card fixes the suit, each later card must match that suit."
    },
    numerator,
    denominator
  );
}

function diceAtLeastOneTarget(random: RandomNumberGenerator): QuantQuestion {
  const dice = randomIntInclusive(2, 4, random);
  const target = randomIntInclusive(1, 6, random);
  const denominator = 6 ** dice;
  return makeProbabilityQuestion(
    {
      id: `prob-dice-at-least-one-${target}-${dice}`,
      category: "probability",
      difficulty: "medium",
      tags: ["probability", "dice", "complement-counting"],
      text: `${dice} fair dice are rolled. What is the probability that at least one die shows a ${target}? Enter a reduced fraction like a/b.`,
      explanation: `Use the complement: 1 - P(no ${target}s) = 1 - (5/6)^${dice}.`
    },
    denominator - 5 ** dice,
    denominator
  );
}

function coinExactlyHeads(random: RandomNumberGenerator): QuantQuestion {
  const tosses = randomIntInclusive(4, 8, random);
  const heads = randomIntInclusive(1, tosses - 1, random);
  return makeProbabilityQuestion(
    {
      id: `prob-binomial-exact-${heads}-of-${tosses}`,
      category: "probability",
      difficulty: "medium",
      tags: ["probability", "coins", "binomial"],
      text: `A fair coin is tossed ${tosses} times. What is the probability of exactly ${heads} heads? Enter a reduced fraction like a/b.`,
      explanation: `Choose the head positions: C(${tosses},${heads}) / 2^${tosses}.`
    },
    combination(tosses, heads),
    2 ** tosses
  );
}

function conditionalDieSum(random: RandomNumberGenerator): QuantQuestion {
  const knownMinimum = randomIntInclusive(3, 8, random);
  const targetSum = randomIntInclusive(knownMinimum, 12, random);
  const denominator = Array.from({ length: 11 }, (_, index) => index + 2)
    .filter((sum) => sum >= knownMinimum)
    .reduce((total, sum) => total + countDiceSum(sum), 0);
  const numerator = countDiceSum(targetSum);
  return makeProbabilityQuestion(
    {
      id: `prob-conditional-dice-${targetSum}-given-${knownMinimum}`,
      category: "probability",
      difficulty: "hard",
      tags: ["probability", "dice", "conditional-probability"],
      text: `Two fair dice are rolled. Given that their sum is at least ${knownMinimum}, what is the probability that the sum is ${targetSum}? Enter a reduced fraction like a/b.`,
      explanation: `Restrict the sample space to sums at least ${knownMinimum}, then count the ${targetSum} outcomes.`
    },
    numerator,
    denominator
  );
}

function cardsWithoutReplacement(random: RandomNumberGenerator): QuantQuestion {
  const ranks = ["aces", "kings", "queens", "jacks"];
  const rank = ranks[randomIntInclusive(0, ranks.length - 1, random)] ?? "aces";
  const draws = randomIntInclusive(2, 3, random);
  let numerator = 1;
  let denominator = 1;
  for (let draw = 0; draw < draws; draw += 1) {
    numerator *= 4 - draw;
    denominator *= 52 - draw;
  }
  return makeProbabilityQuestion(
    {
      id: `prob-cards-${draws}-${rank}`,
      category: "probability",
      difficulty: "hard",
      tags: ["probability", "cards", "dependent-events"],
      text: `${draws} cards are drawn without replacement from a standard deck. What is the probability all are ${rank}? Enter a reduced fraction like a/b.`,
      explanation: "Multiply the shrinking favorable-rank count over the shrinking deck size."
    },
    numerator,
    denominator
  );
}

function binomialAtLeastHeads(random: RandomNumberGenerator): QuantQuestion {
  const tosses = randomIntInclusive(5, 9, random);
  const heads = randomIntInclusive(Math.ceil(tosses / 2), tosses - 1, random);
  let favorable = 0;
  for (let count = heads; count <= tosses; count += 1) {
    favorable += combination(tosses, count);
  }
  return makeProbabilityQuestion(
    {
      id: `prob-binomial-at-least-${heads}-of-${tosses}`,
      category: "probability",
      difficulty: "hard",
      tags: ["probability", "coins", "binomial"],
      text: `A fair coin is tossed ${tosses} times. What is the probability of at least ${heads} heads? Enter a reduced fraction like a/b.`,
      explanation: `Add C(${tosses},k) for k = ${heads} through ${tosses}, then divide by 2^${tosses}.`
    },
    favorable,
    2 ** tosses
  );
}

function generateCombinatoricsQuestion(
  difficulty: Exclude<QuantDifficulty, "mixed">,
  random: RandomNumberGenerator
): QuantQuestion {
  const templates =
    difficulty === "easy"
      ? [arrangeDistinct, chooseCommittee, noRepeatCode]
      : difficulty === "medium"
        ? [lineupTogether, distributeIdentical, teamExactGroup, digitNoRepeat]
        : [lineupNotTogether, teamAtLeastOne, repeatedLetters, committeeAtLeast];
  return templates[randomIntInclusive(0, templates.length - 1, random)]!(random);
}

function arrangeDistinct(random: RandomNumberGenerator): QuantQuestion {
  const items = randomIntInclusive(4, 8, random);
  return {
    id: `comb-arrange-${items}`,
    category: "combinatorics",
    difficulty: "easy",
    tags: ["combinatorics", "permutations"],
    text: `In how many ways can ${items} distinct books be arranged on a shelf?`,
    answer: factorial(items),
    explanation: `Arrange ${items} distinct items: ${items}!.`
  };
}

function chooseCommittee(random: RandomNumberGenerator): QuantQuestion {
  const total = randomIntInclusive(7, 14, random);
  const chosen = randomIntInclusive(2, Math.min(5, total - 2), random);
  return {
    id: `comb-choose-${chosen}-of-${total}`,
    category: "combinatorics",
    difficulty: "easy",
    tags: ["combinatorics", "combinations"],
    text: `From ${total} candidates, how many ${chosen}-person committees can be formed?`,
    answer: combination(total, chosen),
    explanation: `Order does not matter, so use C(${total},${chosen}).`
  };
}

function noRepeatCode(random: RandomNumberGenerator): QuantQuestion {
  const letters = randomIntInclusive(6, 10, random);
  const length = randomIntInclusive(2, 4, random);
  return {
    id: `comb-code-${length}-of-${letters}`,
    category: "combinatorics",
    difficulty: "easy",
    tags: ["combinatorics", "permutations"],
    text: `How many ${length}-letter codes can be made from ${letters} distinct letters if no letter repeats?`,
    answer: permutation(letters, length),
    explanation: `Use ${letters}P${length}: multiply descending choices for each slot.`
  };
}

function lineupTogether(random: RandomNumberGenerator): QuantQuestion {
  const people = randomIntInclusive(5, 9, random);
  return {
    id: `comb-lineup-together-${people}`,
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "arrangements-with-restrictions"],
    text: `${people} people line up. Two specified people must stand together. How many lineups are possible?`,
    answer: factorial(people - 1) * 2,
    explanation: `Treat the pair as one block: ${(people - 1)}! block arrangements times 2 internal orders.`
  };
}

function distributeIdentical(random: RandomNumberGenerator): QuantQuestion {
  const tokens = randomIntInclusive(6, 14, random);
  const boxes = randomIntInclusive(3, 6, random);
  return {
    id: `comb-distribute-${tokens}-${boxes}`,
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "distribution-problems"],
    text: `How many ways can ${tokens} identical tokens be distributed among ${boxes} distinct boxes if boxes may be empty?`,
    answer: combination(tokens + boxes - 1, boxes - 1),
    explanation: `Stars and bars gives C(${tokens}+${boxes}-1, ${boxes}-1).`
  };
}

function teamExactGroup(random: RandomNumberGenerator): QuantQuestion {
  const women = randomIntInclusive(5, 9, random);
  const men = randomIntInclusive(4, 9, random);
  const womenChosen = randomIntInclusive(1, Math.min(3, women), random);
  const menChosen = randomIntInclusive(1, Math.min(3, men), random);
  return {
    id: `comb-team-exact-${womenChosen}-${menChosen}-${women}-${men}`,
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "combinations", "counting-cases"],
    text: `From ${women} women and ${men} men, how many ${womenChosen + menChosen}-person teams contain exactly ${womenChosen} women?`,
    answer: combination(women, womenChosen) * combination(men, menChosen),
    explanation: `Choose ${womenChosen} women and ${menChosen} men independently.`
  };
}

function digitNoRepeat(random: RandomNumberGenerator): QuantQuestion {
  const length = randomIntInclusive(3, 5, random);
  return {
    id: `comb-digit-no-repeat-${length}`,
    category: "combinatorics",
    difficulty: "medium",
    tags: ["combinatorics", "permutations", "arrangements-with-restrictions"],
    text: `How many ${length}-digit numbers can be formed from digits 0-9 with no repeated digits?`,
    answer: 9 * permutation(9, length - 1),
    explanation: "The first digit cannot be 0; each later digit has one fewer available choice."
  };
}

function lineupNotTogether(random: RandomNumberGenerator): QuantQuestion {
  const people = randomIntInclusive(5, 9, random);
  return {
    id: `comb-lineup-not-together-${people}`,
    category: "combinatorics",
    difficulty: "hard",
    tags: ["combinatorics", "complement-counting"],
    text: `${people} people line up. Two specified people must not stand together. How many lineups are possible?`,
    answer: factorial(people) - factorial(people - 1) * 2,
    explanation: `Use total lineups minus the together case: ${people}! - 2 x ${(people - 1)}!.`
  };
}

function teamAtLeastOne(random: RandomNumberGenerator): QuantQuestion {
  const women = randomIntInclusive(4, 9, random);
  const men = randomIntInclusive(5, 10, random);
  const size = randomIntInclusive(3, Math.min(6, women + men - 1), random);
  return {
    id: `comb-team-at-least-one-${women}-${men}-${size}`,
    category: "combinatorics",
    difficulty: "hard",
    tags: ["combinatorics", "complement-counting"],
    text: `From ${women} women and ${men} men, how many ${size}-person teams include at least one woman?`,
    answer: combination(women + men, size) - combination(men, size),
    explanation: "Use complement counting: all teams minus all-men teams."
  };
}

function repeatedLetters(random: RandomNumberGenerator): QuantQuestion {
  const first = randomIntInclusive(2, 4, random);
  const second = randomIntInclusive(2, 4, random);
  const singles = randomIntInclusive(1, 3, random);
  const total = first + second + singles;
  return {
    id: `comb-repeated-letters-${first}-${second}-${singles}`,
    category: "combinatorics",
    difficulty: "hard",
    tags: ["combinatorics", "permutations", "repeated-items"],
    text: `How many distinct arrangements are there of ${total} letters if one letter repeats ${first} times, another repeats ${second} times, and the remaining ${singles} letters are unique?`,
    answer: factorial(total) / (factorial(first) * factorial(second)),
    explanation: `Divide ${total}! by the factorials for repeated letters.`
  };
}

function committeeAtLeast(random: RandomNumberGenerator): QuantQuestion {
  const seniors = randomIntInclusive(4, 8, random);
  const juniors = randomIntInclusive(5, 10, random);
  const size = randomIntInclusive(4, 7, random);
  const minimumSeniors = randomIntInclusive(2, Math.min(3, seniors, size), random);
  let total = 0;
  for (let seniorCount = minimumSeniors; seniorCount <= Math.min(size, seniors); seniorCount += 1) {
    total += combination(seniors, seniorCount) * combination(juniors, size - seniorCount);
  }
  return {
    id: `comb-committee-at-least-${minimumSeniors}-${seniors}-${juniors}-${size}`,
    category: "combinatorics",
    difficulty: "hard",
    tags: ["combinatorics", "combinations", "counting-cases"],
    text: `From ${seniors} seniors and ${juniors} juniors, how many ${size}-person committees have at least ${minimumSeniors} seniors?`,
    answer: total,
    explanation: `Sum cases with ${minimumSeniors} or more seniors.`
  };
}

function countDiceSum(sum: number): number {
  let count = 0;
  for (let first = 1; first <= 6; first += 1) {
    const second = sum - first;
    if (second >= 1 && second <= 6) {
      count += 1;
    }
  }
  return count;
}

function factorial(value: number): number {
  let product = 1;
  for (let factor = 2; factor <= value; factor += 1) {
    product *= factor;
  }
  return product;
}

function permutation(total: number, chosen: number): number {
  let product = 1;
  for (let offset = 0; offset < chosen; offset += 1) {
    product *= total - offset;
  }
  return product;
}

function combination(total: number, chosen: number): number {
  if (chosen < 0 || chosen > total) {
    return 0;
  }

  const reducedChosen = Math.min(chosen, total - chosen);
  return permutation(total, reducedChosen) / factorial(reducedChosen);
}

function reduceFraction(numerator: number, denominator: number) {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

function gcd(left: number, right: number): number {
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}
