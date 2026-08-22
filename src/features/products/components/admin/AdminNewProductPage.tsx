import AdminProductForm from "./AdminProductForm";
import AdminProductsBackLink from "./AdminProductsBackLink";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <AdminProductsBackLink />

      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-1.5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
            إضافة منتج
          </h1>
          <p className="text-sm text-muted-foreground">
            أدخل الاسم والوصف والفئة وصورة واحدة ومقاس واحد على الأقل. سعر البيع
            لازم يكون أقل من أو يساوي السعر الأصلي.
          </p>
        </header>

        <AdminProductForm />
      </div>
    </div>
  );
}
