import { describe, expect, it } from "vitest";

import { buildAuthCallbackUrl } from "./buildAuthCallbackUrl";

describe("buildAuthCallbackUrl", () => {
  it("points at /auth/callback with a safe next path", () => {
    expect(buildAuthCallbackUrl("http://localhost:3000", "/checkout")).toBe(
      "http://localhost:3000/auth/callback?next=%2Fcheckout",
    );
  });

  it("falls back to / when next is missing or unsafe", () => {
    expect(buildAuthCallbackUrl("http://localhost:3000")).toBe(
      "http://localhost:3000/auth/callback?next=%2F",
    );
    expect(
      buildAuthCallbackUrl("http://localhost:3000", "https://evil.com"),
    ).toBe("http://localhost:3000/auth/callback?next=%2F");
  });
});
