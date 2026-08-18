import type { Metadata } from "next";

import AdminLoginForm from "@/features/auth/components/AdminLoginForm";
import { getSafeAdminNextPath } from "@/features/auth/lib/getSafeNextPath";

export const metadata: Metadata = {
  title: "تسجيل دخول المدير | أريج",
  description: "دخول لوحة تحكم متجر أريج.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeAdminNextPath(params.next);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-12">
      <AdminLoginForm nextPath={nextPath} />
    </main>
  );
}
