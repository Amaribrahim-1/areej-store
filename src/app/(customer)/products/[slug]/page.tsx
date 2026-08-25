import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { getProduct } from "@/features/products/api/getProduct";
import ProductDetails from "@/features/products/components/ProductDetails";
import { decodeRouteSlug } from "@/features/products/lib/decodeRouteSlug";

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeRouteSlug(rawSlug);
  const product = await getProduct({ slug });

  if (!product) {
    return { title: "المنتج غير موجود" };
  }

  const description =
    product.description?.trim() ||
    `تسوّقي ${product.name} من ${product.categoryLabel} — متجر أريج للعطور.`;
  const url = `/products/${encodeURIComponent(product.slug)}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: product.name,
      description,
      images: [{ url: product.imageUrl, alt: `صورة ${product.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
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
