# شرح التاسك — 12.5

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

علاء كانت تقدر تشوف حالة الطلب وتتغيّرها من القائمة (12.4)، بس التغيير لازم يتكتب في الداتابيز ويتظهر فورًا في التفاصيل والليستة والداشبورد. الحل: `updateAdminOrderStatus` بيكتب عمود `status` بس، والـ mutation بتعمل optimistic update + invalidate + توست. الـ RLS من Phase 1.3 هو حارس الكتابة، مش الواجهة.

## الصفحات والملفات

- `/admin/orders/[id]` — صفحة التفاصيل؛ قائمة «حالة الطلب» بتحفظ القيمة المختارة.
- `src/features/orders/components/admin/AdminOrderStatusControl.tsx` — الكنترول: القيم من `ORDER_STATUSES`، والعناوين من `ORDER_STATUS_LABELS`. الاختيار بيروح للـ mutation.
- `src/features/orders/components/admin/AdminOrderDetails.tsx` — بيركب الكنترول جنب اسم العميل.
- `src/features/orders/api/admin/updateAdminOrderStatus.ts` — الكتابة لـ `orders.status`.
- `src/features/orders/api/admin/useUpdateAdminOrderStatus.ts` — الـ mutation: optimistic على التفاصيل والليستة، توست، وبعدين invalidate.
- `src/features/orders/schema.ts` — `updateAdminOrderStatusSchema`.
- `src/features/orders/api/queryKeys.ts` — مفاتيح كاش الطلبات (ليستة أدمن / تفاصيل / طلبات العميلة).
- `src/features/admin-dashboard/public.ts` — مفتاح كاش الـ KPIs؛ الطلبات بتبطّله من هنا مش من جوه ملفات الداشبورد.
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
3. القائمة تفضل على القيمة الجديدة طول ما الكتابة شغالة (من غير ما ترجع للقديمة لحظة).
4. `updateAdminOrderStatus` يكتب عمود `status` فقط.
5. مش أدمن أو الطلب مش موجود → `ORDER_NOT_FOUND` → توست غلط، والقائمة ترجع للحالة القديمة.
6. نجاح → توست «تم تحديث حالة الطلب»، ويتحدّث كاش التفاصيل والليستة وطلبات العميلة وكروت الداشبورد (المعلّق والمبيعات).

## قرارات مهمة وليه

- **الكتابة عمود `status` بس:** الـ grant من Phase 1.3 يمنع تعديل الإجمالي أو عنوان العميل بعد إنشاء الطلب.
- **مفيش مايجريشن جديد:** سياسة `orders_update_admin_status` موجودة. مايجريشن فاضي كان هيضيف تاريخ من غير شغل.
- **القيم من `constants.ts`:** سطر `Pending` متعاود في الجدول والـ UI هيفرق يوم ما الحالة تتغير.
- **الكنترول في التفاصيل مش الليستة:** تغيير الحالة قرار على طلب واحد بعد ما علاء تشوف المنتجات والعنوان.
- **Invalidate للـ KPIs من `admin-dashboard/public`:** عدد المعلّق ومبيعات «تم التوصيل» بيتغيروا مع الحالة. الاستيراد من `public.ts` مش من جوه `api/` — نفس أسلوب المنتجات مع الريفيوهات.

## تحقق بنفسك

1. أدمن → تفاصيل طلب Pending → اختار «جاري التوصيل»: توست نجاح، القائمة تتحدث، ارجع لليستة وشوف البادج اتغيرت.
2. حدّث الصفحة: الحالة لسه Shipping — يعني اتكتب في الداتابيز.
3. روح `/admin`: كارت المعلّق ينقص (ولو غيّرتها لـ «تم التوصيل» رقم المبيعات يزيد).
4. اختار «ملغي» ثم «قيد المراجعة»: الأربع قيم مسموحة من غير سلسلة إجبارية.
5. جلسة مش أدمن ما تقدرش تعدّل الصف (RLS) — الواجهة أصلاً ورا `/admin`.
