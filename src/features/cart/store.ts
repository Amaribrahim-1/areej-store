import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];

  addItem: (productId: string, variantId: string, quantity?: number) => void;

  removeItem: (productId: string, variantId: string) => void;

  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;

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
      addItem: (productId, variantId, quantity = 1) => {
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
            items: [...state.items, { productId, variantId, quantity }],
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
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);
