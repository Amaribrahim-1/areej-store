const FALLBACK_ADMIN_ORDER_STATUS_ERROR =
  "تعذر تحديث حالة الطلب. جرّب مرة أخرى";

export function adminOrderStatusErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "";

  if (raw === "INVALID_ORDER_STATUS_PAYLOAD") {
    return "حالة الطلب غير صحيحة";
  }

  if (raw === "UNAUTHENTICATED") {
    return "جلسة الأدمن انتهت. سجّل الدخول مرة أخرى";
  }

  if (raw === "ORDER_NOT_FOUND") {
    return "الطلب غير موجود أو لا يمكن تحديثه";
  }

  return raw || FALLBACK_ADMIN_ORDER_STATUS_ERROR;
}
