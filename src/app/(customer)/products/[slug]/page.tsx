import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import ProductDetails from "@/features/products/components/ProductDetails";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, initialUser] = await Promise.all([
    params,
    getCurrentUser(),
  ]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <ProductDetails slug={slug} initialUser={initialUser} />
    </section>
  );
}
