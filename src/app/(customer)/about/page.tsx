import type { Metadata } from "next";

import AboutContent from "../_components/AboutContent";

export const metadata: Metadata = {
  title: "عنّا | أريج",
  description:
    "تعرّفي على أريج: متجر للعطور والمسك والمخمرية وزيوت الشعر، مع الدفع عند الاستلام.",
};

export default function AboutPage() {
  return <AboutContent />;
}
