import AccountSectionNav from "@/components/shared/AccountSectionNav";
import CustomerOrdersPage from "@/features/orders/components/CustomerOrdersPage";

export default function OrdersRoutePage() {
  return (
    <section className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <AccountSectionNav current="orders" />
      <CustomerOrdersPage />
    </section>
  );
}
