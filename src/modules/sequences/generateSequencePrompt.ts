import { randomIntInclusive, type RandomNumberGenerator } from "../../shared/utils/random";
import { sequencePatterns } from "./sequencePatterns";
import type {
  GeneratedSequence,
  SequenceDifficulty,
  SequencePrompt,
  SequenceSession
} from "./sequenceTypes";

export function generateSequencePrompt(
  session: SequenceSession,
  random?: RandomNumberGenerator
): SequencePrompt {
  const patterns = sequencePatterns.filter(
    (pattern) => pattern.difficulty === session.settings.difficulty
  );
  if (patterns.length === 0) {
    throw new Error(`No sequence patterns configured for ${session.settings.difficulty}`);
  }

  const fallbackPattern = patterns[0];
  if (!fallbackPattern) {
    throw new Error(`No sequence patterns configured for ${session.settings.difficulty}`);
  }

  const pattern =
    patterns[randomIntInclusive(0, patterns.length - 1, random)] ?? fallbackPattern;
  const generated = pattern.generate(random);

  return toPrompt(generated);
}

function toPrompt(generated: GeneratedSequence): SequencePrompt {
  const [first, second, third, fourth, fifth, answer] = generated.values;
  const values: [number, number, number, number, number] = [
    first,
    second,
    third,
    fourth,
    fifth
  ];

  return {
    values,
    answer,
    patternId: generated.patternId,
    difficulty: generated.difficulty,
    text: `${values.join(", ")}, ?`
  };
}

export function getSequencePatternIds(difficulty: SequenceDifficulty): string[] {
  return sequencePatterns
    .filter((pattern) => pattern.difficulty === difficulty)
    .map((pattern) => pattern.id);
}
