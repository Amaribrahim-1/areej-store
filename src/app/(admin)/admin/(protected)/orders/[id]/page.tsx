import type { Metadata } from "next";

import AdminOrderDetailsPage from "@/features/orders/components/admin/AdminOrderDetailsPage";

export const metadata: Metadata = {
  title: "تفاصيل الطلب",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminOrderDetailsPage orderId={id} />;
}
