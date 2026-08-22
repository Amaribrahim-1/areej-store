import { productImageErrorMessage } from "./productImageErrorMessage";

const PRODUCT_WRITE_ERROR_MESSAGES: Record<string, string> = {
  INVALID_PRODUCT_PAYLOAD: "بيانات المنتج غير صحيحة",
  PRODUCT_SLUG_TAKEN: "رابط المنتج ده مستخدم قبل كده",
  CATEGORY_NOT_FOUND: "الفئة دي مش موجودة",
  NOT_ADMIN: "مفيش صلاحية لحفظ المنتج",
  PRODUCT_CREATE_NO_ID: "المنتج اتعمل بس المعرف مرجعش — حاول تاني",
  PRODUCT_UPDATE_NO_ID: "المنتج اتحدث بس المعرف مرجعش — حاول تاني",
  PRODUCT_NOT_FOUND: "المنتج مش موجود",
  VARIANT_IN_USE: "مفيش حذف لمقاس استخدم في طلبات سابقة",
  VARIANT_NOT_FOUND: "واحد من المقاسات مش تابع للمنتج ده",
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
