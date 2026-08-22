import { productImageErrorMessage } from "./productImageErrorMessage";

const PRODUCT_WRITE_ERROR_MESSAGES: Record<string, string> = {
  INVALID_PRODUCT_PAYLOAD: "بيانات المنتج غير صحيحة",
  PRODUCT_SLUG_TAKEN: "رابط المنتج ده مستخدم قبل كده",
  CATEGORY_NOT_FOUND: "الفئة دي مش موجودة",
  NOT_ADMIN: "مفيش صلاحية لإضافة منتج",
  PRODUCT_CREATE_NO_ID: "المنتج اتعمل بس المعرف مرجعش — حاول تاني",
};

export function productWriteErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : "";
  if (code in PRODUCT_WRITE_ERROR_MESSAGES) {
    return PRODUCT_WRITE_ERROR_MESSAGES[code];
  }
  if (code.startsWith("IMAGE_")) {
    return productImageErrorMessage(error);
  }
  return "حصل خطأ أثناء حفظ المنتج، جرّب تاني";
}
