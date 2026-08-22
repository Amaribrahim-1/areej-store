# شرح التاسك — 13.6

- التاريخ: 2026-08-22
- النوع: full-task

## المشكلة والحل

علاء هترفع صور منتجات من الموبايل أو اللابتوب. المساحة على Supabase مجانية بحد 1 جيجا، والصورة الأصلية ممكن تبقى 4 أو 8 ميجا. من غير ضغط، الكتالوج يملى التخزين بسرعة.

اتشحن: اختيار الصورة بيضغطّها ويصغّرها لـ WebP قبل ما تتحط في الفورم. حفظ المنتج بيرفع الملف على باكت `product-images`. لو الرفع نجح وبعدين الكتابة فشلت، الملف بيتمسح عشان ميفضلش يتيم. المنتج نفسه لسه مش بيتسجل (ده 13.7).

## الصفحات والملفات

- `/admin/products/new` (`src/app/(admin)/admin/(protected)/products/new/page.tsx`) — صفحة إضافة منتج. اختيار الصورة بقى فيه تجهيز ورفع، مش مجرد معاينة محلية.
- `src/features/products/components/admin/AdminNewProductPage.tsx` — بيربط الحفظ برفع الصورة، وبيمسح الملف لو علاء لغت أو اختارت صورة تانية بعد رفع ناجح.
- `src/features/products/components/admin/AdminProductForm.tsx` — الفورم المشترك. أثناء التجهيز أو الرفع الزرار يتقفل ويظهر التقدم.
- `src/features/products/components/admin/AdminProductImageField.tsx` — حقل الصورة: ضغط عند الاختيار، شريط تقدم، غلط تحت الحقل، معاينة بالحجم بعد الضغط.
- `src/features/products/lib/compressProductImage.ts` — التحقق من النوع والحجم، تصغير لأطول ضلع 1200px، تحويل WebP تحت سقف الـ 1MB بتاع الباكت.
- `src/features/products/api/admin/uploadProductImage.ts` — رفع الملف بعد التجهيز.
- `src/features/products/api/admin/deleteProductImage.ts` — مسح كائن من الباكت.
- `src/features/products/api/admin/withUploadedProductImage.ts` — ارفع الأول، نفّذ الخطوة اللي بعده، امسح الملف لو الخطوة دي رمت خطأ.

## عقد الاستخدام (English)

### `uploadProductImage` — `src/features/products/api/admin/uploadProductImage.ts`

- **Params:** `file: File`. Optional `{ onProgress?: (progress) => void }` where `progress` is `{ phase: "compressing" | "uploading", percent: number | null }`. `percent` is `null` during upload (no byte events from Storage).
- **Returns:** `{ path: string, publicUrl: string }`. Path shape: `products/{uuid}.webp`. Never empty; throws instead.
- **Errors:** throws `Error` with `message` of `IMAGE_EMPTY` | `IMAGE_INVALID_TYPE` | `IMAGE_TOO_LARGE` | `IMAGE_COMPRESS_FAILED` | `IMAGE_OUTPUT_TOO_LARGE` | `IMAGE_UPLOAD_FAILED`.
- **Call:**

```ts
const uploaded = await uploadProductImage(file, {
  onProgress: (progress) => console.log(progress.phase, progress.percent),
})
```

### `deleteProductImage` — `src/features/products/api/admin/deleteProductImage.ts`

- **Params:** `path: string` (storage object path, not the public URL).
- **Returns:** `void`.
- **Errors:** throws `IMAGE_DELETE_FAILED`.
- **Call:**

```ts
await deleteProductImage(uploaded.path)
```

### `withUploadedProductImage` — `src/features/products/api/admin/withUploadedProductImage.ts`

- **Params:** `file: File`, `run: (uploaded) => Promise<T>`, optional same `onProgress` as upload.
- **Returns:** whatever `run` returns.
- **Errors:** rethrows `run`'s error after attempting `deleteProductImage`. Upload errors throw before `run`. A failed delete does not replace the original error.
- **Call:**

```ts
const product = await withUploadedProductImage(file, async (uploaded) => {
  return createProduct({ ...input, imageUrl: uploaded.publicUrl })
})
```

## التدفق

1. علاء تختار صورة (JPG / PNG / WebP / GIF، حد 10 ميجا قبل الضغط). النوع أو الحجم الغلط يظهر تحت الحقل من غير رفع.
2. المتصفح يفك الصورة، يصغّرها لو أطول ضلع أكبر من 1200، ويحوّلها WebP. شريط «جاري تجهيز الصورة». المعاينة بتظهر الملف المضغوط وحجمه.
3. «حفظ المنتج» بيرفع على `product-images` باسم UUID، مش اسم الملف الأصلي. الشريط يتغير لـ «جاري رفع الصورة».
4. النجاح: توست «تم رفع الصورة»، والحقل يستبدل الـ File بالرابط العام. مفيش صف منتج جديد في القائمة — ده 13.7.
5. إلغاء، أو اختيار صورة تانية بعد رفع ناجح: الكائن اللي اترفع في الجلسة دي بيتمسح.
6. `withUploadedProductImage`: لو الخطوة اللي بعد الرفع رمت (إنشاء المنتج في 13.7)، الملف بيتمسح. لو الرفع نفسه فشل، مفيش حاجة تتمسح لأنه الملف ما وصلش.

## قرارات مهمة وليه

- **المسار `products/{uuid}.webp` مش اسم الملف.** اسم أصلي من الجهاز ممكن يبقى فيه `/` أو عربي أو يتخبط مع ملف تاني. الـ UUID يتكتب مرة وما يتعدّلش، فـ `Cache-Control` سنة كاملة آمن.
- **سقف الإدخال 10 ميجا، وسقف الباكت 1 ميجا.** العشرة تمنع صورة ضخمة توقف التاب قبل ما نفكّها. الواحد هو أمان الباكت من 1.4 لو الضغط اتعدّى.
- **الضغط في المتصفح، مش في سيرفر.** مفيش service role، ومفيش باكت وسيط. نفس جلسة الأدمن اللي RLS بتسمح لها تكتب.
- **رفع الأول، بعدين الكتابة، ولو الكتابة فشلت نمسح الملف.** العكس (صف المنتج الأول) كان هيخلي `image_url` إجباري من غير ملف، أو يحط URL فاضي. يتيم في التخزين أرخص من صف مكسور.
- **صورة واحدة للمنتج.** صور لكل مقاس مؤجلة في الـ backlog. الفورم والحقل مصممين لكائن واحد.

## تحقق بنفسك

1. `/admin/products/new` — اختاري JPG أو PNG. المفروض المعاينة تظهر وكتابة الحجم بعد الضغط، من غير ما الملف يوصل Storage لسه.
2. ملف PDF أو صورة أكبر من 10 ميجا. الغلط تحت الحقل، ومفيش رفع.
3. املِي باقي الفورم واضغطي حفظ. في Supabase Storage → `product-images` → `products/` المفروض ملف `.webp` جديد. القائمة `/admin/products` مش هيزيد فيها صف.
4. بعد رفع ناجح، «إلغاء». الملف اللي لسه اترفع المفروض يختفي من الباكت.
5. ارفعي تاني، بعدين اختاري صورة تانية. الملف الأول يتمسح، والتانية تستنى الحفظ الجاي.
