# نفذ — لاندنج موبايل + تأخير النافيجيشن

- التاريخ: 2026-08-25
- النوع: full-task

الشات الجاي يقول «نفذ». نفّذ الاتنين تحت بس. متلمسش حاجة تانية.

---

## 1. اللاندنج على الموبايل

الصورة (`public/hero.jpeg`) قوية. المشكلة القصّ والغسيل على الموبايل، مش المحتوى.

الملف: `src/app/(customer)/_components/Hero.tsx`

الوضع الحالي:

- اللاب: النص في النص، غسيل خفيف على جنب النسخ، القزازة باينة (`object-[20%_40%]` + contrast/saturate).
- الموبايل: النص تحت (`items-end`)، غسيل كريمي تقيل يغطي جزء كبير (`from-brand-50 from-28%`)، القص `object-[28%_center]` ممكن يقصّ القزازة، العنوان `text-2xl`.

المطلوب (موبايل بس — الديسكتوب يفضل زي ما هو قدر الإمكان):

1. قص يركّز على القزازة (عدّل `object-position` على الشاشات الصغيرة، أو صورة موبايل منفصلة لو القص مش كفاية).
2. خفّف الغسيل الكريمي: جراديانت صغير ورا النص بس، مش طبقة تغطي تلت الشاشة.
3. عنوان أكبر على الموبايل (`text-3xl` أو `text-4xl`) وCTA بعرض أوضح.
4. اختياري لو لسه فاضي: الهيرو حوالي `80vh` / `85svh` بدل `h-svh` عشان سطر من السيكشن اللي بعده يبان.

متغيّرش نصوص ألاء، ومتعملش كروسل (باك لوج).

---

## 2. تأخير النافيجيشن — بما فيه الـ prefetch

التأخير من تلات حاجات مع بعض: مفيش إشارة تحميل، كل راوت ديناميك بسبب السيشن، وبعد الرسم TanStack بيجيب الداتا من جديد من العميل.

### أ) Prefetch + hydrate — مش باك لوج، اتنفذ دلوقت

كان مؤجّل في `docs/backlog.md`. اتنفذ دلوقت لأنه جزء من الإحساس بالسرعة.

النمط:

- في الـ Server Component بتاع الصفحة: `QueryClient` → `prefetchQuery` → `dehydrate` → `HydrationBoundary`.
- نفس `queryKey` ونفس `get*` اللي الـ `use*` بتستخدمهم. متستبدلش الكاش ولا الـ invalidation.

الصفحات:

| الصفحة | المفاتيح | الدوال |
|---|---|---|
| `/` | `latestProductsQueryKey`، `featuredProductsQueryKey`، `homeTestimonialsQueryKey` | `getLatestProducts`، `getFeaturedProducts`، `getHomeTestimonials` |
| `/products` | `productsQueryKey` (نفس بارامز الكتالوج الافتراضية) + التصنيفات لو `useCategories` شغالة هناك | `getProducts`، و`getCategories` لو مستخدمة |
| `/products/[slug]` | `productQueryKey({ slug })` + ريفيوهات المنتج لو الصفحة بتطلبها من أول رسم | `getProduct`، و`getProductReviews` لو الـ hook بيشتغل مع أول رسم |

الثوابت جاهزة: `HOME_LATEST_PAGE_SIZE` / `HOME_FEATURED_PAGE_SIZE` / `HOME_TESTIMONIALS_PAGE_SIZE` / `PRODUCTS_PAGE_SIZE`.

`HydrationBoundary` جوه `QueryClientProvider` (موجود في `src/app/Providers.tsx`). الصفحة تقدر تلف المحتوى بـ `HydrationBoundary` من غير ما تكسّر الـ Providers.

ملاحظة على `get*`: دلوقت بتستخدم `createClient` من `src/lib/supabase/client.ts` (browser). قراءة الكتالوج عامة (anon + RLS) ومش محتاجة كوكيز. لو الـ prefetch من الـ RSC وقع، حوّل استدعاءات الـ prefetch دي على `createClient` من `src/lib/supabase/server.ts` — من غير ما تغيّر شكل الـ `use*`.

متعملش prefetch لأوردرات العميل أو الأدمن في الجولة دي (محتاجة سيشن).

### ب) إشارة تحميل أثناء التنقل

مفيش `loading.tsx`. ضيف `src/app/(customer)/loading.tsx` (سكيلتون بسيط، مش سبينر عشوائي) عشان الانتقال ميتحسّش تجميد. الـ layout (نافبار/فوتر) يفضل ظاهر.

اختياري فوق ده: شريط رفيع أعلى الصفحة (`useLinkStatus` في Next 16، أو مكوّن خفيف بنفس الفكرة). مش بديل للـ prefetch.

### ج) منطقة Vercel

لو الدالة بتشتغل بعيد عن مصر، حط `preferredRegion` أقرب (`fra1` أو `dub1`) على مستوى التطبيق/الراوتات العامة. ده RTT، مش بديل للـ prefetch.

### د) Link prefetch

`next/link` أصلًا بيعمل prefetch للينكات الظاهرة. راجع لينكات النافبار والهيرو وCTA السلة إنها `Link` مش `router.push` من غير سبب. متقفلش الـ prefetch.

---

## تحقق بعد التنفيذ

- موبايل `/`: القزازة باينة، النص مقروء، مفيش طبقة كريمية ماسحة الصورة.
- أول دخول `/` و`/products` وصفحة منتج: الداتا تظهر من غير ووترفول العميل (Network: مفيش طلب كتالوج تاني فوري بعد الـ hydrate لو الكاش اتملّى).
- تنقل بين صفحات العميل: سكيلتون أو شريط يظهر، وبعدين المحتوى. السكرول لسه من فوق (`ScrollToTop` موجود، متكسرهوش).
