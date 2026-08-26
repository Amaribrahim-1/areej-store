import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/** 1200×630 JPEG. The previous 1536×1024 PNG was ~1.7 MB — WhatsApp and several scrapers drop images that large. */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "أريج — عطور فاخرة",
  type: "image/jpeg",
} as const;

type StorefrontShareMeta = {
  url: string;
  title?: string;
  description?: string;
};

export function storefrontOpenGraph({
  url,
  title = SITE_TAGLINE,
  description = SITE_DESCRIPTION,
}: StorefrontShareMeta): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: "ar_EG",
    siteName: SITE_NAME,
    title,
    description,
    url,
    images: [OG_IMAGE],
  };
}

export function storefrontTwitter({
  title = SITE_TAGLINE,
  description = SITE_DESCRIPTION,
}: Omit<StorefrontShareMeta, "url"> = {}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE.url],
  };
}
