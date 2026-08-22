# شرح التاسك — 12.4 و 12.5

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

علاء كانت بتشوف الحالة بادج عرض بس. محتاجة تغيّرها: قيد المراجعة، جاري التوصيل، تم التوصيل، ملغي. الحل: قائمة على صفحة التفاصيل بتكتب `status` في الداتابيز، والـ RLS يمنع غير الأدمن.

## الصفحات والملفات

- `/admin/orders/[id]` — نفس صفحة التفاصيل؛ البادج اتبدلت بقائمة «حالة الطلب».
- `src/features/orders/components/admin/AdminOrderStatusControl.tsx` — القائمة: القيم من `ORDER_STATUSES` والعناوين من `ORDER_STATUS_LABELS`.
- `src/features/orders/components/admin/AdminOrderDetails.tsx` — بيركب الكنترول جنب اسم العميل.
- `src/features/orders/api/admin/updateAdminOrderStatus.ts` — الكتابة لـ `orders.status`.
- `src/features/orders/api/admin/useUpdateAdminOrderStatus.ts` — الـ mutation + توست.
- `src/features/orders/schema.ts` — `updateAdminOrderStatusSchema`.
- `src/features/orders/api/queryKeys.ts` — مفاتيح الكاش المشتركة (ليستة / تفاصيل / طلبات العميلة).
- الليستة والكروت لسه فيها `OrderStatusBadge` عرض فقط — التغيير من صفحة التفاصيل.

## عقد الاستخدام (English)

### `updateAdminOrderStatus` — `src/features/orders/api/admin/updateAdminOrderStatus.ts`

- **Params:** `{ orderId: string, status: "Pending" | "Shipping" | "Delivered" | "Cancelled" }`
  - `orderId` must be a UUID (whitespace trimmed).
  - `status` must be one of `ORDER_STATUSES`. Any other string is rejected before the write.
- **Returns:** `{ status: OrderStatus }` — the value stored on the row.
- **Errors:**
  - Invalid id/status → throws `INVALID_ORDER_STATUS_PAYLOAD` (no Supabase call).
  - No session → throws `UNAUTHENTICATED`.
  - Row missing, or RLS hides the row (non-admin) → throws `ORDER_NOT_FOUND`.
  - Unexpected DB `status` shape → throws.
- **Call:**

```ts
const result = await updateAdminOrderStatus({
  orderId,
  status: "Shipping",
})
```

## التدفق

1. علاء على `/admin/orders/[id]` تختار حالة من القائمة.
2. الـ schema يتأكد إن القيمة من الأربع حالات.
3. `updateAdminOrderStatus` يكتب عمود `status` فقط.
4. مش أدمن أو الطلب مش موجود → `ORDER_NOT_FOUND` → توست غلط، والقائمة ترجع للحالة القديمة.
5. نجاح → توست «تم تحديث حالة الطلب»، والليستة وتفاصيل الطلب يتحدّثوا.

## قرارات مهمة وليه

- **الكتابة عمود `status` بس:** الـ grant من Phase 1.3 يمنع تعديل الإجمالي أو عنوان العميل بعد إنشاء الطلب.
- **مفيش مايجريشن جديد:** سياسة `orders_update_admin_status` موجودة. مايجريشن فاضي كان هيضيف تاريخ من غير شغل.
- **القيم من `constants.ts`:** سطر `Pending` متعاود في الجدول والـ UI هيفرق يوم ما الحالة تتغير.
- **الكنترول في التفاصيل مش الليستة:** تغيير الحالة قرار على طلب واحد بعد ما علاء تشوف المنتجات والعنوان.

## تحقق بنفسك

1. أدمن → تفاصيل طلب Pending → اختار «جاري التوصيل»: توست نجاح، القائمة تتحدث، ارجع لليستة وشوف البادج اتغيرت.
2. حدّث الصفحة: الحالة لسه Shipping — يعني اتكتب في الداتابيز.
3. اختار «ملغي» ثم «قيد المراجعة»: الأربع قيم مسموحة من غير سلسلة إجبارية.
4. جلسة مش أدمن ما تقدرش تعدّل الصف (RLS) — الواجهة أصلاً ورا `/admin`.
