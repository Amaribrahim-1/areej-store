"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { productWriteErrorMessage } from "../../lib/productWriteErrorMessage";
import type { ProductInput } from "../../schema";
import type { ProductImageUploadProgress } from "../../types";
import {
  adminProductQueryKey,
  adminProductsQueryKey,
  featuredProductsQueryKeyRoot,
  latestProductsQueryKeyRoot,
  productQueryKeyRoot,
  productsQueryKeyRoot,
} from "../queryKeys";
import { updateProduct } from "./updateProduct";
import { withReplacedProductImage } from "./withReplacedProductImage";

export type UpdateProductVariables = {
  productId: string;
  currentImageUrl: string;
  input: ProductInput;
  onProgress?: (progress: ProductImageUploadProgress) => void;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      currentImageUrl,
      input,
      onProgress,
    }: UpdateProductVariables) => {
      if (typeof input.image === "string") {
        return updateProduct(productId, { ...input, image: input.image });
      }

      return withReplacedProductImage(
        input.image,
        currentImageUrl,
        (uploaded) =>
          updateProduct(productId, { ...input, image: uploaded.publicUrl }),
        { onProgress },
      );
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminProductsQueryKey() });
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
      toast.success("تم تحديث المنتج");
    },
    onError: (error) => {
      toast.error(productWriteErrorMessage(error));
    },
  });
}
