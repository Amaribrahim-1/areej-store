import type { Metadata } from "next";

import ProductCatalog from "@/features/products/components/ProductCatalog";
import ProductGrid from "@/features/products/components/ProductGrid";

export const metadata: Metadata = {
  title: "المنتجات",
  description: "تصفّح مجموعة عطور ومسك ومخمريات زيوت الشعر من أريج.",
  alternates: { canonical: "/products" },
  openGraph: { url: "/products" },
};

export default function ProductsCatalogPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 space-y-2 text-start sm:mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-brand sm:text-4xl">
          المنتجات
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          تصفّح مجموعة عطور ومسك ومخمريات زيوت الشعر من أريج.
        </p>
      </header>

      <ProductCatalog>
        <ProductGrid />
      </ProductCatalog>
    </section>
  );
}
