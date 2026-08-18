# شرح التاسك — 11.2

- التاريخ: 2026-08-18
- النوع: full-task

## المشكلة والحل

المشكلة: بعد لوجين الأدمن (11.1)، أي حد يقدر يكتب `/admin` في المتصفح ويشوف اللوحة. إخفاء اللينك مش حماية.

الحل: حارس على السيرفر. اللي مش أدمن مش بيوصل لصفحات اللوحة أصلًا.

## الصفحات والملفات

- `/admin` (`src/app/(admin)/admin/(protected)/page.tsx`) — نص مؤقت «صفحة المدير». اتنقلت جوه مجموعة `(protected)` عشان نفس الـ URL يعدّي على الحارس.
- `/admin/login` (`src/app/(admin)/admin/login/page.tsx`) — فورم دخول الأدمن. متغيّرتش. لازم تفضل **برّه** الحارس وإلا الزائر مش هيقدر يدخل.
- `src/features/auth/api/requireAdmin.ts` — هيلبر سيرفر: يقرأ الجلسة و`profiles.role`، يا أدمن يعدّي يا تحويل.
- `src/app/(admin)/admin/(protected)/layout.tsx` — بيستدعي الحارس مرة واحدة لكل صفحات اللوحة الجاية.
- `src/app/(admin)/admin/page.tsx` — اتمسح. مكانه بقى جوه `(protected)` عشان ميبقاش مسارين لنفس الـ URL.

## عقد الاستخدام (English)

### `requireAdmin` — `src/features/auth/api/requireAdmin.ts`

- **Params:** none. Uses session cookies and the `x-pathname` header.
- **Returns:** `AuthUser` (`{ id: string; email: string | null }`) when `profiles.role` is `'admin'`.
- **Does not return** when denied — redirects:
  - No session → `/admin/login?next=<sanitized admin path>`
  - Logged in but not admin → `/`
- **Errors:** Throws if `getCurrentUser` or the `profiles` query fails for a reason other than a missing session.
- **Call:**

```ts
const admin = await requireAdmin();
```

Do not call this on `/admin/login`.

## التدفق

1. حد بيكتب `/admin`.
2. `src/proxy.ts` يجدّد الجلسة ويحط `x-pathname`.
3. `(protected)/layout.tsx` يستنى `requireAdmin()`.
4. زائر → `/admin/login?next=...`. كاستومر مسجّل مش أدمن → `/`. أدمن → الصفحة تترسم.
5. الغلط في قراءة `profiles` → `throw` (مش تحويل صامت).

`loginAdmin` لسه بيفحص وقت الفورم. ده طبقة تانية، مش بديل للحارس.

## قرارات مهمة وليه

- **Layout مش الـ proxy:** الـ proxy عندنا بيجدّد الجلسة وبس. حماية الكاستومر أصلًا بنفس شكل الـ layout. لو الـ role اتحط في الـ proxy، كل صفحات الموقع هتدفع الثمن.
- **منعتمدش على `loginAdmin` لوحده:** دي بوابة دخول. الحارس بوابة كل طلب. الكاستومر مايعدّيش من فورم الأدمن، بس يقدر يكتب العنوان.
- **كاستومر → `/` مش صفحة اللوجين:** معاه جلسة تسوق. مش بنعمل له sign out.
- **كويري وقع → throw:** عطل الشبكة مش معناه «انت مش أدمن».

## تحقق بنفسك

1. برايفت ويندو: `/admin` → لوجين الأدمن، مش «صفحة المدير».
2. حساب كاستومر: `/admin` → الهوم.
3. حساب أدمن: `/admin` → «صفحة المدير».
4. `/admin/login` للزائر تفضل تفتح من غير لوب.
5. مفيش `admin/page.tsx` قديم جنب النسخة اللي جوه `(protected)`.
