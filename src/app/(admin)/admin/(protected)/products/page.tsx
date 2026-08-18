import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المنتجات",
};

export default function AdminProductsPage() {
  return (
    <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
      المنتجات
    </h1>
  );
}
