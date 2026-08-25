import type { Metadata } from "next";

import ContactPageContent from "@/features/contact/components/ContactPageContent";
import { storefrontOpenGraph, storefrontTwitter } from "@/lib/seo";

const title = "تواصل";
const description =
  "ابعتي لأريج رسالة عن المنتجات أو الطلب — هنرجع لكِ على رقم الموبايل.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: storefrontOpenGraph({ url: "/contact", title, description }),
  twitter: storefrontTwitter({ title, description }),
};

export default function ContactPage() {
  return <ContactPageContent />;
}
