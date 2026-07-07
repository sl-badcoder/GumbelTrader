import { describe, expect, it } from "vitest";
import { generateSequencePrompt, getSequencePatternIds } from "./generateSequencePrompt";
import { sequenceModule } from "./sequenceModule";
import { sequencePatterns } from "./sequencePatterns";
import { validateSequenceAnswer } from "./validateSequenceAnswer";

describe("sequenceModule", () => {
  it("generates five visible values and a sixth answer", () => {
    const session = sequenceModule.createSession({
      durationSeconds: 60,
      difficulty: "easy"
    });
    const randomValues = [0, 0, 0];
    const prompt = generateSequencePrompt(session, () => randomValues.shift() ?? 0);

    expect(prompt.values).toHaveLength(5);
    expect(prompt.answer).toBe(-130);
    expect(prompt.text).toBe("-30, -50, -70, -90, -110, ?");
  });

  it("uses patterns from the selected difficulty", () => {
    const session = sequenceModule.createSession({
      durationSeconds: 60,
      difficulty: "hard"
    });
    const prompt = generateSequencePrompt(session, () => 0);

    expect(getSequencePatternIds("hard")).toContain(prompt.patternId);
    expect(prompt.difficulty).toBe("hard");
  });

  it("validates numeric sequence answers", () => {
    const session = sequenceModule.createSession(sequenceModule.defaultSettings);
    const prompt = sequenceModule.generatePrompt(session);

    expect(validateSequenceAnswer(prompt, String(prompt.answer)).isCorrect).toBe(true);
    expect(validateSequenceAnswer(prompt, String(prompt.answer + 1))).toMatchObject({
      isCorrect: false,
      expectedAnswer: String(prompt.answer)
    });
    expect(validateSequenceAnswer(prompt, "")).toMatchObject({
      isCorrect: false,
      message: "Enter a number."
    });
  });

  it("adds hints to sparse interwoven or distractor sequence patterns", () => {
    const hintedPatternIds = [
      "arithmetic-with-distractors",
      "interwoven-arithmetic-geometric",
      "paired-interwoven-sequences"
    ];

    for (const patternId of hintedPatternIds) {
      const pattern = sequencePatterns.find((candidate) => candidate.id === patternId);
      const generated = pattern?.generate(() => 0);

      expect(generated?.hint).toBeTruthy();
      expect(generated?.hint?.length).toBeGreaterThan(10);
    }
  });
});
