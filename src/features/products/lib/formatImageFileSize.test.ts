import { describe, expect, it } from "vitest";

import { formatImageFileSize } from "./formatImageFileSize";

describe("formatImageFileSize", () => {
  it("formats bytes, kilobytes, and megabytes", () => {
    expect(formatImageFileSize(200)).toBe("200 بايت");
    expect(formatImageFileSize(183401)).toBe("179 ك.ب");
    expect(formatImageFileSize(1_572_864)).toBe("1.5 م.ب");
  });
});
