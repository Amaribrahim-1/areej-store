import { getMyProfile } from "@/features/auth/api/getMyProfile";
import AccountForm from "@/features/auth/components/AccountForm";

export default async function AccountPage() {
  const profile = await getMyProfile();

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <AccountForm initialProfile={profile} />
    </section>
  );
}
