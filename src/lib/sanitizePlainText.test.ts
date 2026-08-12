import { describe, expect, it } from "vitest";

import { sanitizePlainText } from "./sanitizePlainText";

describe("sanitizePlainText", () => {
  it("returns plain Arabic/English text unchanged", () => {
    expect(sanitizePlainText("رائحة جميلة جداً")).toBe("رائحة جميلة جداً");
    expect(sanitizePlainText("  nice scent  ")).toBe("nice scent");
  });

  it("strips script tags and leaves inner text only", () => {
    expect(sanitizePlainText("<script>alert('hacked')</script>")).toBe(
      "alert('hacked')",
    );
  });

  it("strips img onerror and other HTML tags", () => {
    expect(
      sanitizePlainText('<img src=x onerror="alert(1)">hello'),
    ).toBe("hello");
  });

  it("defeats nested broken-tag tricks", () => {
    const out = sanitizePlainText("<scr<script>ipt>alert(1)</script>");
    expect(out).not.toMatch(/<\/?[a-zA-Z]/);
    expect(out).toContain("alert(1)");
  });

  it("preserves comparison text that is not an HTML tag", () => {
    expect(sanitizePlainText("a < b > c")).toBe("a < b > c");
    expect(sanitizePlainText("5ml < 100ml")).toBe("5ml < 100ml");
  });

  it("preserves newlines in multi-line comments", () => {
    expect(sanitizePlainText("سطر ١\nسطر ٢")).toBe("سطر ١\nسطر ٢");
  });

  it("returns empty string when input is only markup", () => {
    expect(sanitizePlainText("<b></b>")).toBe("");
    expect(sanitizePlainText("   <div>  </div>  ")).toBe("");
  });
});
