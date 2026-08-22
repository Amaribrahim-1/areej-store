"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { adminDashboardKpisQueryKey } from "@/features/admin-dashboard/public";

import { productWriteErrorMessage } from "../../lib/productWriteErrorMessage";
import type { ProductInput } from "../../schema";
import type { ProductImageUploadProgress } from "../../types";
import {
  adminProductsQueryKey,
  featuredProductsQueryKeyRoot,
  latestProductsQueryKeyRoot,
  productQueryKeyRoot,
  productsQueryKeyRoot,
} from "../queryKeys";
import { createProduct } from "./createProduct";
import { withUploadedProductImage } from "./withUploadedProductImage";

export type CreateProductVariables = {
  input: ProductInput;
  onProgress?: (progress: ProductImageUploadProgress) => void;
};

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ input, onProgress }: CreateProductVariables) => {
      if (typeof input.image === "string") {
        return createProduct({ ...input, image: input.image });
      }

      return withUploadedProductImage(
        input.image,
        (uploaded) => createProduct({ ...input, image: uploaded.publicUrl }),
        { onProgress },
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey() });
      void queryClient.invalidateQueries({ queryKey: productsQueryKeyRoot });
      void queryClient.invalidateQueries({ queryKey: productQueryKeyRoot });
      void queryClient.invalidateQueries({
        queryKey: featuredProductsQueryKeyRoot,
      });
      void queryClient.invalidateQueries({
        queryKey: latestProductsQueryKeyRoot,
      });
      void queryClient.invalidateQueries({
        queryKey: adminDashboardKpisQueryKey,
      });
      toast.success("تم إضافة المنتج");
    },
    onError: (error) => {
      toast.error(productWriteErrorMessage(error));
    },
  });
}
