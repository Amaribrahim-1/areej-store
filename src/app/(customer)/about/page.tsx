import type { Metadata } from "next";

import { storefrontOpenGraph, storefrontTwitter } from "@/lib/seo";

import AboutContent from "../_components/AboutContent";

const title = "عنّا";
const description =
  "تعرّفي على أريج: متجر للعطور والمسك والمخمرية وزيوت الشعر، مع الدفع عند الاستلام.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: storefrontOpenGraph({ url: "/about", title, description }),
  twitter: storefrontTwitter({ title, description }),
};

export default function AboutPage() {
  return <AboutContent />;
}
