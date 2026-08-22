# شرح التاسك — 13.2

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

Alaa كانت بتشوف عدّاد المنتجات في `/admin/products` من غير ما تعرف الأسماء والفئات والأسعار ولا تقدر تدخل تعدّل. التاسك كان الجدول نفسه: اسم، فئة، سعر، حالة، زر تعديل، وزر إضافة منتج.

اتشحن عرض الموبايل ككروت، والجدول من `lg` فوق — نفس قرار قائمة الطلبات. مفيش عمود كمية: المخزون برّه الـ MVP.

## الصفحات والملفات

- `/admin/products` (`src/app/(admin)/admin/(protected)/products/page.tsx`) — صفحة منتجات اللوحة. Loading و error و empty زي 13.1، ومعاهم الجدول/الكروت وزر «إضافة منتج».
- `src/features/products/components/admin/AdminProductsPage.tsx` — بيركب الهيدر والعدّاد والحالات والليستة.
- `src/features/products/components/admin/AdminProductsList.tsx` — كروت تحت `lg`، جدول من `lg`.
- `src/features/products/components/admin/AdminProductCard.tsx` — كارت منتج واحد (اسم، حالة، فئة، سعر، تعديل).
- `src/features/products/components/admin/AdminProductsTable.tsx` — أعمدة الاسم / الفئة / السعر / الحالة / تعديل.
- `src/features/products/components/admin/AdminAddProductLink.tsx` — زر «إضافة منتج» → `/admin/products/new`.
- `src/features/products/components/admin/AdminProductEditLink.tsx` — زر «تعديل» → `/admin/products/[id]/edit`.
- `src/features/products/components/admin/AdminProductStatusBadge.tsx` — شارة «ظاهر» / «غير ظاهر».
- `src/features/products/components/admin/AdminProductField.tsx` — صف تسمية + قيمة جوه الكارت.

الاستعلام لسه `getAdminProducts` من 13.1. مفيش RPC جديد.

## التدفق

1. الأدمن فاتح `/admin/products` (الـ layout أصلاً بيمنع غير الأدمن).
2. الصفحة بتطلب نفس ليستة 13.1: كل المنتجات، ظاهر ومخفي، أحدث أولاً.
3. تحميل: هيكل كروت على الموبايل وجدول على الشاشات الكبيرة.
4. خطأ: إعادة محاولة. فاضي: empty + زر إضافة.
5. في منتجات: عدّاد (وكام واحد مش ظاهر) + كروت أو جدول. السعر من أرخص variant، و`PriceTag` بيظهر الخصم لو `currentPrice < originalPrice`.
6. «إضافة منتج» و«تعديل» روابط لصفحات الفورم. الصفحات دي تاسك **13.4** و**13.8** — دلوقتي هتفتح 404، وده متوقع.

## قرارات مهمة وليه

- كروت + جدول، مش سكرول أفقي بس على الموبايل. الجدول عريض (اسم + فئة + سعر + حالة + زر) وهيتكسر على الموبايل لو اتعرض زي الديسكتوب — نفس سبب 12.2.
- الحالة من `PRODUCT_STATUS_LABELS` (`ظاهر` / `غير ظاهر`)، مش active/inactive بالإنجليزي في الـ UI. القيم الإنجليزية تعيش في `constants.ts` بس.
- مفيش صورة في الصف: `AdminProduct` من 13.1 مالوش `imageUrl`، والتاسك محدد الأعمدة من غير صورة. إضافة صورة كانت هتحتاج تغيير في الـ RPC.
- مفيش كمية متاحة. المخزون مش في الـ MVP؛ لو العمود حسّ إنه ناقص، ده الـ backlog بيطرق الباب.

## تحقق بنفسك

1. ادخل لوحة التحكم وافتح `/admin/products`. المفروض تشوف المنتجات (دلوقتي 8) بالاسم والفئة والسعر والحالة.
2. صغّر الشاشة تحت `lg`: كروت. كبّرها: جدول.
3. لو في منتج `inactive`، يفضل ظاهر هنا بشارة «غير ظاهر»، والمتجر يخفيه.
4. «إضافة منتج» و«تعديل» هيروحوا لصفحات لسه مش موجودة (404) لحد 13.4 و13.8. لو حصلت 404 هنا، ده مش باج في 13.2.
