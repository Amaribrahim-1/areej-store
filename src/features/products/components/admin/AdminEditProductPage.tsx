"use client";

import { PackageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProduct } from "@/features/products/api/admin/useAdminProduct";
import { useUpdateProduct } from "@/features/products/api/admin/useUpdateProduct";
import AdminProductForm from "@/features/products/components/admin/AdminProductForm";
import AdminProductsBackLink from "@/features/products/components/admin/AdminProductsBackLink";
import { toAdminProductFormValues } from "@/features/products/lib/toAdminProductFormValues";
import type { ProductInput } from "@/features/products/schema";
import type {
  AdminProductDetail,
  ProductImageUploadProgress,
} from "@/features/products/types";

type AdminEditProductPageProps = {
  productId: string;
};

export default function AdminEditProductPage({
  productId,
}: AdminEditProductPageProps) {
  const { data: product, isPending, isError, refetch } = useAdminProduct(
    productId,
  );

  const showFallbackHeading = isPending || isError || !product;

  return (
    <div className="space-y-6">
      <AdminProductsBackLink />

      {showFallbackHeading ? (
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          تعديل المنتج
        </h1>
      ) : null}

      {isPending ? <AdminEditProductSkeleton /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل المنتج"
          description="تعذّر جلب بيانات المنتج. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && !product ? <AdminProductNotFound /> : null}

      {!isPending && !isError && product ? (
        <AdminEditProductForm product={product} />
      ) : null}
    </div>
  );
}

function AdminEditProductForm({ product }: { product: AdminProductDetail }) {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] =
    useState<ProductImageUploadProgress | null>(null);
  const { mutateAsync: updateProduct, isPending: isSaving } =
    useUpdateProduct();

  async function handleSubmit(data: ProductInput) {
    try {
      await updateProduct({
        productId: product.id,
        currentImageUrl: product.imageUrl,
        input: data,
        onProgress: setUploadProgress,
      });
      router.replace("/admin/products");
    } finally {
      setUploadProgress(null);
    }
  }

  function handleCancel() {
    router.replace("/admin/products");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          تعديل المنتج
        </h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </header>

      <AdminProductForm
        key={product.id}
        defaultValues={toAdminProductFormValues(product)}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="حفظ التعديلات"
        isSubmitting={isSaving}
        imageUploadProgress={uploadProgress}
        syncSlugFromName={false}
      />
    </div>
  );
}

function AdminProductNotFound() {
  return (
    <EmptyState
      icon={<PackageIcon />}
      title="المنتج غير موجود"
      description="المنتج ده مش موجود، أو الرابط غير صحيح."
      action={
        <Button render={<Link href="/admin/products" />} variant="outline">
          العودة للمنتجات
        </Button>
      }
    />
  );
}

function AdminEditProductSkeleton() {
  return (
    <div
      className="mx-auto max-w-2xl space-y-4"
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      <Skeleton className="h-10 w-48 rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
}
