import { describe, expect, it } from "vitest";

import { getSafeAdminNextPath, getSafeNextPath } from "./getSafeNextPath";

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

describe("getSafeAdminNextPath", () => {
  it("allows admin panel paths including query strings", () => {
    expect(getSafeAdminNextPath("/admin")).toBe("/admin");
    expect(getSafeAdminNextPath("/admin?tab=orders")).toBe("/admin?tab=orders");
    expect(getSafeAdminNextPath("/admin/orders")).toBe("/admin/orders");
    expect(getSafeAdminNextPath("/admin/messages")).toBe("/admin/messages");
  });

  it("rejects the login page so the next path cannot loop", () => {
    expect(getSafeAdminNextPath("/admin/login")).toBe("/admin");
    expect(getSafeAdminNextPath("/admin/login?next=/admin")).toBe("/admin");
  });

  it("falls back for storefront paths and unsafe URLs", () => {
    expect(getSafeAdminNextPath("/checkout")).toBe("/admin");
    expect(getSafeAdminNextPath("https://evil.com")).toBe("/admin");
    expect(getSafeAdminNextPath(undefined)).toBe("/admin");
  });
});
