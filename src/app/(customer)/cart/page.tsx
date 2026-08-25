import type { Metadata } from "next";

import CartPageClient from "@/features/cart/components/CartPageClient";

export const metadata: Metadata = {
  title: "عربة التسوّق",
  robots: { index: false, follow: false },
};

export default function CartRoutePage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <CartPageClient />
    </section>
  );
}
