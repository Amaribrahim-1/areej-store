export type CartLineLookup = {
  productId: string;
  variantId: string;
};

export type CartLineDetail = {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  imageUrl: string;
  volumeLabel: string | null;
  currentPrice: number;
  originalPrice: number;
};

export type CartLineDetailsResult = {
  lines: CartLineDetail[];
  unresolved: CartLineLookup[];
};

/** Display model for a cart row: API detail fields + store quantity. */
export type CartLineItemData = CartLineDetail & {
  quantity: number;
};
