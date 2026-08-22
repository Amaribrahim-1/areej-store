import type { Metadata } from "next";

import AdminEditProductPage from "@/features/products/components/admin/AdminEditProductPage";

export const metadata: Metadata = {
  title: "تعديل المنتج",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminEditProductPage productId={id} />;
}
