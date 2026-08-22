# شرح التاسك — 13.8

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

علاء تقدر تضيف منتج، ومش تقدر تعدّل اللي اتحفظ. المقاسات القديمة لو اتمسحت وفي طلبات عليها، تاريخ الطلب بيتكسّر. لو بدّلت الصورة من غير ما تمسح القديمة، التخزين بيتملّا على الباكت المجاني.

اتشحن: صفحة تعديل بنفس فورم الإضافة، متعبّية من المنتج الحالي. الحفظ بيحدّث الصف والمقاسات في معاملة واحدة. المقاس اللي ظهر في طلبات ما يتمسحش. تبديل الصورة بيمسح الملف القديم بعد نجاح الكتابة.

## الصفحات والملفات

- `/admin/products/[id]/edit` (`src/app/(admin)/admin/(protected)/products/[id]/edit/page.tsx`) — تعديل منتج موجود. الاسم والوصف والفئة والحالة والصورة والمقاسات متعبّيين. حفظ يرجع لقائمة المنتجات.
- `/admin/products` — زرار «تعديل» كان واصل للرابط ده من 13.2؛ الصفحة بقت شغالة.
- `src/features/products/components/admin/AdminEditProductPage.tsx` — تحميل المنتج، حالات التحميل/الغلط/مش موجود، وربط الفورم بالحفظ.
- `src/features/products/api/admin/getAdminProduct.ts` — منتج واحد للأدمن، شامل المخفي.
- `src/features/products/api/admin/updateProduct.ts` — إعادة التحقق + تنظيف النص + استدعاء الـ RPC.
- `src/features/products/api/admin/useUpdateProduct.ts` — الـ mutation: رفع صورة جديدة إن لزم، تحديث، مسح الصورة القديمة، توست، وإبطال الكاش.
- `src/features/products/api/admin/withReplacedProductImage.ts` — رفع الجديد، كتابة الصف، بعدين مسح القديم. لو الكتابة فشلت، الجديد يتمسح والقديم يفضل.
- `supabase/migrations/20260822181600_update_admin_product.sql` — `get_admin_product` و `update_admin_product`. أدمن فقط.

## عقد الاستخدام (English)

### `getAdminProduct` — `src/features/products/api/admin/getAdminProduct.ts`

- **Params:** `productId: string` (uuid). Malformed / blank → no RPC call.
- **Returns:** `{ id, name, slug, description, category, categoryLabel, status, imageUrl, variants }` including inactive products. Missing id → `null`. `variants` ordered by `sort_order`; each `{ id, volumeLabel, originalPrice, currentPrice, sortOrder }`.
- **Errors:** throws `Error` with `message` of `NOT_ADMIN`. Throws if the row has zero variants.
- **Call:**

```ts
const product = await getAdminProduct(productId)
```

### `updateProduct` — `src/features/products/api/admin/updateProduct.ts`

- **Params:** `(productId, { name, slug, description, category, status, image, variants })`. `image` must be a public URL in the `product-images` bucket (not a `File`). Each variant: `{ id?: uuid, volumeLabel, originalPrice, currentPrice }`. `id` present = update that row; omitted = insert. Rows on the product whose ids are missing from the list are deleted when unused by `order_items`.
- **Returns:** `{ id, slug, imageUrl }`. Never empty; throws instead.
- **Errors:** throws `Error` with `message` of `INVALID_PRODUCT_PAYLOAD` | `PRODUCT_SLUG_TAKEN` | `CATEGORY_NOT_FOUND` | `NOT_ADMIN` | `PRODUCT_NOT_FOUND` | `VARIANT_IN_USE` | `VARIANT_NOT_FOUND` | `PRODUCT_UPDATE_NO_ID`.
- **Call:**

```ts
const product = await updateProduct(productId, {
  name: "عود كمبودي",
  slug: "oud-cambodi",
  description: "خليط دافئ مناسب للمساء.",
  category: "Perfumes",
  status: "active",
  image: uploaded.publicUrl,
  variants: [
    { id: existingVariantId, volumeLabel: "50ml", originalPrice: 250, currentPrice: 200 },
    { volumeLabel: "100ml", originalPrice: 400, currentPrice: 400 },
  ],
})
```

## التدفق

1. من قائمة المنتجات، «تعديل» يفتح `/admin/products/{id}/edit`.
2. `getAdminProduct` يجيب المنتج حتى لو مخفي. الفورم تتعبّى. تغيير الاسم مش بيغيّر الرابط لوحده.
3. حفظ: لو الصورة لسه `File`، تترفع أولاً. `updateProduct` يعيد `productSchema` وينظّف الاسم والوصف واسم المقاس.
4. `update_admin_product` يحدّث صف المنتج. المقاسات اللي ليها `id` تتحدث؛ اللي من غير `id` تتضاف؛ اللي اتشالت من القائمة تتمسح لو مفيش `order_items` عليها.
5. نجاح: توست «تم تحديث المنتج»، تحويل لـ `/admin/products`. كاش القائمة والكتالوج وصفحة المنتج وHome يتحدث.
6. محاولة مسح مقاس استخدم في طلب: المعاملة تتراجع، توست «مفيش حذف لمقاس استخدم في طلبات سابقة»، الفورم تفضل مفتوحة.
7. صورة جديدة بعد نجاح الكتابة: الملف القديم يتمسح. لو الكتابة فشلت، الملف الجديد يتمسح والقديم يفضل.

## قرارات مهمة وليه

- **قائمة المقاسات الكاملة على السيرفر، مش فرق من العميل.** العميل يقدر يبعت حذف غلط. السيرفر يقارن بالموجود ويمنع المسح لو في طلبات (`ON DELETE RESTRICT` لوحده كان هيطلع خطأ أجنبي عام زي الفئة الغلط).
- **المعاملة كاملة تفشل لو مقاس مستخدم اتشال.** حذف جزئي يخلّي علاء تفتكر المقاس اتمسح وهو لسه موجود.
- **مسح الصورة القديمة بعد نجاح الكتابة بس.** لو عكسنا الترتيب، منتج محفوظ بصورة اتمسحت.

## تحقق بنفسك

1. `/admin/products` → تعديل منتج. الفورم لازم تتعبّى بالاسم والمقاسات والصورة الحالية.
2. غيّر السعر أو الوصف. حفظ. توست «تم تحديث المنتج» والرجوع للقائمة. افتح تاني وتأكد إن التغيير اتسجل.
3. أضف مقاس جديد في نفس الفورم. المفروض يظهر بعد الحفظ. امسح مقاس **ما ظهرش** في أي طلب. المفروض يتمسح.
4. حاول تمسح مقاس اتطلب قبل كده. المفروض توست إن المسح ممنوع، والمقاس يفضل في الداتابيز.
5. بدّل الصورة. بعد النجاح الصورة الجديدة تظهر، والقديمة مش المفروض تفضل في Storage.
6. منتج مخفي (`inactive`) يتفتح ويتعدل. الكتالوج يفضل ما يعرضوش لو الحالة لسه مخفية.
