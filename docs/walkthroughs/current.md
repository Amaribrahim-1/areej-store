# شرح التاسك — 12.1

- التاريخ: 2026-08-20
- النوع: full-task

## المشكلة والحل

علاء محتاجة ليستة كل الطلبات في الأدمن. الباك كان جاهز. اتظبط الفرونت: النوع، الهوك، والصفحة من غير جدول (ده 12.2).

## الصفحات والملفات

- `/admin/orders` (`src/app/(admin)/admin/(protected)/orders/page.tsx`) — علاء تفتح الطلبات. الصفحة رفيعة: ميتاداتا + الكمبوننت.
- `src/features/orders/components/admin/AdminOrdersPage.tsx` — عنوان «الطلبات»، تحميل، غلط، أو فاضي.
- `src/features/orders/api/admin/useAdminOrders.ts` — الهوك اللي بيجيب الليستة.
- `src/features/orders/api/admin/getAdminOrders.ts` — بينادي الـ RPC ويرجع `AdminOrder[]`.
- `src/features/orders/types.ts` — شكل الصف اللي الفرونت بيشتغل عليه.
- `src/features/orders/constants.ts` — `ADMIN_ORDERS_STALE_TIME_MS` (30 ثانية).

## عقد الاستخدام (English)

### `getAdminOrders` — `src/features/orders/api/admin/getAdminOrders.ts`

- **Params:** none
- **Returns:** `AdminOrder[]`, newest first. Empty shop → `[]`.
- **Errors:** `Error("NOT_ADMIN")` if the session is not admin. Other RPC failures throw as-is.
- **Call:**

```ts
const orders = await getAdminOrders()
```

## التدفق

1. علاء تفتح `/admin/orders`.
2. `AdminOrdersPage` يستدعي `useAdminOrders`.
3. الهوك ينادي `getAdminOrders` → RPC `list_admin_orders`.
4. الصفوف بتتحول من `snake_case` لشكل `AdminOrder` في `types.ts`.
5. تحميل → سكلتون. غلط → `ErrorState`. فاضي → `EmptyState`.

## قرارات مهمة وليه

- **`types.ts` مش تكرار للمتعة:** ده عقد الفرونت. الـ RPC بيرجع `customer_name`. الصفحة تشتغل بـ `customerName`. النوع في النص هو الجسر: الـ helper يلتزم بيه، والهوك بيرثه، وجدول 12.2 هياخد `AdminOrder` في الـ props. لو حقل نقص، الكومبايلر يصرخ قبل الرن.
- **مفرد `AdminOrder` مش `AdminOrders`:** الصف واحد. الليستة `AdminOrder[]`. الجمع على النوع بيخلط الصف بالمصفوفة.
- **`status: OrderStatus` مش يونيون متكتب تاني:** القيم عايشة في `constants.ts`. نسختين هيفرقوا يوم ما نزود حالة.
- **الـ helper بيستورد النوع من `types.ts`:** زي `getCustomerOrders`. مصدر واحد للشكل، مش نوع في الـ api ونوع في الفرونت.
- **`staleTime` 30 ثانية مش `0`:** أدمن قريب من الوقت الحقيقي من غير ريفetch على كل فوكس. نفس رقم KPIs.
- **المفتاح متصدّر من الهوك:** 12.5 هتعمل invalidate لنفس المفتاح. سترينج متكرر بيتكسّر بهدوء.

## تحقق بنفسك

1. أدمن على `/admin/orders`: عنوان «الطلبات». فاضي → رسالة مفيش طلبات. مش إنجليزي، ومفيش لوج في الكونسول.
2. لو الـ query فشل: `ErrorState` وزر إعادة المحاولة، مش صفحة كأنها نجحت.
