import { requireAdmin } from "@/features/auth/api/requireAdmin";

/**
 * Shared guard for admin-only routes (`/admin` and nested admin pages).
 * `/admin/login` lives outside this group. Relies on `x-pathname` stamped
 * by the Supabase session proxy.
 */
export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();
  return children;
}
