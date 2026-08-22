"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ProductStatus } from "../../constants";
import { productWriteErrorMessage } from "../../lib/productWriteErrorMessage";
import type { AdminProduct } from "../../types";
import {
  adminProductQueryKey,
  adminProductsQueryKey,
  featuredProductsQueryKeyRoot,
  latestProductsQueryKeyRoot,
  productQueryKeyRoot,
  productsQueryKeyRoot,
} from "../queryKeys";
import { setProductStatus } from "./setProductStatus";

export type SetProductStatusVariables = {
  productId: string;
  status: ProductStatus;
};

/**
 * Quick status toggle from the admin products table/cards (task 13.9).
 * Updates the `admin-products` cache optimistically so the switch flips
 * immediately, then rolls back on error.
 */
export function useSetProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, status }: SetProductStatusVariables) =>
      setProductStatus(productId, status),
    onMutate: async ({ productId, status }) => {
      await queryClient.cancelQueries({ queryKey: adminProductsQueryKey() });

      const previousProducts = queryClient.getQueryData<AdminProduct[]>(
        adminProductsQueryKey(),
      );

      queryClient.setQueryData<AdminProduct[]>(
        adminProductsQueryKey(),
        (products) =>
          products?.map((product) =>
            product.id === productId ? { ...product, status } : product,
          ),
      );

      return { previousProducts };
    },
    onError: (error, _variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(
          adminProductsQueryKey(),
          context.previousProducts,
        );
      }
      toast.error(productWriteErrorMessage(error));
    },
    onSuccess: (_status, variables) => {
      toast.success("تم تحديث حالة المنتج");
      void queryClient.invalidateQueries({
        queryKey: adminProductQueryKey(variables.productId),
      });
      void queryClient.invalidateQueries({ queryKey: productsQueryKeyRoot });
      void queryClient.invalidateQueries({ queryKey: productQueryKeyRoot });
      void queryClient.invalidateQueries({
        queryKey: featuredProductsQueryKeyRoot,
      });
      void queryClient.invalidateQueries({
        queryKey: latestProductsQueryKeyRoot,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey() });
    },
  });
}
