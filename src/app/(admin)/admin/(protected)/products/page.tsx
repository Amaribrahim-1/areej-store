import type { Metadata } from "next";

import AdminProductsPage from "@/features/products/components/admin/AdminProductsPage";

export const metadata: Metadata = {
  title: "المنتجات",
};

export default function Page() {
  return <AdminProductsPage />;
}
