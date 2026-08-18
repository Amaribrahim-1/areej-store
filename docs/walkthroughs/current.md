# شرح التاسك — 11.4 و 11.5

- التاريخ: 2026-08-18
- النوع: full-task

## المشكلة والحل

المشكلة: لوحة التحكم كانت عنوان بس. علاء محتاجة تشوف حجم المتجر من غير ما تفتح جداول الطلبات والمنتجات.

الحل: رقم واحد يتجمّع في Postgres، والكروت بتعرضه. المتصفح مش بيجيب كل الصفوف ويجمع.

## الصفحات والملفات

- `/admin` (`src/app/(admin)/admin/(protected)/page.tsx`) — الداشبورد. عنوان اللوحة وثلاثة كروت KPI. الـ route رفيع؛ المحتوى من الفيتشِر.
- `src/features/admin-dashboard/components/AdminDashboardPage.tsx` — تحميل / خطأ / الكروت.
- `src/features/admin-dashboard/components/DashboardKpiCards.tsx` — الكروت الثلاثة.
- `src/features/admin-dashboard/components/DashboardKpiCard.tsx` — كارت واحد: عنوان، رقم، أيقونة.
- `src/features/admin-dashboard/api/getAdminDashboardKpis.ts` — الهيلبر اللي بينادي الـ RPC.
- `src/features/admin-dashboard/api/useAdminDashboardKpis.ts` — غلاف TanStack Query.
- `supabase/migrations/20260818101959_get_admin_dashboard_kpis.sql` — الدالة `get_admin_dashboard_kpis` + فهرس للطلبات قيد المراجعة.
- `supabase/migrations/20260818105328_kpi_total_sales_delivered_only.sql` — إجمالي المبيعات بقى طلبات `Delivered` بس (COD).

## عقد الاستخدام (English)

### `getAdminDashboardKpis` — `src/features/admin-dashboard/api/getAdminDashboardKpis.ts`

- **Params:** none
- **Returns:** `{ totalSales: number, pendingOrders: number, totalProducts: number }`
  - `totalSales`: sum of `orders.total` where status is `Delivered` (EGP, COD realized sales). Empty shop or no deliveries yet → `0`.
  - `pendingOrders`: count of orders with status `Pending` only.
  - `totalProducts`: count of all `products` rows, including `inactive`.
  - Always one object. Never `null`. Zeros are a valid empty shop.
- **Errors:** throws on PostgREST/network errors. Non-admin (including no session) → RPC raises `NOT_ADMIN` and the helper throws. Malformed/non-numeric row → throws.
- **Call:**

```ts
const kpis = await getAdminDashboardKpis()
```

## التدفق

1. علاء داخلة `/admin` (الحارس من 11.2 لسه شغّال).
2. الصفحة تطلب الأرقام مرة واحدة من `get_admin_dashboard_kpis`.
3. الدالة تتأكد `private.is_admin()`. لو لأ → `NOT_ADMIN`.
4. لو أدمن: Postgres يجمع الثلاثة ويرجع صف واحد.
5. الكروت تتعرض. صفر مش حالة فاضية — معناه مفيش مبيعات/طلبات لسه.
6. زائر أو كاستومر على `/admin` بيترفض من الحارس قبل ما يوصل للكروت. لو حد نادى الـ RPC من برّه، برضو `NOT_ADMIN`.

## قرارات مهمة وليه

- **تجميع في الداتابيز مش في JS:** لو جبنا كل الطلبات عشان نجمع `total`، القائمة هتكبر والرقم ممكن يطلع غلط على الكلاينت.
- **SECURITY INVOKER مش DEFINER:** الأدمن أصلًا يقدر يقرأ كل الطلبات والمنتجات من RLS. الدالة مش محتاجة تتجاوز RLS. و`anon` ملوش EXECUTE.
- **المبيعات = تم التوصيل بس:** الدفع عند الاستلام، فالفلوس مش في الإيد وأنا الطلب Pending أو Shipping. الكارت التاني بيبين الشغل المستني.
- **عدد المنتجات يشمل inactive:** علاء بتدير الكتالوج كامل، مش الواجهة بس.
- **كروت من غير Charts:** الجرافات مؤجلة في الباك لوج.

## تحقق بنفسك

1. أدمن: `/admin` → ثلاثة كروت بأرقام (مبيعات بالجنيه، قيد المراجعة، المنتجات).
2. الأرقام تطابق الداتابيز: مجموع `total` لحالة `Delivered`، عدد `Pending`، عدد كل المنتجات. لو كل الطلبات لسه قيد المراجعة، المبيعات صفر.
3. حالة صفر تظهر كأرقام صفر، مش empty state.
4. كاستومر على `/admin` لسه بيتودّى الهوم. اللوجين مش شايف الكروت.
