import MyOrdersList from "@/features/orders/components/MyOrdersList";

export default function OrdersPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          طلباتي
        </h1>
        <p className="text-sm text-muted-foreground">
          هنا تتابعي طلباتك: المنتجات، الإجمالي، وحالة التوصيل.
        </p>
      </header>

      <MyOrdersList />
    </section>
  );
}
