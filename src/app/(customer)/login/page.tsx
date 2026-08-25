import type { Metadata } from "next";

import LoginForm from "@/features/auth/components/LoginForm";
import { getSafeNextPath } from "@/features/auth/lib/getSafeNextPath";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّلي دخولك إلى متجر أريج لإتمام الطلب ومتابعة طلباتك.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next, "/");

  return (
    <section className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
      <LoginForm nextPath={nextPath} />
    </section>
  );
}
