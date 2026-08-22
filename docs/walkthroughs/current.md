# شرح التاسك — 12.6

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

لما قائمة الطلبات تكبر، علاء محتاجة تلاقي «قيد المراجعة» من غير ما تعدّي على كل الصفوف. الحل: فلتر بالحالة وترتيب (الأحدث / الأقدم / حسب الحالة) على `/admin/orders`. الرابط بيحفظ الاختيار. الليستة لسه بتيجي كاملة من `getAdminOrders`؛ الفلترة بعد الجلب.

## الصفحات والملفات

- `/admin/orders` (`src/app/(admin)/admin/(protected)/orders/page.tsx`) — قائمة الأدمن؛ فوق الجدول/الكروت قائمتين: الحالة والترتيب.
- `src/features/orders/components/admin/AdminOrdersPage.tsx` — بيركب الفلتر على نتيجة `useAdminOrders`، ويفرق بين محل فاضي وفلتر مالوش نتائج.
- `src/features/orders/components/admin/AdminOrdersToolbar.tsx` — قائمتي الحالة والترتيب. العناوين عربية من `constants.ts`.
- `src/features/orders/hooks/useAdminOrdersListParams.ts` — بيقرأ ويكتب `?status=` و `?sort=` زي كتالوج المنتجات.
- `src/features/orders/lib/filterAndSortAdminOrders.ts` — فلترة وترتيب نقي على الليستة الجاهزة.
- `src/features/orders/constants.ts` — `ADMIN_ORDER_SORTS` + حراس `isOrderStatus` / `isAdminOrderSort`. قيمة URL غلط بتترمي ويتتعامل كأنها الافتراضي.

## عقد الاستخدام (English)

### `filterAndSortAdminOrders` — `src/features/orders/lib/filterAndSortAdminOrders.ts`

- **Params:** `(orders: AdminOrder[], params: { status?: OrderStatus; sort: AdminOrderSort })`
  - Omit `status` (or pass `undefined`) to keep every order.
  - `sort`: `"newest"` | `"oldest"` | `"status"`.
  - `"status"` follows `ORDER_STATUSES` (Pending → Shipping → Delivered → Cancelled), then newest within a status.
  - Equal `createdAt` breaks with `id` descending (same idea as `list_admin_orders`).
- **Returns:** a **new** array. Empty input or no matches → `[]`. Does not throw.
- **Errors:** none. Invalid URL values are rejected in the hook before this runs.
- **Call:**

```ts
const visible = filterAndSortAdminOrders(orders, {
  status: "Pending",
  sort: "newest",
})
```

`getAdminOrders` is unchanged: no extra RPC args, still all orders, newest first, `[]` when the shop has none, `NOT_ADMIN` for a non-admin session.

## التدفق

1. علاء تفتح `/admin/orders` → كل الطلبات، الأحدث أولاً.
2. تختار حالة → `?status=Pending` (مثلًا) → الصفوف دي بس.
3. تختار ترتيب → `?sort=oldest` أو `?sort=status`. الأحدث هو الافتراضي ومش بيتكتب في الرابط.
4. فلتر مالوش صفوف → رسالة «لا توجد طلبات بهذه الحالة» وزر «عرض كل الطلبات».
5. محل من غير طلبات أصلًا → الرسالة القديمة، ومن غير قوائم الفلتر.
6. تغيير حالة طلب من صفحة التفاصيل لسه بيحدّث نفس كاش الليستة؛ الفلتر بيتطبّق تاني على النسخة الجديدة.

## قرارات مهمة وليه

- **فلترة على الكلاينت، مش RPC جديد:** العدد دلوقتي صغير، وكاش 12.5 فضل مفتاح واحد (`admin-orders`). لو بكرة في pagination، الفلتر ساعتها يدخل `list_admin_orders`.
- **الرابط مصدر الاختيار، مش Zustand:** نفس أسلوب الكتالوج. ريفرش و«رجوع» يفضلوا على نفس العرض. قيمة مش من `ORDER_STATUSES` / `ADMIN_ORDER_SORTS` بتتجاهل.
- **ترتيب «حسب الحالة» = ترتيب الـ pipeline:** قيد المراجعة فوق، لأن ده شغل علاء اليومي، مش ترتيب أبجدي.

## تحقق بنفسك

1. أدمن → `/admin/orders` → اختار «قيد المراجعة»: الباقي يختفي، والرابط فيه `status=Pending`.
2. حدّث الصفحة: الفلتر لسه واقف.
3. رتّب «حسب الحالة»: Pending ثم Shipping ثم Delivered ثم Cancelled، وجوّه كل حالة الأحدث فوق.
4. حالة مالهاش طلبات: رسالة فاضية و«عرض كل الطلبات» يمسح `status` من الرابط.
5. محل فاضي (لو عندك بيئة كده): مفيش قوائم فلتر، ونفس رسالة «لا توجد طلبات بعد».
