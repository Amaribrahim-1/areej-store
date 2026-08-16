import { describe, expect, it } from "vitest";

import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
} from "./constants";
import { contactSchema } from "./schema";

const valid = {
  name: "سارة أحمد",
  phone: "01012345678",
  message: "عايزة أسأل عن المقاسات المتاحة للعطر.",
};

describe("contactSchema", () => {
  it("accepts a valid name, Egyptian phone, and message", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("trims name and message before length checks", () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: "  سارة  ",
      message: `  ${valid.message}  `,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("سارة");
      expect(result.data.message).toBe(valid.message);
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = contactSchema.safeParse({ ...valid, name: "س" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "name")).toBe(true);
    }
  });

  it("rejects a name longer than the max", () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: "س".repeat(CONTACT_NAME_MAX_LENGTH + 1),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "name")).toBe(true);
    }
  });

  it("rejects a non-Egyptian phone number", () => {
    const result = contactSchema.safeParse({ ...valid, phone: "0212345678" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "phone")).toBe(true);
    }
  });

  it("rejects a message shorter than the minimum", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "س".repeat(CONTACT_MESSAGE_MIN_LENGTH - 1),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "message")).toBe(
        true,
      );
    }
  });

  it("rejects a message longer than the max", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "س".repeat(CONTACT_MESSAGE_MAX_LENGTH + 1),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "message")).toBe(
        true,
      );
    }
  });

  it("accepts a message of exactly the max length", () => {
    const result = contactSchema.safeParse({
      ...valid,
      message: "س".repeat(CONTACT_MESSAGE_MAX_LENGTH),
    });
    expect(result.success).toBe(true);
  });
});
