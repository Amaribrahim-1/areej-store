import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema, registerWriteSchema } from "./schema";

const validRegisterBase = {
  fullName: "مريم أحمد",
  email: "mariam@example.com",
  password: "secret1",
  phone: "01012345678",
  governorate: "Kafr El-Sheikh",
  markaz: "Kafr Al-Shaykh",
  addressDescription: "قرية قراجة، جانب موقف الأتوبيس",
};

describe("registerWriteSchema", () => {
  it("accepts a valid Egypt location payload", () => {
    const result = registerWriteSchema.safeParse(validRegisterBase);
    expect(result.success).toBe(true);
  });

  it("rejects an unknown governorate", () => {
    const result = registerWriteSchema.safeParse({
      ...validRegisterBase,
      governorate: "NotAGovernorate",
      markaz: "Kafr El-Sheikh",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "governorate"))
        .toBe(true);
    }
  });

  it("rejects a markaz that does not belong to the governorate", () => {
    const result = registerWriteSchema.safeParse({
      ...validRegisterBase,
      governorate: "Cairo",
      markaz: "Kafr El-Sheikh",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "markaz")).toBe(
        true,
      );
    }
  });

  it("rejects an invalid Egyptian phone number", () => {
    const result = registerWriteSchema.safeParse({
      ...validRegisterBase,
      phone: "0212345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "phone")).toBe(
        true,
      );
    }
  });
});

describe("registerSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validRegisterBase,
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === "confirmPassword"),
      ).toBe(true);
    }
  });

  it("accepts matching passwords with a valid location", () => {
    const result = registerSchema.safeParse({
      ...validRegisterBase,
      confirmPassword: "secret1",
    });
    expect(result.success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
  });
});
