# شرح التاسك — 15.11

- التاريخ: 2026-08-26
- النوع: full-task

## المشكلة والحل

الـ `README.md` كان قالب Create Next App، والشير على المنصات كان بيظهر من غير صورة. السبب في الـ OG مش التاجز: التاجز كانت صح وبتشير لـ `https://areej-store-kappa.vercel.app/og-image.png`، لكن الملف كان PNG بحجم ~1.7 MB. واتساب وسكرابرز كتير بيسكتوا الصورة لو تعدّت ~300 KB.

اتكتب README ورايت أب من تاريخ المشروع، اتحطت سكاشوتات البرودكشن، واتضغطت صورة الشير لـ JPEG 1200×630 (~73 KB)، واتركب Vercel Analytics في الـ layout.

## الصفحات والملفات

- [https://areej-store-kappa.vercel.app/](https://areej-store-kappa.vercel.app/) — المتجر اللايف.
- `README.md` — واجهة GitHub + السكاشوتات.
- `docs/portfolio-writeup.md` — نصوص CV / LinkedIn.
- `docs/screenshots/home.png` — الهوم.
- `docs/screenshots/catalog.png` — الكاتالوج.
- `docs/screenshots/product.png` — تفاصيل منتج.
- `docs/screenshots/admin-orders.png` — قائمة طلبات الأدمن.
- `docs/screenshots/admin-order-details.png` — تفاصيل طلب (حالة + عنوان + أسطر).
- `public/og-image.jpg` — صورة الشير (اتبدّل الـ PNG الكبير).
- `src/lib/seo.ts` — `OG_IMAGE` بقى 1200×630 JPEG.
- `src/app/layout.tsx` — `<Analytics />` من `@vercel/analytics/next`.
- `.env.example` — `NEXT_PUBLIC_SITE_URL` بقى الدومين اللايف.

## التدفق

1. مراجع GitHub يفتح README ويشوف اللايف والسكاشوتات.
2. شير اللينك → السكرابر يقرأ `og:image` → يجيب `og-image.jpg` الصغيرة.
3. بعد الدبلوي، Analytics بيبعت page views على داشبورد Vercel (Enable من الداشبورد اتعمل؛ الكود بيركّب السكربت).
4. كاش واتساب/فيسبوك ممكن يفضل على الصورة القديمة ساعات — إعادة الشير أو Facebook Sharing Debugger بعد الدبلوي.

## قرارات مهمة وليه

- سكاشوت `admin-order-details` اتضافت: قائمة الطلبات بتوري الجدول، التفاصيل بتوري الـ snapshot والحالة والأسطر — ده شغل الأدمن الفعلي.
- صورة الـ OG اتغير اسمها لـ `.jpg` عمداً عشان كاش السكرابرز مايفضلش معلّق على الـ PNG القديم.
- Analytics في الـ root layout عشان كل الصفحات (ستورفرونت وأدمن) تتعدّ، من غير env keys إضافية.

## تحقق بنفسك

- بعد الدبلوي: افتح اللينك في واتساب/تليجرام. لازم تظهر كارت فيها بنر أريج مش أيقونة فاضية.
- في Vercel → المشروع → Analytics: بعد زيارة أو اتنين المفروض تظهر page views (ممكن تتأخر شوية).
