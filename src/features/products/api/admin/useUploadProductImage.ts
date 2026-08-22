"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { productImageErrorMessage } from "../../lib/productImageErrorMessage";
import { deleteProductImage } from "./deleteProductImage";
import { uploadProductImage } from "./uploadProductImage";
import type { ProductImageUploadProgress } from "../../types";

type UploadProductImageInput = {
  file: File;
  onProgress?: (progress: ProductImageUploadProgress) => void;
};

export function useUploadProductImage() {
  return useMutation({
    mutationFn: ({ file, onProgress }: UploadProductImageInput) =>
      uploadProductImage(file, { onProgress }),
    onError: (error) => {
      toast.error(productImageErrorMessage(error));
    },
  });
}

export function useDeleteProductImage() {
  return useMutation({
    mutationFn: (path: string) => deleteProductImage(path),
    onError: (error) => {
      toast.error(productImageErrorMessage(error));
    },
  });
}
