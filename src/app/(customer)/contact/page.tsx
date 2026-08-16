import type { Metadata } from "next";

import ContactPageContent from "@/features/contact/components/ContactPageContent";

export const metadata: Metadata = {
  title: "تواصل | أريج",
  description:
    "ابعتي لأريج رسالة عن المنتجات أو الطلب — هنرجع لكِ على رقم الموبايل.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
