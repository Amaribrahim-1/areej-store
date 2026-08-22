import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import ProductDetails from "@/features/products/components/ProductDetails";
import { decodeRouteSlug } from "@/features/products/lib/decodeRouteSlug";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug: rawSlug }, initialUser] = await Promise.all([
    params,
    getCurrentUser(),
  ]);
  const slug = decodeRouteSlug(rawSlug);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <ProductDetails slug={slug} initialUser={initialUser} />
    </section>
  );
}
