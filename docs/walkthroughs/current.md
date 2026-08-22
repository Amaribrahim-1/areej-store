# مراجعة — 12

- التاريخ: 2026-08-22
- النوع: review

مفيش must. التنظيف اتطبّق على `feature/admin-orders` قبل الميرج.

## must

none

## should

- في `getAdminOrders.ts` / `getAdminOrder.ts` / `updateAdminOrderStatus.ts` / `getCustomerOrders.ts`: بعد 12.6 `isOrderStatus` اتصدّر من `constants.ts`، والنسخ المحلية فضلت. الحل: `requireOrderStatus` و `requirePaymentMethod` من `constants.ts`، والمسح من الملفات الأربعة.
- في `useUpdateAdminOrderStatus.ts`: ترجمة الغلط جوّه `onError` بـ ternary متداخل. الحل: `adminOrderStatusErrorMessage` زي `adminLoginErrorMessage`.

## ذوق

- في `formatOrderPlacedAt.ts`: كومنت بيكرّر الاسم. الحل: اتمسح.
- في `AdminOrderCard.tsx` و `AdminOrderCustomerBlock.tsx`: `OrderField` متكرر. الحل: `AdminOrderField.tsx`.
- في `CustomerOrderCard.tsx`: نفس فورمات التاريخ. الحل: يستخدم `formatOrderPlacedAt`.

## اللي هيتعدل

- تصدير `requireOrderStatus` و `requirePaymentMethod` من `constants.ts`
- مسح الـ guards المحلية من الأربع API files
- `adminOrderStatusErrorMessage.ts` + استخدامه في الهوك
- مسح كومنت `formatOrderPlacedAt`
- `AdminOrderField.tsx` بدل النسختين
- `CustomerOrderCard` يستخدم `formatOrderPlacedAt`
