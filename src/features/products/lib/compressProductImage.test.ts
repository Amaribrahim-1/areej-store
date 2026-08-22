import { describe, expect, it } from "vitest";

import { PRODUCT_IMAGE_MAX_INPUT_BYTES } from "../constants";

import {
  assertProductImageFile,
  fitImageWithinMaxDimension,
  isPreparedProductImage,
  toWebpFileName,
} from "./compressProductImage";

describe("assertProductImageFile", () => {
  it("accepts a jpeg under the input cap", () => {
    expect(() =>
      assertProductImageFile(
        new File(["photo"], "oud.jpg", { type: "image/jpeg" }),
      ),
    ).not.toThrow();
  });

  it("rejects an empty file", () => {
    expect(() =>
      assertProductImageFile(new File([], "oud.jpg", { type: "image/jpeg" })),
    ).toThrow("IMAGE_EMPTY");
  });

  it("rejects a non-image MIME", () => {
    expect(() =>
      assertProductImageFile(
        new File(["x"], "notes.pdf", { type: "application/pdf" }),
      ),
    ).toThrow("IMAGE_INVALID_TYPE");
  });

  it("rejects a file over the 10MB input cap", () => {
    const file = new File(["x"], "huge.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", {
      value: PRODUCT_IMAGE_MAX_INPUT_BYTES + 1,
    });
    expect(() => assertProductImageFile(file)).toThrow("IMAGE_TOO_LARGE");
  });
});

describe("fitImageWithinMaxDimension", () => {
  it("leaves smaller images unchanged", () => {
    expect(fitImageWithinMaxDimension(800, 600, 1200)).toEqual({
      width: 800,
      height: 600,
    });
  });

  it("scales a landscape image by the long edge", () => {
    expect(fitImageWithinMaxDimension(4000, 3000, 1200)).toEqual({
      width: 1200,
      height: 900,
    });
  });

  it("scales a portrait image by the long edge", () => {
    expect(fitImageWithinMaxDimension(3000, 4000, 1200)).toEqual({
      width: 900,
      height: 1200,
    });
  });
});

describe("toWebpFileName", () => {
  it("replaces the last extension", () => {
    expect(toWebpFileName("photo.JPG")).toBe("photo.webp");
    expect(toWebpFileName("a.b.c.png")).toBe("a.b.c.webp");
  });

  it("falls back when the name is empty", () => {
    expect(toWebpFileName("   ")).toBe("product.webp");
  });
});

describe("isPreparedProductImage", () => {
  it("is true for a non-empty webp under the output cap", () => {
    expect(
      isPreparedProductImage(
        new File(["x"], "oud.webp", { type: "image/webp" }),
      ),
    ).toBe(true);
  });

  it("is false for jpeg even when small", () => {
    expect(
      isPreparedProductImage(
        new File(["x"], "oud.jpg", { type: "image/jpeg" }),
      ),
    ).toBe(false);
  });
});
