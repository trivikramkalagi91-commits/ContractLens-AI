import { describe, it, expect } from "vitest";
import {
  calculateReadability,
  calculateImprovement,
  countSyllablesInWord,
} from "@/lib/readability";

describe("Flesch-Kincaid Readability Calculator", () => {
  it("should accurately count syllables in simple words", () => {
    expect(countSyllablesInWord("cat")).toBe(1);
    expect(countSyllablesInWord("contract")).toBe(2);
    expect(countSyllablesInWord("agreement")).toBe(3);
    expect(countSyllablesInWord("termination")).toBe(4);
  });

  it("should calculate higher reading ease for simple 8th-grade text", () => {
    const simpleText = "You can quit this agreement anytime by giving 30 days notice in writing. We will pay your invoices within 30 days.";
    const metrics = calculateReadability(simpleText);
    expect(metrics.readingEase).toBeGreaterThan(60);
    expect(metrics.gradeLevel).toBeLessThanOrEqual(10);
  });

  it("should calculate lower reading ease for dense legal agreement text", () => {
    const legalText = "Notwithstanding anything to the contrary contained herein, the Party of the First Part hereby indemnifies, defends, and holds harmless the Party of the Second Part against any and all claims, liabilities, damages, costs, and expenses whatsoever.";
    const metrics = calculateReadability(legalText);
    expect(metrics.readingEase).toBeLessThan(45);
    expect(metrics.gradeLevel).toBeGreaterThanOrEqual(12);
  });

  it("should return zero for empty text", () => {
    const metrics = calculateReadability("");
    expect(metrics.readingEase).toBe(0);
    expect(metrics.gradeLevel).toBe(0);
    expect(metrics.wordCount).toBe(0);
  });

  it("should calculate percentage improvement between legal and plain English", () => {
    const legalText = "In the event that the Contractor fails to perform the Services to the sole satisfaction of the Client, Client may withhold payment indefinitely without penalty or interest.";
    const plainText = "If you do not complete the work properly, the client can hold back payment.";

    const result = calculateImprovement(legalText, plainText);
    expect(result.improvementPercent).toBeGreaterThan(0);
    expect(result.plainScore).toBeGreaterThan(result.originalScore);
  });

  it("should accurately count words and sentence metrics", () => {
    const text = "First sentence here. Second sentence follows!";
    const metrics = calculateReadability(text);
    expect(metrics.sentenceCount).toBe(2);
    expect(metrics.wordCount).toBe(6);
  });

  it("should cap reading ease score between 0 and 100", () => {
    const text = "See Spot run. Run Spot run.";
    const metrics = calculateReadability(text);
    expect(metrics.readingEase).toBeGreaterThanOrEqual(0);
    expect(metrics.readingEase).toBeLessThanOrEqual(100);
  });

  it("should handle single word inputs without error", () => {
    const metrics = calculateReadability("Termination");
    expect(metrics.wordCount).toBe(1);
    expect(metrics.sentenceCount).toBe(1);
  });

  it("should handle punctuation edge cases cleanly", () => {
    const text = "Wait... What? Yes! Ok.";
    const metrics = calculateReadability(text);
    expect(metrics.wordCount).toBe(4);
  });

  it("should report grade level greater than or equal to 1", () => {
    const metrics = calculateReadability("Cat sat on mat.");
    expect(metrics.gradeLevel).toBeGreaterThanOrEqual(1);
  });
});
