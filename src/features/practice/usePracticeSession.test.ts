import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { arithmeticModule } from "../../modules/arithmetic/arithmeticModule";
import type {
  ArithmeticPrompt,
  ArithmeticSettings
} from "../../modules/arithmetic/arithmeticTypes";
import { usePracticeSession } from "./usePracticeSession";

describe("usePracticeSession", () => {
  it("auto-submits only when the typed answer exactly matches the expected answer", () => {
    const settings: ArithmeticSettings = {
      durationSeconds: 30,
      enabledOperators: ["addition"],
      minNumber: 10,
      maxNumber: 10
    };
    const { result, unmount } = renderHook(() =>
      usePracticeSession({
        module: arithmeticModule,
        settings,
        durationSeconds: 30
      })
    );

    const firstPrompt = result.current.prompt as ArithmeticPrompt;
    expect(firstPrompt.answer).toBe(20);

    act(() => {
      result.current.setAnswer("2");
    });

    expect(result.current.session.attempts).toBe(0);
    expect(result.current.answer).toBe("2");

    act(() => {
      result.current.setAnswer("20");
    });

    expect(result.current.session.attempts).toBe(1);
    expect(result.current.session.score).toBe(1);
    expect(result.current.answer).toBe("");

    unmount();
  });
});
