"use client";

import { useQuery } from "@tanstack/react-query";

import { CART_STALE_TIME } from "../constants";
import { useCartStore } from "../store";
import { getCartLineDetails } from "./getCartLineDetails";

export function useCartLineDetails() {
  const items = useCartStore((store) => store.items);
  const lookups = items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
  }));

  return useQuery({
    enabled: lookups.length > 0,
    queryKey: ["cart-details", lookups],
    queryFn: () => getCartLineDetails(lookups),
    staleTime: CART_STALE_TIME,
  });
}
