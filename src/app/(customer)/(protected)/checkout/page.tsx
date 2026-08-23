import type { Metadata } from "next";

import { getMyProfile } from "@/features/auth/api/getMyProfile";
import CheckoutPageClient from "@/features/orders/components/CheckoutPageClient";

export const metadata: Metadata = {
  title: "إتمام الطلب",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const profile = await getMyProfile();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <CheckoutPageClient profile={profile} />
    </section>
  );
}
