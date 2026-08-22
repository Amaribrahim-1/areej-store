import type { Metadata } from "next";

import AdminNewProductPage from "@/features/products/components/admin/AdminNewProductPage";

export const metadata: Metadata = {
  title: "إضافة منتج",
};

export default function Page() {
  return <AdminNewProductPage />;
}
