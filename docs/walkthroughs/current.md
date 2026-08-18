# شرح التاسك — Phase 11 review fixes

- التاريخ: 2026-08-18
- النوع: full-task

## المشكلة والحل

المراجعة وقفت على أسماء ونبرة وكومنت بيكرر الكود. التصليحات اتشحنت. سلوك الحارس واللوجين نفسه زي ما هو.

## الصفحات والملفات

- `src/features/auth/api/signOutSession.ts` — تسجيل خروج الجلسة لأي دور (ستور أو لوحة).
- `src/features/auth/api/useSignOut.ts` — توست الخروج بصيغة محايدة.
- `src/features/auth/lib/adminLoginErrorMessage.ts` — ترجمة أخطاء لوجين الأدمن لعربي.
- `src/features/auth/api/useAdminLogin.ts` — التوست بس؛ الرسالة من الدالة فوق.
- `src/features/auth/api/loginAdmin.ts` — كومنت الـ why بس.
- `src/features/auth/components/AdminLoginForm.tsx` — اسم الحقل `credentials`.
- `src/features/admin-dashboard/components/AdminDashboardPage.tsx` — وصف الخطأ بنفس نبرة `error.tsx`.

## عقد الاستخدام (English)

### `signOutSession` — `src/features/auth/api/signOutSession.ts`

- **Params:** none
- **Returns:** `void`
- **Errors:** throws the Supabase `signOut` error
- **Call:**

```ts
await signOutSession()
```

### `adminLoginErrorMessage` — `src/features/auth/lib/adminLoginErrorMessage.ts`

- **Params:** `error: unknown`
- **Returns:** Arabic string for the admin login toast. Unknown/empty → `"حدث خطأ، حاول مرة أخرى"`.
- **Errors:** none (pure)
- **Call:**

```ts
toast.error(adminLoginErrorMessage(error))
```

## التدفق

1. تسجيل الخروج من الستور أو اللوحة يعدّي على `signOutSession`.
2. لو الخروج فشل، التوست محايد الجنس.
3. لوجين الأدمن لو فشل: `useAdminLogin` يمرر الخطأ لـ `adminLoginErrorMessage` ويعرض الناتج.

## قرارات مهمة وليه

- **`signOutSession` مش `signOut`:** الاسم التاني هيختلط بـ `supabase.auth.signOut`.
- **توست واحد محايد:** الهوك مشترك. صيغتين هتتكرر.

## تحقق بنفسك

1. من اللوحة: سجّل خروج. الرسالة مش مؤنثة لو حصل خطأ.
2. `/admin/login` بحساب كاستومر: توست «هذا الحساب ليس حساب مدير».
3. `/admin` لو الـ KPIs فشلت: الوصف رسمي خفيف زي باقي اللوحة.
