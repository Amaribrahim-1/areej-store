import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar initialUser={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
