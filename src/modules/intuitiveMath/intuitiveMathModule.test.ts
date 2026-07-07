import { describe, expect, it } from "vitest";
import { decimalShiftDistractors } from "./distractorFactory";
import { generateDecimalPlacePrompt } from "./generators/decimalPlaceGenerator";
import { generateFermiPrompt } from "./generators/fermiGenerator";
import { generateFractionTrapPrompt } from "./generators/fractionTrapGenerator";
import { buildMissingOperandCase, generateMissingOperandPrompt } from "./generators/missingOperandGenerator";
import {
  solvePercentChain,
  solveReversePercentage
} from "./generators/percentIntuitionGenerator";
import { generateStrategyRecognitionPrompt } from "./generators/strategyRecognitionGenerator";
import type { IntuitiveMathPrompt, IntuitiveMathSession } from "./intuitiveMathTypes";
import { intuitiveMathModules } from "./modules";

function makeSession(promptIndex = 0, acceptsTypedAnswer = false): IntuitiveMathSession {
  return {
    settings: {
      durationSeconds: null,
      questionLimit: null,
      immediateFeedback: true,
      acceptsTypedAnswer
    },
    score: 0,
    attempts: 0,
    correct: 0,
    startedAt: 0,
    promptIndex
  };
}

function expectValidChoices(prompt: IntuitiveMathPrompt) {
  expect(prompt.text.length).toBeGreaterThan(0);
  expect(prompt.choices).toContain(String(prompt.answer));
  expect(new Set(prompt.choices).size).toBe(prompt.choices?.length);
}

describe("intuitive math generators", () => {
  it("all choice modules generate non-empty prompts with the correct answer and no duplicate choices", () => {
    for (const module of Object.values(intuitiveMathModules)) {
      const session = module.createSession(module.defaultSettings);
      const prompt = module.generatePrompt(session);

      expect(prompt.text.length).toBeGreaterThan(0);
      if (module.id === "typed-hardcore") {
        expect(prompt.choices).toBeUndefined();
      } else {
        expectValidChoices(prompt);
      }
    }
  });

  it("decimal-place distractors differ by powers of 10", () => {
    const prompt = generateDecimalPlacePrompt(makeSession(0));
    const numericAnswer = Number(prompt.answer);

    expectValidChoices(prompt);
    const distractors = decimalShiftDistractors(numericAnswer).map(Number);
    expect(distractors).toEqual(expect.arrayContaining([expect.closeTo(numericAnswer * 10), expect.closeTo(numericAnswer / 10)]));
  });

  it("missing operand equations solve correctly for all six forms", () => {
    expect(buildMissingOperandCase(0).answer + 17).toBe(42);
    expect(buildMissingOperandCase(1).answer - 8).toBe(19);
    expect(53 - buildMissingOperandCase(2).answer).toBe(21);
    expect(buildMissingOperandCase(3).answer * 7).toBe(63);
    expect(buildMissingOperandCase(4).answer / 0.4).toBeCloseTo(12);
    expect((3 / 4) / buildMissingOperandCase(5).answer).toBe(3 / 8);

    for (let index = 0; index < 6; index += 1) {
      expectValidChoices(generateMissingOperandPrompt(makeSession(index)));
    }
  });

  it("fraction division uses the reciprocal and includes the forgot-reciprocal trap", () => {
    const prompts = Array.from({ length: 40 }, (_, index) =>
      generateFractionTrapPrompt(makeSession(index))
    );
    const divisionPrompt = prompts.find((prompt) => prompt.text.includes(" / "));

    expect(divisionPrompt).toBeDefined();
    expect(divisionPrompt?.explanation).toContain("reciprocal");
    expect(divisionPrompt?.trapTags).toContain("forgotReciprocal");
  });

  it("percentage chains are multiplicative and reverse percentage solves original times factor", () => {
    expect(solvePercentChain(100, [20, -20])).toBe("96%");
    expect(solveReversePercentage(24, 12.5)).toBe(192);
  });

  it("Fermi questions use order-of-magnitude choices", () => {
    const prompt = generateFermiPrompt(makeSession(0));

    expectValidChoices(prompt);
    expect(prompt.choices?.every((choice) => choice.startsWith("10^"))).toBe(true);
  });

  it("strategy recognition questions are conceptual multiple choice", () => {
    const prompt = generateStrategyRecognitionPrompt(makeSession(0));

    expectValidChoices(prompt);
    expect(prompt.skillTags).toContain("strategyRecognition");
  });

  it("80-in-8 MC has 80 questions, 480 seconds, choices, and final-only feedback", () => {
    const module = intuitiveMathModules.eightyInEightMc;
    expect(module.title).toBe("80-in-8 Multiple Choice");
    expect(module.iconLabel).toBe("8:00");
    expect(module.defaultSettings.questionLimit).toBe(80);
    expect(module.defaultSettings.durationSeconds).toBe(480);
    expect(module.defaultSettings.immediateFeedback).toBe(false);
    expect(module.defaultSettings.startCountdownSeconds).toBe(5);

    const session = module.createSession(module.defaultSettings);
    const questionTexts = new Set<string>();
    for (let index = 0; index < 80; index += 1) {
      const prompt = module.generatePrompt({ ...session, promptIndex: index });
      expectValidChoices(prompt);
      questionTexts.add(prompt.text);
    }
    expect(questionTexts.size).toBeGreaterThanOrEqual(60);
  });

  it("typed hardcore mode has no choices", () => {
    const module = intuitiveMathModules.typedHardcore;
    const prompt = module.generatePrompt(module.createSession(module.defaultSettings));

    expect(module.defaultSettings.acceptsTypedAnswer).toBe(true);
    expect(prompt.choices).toBeUndefined();
  });
});
