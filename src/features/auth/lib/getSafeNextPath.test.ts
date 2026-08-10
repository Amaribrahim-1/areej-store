import { describe, expect, it } from "vitest";

import { getSafeNextPath } from "./getSafeNextPath";

describe("getSafeNextPath", () => {
  it("returns a same-origin relative path", () => {
    expect(getSafeNextPath("/checkout")).toBe("/checkout");
    expect(getSafeNextPath("/orders?tab=open")).toBe("/orders?tab=open");
  });

  it("uses the first value when next is an array", () => {
    expect(getSafeNextPath(["/orders", "/evil"])).toBe("/orders");
  });

  it("falls back for missing values", () => {
    expect(getSafeNextPath(undefined)).toBe("/");
    expect(getSafeNextPath(null)).toBe("/");
    expect(getSafeNextPath("")).toBe("/");
    expect(getSafeNextPath(undefined, "/cart")).toBe("/cart");
  });

  it("rejects absolute and protocol-relative URLs", () => {
    expect(getSafeNextPath("https://evil.com")).toBe("/");
    expect(getSafeNextPath("//evil.com")).toBe("/");
    expect(getSafeNextPath("/\\evil.com")).toBe("/");
    expect(getSafeNextPath("/\\\\evil.com")).toBe("/");
  });

  it("rejects paths that embed a scheme", () => {
    expect(getSafeNextPath("/redirect://evil.com")).toBe("/");
  });
});
