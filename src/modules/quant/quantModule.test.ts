import { describe, expect, it } from "vitest";
import { combinatoricsModule, probabilityModule } from "./quantModules";
import { getQuantQuestion } from "./quantQuestionBank";
import { normalizeQuantSettings } from "./quantSettings";
import { validateQuantAnswer } from "./validateQuantAnswer";

describe("quant modules", () => {
  it("uses the requested category for probability mode", () => {
    const session = probabilityModule.createSession(probabilityModule.defaultSettings);
    const prompt = probabilityModule.generatePrompt(session);

    expect(prompt.category).toBe("probability");
    expect(prompt.tags).toContain("probability");
  });

  it("uses the requested category for combinatorics mode", () => {
    const session = combinatoricsModule.createSession(combinatoricsModule.defaultSettings);
    const prompt = combinatoricsModule.generatePrompt(session);

    expect(prompt.category).toBe("combinatorics");
    expect(prompt.tags).toContain("combinatorics");
  });

  it("validates rounded decimal probability answers", () => {
    const question = getQuantQuestion("probability", "easy", () => 0);
    const prompt = {
      ...question,
      answer: 0.1111,
      expectedAnswer: "0.1111"
    };

    expect(validateQuantAnswer(prompt, "0.1111").isCorrect).toBe(true);
    expect(validateQuantAnswer(prompt, "0.1112").isCorrect).toBe(true);
    expect(validateQuantAnswer(prompt, "0.12")).toMatchObject({
      isCorrect: false,
      expectedAnswer: "0.1111"
    });
  });

  it("generates a broad question set for repeated probability and combinatorics trials", () => {
    const probabilityTexts = new Set<string>();
    const combinatoricsTexts = new Set<string>();
    const probabilityRandom = createSeededRandom(123);
    const combinatoricsRandom = createSeededRandom(456);

    for (let index = 0; index < 80; index += 1) {
      probabilityTexts.add(getQuantQuestion("probability", "mixed", probabilityRandom).text);
      combinatoricsTexts.add(getQuantQuestion("combinatorics", "mixed", combinatoricsRandom).text);
    }

    expect(probabilityTexts.size).toBeGreaterThanOrEqual(35);
    expect(combinatoricsTexts.size).toBeGreaterThanOrEqual(35);
  });

  it("normalizes settings without losing default category", () => {
    const settings = normalizeQuantSettings(
      { questionCount: 0, durationSeconds: 5, difficulty: "mixed" },
      probabilityModule.defaultSettings
    );

    expect(settings.questionCount).toBe(1);
    expect(settings.durationSeconds).toBe(30);
    expect(settings.category).toBe("probability");
  });
});

function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}
