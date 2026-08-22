# شرح التاسك — 13.4 + 13.13

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

علاء هتضيف المنتجات من الأدمن (الداتا الحالية سيد). الفورم لازم فيه اسم، رابط، وصف، فئة، حالة، صورة بمعاينة، ومقاس واحد على الأقل. والفئات الأربعة الثابتة في الكود كانت هتمنع أي قسم جديد من غير تعديل كود.

اتشحن: فورم إضافة على `/admin/products/new`؛ slug بيتولد من الاسم وقابل للتعديل؛ جدول `categories` علاء تضيف منه فئة وهي بتضيف منتج؛ معاينة للصورة بعد الاختيار؛ Placeholder المقاس بالعربي.

## الصفحات والملفات

- `/admin/products/new` (`src/app/(admin)/admin/(protected)/products/new/page.tsx`) — صفحة إضافة منتج.
- `src/features/products/components/admin/AdminNewProductPage.tsx` — العنوان + الفورم في نص الشاشة.
- `src/features/products/components/admin/AdminProductForm.tsx` — الفورم المشترك (إضافة/تعديل لاحقًا): اسم، رابط، وصف، فئة، حالة، صورة، مقاس واحد.
- `src/features/products/components/admin/AdminProductCategoryField.tsx` — اختيار فئة من الجدول + «إضافة فئة جديدة».
- `src/features/products/components/admin/AdminProductImageField.tsx` — اختيار صورة + معاينة (ملف جديد أو رابط موجود للتعديل).
- `src/features/products/components/admin/AdminProductVariantRow.tsx` — صف مقاس واحد (إضافة/حذف صفوف = 13.5).
- `src/features/products/api/getCategories.ts` — قراءة الفئات.
- `src/features/products/api/admin/createCategory.ts` — إضافة فئة (أدمن فقط).
- `src/features/products/lib/slugifyLabel.ts` — تحويل الاسم/الليبل لرابط.
- `supabase/migrations/20260822131016_admin_managed_categories.sql` — جدول الفئات + FK بدل الـ check الثابت.
- كتالوج الأدمن والمتجر بيقرأوا `categoryLabel` من الداتابيز.

## عقد الاستخدام (English)

### `getCategories` — `src/features/products/api/getCategories.ts`

- **Params:** none
- **Returns:** `{ slug, label, sortOrder }[]` ordered by `sort_order`. Empty table → `[]`.
- **Errors:** throws on Supabase error.
- **Call:**

```ts
const categories = await getCategories()
```

### `createCategory` — `src/features/products/api/admin/createCategory.ts`

- **Params:** `{ label, slug }` (re-validated with `categorySchema`; label sanitized)
- **Returns:** `{ slug, label, sortOrder }` of the inserted row
- **Errors:** throws `INVALID_CATEGORY_PAYLOAD`; `CATEGORY_ALREADY_EXISTS` on unique slug/label (`23505`); other Supabase errors throw. Non-admin insert fails via RLS.
- **Call:**

```ts
const row = await createCategory({ label: "بخور", slug: "bakhoor" })
```

## التدفق

1. الأدمن يكتب اسم المنتج → الـ slug بيتولد. لو عدّل الرابط بإيده، التوليد بيتوقف.
2. يختار فئة من القائمة (من جدول `categories`). أو «إضافة فئة جديدة» → اسم عربي + slug → `createCategory` → الفئة بتظهر في السيلكت وفي فلتر الكتالوج.
3. يختار صورة → معاينة + اسم الملف. رابط المعاينة بيتبني في `useEffect` ويتلغى عند التغيير/المغادرة (عشان Strict Mode ميفسدش الـ blob).
4. الحفظ لسه مش بيكتب المنتج (13.7). الفئة الجديدة بتتحفظ فورًا لأنها صف منفصل.

## قرارات مهمة وليه

- **الـ slug في الفورم، مش مستخبي لحد 13.7.** كل منتج محتاج رابط `/products/...`. التوليد من الاسم بيوفر الكتابة؛ التعديل لو حابت URL لاتيني جنب اسم عربي.
- **جدول `categories` مش CRUD كامل.** إضافة من فورم المنتج تكفي. مفيش حذف: `ON DELETE RESTRICT` عشان منتجات قديمة متتكسرش.
- **الليبل العربي من الداتابيز.** خريطة ثابتة في الكود كانت هتكسر أي فئة جديدة على الكارت والفلتر.
- **معاينة الملف بـ `next/image` + `unoptimized`.** الـ blob مش على Storage ومش بيتأمّز؛ `createObjectURL` مش ينفع جوه `useMemo` لأن التنضيف في Strict Mode بيلغي الرابط وهو لسه مستخدم.

## تحقق بنفسك

1. `/admin/products/new` — اكتب اسم عربي. الرابط تحت الحقل لازم يتحدث. عدّل الرابط بإيدك، غيّر الاسم تاني: الرابط يفضل اللي كتبتيه.
2. اختر صورة: لازم تظهر معاينة + اسم الملف.
3. «إضافة فئة جديدة» (مثلاً بخور). المفروض toast نجاح، والفئة تظهر في السيلكت. على `/products` الفلتر لازم يعرضها.
4. Placeholder المقاس: `50ml — متوسط — كبير`.
5. حفظ المنتج لسه مش بيضيف صف في القائمة (13.7). إضافة مقاس تاني: 13.5.
