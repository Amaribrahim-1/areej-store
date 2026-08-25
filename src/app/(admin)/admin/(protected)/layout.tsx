import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/api/requireAdmin";

import AdminNavbar from "../../_components/AdminNavbar";

export const metadata: Metadata = {
  title: {
    template: "%s | لوحة التحكم | أريج",
    default: "لوحة التحكم | أريج",
  },
  robots: { index: false, follow: false },
};

/**
 * Shared guard + chrome for admin-only routes (`/admin` and nested admin pages).
 * `/admin/login` lives outside this group. Relies on `x-pathname` stamped
 * by the Supabase session proxy.
 */
export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();

  return (
    <div className="flex min-h-svh flex-col">
      <AdminNavbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
