import { beforeAll, beforeEach, describe, expect, it } from "vitest";

let useCartStore: typeof import("./store").useCartStore;

beforeAll(async () => {
  const memory: Record<string, string> = {};
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => memory[key] ?? null,
      setItem: (key: string, value: string) => {
        memory[key] = String(value);
      },
      removeItem: (key: string) => {
        delete memory[key];
      },
      clear: () => {
        for (const key of Object.keys(memory)) delete memory[key];
      },
    },
  });

  ({ useCartStore } = await import("./store"));
});

beforeEach(() => {
  useCartStore.getState().clear();
});

describe("useCartStore", () => {
  it("merges quantity when adding the same product_id + variant_id", () => {
    const { addItem } = useCartStore.getState();

    addItem({
      productId: "p1",
      variantId: "v1",
      quantity: 2,
      unitPriceSnapshot: 100,
    });
    addItem({
      productId: "p1",
      variantId: "v1",
      quantity: 3,
      unitPriceSnapshot: 120,
    });

    expect(useCartStore.getState().items).toEqual([
      {
        productId: "p1",
        variantId: "v1",
        quantity: 5,
        unitPriceSnapshot: 100,
      },
    ]);
  });

  it("keeps separate lines when variant_id differs", () => {
    const { addItem } = useCartStore.getState();

    addItem({
      productId: "p1",
      variantId: "v1",
      quantity: 1,
      unitPriceSnapshot: 100,
    });
    addItem({
      productId: "p1",
      variantId: "v2",
      quantity: 1,
      unitPriceSnapshot: 150,
    });

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("rejects adding a quantity below 1", () => {
    useCartStore.getState().addItem({
      productId: "p1",
      variantId: "v1",
      quantity: 0,
      unitPriceSnapshot: 100,
    });

    expect(useCartStore.getState().items).toEqual([]);
  });

  it("removes the line when updateQuantity is called with 0", () => {
    const { addItem, updateQuantity } = useCartStore.getState();

    addItem({
      productId: "p1",
      variantId: "v1",
      quantity: 2,
      unitPriceSnapshot: 100,
    });
    updateQuantity("p1", "v1", 0);

    expect(useCartStore.getState().items).toEqual([]);
  });
});
