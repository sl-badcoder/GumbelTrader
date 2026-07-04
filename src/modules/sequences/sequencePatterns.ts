import { randomIntInclusive, type RandomNumberGenerator } from "../../shared/utils/random";
import type {
  GeneratedSequence,
  SequenceDifficulty
} from "./sequenceTypes";

type SequencePattern = {
  id: string;
  difficulty: SequenceDifficulty;
  generate: (random?: RandomNumberGenerator) => GeneratedSequence;
};

const sequenceLength = 6;
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

export const sequencePatterns: SequencePattern[] = [
  {
    id: "arithmetic-progression",
    difficulty: "easy",
    generate: (random) => buildArithmetic("arithmetic-progression", "easy", -30, 30, -20, 20, random)
  },
  {
    id: "geometric-progression",
    difficulty: "easy",
    generate: (random) => buildGeometric("geometric-progression", "easy", -15, 15, 1, 3, random)
  },
  {
    id: "standard-fibonacci",
    difficulty: "easy",
    generate: () => toGeneratedSequence("standard-fibonacci", "easy", [1, 1, 2, 3, 5, 8])
  },
  {
    id: "increasing-arithmetic-progression",
    difficulty: "easy",
    generate: (random) =>
      buildIncreasingArithmetic("increasing-arithmetic-progression", "easy", -20, 20, -20, 20, -5, 5, random)
  },
  {
    id: "prime-numbers",
    difficulty: "easy",
    generate: (random) => buildPrimes("prime-numbers", "easy", 0, 4, random)
  },
  {
    id: "arithmetic-prime-numbers",
    difficulty: "easy",
    generate: (random) => {
      const startIndex = randomIntInclusive(0, 4, random);
      const step = pickNonZero(-3, 3, random);
      return toGeneratedSequence(
        "arithmetic-prime-numbers",
        "easy",
        Array.from(
          { length: sequenceLength },
          (_, index) => valueAt(primes, startIndex + index) + step * index
        )
      );
    }
  },
  {
    id: "medium-arithmetic-progression",
    difficulty: "medium",
    generate: (random) => buildArithmetic("medium-arithmetic-progression", "medium", -100, 100, -50, 50, random)
  },
  {
    id: "medium-geometric-progression",
    difficulty: "medium",
    generate: (random) => buildGeometric("medium-geometric-progression", "medium", -20, 20, -7, 7, random)
  },
  {
    id: "sign-flip-arithmetic",
    difficulty: "medium",
    generate: (random) => {
      const start = pickNonZero(-100, 100, random);
      const step = pickNonZero(-50, 50, random);
      return buildSequence("sign-flip-arithmetic", "medium", (index) => {
        const value = start + step * index;
        return index % 2 === 0 ? value : -value;
      });
    }
  },
  {
    id: "mixed-geometric-arithmetic",
    difficulty: "medium",
    generate: (random) => buildMixedGeometricArithmetic("mixed-geometric-arithmetic", "medium", -15, 15, 1, 3, -20, 20, random)
  },
  {
    id: "increasing-geometric-progression",
    difficulty: "medium",
    generate: (random) => buildIncreasingGeometric("increasing-geometric-progression", "medium", -8, 8, 2, 2, random)
  },
  {
    id: "shifted-start-fibonacci",
    difficulty: "medium",
    generate: (random) => {
      const start = pickNonZero(-10, 10, random);
      return toGeneratedSequence("shifted-start-fibonacci", "medium", fibonacciValues(start, start));
    }
  },
  {
    id: "multiplicative-fibonacci",
    difficulty: "medium",
    generate: (random) => {
      const first = randomIntInclusive(1, 3, random);
      const second = randomIntInclusive(2, 4, random);
      return toGeneratedSequence("multiplicative-fibonacci", "medium", multiplicativeFibonacciValues(first, second));
    }
  },
  {
    id: "alternating-sign-fibonacci",
    difficulty: "medium",
    generate: (random) => {
      const start = pickNonZero(1, 8, random);
      return toGeneratedSequence("alternating-sign-fibonacci", "medium", withAlternatingSigns(fibonacciValues(start, start)));
    }
  },
  {
    id: "arithmetic-with-distractors",
    difficulty: "medium",
    generate: (random) => {
      const main = arithmeticValues(pickNonZero(-40, 40, random), pickNonZero(-15, 15, random), 4);
      const distractor = randomIntInclusive(-50, 50, random);
      return toGeneratedSequence("arithmetic-with-distractors", "medium", [
        valueAt(main, 0),
        distractor,
        valueAt(main, 1),
        distractor,
        valueAt(main, 2),
        valueAt(main, 3)
      ]);
    }
  },
  {
    id: "tribonacci",
    difficulty: "medium",
    generate: () => toGeneratedSequence("tribonacci", "medium", tribonacciValues(1, 1, 2))
  },
  {
    id: "hard-arithmetic-progression",
    difficulty: "hard",
    generate: (random) => buildArithmetic("hard-arithmetic-progression", "hard", -300, 300, -150, 150, random)
  },
  {
    id: "hard-geometric-progression",
    difficulty: "hard",
    generate: (random) => buildGeometric("hard-geometric-progression", "hard", -40, 40, -9, 9, random)
  },
  {
    id: "shifted-fibonacci",
    difficulty: "hard",
    generate: (random) => {
      const shift = pickNonZero(-30, 30, random);
      return toGeneratedSequence(
        "shifted-fibonacci",
        "hard",
        fibonacciValues(1, 1).map((value) => value + shift)
      );
    }
  },
  {
    id: "binomial-sequence",
    difficulty: "hard",
    generate: (random) => {
      const values = pascalSegment(random);
      return toGeneratedSequence("binomial-sequence", "hard", values);
    }
  },
  {
    id: "shifted-tribonacci",
    difficulty: "hard",
    generate: (random) => {
      const shift = pickNonZero(-25, 25, random);
      return toGeneratedSequence(
        "shifted-tribonacci",
        "hard",
        tribonacciValues(1, 1, 2).map((value) => value + shift)
      );
    }
  },
  {
    id: "custom-start-tribonacci",
    difficulty: "hard",
    generate: (random) =>
      toGeneratedSequence(
        "custom-start-tribonacci",
        "hard",
        tribonacciValues(
          pickNonZero(-10, 10, random),
          pickNonZero(-10, 10, random),
          pickNonZero(-10, 10, random)
        )
      )
  },
  {
    id: "custom-start-fibonacci",
    difficulty: "hard",
    generate: (random) =>
      toGeneratedSequence(
        "custom-start-fibonacci",
        "hard",
        fibonacciValues(pickNonZero(-20, 20, random), pickNonZero(-20, 20, random))
      )
  },
  {
    id: "interwoven-arithmetic-geometric",
    difficulty: "hard",
    generate: (random) => {
      const arithmetic = arithmeticValues(pickNonZero(-30, 30, random), pickNonZero(-12, 12, random), 3);
      const geometric = geometricValues(pickNonZero(-8, 8, random), pickNonZero(2, 4, random), 3);
      return toGeneratedSequence("interwoven-arithmetic-geometric", "hard", [
        valueAt(arithmetic, 0),
        valueAt(geometric, 0),
        valueAt(arithmetic, 1),
        valueAt(geometric, 1),
        valueAt(arithmetic, 2),
        valueAt(geometric, 2)
      ]);
    }
  },
  {
    id: "paired-interwoven-sequences",
    difficulty: "hard",
    generate: (random) => {
      const arithmetic = arithmeticValues(pickNonZero(-40, 40, random), pickNonZero(-10, 10, random), 4);
      const fibonacci = fibonacciValues(pickNonZero(1, 8, random), pickNonZero(1, 8, random));
      return toGeneratedSequence("paired-interwoven-sequences", "hard", [
        valueAt(arithmetic, 0),
        valueAt(arithmetic, 1),
        valueAt(fibonacci, 0),
        valueAt(fibonacci, 1),
        valueAt(arithmetic, 2),
        valueAt(arithmetic, 3)
      ]);
    }
  },
  {
    id: "shifted-pascal-triangle",
    difficulty: "hard",
    generate: (random) => {
      const row = randomIntInclusive(5, 9, random);
      const shift = pickNonZero(-20, 20, random);
      return toGeneratedSequence(
        "shifted-pascal-triangle",
        "hard",
        pascalSegment(random, row).map((value) => value + shift)
      );
    }
  },
  {
    id: "alternating-sign-tribonacci",
    difficulty: "hard",
    generate: (random) =>
      toGeneratedSequence(
        "alternating-sign-tribonacci",
        "hard",
        withAlternatingSigns(
          tribonacciValues(
            pickNonZero(1, 6, random),
            pickNonZero(1, 6, random),
            pickNonZero(1, 6, random)
          )
        )
      )
  }
];

function buildArithmetic(
  patternId: string,
  difficulty: SequenceDifficulty,
  minStart: number,
  maxStart: number,
  minStep: number,
  maxStep: number,
  random?: RandomNumberGenerator
): GeneratedSequence {
  return toGeneratedSequence(
    patternId,
    difficulty,
    arithmeticValues(pickNonZero(minStart, maxStart, random), pickNonZero(minStep, maxStep, random), sequenceLength)
  );
}

function buildGeometric(
  patternId: string,
  difficulty: SequenceDifficulty,
  minStart: number,
  maxStart: number,
  minFactor: number,
  maxFactor: number,
  random?: RandomNumberGenerator
): GeneratedSequence {
  return toGeneratedSequence(
    patternId,
    difficulty,
    geometricValues(pickNonZero(minStart, maxStart, random), pickNonZero(minFactor, maxFactor, random), sequenceLength)
  );
}

function buildIncreasingArithmetic(
  patternId: string,
  difficulty: SequenceDifficulty,
  minStart: number,
  maxStart: number,
  minFirstStep: number,
  maxFirstStep: number,
  minStepChange: number,
  maxStepChange: number,
  random?: RandomNumberGenerator
): GeneratedSequence {
  const start = pickNonZero(minStart, maxStart, random);
  const firstStep = pickNonZero(minFirstStep, maxFirstStep, random);
  const stepChange = pickNonZero(minStepChange, maxStepChange, random);
  return buildFromSteps(patternId, difficulty, start, (index) => firstStep + index * stepChange);
}

function buildPrimes(
  patternId: string,
  difficulty: SequenceDifficulty,
  minStartIndex: number,
  maxStartIndex: number,
  random?: RandomNumberGenerator
): GeneratedSequence {
  const startIndex = randomIntInclusive(minStartIndex, maxStartIndex, random);
  return toGeneratedSequence(patternId, difficulty, primes.slice(startIndex, startIndex + sequenceLength));
}

function buildMixedGeometricArithmetic(
  patternId: string,
  difficulty: SequenceDifficulty,
  minStart: number,
  maxStart: number,
  minFactor: number,
  maxFactor: number,
  minAdd: number,
  maxAdd: number,
  random?: RandomNumberGenerator
): GeneratedSequence {
  const values = [pickNonZero(minStart, maxStart, random)];
  const factor = pickNonZero(minFactor, maxFactor, random);
  const add = pickNonZero(minAdd, maxAdd, random);
  while (values.length < sequenceLength) {
    values.push((values.at(-1) ?? 0) * factor + add);
  }
  return toGeneratedSequence(patternId, difficulty, values);
}

function buildIncreasingGeometric(
  patternId: string,
  difficulty: SequenceDifficulty,
  minStart: number,
  maxStart: number,
  firstFactor: number,
  factorStep: number,
  random?: RandomNumberGenerator
): GeneratedSequence {
  const values = [pickNonZero(minStart, maxStart, random)];
  while (values.length < sequenceLength) {
    const factor = firstFactor + (values.length - 1) * factorStep;
    values.push((values.at(-1) ?? 0) * factor);
  }
  return toGeneratedSequence(patternId, difficulty, values);
}

function buildSequence(
  patternId: string,
  difficulty: SequenceDifficulty,
  getValue: (index: number) => number
): GeneratedSequence {
  return toGeneratedSequence(
    patternId,
    difficulty,
    Array.from({ length: sequenceLength }, (_, index) => getValue(index))
  );
}

function buildFromSteps(
  patternId: string,
  difficulty: SequenceDifficulty,
  start: number,
  getStep: (stepIndex: number) => number
): GeneratedSequence {
  const values = [start];
  while (values.length < sequenceLength) {
    const previous = values[values.length - 1] ?? start;
    values.push(previous + getStep(values.length - 1));
  }
  return toGeneratedSequence(patternId, difficulty, values);
}

function arithmeticValues(start: number, step: number, length: number): number[] {
  return Array.from({ length }, (_, index) => start + step * index);
}

function geometricValues(start: number, factor: number, length: number): number[] {
  return Array.from({ length }, (_, index) => start * factor ** index);
}

function fibonacciValues(first: number, second: number): number[] {
  const values = [first, second];
  while (values.length < sequenceLength) {
    values.push((values.at(-1) ?? 0) + (values.at(-2) ?? 0));
  }
  return values;
}

function multiplicativeFibonacciValues(first: number, second: number): number[] {
  const values = [first, second];
  while (values.length < sequenceLength) {
    values.push((values.at(-1) ?? 1) * (values.at(-2) ?? 1));
  }
  return values;
}

function tribonacciValues(first: number, second: number, third: number): number[] {
  const values = [first, second, third];
  while (values.length < sequenceLength) {
    values.push((values.at(-1) ?? 0) + (values.at(-2) ?? 0) + (values.at(-3) ?? 0));
  }
  return values;
}

function pascalRow(row: number): number[] {
  const values = [1];
  for (let index = 1; index <= row; index += 1) {
    values.push((valueAt(values, index - 1) * (row - index + 1)) / index);
  }
  return values;
}

function pascalSegment(random?: RandomNumberGenerator, selectedRow?: number): number[] {
  const row = selectedRow ?? randomIntInclusive(5, 9, random);
  const rowValues = pascalRow(row);
  const maxStartIndex = rowValues.length - sequenceLength;
  const startIndex = randomIntInclusive(0, maxStartIndex, random);
  return rowValues.slice(startIndex, startIndex + sequenceLength);
}

function withAlternatingSigns(values: number[]): number[] {
  return values.map((value, index) => (index % 2 === 0 ? value : -value));
}

function pickNonZero(
  min: number,
  max: number,
  random?: RandomNumberGenerator
): number {
  const value = randomIntInclusive(min, max, random);
  if (value !== 0) {
    return value;
  }
  return max > 0 ? 1 : -1;
}

function valueAt(values: number[], index: number): number {
  return values[index] ?? 0;
}

function toGeneratedSequence(
  patternId: string,
  difficulty: SequenceDifficulty,
  values: number[]
): GeneratedSequence {
  const sequence = values.map(Math.trunc);
  return {
    patternId,
    difficulty,
    values: [
      sequence[0] ?? 0,
      sequence[1] ?? 0,
      sequence[2] ?? 0,
      sequence[3] ?? 0,
      sequence[4] ?? 0,
      sequence[5] ?? 0
    ]
  };
}
