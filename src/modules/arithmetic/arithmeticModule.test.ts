import { describe, expect, it } from "vitest";
import { arithmeticModule } from "./arithmeticModule";
import type { ArithmeticSettings } from "./arithmeticTypes";
import { generateArithmeticPrompt } from "./generateArithmeticPrompt";
import { validateArithmeticAnswer } from "./validateArithmeticAnswer";

describe("arithmeticModule", () => {
  it("generates prompts from session settings", () => {
    const settings: ArithmeticSettings = {
      durationSeconds: 30,
      enabledOperators: ["addition"],
      minNumber: 2,
      maxNumber: 5
    };
    const session = arithmeticModule.createSession(settings);
    const randomValues = [0, 0.25, 0.75];
    const prompt = generateArithmeticPrompt(session, () => randomValues.shift() ?? 0);

    expect(prompt).toEqual({
      left: 3,
      right: 5,
      operator: "addition",
      text: "3 + 5",
      answer: 8
    });
  });

  it("generates whole-number division prompts", () => {
    const session = arithmeticModule.createSession({
      durationSeconds: 30,
      enabledOperators: ["division"],
      minNumber: 2,
      maxNumber: 4
    });
    const randomValues = [0, 0.5, 0];
    const prompt = generateArithmeticPrompt(session, () => randomValues.shift() ?? 0);

    expect(prompt.operator).toBe("division");
    expect(prompt.left % prompt.right).toBe(0);
    expect(prompt.left / prompt.right).toBe(prompt.answer);
  });

  it("does not generate negative subtraction answers", () => {
    const session = arithmeticModule.createSession({
      durationSeconds: 30,
      enabledOperators: ["subtraction"],
      minNumber: 1,
      maxNumber: 10
    });
    const randomValues = [0, 0, 0.9];
    const prompt = generateArithmeticPrompt(session, () => randomValues.shift() ?? 0);

    expect(prompt.operator).toBe("subtraction");
    expect(prompt.left).toBeGreaterThanOrEqual(prompt.right);
    expect(prompt.answer).toBeGreaterThanOrEqual(0);
    expect(prompt.text).toBe("10 - 1");
  });

  it("validates numeric answers", () => {
    const prompt = {
      left: 4,
      right: 7,
      operator: "multiplication" as const,
      text: "4 x 7",
      answer: 28
    };

    expect(validateArithmeticAnswer(prompt, "28").isCorrect).toBe(true);
    expect(validateArithmeticAnswer(prompt, "27")).toMatchObject({
      isCorrect: false,
      expectedAnswer: "28"
    });
    expect(validateArithmeticAnswer(prompt, "")).toMatchObject({
      isCorrect: false,
      message: "Enter a number."
    });
  });

  it("applies scoring through the module", () => {
    const session = arithmeticModule.createSession(arithmeticModule.defaultSettings);
    const prompt = arithmeticModule.generatePrompt(session);
    const nextSession = arithmeticModule.applyResult(session, prompt, {
      isCorrect: true,
      expectedAnswer: String(prompt.answer)
    });

    expect(nextSession.score).toBe(1);
    expect(nextSession.attempts).toBe(1);
    expect(nextSession.correct).toBe(1);
  });
});
