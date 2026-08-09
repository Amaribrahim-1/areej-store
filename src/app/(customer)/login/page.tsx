import type { Metadata } from "next";

import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول | أريج",
  description: "سجّلي دخولك إلى متجر أريج لإتمام الطلب ومتابعة طلباتك.",
};

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
      <LoginForm />
    </section>
  );
}
