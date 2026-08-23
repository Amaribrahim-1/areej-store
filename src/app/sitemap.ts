import type { MetadataRoute } from "next";

import { getProducts } from "@/features/products/api/getProducts";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = ["", "/products", "/about", "/contact"] as const;

/** Active products only (same rule the storefront catalog uses). Paginates in case the catalog outgrows one page. */
async function getAllProductSlugs(): Promise<string[]> {
  const pageSize = 200;
  const slugs: string[] = [];
  let page = 1;

  while (true) {
    const { items, total } = await getProducts({ page, pageSize });
    slugs.push(...items.map((item) => item.slug));

    if (slugs.length >= total || items.length === 0) {
      break;
    }
    page += 1;
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await getAllProductSlugs();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/products/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries];
}
