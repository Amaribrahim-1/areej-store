import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الطلبات",
};

export default function AdminOrdersPage() {
  return (
    <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
      الطلبات
    </h1>
  );
}
