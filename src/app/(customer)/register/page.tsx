import type { Metadata } from "next";

import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "إنشاء حساب | أريج",
  description: "سجّلي حساب جديد في متجر أريج لإتمام الطلب ومتابعة طلباتك.",
};

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
      <RegisterForm />
    </section>
  );
}
