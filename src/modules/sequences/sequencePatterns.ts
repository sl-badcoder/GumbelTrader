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

export const sequencePatterns: SequencePattern[] = [
  {
    id: "constant-addition",
    difficulty: "easy",
    generate: (random) => {
      const start = randomIntInclusive(1, 25, random);
      const step = randomIntInclusive(2, 12, random);
      return buildSequence("constant-addition", "easy", (index) => start + step * index);
    }
  },
  {
    id: "constant-subtraction",
    difficulty: "easy",
    generate: (random) => {
      const step = randomIntInclusive(2, 9, random);
      const answer = randomIntInclusive(0, 20, random);
      const start = answer + step * (sequenceLength - 1);
      return buildSequence("constant-subtraction", "easy", (index) => start - step * index);
    }
  },
  {
    id: "constant-multiplication",
    difficulty: "easy",
    generate: (random) => {
      const start = randomIntInclusive(1, 6, random);
      const factor = randomIntInclusive(2, 4, random);
      return buildSequence("constant-multiplication", "easy", (index) =>
        start * factor ** index
      );
    }
  },
  {
    id: "constant-division",
    difficulty: "easy",
    generate: (random) => {
      const divisor = randomIntInclusive(2, 4, random);
      const answer = randomIntInclusive(1, 8, random);
      const start = answer * divisor ** (sequenceLength - 1);
      return buildSequence("constant-division", "easy", (index) =>
        start / divisor ** index
      );
    }
  },
  {
    id: "squares",
    difficulty: "easy",
    generate: (random) => {
      const start = randomIntInclusive(1, 4, random);
      return buildSequence("squares", "easy", (index) => (start + index) ** 2);
    }
  },
  {
    id: "increasing-addition",
    difficulty: "medium",
    generate: (random) => {
      const start = randomIntInclusive(1, 20, random);
      const firstStep = randomIntInclusive(1, 5, random);
      return buildFromSteps("increasing-addition", "medium", start, (index) =>
        firstStep + index
      );
    }
  },
  {
    id: "decreasing-addition",
    difficulty: "medium",
    generate: (random) => {
      const start = randomIntInclusive(1, 25, random);
      const firstStep = randomIntInclusive(7, 12, random);
      return buildFromSteps("decreasing-addition", "medium", start, (index) =>
        firstStep - index
      );
    }
  },
  {
    id: "alternating-add-multiply",
    difficulty: "medium",
    generate: (random) => {
      const start = randomIntInclusive(1, 10, random);
      const add = randomIntInclusive(2, 8, random);
      const factor = randomIntInclusive(2, 3, random);
      return buildAlternating("alternating-add-multiply", "medium", start, [
        (value) => value + add,
        (value) => value * factor
      ]);
    }
  },
  {
    id: "alternating-multiply-add",
    difficulty: "medium",
    generate: (random) => {
      const start = randomIntInclusive(1, 8, random);
      const factor = randomIntInclusive(2, 3, random);
      const add = randomIntInclusive(2, 8, random);
      return buildAlternating("alternating-multiply-add", "medium", start, [
        (value) => value * factor,
        (value) => value + add
      ]);
    }
  },
  {
    id: "fibonacci-like",
    difficulty: "medium",
    generate: (random) => {
      const first = randomIntInclusive(1, 8, random);
      const second = randomIntInclusive(1, 8, random);
      const values: number[] = [first, second];
      while (values.length < sequenceLength) {
        values.push((values.at(-1) ?? 0) + (values.at(-2) ?? 0));
      }
      return toGeneratedSequence("fibonacci-like", "medium", values);
    }
  },
  {
    id: "odd-increments",
    difficulty: "medium",
    generate: (random) => {
      const start = randomIntInclusive(1, 20, random);
      const firstOddStep = randomIntInclusive(1, 5, random) * 2 - 1;
      return buildFromSteps("odd-increments", "medium", start, (index) =>
        firstOddStep + index * 2
      );
    }
  },
  {
    id: "quadratic",
    difficulty: "hard",
    generate: (random) => {
      const a = randomIntInclusive(1, 4, random);
      const b = randomIntInclusive(-3, 5, random);
      const c = randomIntInclusive(0, 10, random);
      const startN = randomIntInclusive(1, 3, random);
      return buildSequence("quadratic", "hard", (index) => {
        const n = startN + index;
        return a * n ** 2 + b * n + c;
      });
    }
  },
  {
    id: "alternating-subsequences",
    difficulty: "hard",
    generate: (random) => {
      const oddStart = randomIntInclusive(1, 6, random);
      const oddFactor = randomIntInclusive(2, 3, random);
      const evenStart = randomIntInclusive(8, 20, random);
      const evenStep = randomIntInclusive(3, 8, random);
      return buildSequence("alternating-subsequences", "hard", (index) => {
        const subsequenceIndex = Math.floor(index / 2);
        return index % 2 === 0
          ? oddStart * oddFactor ** subsequenceIndex
          : evenStart + evenStep * subsequenceIndex;
      });
    }
  },
  {
    id: "prime-increments",
    difficulty: "hard",
    generate: (random) => {
      const start = randomIntInclusive(1, 20, random);
      const primes = [2, 3, 5, 7, 11];
      return buildFromSteps("prime-increments", "hard", start, (index) => primes[index] ?? 2);
    }
  }
];

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

function buildAlternating(
  patternId: string,
  difficulty: SequenceDifficulty,
  start: number,
  operations: [(value: number) => number, (value: number) => number]
): GeneratedSequence {
  const values = [start];
  while (values.length < sequenceLength) {
    const previous = values[values.length - 1] ?? start;
    const operation = operations[(values.length - 1) % operations.length] ?? operations[0];
    values.push(operation(previous));
  }
  return toGeneratedSequence(patternId, difficulty, values);
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
