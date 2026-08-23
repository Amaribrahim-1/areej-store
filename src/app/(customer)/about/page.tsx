import type { Metadata } from "next";

import AboutContent from "../_components/AboutContent";

export const metadata: Metadata = {
  title: "عنّا",
  description:
    "تعرّفي على أريج: متجر للعطور والمسك والمخمرية وزيوت الشعر، مع الدفع عند الاستلام.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
