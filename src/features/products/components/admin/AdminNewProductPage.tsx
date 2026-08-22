"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import {
  useDeleteProductImage,
  useUploadProductImage,
} from "@/features/products/api/admin/useUploadProductImage";
import AdminProductForm from "@/features/products/components/admin/AdminProductForm";
import AdminProductsBackLink from "@/features/products/components/admin/AdminProductsBackLink";
import type { ProductInput } from "@/features/products/schema";
import type { ProductImageUploadProgress } from "@/features/products/types";

export default function AdminNewProductPage() {
  const uploadedPathRef = useRef<string | null>(null);
  const [uploadProgress, setUploadProgress] =
    useState<ProductImageUploadProgress | null>(null);
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadProductImage();
  const { mutateAsync: deleteImage, isPending: isDeleting } =
    useDeleteProductImage();

  async function forgetUploadedImage() {
    const path = uploadedPathRef.current;
    uploadedPathRef.current = null;
    if (!path) return;
    try {
      await deleteImage(path);
    } catch {
      // Hook already toasted. Session pointer is cleared so a later
      // upload does not delete a different object by mistake.
    }
  }

  async function handleSubmit(data: ProductInput) {
    if (typeof data.image === "string") {
      return { imageUrl: data.image };
    }

    try {
      const uploaded = await uploadImage({
        file: data.image,
        onProgress: setUploadProgress,
      });
      uploadedPathRef.current = uploaded.path;
      toast.success("تم رفع الصورة");
      return { imageUrl: uploaded.publicUrl };
    } finally {
      setUploadProgress(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminProductsBackLink />

      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-1.5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
            إضافة منتج
          </h1>
          <p className="text-sm text-muted-foreground">
            أدخل الاسم والوصف والفئة وصورة واحدة ومقاس واحد على الأقل. ممكن
            إضافة أكتر من مقاس. سعر البيع لازم يكون أقل من أو يساوي السعر
            الأصلي.
          </p>
        </header>

        <AdminProductForm
          onSubmit={handleSubmit}
          onCancel={forgetUploadedImage}
          onReplaceImage={forgetUploadedImage}
          isSubmitting={isUploading || isDeleting}
          imageUploadProgress={uploadProgress}
        />
      </div>
    </div>
  );
}
