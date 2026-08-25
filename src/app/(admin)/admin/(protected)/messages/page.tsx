import type { Metadata } from "next";

import AdminContactMessagesPage from "@/features/contact/components/admin/AdminContactMessagesPage";

export const metadata: Metadata = {
  title: "الرسائل",
};

export default function Page() {
  return <AdminContactMessagesPage />;
}
