import { describe, expect, it } from "vitest";

import type { AdminOrder } from "../types";

import { filterAndSortAdminOrders } from "./filterAndSortAdminOrders";

const pendingOld = order({
  id: "11111111-1111-4111-8111-111111111111",
  status: "Pending",
  createdAt: "2026-08-01T10:00:00.000Z",
});
const pendingNew = order({
  id: "22222222-2222-4222-8222-222222222222",
  status: "Pending",
  createdAt: "2026-08-20T10:00:00.000Z",
});
const shipping = order({
  id: "33333333-3333-4333-8333-333333333333",
  status: "Shipping",
  createdAt: "2026-08-10T10:00:00.000Z",
});
const delivered = order({
  id: "44444444-4444-4444-8444-444444444444",
  status: "Delivered",
  createdAt: "2026-08-15T10:00:00.000Z",
});
const cancelled = order({
  id: "55555555-5555-4555-8555-555555555555",
  status: "Cancelled",
  createdAt: "2026-08-18T10:00:00.000Z",
});

const mixed = [cancelled, pendingOld, delivered, shipping, pendingNew];

describe("filterAndSortAdminOrders", () => {
  it("returns only the requested status, newest first", () => {
    expect(
      filterAndSortAdminOrders(mixed, { status: "Pending", sort: "newest" }).map(
        (row) => row.id,
      ),
    ).toEqual([pendingNew.id, pendingOld.id]);
  });

  it("applies oldest-first after a status filter", () => {
    expect(
      filterAndSortAdminOrders(mixed, { status: "Pending", sort: "oldest" }).map(
        (row) => row.id,
      ),
    ).toEqual([pendingOld.id, pendingNew.id]);
  });

  it("sorts oldest-first across every status when no filter is set", () => {
    expect(
      filterAndSortAdminOrders(mixed, { sort: "oldest" }).map((row) => row.id),
    ).toEqual([
      pendingOld.id,
      shipping.id,
      delivered.id,
      cancelled.id,
      pendingNew.id,
    ]);
  });

  it("groups by pipeline status, then newest within each status", () => {
    expect(
      filterAndSortAdminOrders(mixed, { sort: "status" }).map((row) => row.id),
    ).toEqual([
      pendingNew.id,
      pendingOld.id,
      shipping.id,
      delivered.id,
      cancelled.id,
    ]);
  });

  it("breaks a createdAt tie with id, newest-first then id descending", () => {
    const earlierId = order({
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      status: "Pending",
      createdAt: "2026-08-20T10:00:00.000Z",
    });
    const laterId = order({
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      status: "Pending",
      createdAt: "2026-08-20T10:00:00.000Z",
    });

    expect(
      filterAndSortAdminOrders([earlierId, laterId], { sort: "newest" }).map(
        (row) => row.id,
      ),
    ).toEqual([laterId.id, earlierId.id]);
  });
});

function order(
  overrides: Pick<AdminOrder, "id" | "status" | "createdAt">,
): AdminOrder {
  return {
    customerName: "مريم",
    customerPhone: "01012345678",
    governorate: "Cairo",
    markaz: "Nasr City",
    addressText: "شارع عباس العقاد",
    total: 250,
    ...overrides,
  };
}
