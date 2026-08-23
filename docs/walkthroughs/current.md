# مراجعة — Phase 14 + Phase A (Admin Reviews)

- النوع: review

## must

none

## should

- في `src/features/reviews/components/admin/AdminReviewCard.tsx` (الدالة `DeleteAdminReviewConfirm`, سطور 26-78): بتعيد بناء دايالوج تأكيد كامل (open/cancel/pending/destructive button) من الصفر، مع إن `src/components/shared/ConfirmDialog.tsx` عامل بالظبط لنفس الغرض وقابل للاستخدام مباشرة (`title` / `description` / `confirmLabel` / `isPending` / `onConfirm`). الحل: استبدال `DeleteAdminReviewConfirm` باستخدام `ConfirmDialog` بالـ props المناسبة، ومسح الكومبوننت المحلي.

## ذوق

- في `src/features/reviews/api/invalidateAdminReviewRelatedQueries.ts` (سطر invalidate الخاص بـ testimonials): بتعمل invalidate لـ `homeTestimonialsQueryKey(HOME_TESTIMONIALS_PAGE_SIZE)` بمفتاح محدد (default page size) لا بـ root key، عكس باقي الأربع invalidations اللي بتستخدم root keys. لو `useHomeTestimonials` استُخدم يوم بـ `pageSize` مختلف، الكاش بتاعه هيفضل قديم بعد حذف الأدمن. غير مستعجلة دلوقتي لأن الكولر الوحيد بنفس الـ page size — لا يتعدل الآن.
- Git: فرع `feature/admin-reviews` فيه كل كوميتات Phase 14 و Phase A (`6b14bad`, `e017d37`, `873bb40`, `b6a0fd8`) لكن لسه متدمجش في `main`. ده الوقت المناسب للدمج بـ `git merge --no-ff feature/admin-reviews` من `main` قبل البدء في Phase 15، عشان الـ branch history يفضل واضح في اللوج.

## اللي هيتعدل

- استبدال `DeleteAdminReviewConfirm` في `AdminReviewCard.tsx` بالـ `ConfirmDialog` المشترك
- دمج `feature/admin-reviews` في `main` بـ `--no-ff`

---

## خطة تنفيذ فورية (لشات جديد — نفّذ زي ما هي، بدون سؤال)

السياق: الشغل الحالي على فرع `feature/admin-reviews`، كل الكوميتات موجودة، الملفات دي committed بالفعل. ده تعديل واحد بسيط + عملية git، مفيش تصميم أو قرارات مفتوحة.

### الخطوة 1 — استبدال الدايالوج المحلي بـ `ConfirmDialog` المشترك

الملف: `src/features/reviews/components/admin/AdminReviewCard.tsx`

1. شيل الـ import بتاع `Dialog` / `DialogContent` / `DialogDescription` / `DialogFooter` / `DialogHeader` / `DialogTitle` من `@/components/ui/dialog`.
2. ضيف: `import ConfirmDialog from "@/components/shared/ConfirmDialog";`
3. مسح تعريف `type DeleteAdminReviewConfirmProps` وكومبوننت `DeleteAdminReviewConfirm` بالكامل (سطور 26-78 تقريبًا).
4. في `AdminReviewCard`، استبدل استخدام `<DeleteAdminReviewConfirm ... />` في الآخر بـ:

```tsx
<ConfirmDialog
  open={isConfirmOpen}
  onOpenChange={setIsConfirmOpen}
  title="حذف التقييم؟"
  description="التقييم هيتشال نهائيًا من المنتج. الخطوة دي مش هترجع."
  confirmLabel={isDeleting ? "جاري الحذف..." : "حذف التقييم"}
  isPending={isDeleting}
  onConfirm={confirmDelete}
/>
```

ملاحظة: `ConfirmDialog` نفسه بيعمل `variant="destructive"` على زرار التأكيد ويعطّل الأزرار وقت `isPending` — نفس السلوك الحالي بالظبط، فمفيش تغيير سلوك أو نص للمستخدم، بس شيل تكرار كود. مرجع استخدام حي بنفس الشكل: `src/features/cart/components/CartPage.tsx` (سطر ~128).

5. بعد التعديل: شغّل linter check على الملف (`ReadLints`)، وتأكد إن مفيش imports غير مستخدمة فاضلة.

### الخطوة 2 — كوميت التعديل

على نفس الفرع `feature/admin-reviews`:

```
git add src/features/reviews/components/admin/AdminReviewCard.tsx
git commit -m "refactor(admin-reviews): reuse shared ConfirmDialog instead of a local dialog"
```

### الخطوة 3 — دمج الفرع في main

```
git checkout main
git merge --no-ff feature/admin-reviews
```

بعد الدمج: اعرض `git status` و `git log --oneline -5` للتأكيد إن فيه merge commit ظاهر، واسأل المستخدم قبل أي `git push` (الدمج والـ push المحليين بس تلقائيين، الـ push للريموت يستأذن الأول لو المستخدم مركزلوش صريح).

### الخطوة 4 — تحديث `tasks.md`

لا تعديل مطلوب في `tasks.md` — Phase 14 و Phase A كلها `[x]` بالفعل. لو حابب توثيق إن فيه refactor بسيط اتعمل بعد المراجعة، ده اختياري وممكن يترك كوميت الرسالة يشرح نفسه.

### ما لا يُفعل

- لا تلمس `invalidateAdminReviewRelatedQueries.ts` (بند الـ ذوق) — قررنا إنه غير مستعجل.
- لا تعمل `git push` بدون سؤال المستخدم أولًا.
- لا تفتح Phase 15 في نفس الطلب ده — الطلب المطلوب هنا هو تنفيذ نتيجة المراجعة بس.
