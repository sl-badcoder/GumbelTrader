import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PracticeSessionView } from "./PracticeSessionView";

const baseProps = {
  score: 0,
  attempts: 0,
  remainingSeconds: null,
  isEnded: false,
  feedback: null,
  onSubmit: vi.fn()
};

describe("PracticeSessionView", () => {
  it("keeps numeric prompts on a number input by default", () => {
    render(
      <PracticeSessionView
        {...baseProps}
        prompt={{ text: "2 + 2 = ?" }}
        answer=""
        onAnswerChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Answer").getAttribute("type")).toBe("number");
  });

  it("uses a text input for fraction, percent, and power typed answers", () => {
    for (const typedAnswer of ["1/9", "96%", "10^5"]) {
      const onAnswerChange = vi.fn();
      const { unmount } = render(
        <PracticeSessionView
          {...baseProps}
          prompt={{ text: "Typed answer prompt" }}
          answer=""
          answerInputMode="text"
          onAnswerChange={onAnswerChange}
        />
      );
      const input = screen.getByLabelText("Answer");

      expect(input.getAttribute("type")).toBe(null);
      expect(input.getAttribute("inputmode")).toBe("text");

      fireEvent.change(input, { target: { value: typedAnswer } });
      expect(onAnswerChange).toHaveBeenCalledWith(typedAnswer);

      unmount();
    }
  });
});
