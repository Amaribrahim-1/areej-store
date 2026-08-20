# شرح التاسك — 12.3

- التاريخ: 2026-08-20
- النوع: full-task

## المشكلة والحل

علاء من الليستة تشوف الملخص بس. عشان تجهّز الطلب محتاجة صفحة طلب واحد: العميل، عنوان التسليم، والمنتجات بالسعر والكمية. الحل: `/admin/orders/[id]` بتقرأ `getAdminOrder` وتعرض الرجوع + بلوك العميل + جدول المنتجات.

## الصفحات والملفات

- `/admin/orders/[id]` (`src/app/(admin)/admin/(protected)/orders/[id]/page.tsx`) — صفحة رفيعة: ميتاداتا + `orderId` للكمبوننت.
- `src/features/orders/components/admin/AdminOrderDetailsPage.tsx` — تحميل، غلط، مش موجود، أو التفاصيل.
- `src/features/orders/components/admin/AdminOrderBackLink.tsx` — «العودة للطلبات» → `/admin/orders`.
- `src/features/orders/components/admin/AdminOrderDetails.tsx` — اسم العميل، بادج الحالة (عرض فقط)، البلوك، المنتجات، الإجمالي.
- `src/features/orders/components/admin/AdminOrderCustomerBlock.tsx` — الاسم، الهاتف `tel:`، العنوان الكامل، التاريخ، طريقة الدفع.
- `src/features/orders/components/admin/AdminOrderItemsList.tsx` — كروت تحت `lg`، جدول من `lg`.
- `src/features/orders/components/admin/AdminOrderLineItemCard.tsx` — منتج على الموبايل: اسم، سعر، كمية، إجمالي السطر.
- `src/features/orders/components/admin/AdminOrderItemsTable.tsx` — نفس الأعمدة على الشاشة الواسعة.
- `src/features/orders/api/admin/useAdminOrder.ts` — قراءة الطلب الواحد.
- `src/features/orders/api/admin/getAdminOrder.ts` — الـ helper (من شحنة الباك).
- `supabase/migrations/20260820085421_get_admin_order.sql` — RPC أدمن فقط.

## عقد الاستخدام (English)

### `getAdminOrder` — `src/features/orders/api/admin/getAdminOrder.ts`

- **Params:** `orderId: string` (UUID). Whitespace trimmed.
- **Returns:** `AdminOrderDetail | null`
  - Success: header snapshot (`id`, `status`, `total`, `paymentMethod`, `customerName`, `customerPhone`, `governorate`, `markaz`, `addressText`, `createdAt`) plus `items[]`.
  - Each item: `id`, `productName`, `variantLabel` (`string | null`), `quantity`, `unitPrice`, `lineTotal`. Purchase snapshots — no live image/slug.
  - Missing order, empty string, or malformed UUID → `null`.
- **Errors:** non-admin throws `NOT_ADMIN`. Unexpected status/payment/line shape throws.
- **Call:**

```ts
const order = await getAdminOrder(orderId)
```

## التدفق

1. من `/admin/orders` زر «التفاصيل» يفتح `/admin/orders/<id>`.
2. `getAdminOrder` ينادي `get_admin_order`.
3. مش أدمن → `NOT_ADMIN` → حالة الغلط.
4. `null` → «الطلب غير موجود».
5. الطلب موجود → العميل/العنوان من الـ snapshot، والمنتجات بأسعار وقت الشراء.

## قرارات مهمة وليه

- **كروت على الموبايل زي الليستة:** أربع أعمدة + اسم منتج عربي طويل تزدحم على الشاشة الصغيرة. نفس حد `lg`.
- **بادج الحالة عرض مش كنترول:** التحديث تاسك 12.4. من غير البادج علاء تفتح التفاصيل ومش عارفة الطلب Pending ولا Shipping.
- **سهم الرجوع عكس سهم التفاصيل:** لوسيد مش بيقلب. في RTL الرجوع يمين، والتفاصيل شمال.
- **`null` = مش موجود مش إكسبشن:** لينك UUID بايظ أو طلب اتمسح يظهر فاضي، مش 500.
- **العنوان من `formatOrderAddress`:** نفس ترجمة المحافظة في الليستة والإشعار. نسختين هيفرقوا.

## تحقق بنفسك

1. أدمن من الليستة → «التفاصيل»: رجوع، اسم، هاتف يتفتح اتصال، عنوان عربي كامل، منتجات (اسم / سعر / كمية / إجمالي السطر)، إجمالي الطلب. موبايل كروت، شاشة واسعة جدول.
2. بادج الحالة ظاهرة ومفيش قائمة تغيير حالة.
3. UUID شكله صح ومش موجود → «الطلب غير موجود» + رجوع.
4. الجلسة محمية زي باقي `/admin` — عميلة على الرابط تترفض من السيرفر.
