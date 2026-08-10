import type { Metadata } from "next";

import RegisterForm from "@/features/auth/components/RegisterForm";
import { getSafeNextPath } from "@/features/auth/lib/getSafeNextPath";

export const metadata: Metadata = {
  title: "إنشاء حساب | أريج",
  description: "سجّلي حساب جديد في متجر أريج لإتمام الطلب ومتابعة طلباتك.",
};

type RegisterPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next, "/");

  return (
    <section className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
      <RegisterForm nextPath={nextPath} />
    </section>
  );
}
