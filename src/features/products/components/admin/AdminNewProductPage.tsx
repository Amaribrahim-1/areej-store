"use client";

import AdminProductForm from "@/features/products/components/admin/AdminProductForm";
import AdminProductsBackLink from "@/features/products/components/admin/AdminProductsBackLink";

export default function AdminNewProductPage() {
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

        <AdminProductForm />
      </div>
    </div>
  );
}
