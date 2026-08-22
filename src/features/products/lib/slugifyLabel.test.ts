import { describe, expect, it } from "vitest";

import { slugifyLabel } from "./slugifyLabel";

describe("slugifyLabel", () => {
  it("turns Arabic spaces into hyphens", () => {
    expect(slugifyLabel("عود كمبودي", 120)).toBe("عود-كمبودي");
  });

  it("strips punctuation and collapses hyphens", () => {
    expect(slugifyLabel("عود  كمبودي!!!", 120)).toBe("عود-كمبودي");
  });

  it("lowercases latin and hyphenates", () => {
    expect(slugifyLabel("White Musk", 120)).toBe("white-musk");
  });

  it("returns empty when nothing slug-safe remains", () => {
    expect(slugifyLabel("!!!", 120)).toBe("");
  });

  it("respects max length without leaving a trailing hyphen", () => {
    expect(slugifyLabel("عود كمبودي فاخر", 7)).toBe("عود-كمب");
  });
});
