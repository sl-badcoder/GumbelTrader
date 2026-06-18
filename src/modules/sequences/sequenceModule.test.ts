import { describe, expect, it } from "vitest";
import { generateSequencePrompt, getSequencePatternIds } from "./generateSequencePrompt";
import { sequenceModule } from "./sequenceModule";
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
    expect(prompt.answer).toBe(11);
    expect(prompt.text).toBe("1, 3, 5, 7, 9, ?");
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
});
