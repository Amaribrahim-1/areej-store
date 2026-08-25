import { Suspense } from "react";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";

async function CustomerNavbar() {
  const user = await getCurrentUser();
  return <Navbar initialUser={user} />;
}

function NavbarFallback() {
  return <div className="h-14 sm:h-16" aria-hidden />;
}

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <Suspense fallback={<NavbarFallback />}>
        <CustomerNavbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
