import { ProductDetailsSkeleton } from "@/features/products/components/ProductDetails";

export default function ProductDetailsLoading() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <ProductDetailsSkeleton />
    </section>
  );
}
