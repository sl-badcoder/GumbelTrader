import { describe, expect, it } from "vitest";
import {
  eightyInEightDurationSeconds,
  eightyInEightModule,
  eightyInEightQuestionCount,
  eightyInEightSettings
} from "./eightyInEightModule";

describe("eightyInEightModule", () => {
  it("uses fixed Optiver-style arithmetic defaults", () => {
    expect(eightyInEightQuestionCount).toBe(80);
    expect(eightyInEightDurationSeconds).toBe(480);
    expect(eightyInEightModule.defaultSettings).toEqual(eightyInEightSettings);
    expect(eightyInEightModule.defaultSettings.durationSeconds).toBe(480);
  });

  it("scores correct answers as +1 and incorrect answers as -1", () => {
    const session = eightyInEightModule.createSession(eightyInEightSettings);
    const prompt = {
      left: 2,
      right: 2,
      operator: "addition" as const,
      text: "2 + 2",
      answer: 4
    };

    const correctSession = eightyInEightModule.applyResult(
      session,
      prompt,
      eightyInEightModule.validateAnswer(prompt, "4")
    );
    const incorrectSession = eightyInEightModule.applyResult(
      correctSession,
      prompt,
      eightyInEightModule.validateAnswer(prompt, "5")
    );

    expect(correctSession.score).toBe(1);
    expect(incorrectSession.score).toBe(0);
    expect(incorrectSession.attempts).toBe(2);
    expect(incorrectSession.correct).toBe(1);
  });
});
