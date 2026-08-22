"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCreateProduct } from "@/features/products/api/admin/useCreateProduct";
import AdminProductForm from "@/features/products/components/admin/AdminProductForm";
import AdminProductsBackLink from "@/features/products/components/admin/AdminProductsBackLink";
import type { ProductInput } from "@/features/products/schema";
import type { ProductImageUploadProgress } from "@/features/products/types";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] =
    useState<ProductImageUploadProgress | null>(null);
  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  async function handleSubmit(data: ProductInput) {
    try {
      await createProduct({
        input: data,
        onProgress: setUploadProgress,
      });
      router.replace("/admin/products");
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
          isSubmitting={isPending}
          imageUploadProgress={uploadProgress}
        />
      </div>
    </div>
  );
}
