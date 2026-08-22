import type { Metadata } from "next";

import AdminOrdersPage from "@/features/orders/components/admin/AdminOrdersPage";

export const metadata: Metadata = {
  title: "الطلبات",
};

export default function Page() {
  return <AdminOrdersPage />;
}
