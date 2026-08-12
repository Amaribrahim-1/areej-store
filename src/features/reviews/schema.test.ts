import { describe, expect, it } from "vitest";

import { reviewSchema } from "./schema";

describe("reviewSchema", () => {
  it("accepts a valid rating without a comment", () => {
    const result = reviewSchema.safeParse({ rating: 4 });
    expect(result.success).toBe(true);
  });

  it("accepts a valid rating with a comment", () => {
    const result = reviewSchema.safeParse({
      rating: 5,
      comment: "رائحة جميلة جداً وتدوم طويلاً",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty comment (treated as absent)", () => {
    const result = reviewSchema.safeParse({ rating: 3, comment: "" });
    expect(result.success).toBe(true);
  });

  it("rejects when rating is missing", () => {
    const result = reviewSchema.safeParse({ comment: "تعليق بدون تقييم" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "rating")).toBe(
        true,
      );
    }
  });

  it("rejects rating = 0 (below minimum)", () => {
    const result = reviewSchema.safeParse({ rating: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "rating")).toBe(
        true,
      );
    }
  });

  it("rejects rating = 6 (above maximum)", () => {
    const result = reviewSchema.safeParse({ rating: 6 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "rating")).toBe(
        true,
      );
    }
  });

  it("rejects a non-integer rating", () => {
    const result = reviewSchema.safeParse({ rating: 3.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "rating")).toBe(
        true,
      );
    }
  });

  it("rejects a comment longer than 1000 characters", () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      comment: "ر".repeat(1001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "comment")).toBe(
        true,
      );
    }
  });

  it("accepts a comment of exactly 1000 characters", () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      comment: "ر".repeat(1000),
    });
    expect(result.success).toBe(true);
  });

  it("trims whitespace from comment before length check", () => {
    // Zod .trim() runs before .max() — a comment of spaces only → "" → valid
    const result = reviewSchema.safeParse({ rating: 2, comment: "   " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment).toBe("");
    }
  });
});
