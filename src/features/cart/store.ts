import { create } from "zustand";
import { persist } from "zustand/middleware";

import { lineKey } from "./lib/lineKey";

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
  /** Unit current_price when the line was last accepted (for price-drift detection). */
  unitPriceSnapshot?: number;
};

export type AddCartItemInput = {
  productId: string;
  variantId: string;
  quantity?: number;
  unitPriceSnapshot: number;
};

export type CartPriceSnapshotUpdate = {
  productId: string;
  variantId: string;
  unitPriceSnapshot: number;
};

type CartState = {
  items: CartLine[];

  addItem: (input: AddCartItemInput) => void;

  removeItem: (productId: string, variantId: string) => void;

  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;

  syncUnitPriceSnapshots: (updates: CartPriceSnapshotUpdate[]) => void;

  clear: () => void;
};

function isSameLine(
  item: CartLine,
  productId: string,
  variantId: string,
): boolean {
  return item.productId === productId && item.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: ({
        productId,
        variantId,
        quantity = 1,
        unitPriceSnapshot,
      }) => {
        if (quantity < 1) return;

        set((state) => {
          const exists = state.items.some((item) =>
            isSameLine(item, productId, variantId),
          );
          if (exists) {
            return {
              items: state.items.map((item) =>
                isSameLine(item, productId, variantId)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { productId, variantId, quantity, unitPriceSnapshot },
            ],
          };
        });
      },
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameLine(item, productId, variantId),
          ),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return {
              items: state.items.filter(
                (item) => !isSameLine(item, productId, variantId),
              ),
            };
          }
          return {
            items: state.items.map((item) =>
              isSameLine(item, productId, variantId)
                ? { ...item, quantity }
                : item,
            ),
          };
        }),
      syncUnitPriceSnapshots: (updates) =>
        set((state) => {
          if (updates.length === 0) return state;

          const snapshotByKey = new Map(
            updates.map((update) => [
              lineKey(update.productId, update.variantId),
              update.unitPriceSnapshot,
            ]),
          );

          return {
            items: state.items.map((item) => {
              const nextSnapshot = snapshotByKey.get(
                lineKey(item.productId, item.variantId),
              );
              if (nextSnapshot == null) return item;
              return { ...item, unitPriceSnapshot: nextSnapshot };
            }),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);
