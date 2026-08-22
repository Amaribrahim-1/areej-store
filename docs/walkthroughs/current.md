# شرح التاسك — 13.7

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

الفورم كان بيرفع الصورة وبس. المنتج نفسه ما كانش بيتسجل، فالمقاسات والأسعار والاسم يضيعوا بعد الرفع.

اتشحن: حفظ المنتج بيرفع الصورة لو لسه File، بعدين بيكتب المنتج وكل المقاسات في معاملة واحدة. النجاح توست وتحويل لقائمة المنتجات. لو الكتابة فشلت بعد الرفع، الملف بيتمسح.

## الصفحات والملفات

- `/admin/products/new` (`src/app/(admin)/admin/(protected)/products/new/page.tsx`) — صفحة إضافة منتج. الحفظ بقى إنشاء صف حقيقي، مش رفع صورة لوحده.
- `/admin/products` — رجوع علاء بعد النجاح. المنتج الجديد يظهر في القائمة (ظاهر أو مخفي حسب الحالة).
- `src/features/products/components/admin/AdminNewProductPage.tsx` — بيربط الفورم بالإنشاء، شريط تقدم الرفع، وبعد النجاح `replace` للقائمة.
- `src/features/products/api/admin/createProduct.ts` — إعادة التحقق + تنظيف النص + استدعاء الـ RPC.
- `src/features/products/api/admin/useCreateProduct.ts` — الـ mutation: رفع إن لزم، إنشاء، توست، وإبطال كاش الكتالوج والأدمن والـ KPI.
- `src/features/products/api/queryKeys.ts` — مفاتيح الكويري المشتركة (13.1 كانت مستنية اللحظة دي).
- `supabase/migrations/20260822145230_create_admin_product.sql` — `create_admin_product`: منتج + مقاسات مع بعض. أدمن فقط.

## عقد الاستخدام (English)

### `createProduct` — `src/features/products/api/admin/createProduct.ts`

- **Params:** `{ name, slug, description, category, status, image, variants }`. `image` must be a public URL in the `product-images` bucket (not a `File`). `variants` min 1: `{ volumeLabel: string | null, originalPrice, currentPrice }`.
- **Returns:** `{ id: string, slug: string }`. Never empty; throws instead.
- **Errors:** throws `Error` with `message` of `INVALID_PRODUCT_PAYLOAD` | `PRODUCT_SLUG_TAKEN` | `CATEGORY_NOT_FOUND` | `NOT_ADMIN` | `PRODUCT_CREATE_NO_ID`.
- **Call:**

```ts
const product = await createProduct({
  name: "عود كمبودي",
  slug: "oud-cambodi",
  description: "خليط دافئ مناسب للمساء.",
  category: "Perfumes",
  status: "active",
  image: uploaded.publicUrl,
  variants: [{ volumeLabel: "50ml", originalPrice: 250, currentPrice: 200 }],
})
```

## التدفق

1. علاء تملأ الفورم وتضغط حفظ. الزرار يتقفل طول ما العملية شغالة.
2. لو الصورة لسه `File`: ضغط (اتعمل عند الاختيار) ثم رفع، شريط «جاري رفع الصورة».
3. `createProduct` يعيد `productSchema`، ينظّف الاسم والوصف، ويرفض رابط صورة مش من باكت `product-images`.
4. `create_admin_product` يكتب صف المنتج وكل صفوف المقاسات. لو المقاسات فاضية أو الأدمن مش أدمن، المعاملة تتراجع.
5. نجاح: توست «تم إضافة المنتج»، تحويل لـ `/admin/products`. كاش القائمة والكتالوج والـ Featured/Latest وعدد المنتجات في الداشبورد يتحدث.
6. رابط مستخدم قبل كده: توست «رابط المنتج ده مستخدم قبل كده»، الفورم تفضل مفتوحة.
7. فشل بعد رفع الصورة: الملف يتمسح من التخزين، علاء تقدر تحفظ تاني.

## قرارات مهمة وليه

- **منتج + مقاسات في RPC واحد.** مفيش سياسة DELETE على `products` (حذف ناعم بس). لو المنتج اتحط والمقاس فشل، الصف يتيم ومش هيظهر لا في الكتالوج ولا في قائمة الأدمن (الاتنين INNER JOIN على المقاسات).
- **الصورة URL من باكتنا بس.** `image_url` بيتخزن ويتعرض. رابط برّه الباكت يعدّي `next/image` أو يخزن محتوى مش بتاعنا.
- **`replace` مش `push`.** بعد النجاح، زرار الرجوع في المتصفح ما يرجعش لفورم تقدر تتبعت تاني بنفس البيانات.

## تحقق بنفسك

1. `/admin/products/new` — املِي الاسم والوصف والفئة وصورة ومقاس واحد على الأقل. حفظ. المفروض توست «تم إضافة المنتج» والتحول لـ `/admin/products` والصف يظهر.
2. نفس الرابط (slug) تاني. المفروض توست إن الرابط مستخدم، ومفيش صف مكرر.
3. علامة «ظاهر في المتجر» مش متعلّمة. الصف يظهر في قائمة الأدمن كـ غير ظاهر، ومش في كتالوج المتجر.
4. مقاسين بأسعار مختلفة. الاتنين يتسجلوا، وسعر البطاقة هو الأرخص زي باقي القائمة.
