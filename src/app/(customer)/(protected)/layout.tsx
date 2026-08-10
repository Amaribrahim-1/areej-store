import { requireCustomer } from "@/features/auth/api/requireCustomer";

/**
 * Shared guard for customer-only routes (`/checkout`, `/orders`).
 * Relies on `x-pathname` stamped by the Supabase session proxy.
 */
export default async function ProtectedCustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireCustomer();
  return children;
}
