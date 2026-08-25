import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1536,
  height: 1024,
  alt: "أريج — عطور فاخرة",
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
