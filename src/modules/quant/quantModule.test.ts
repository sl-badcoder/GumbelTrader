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
