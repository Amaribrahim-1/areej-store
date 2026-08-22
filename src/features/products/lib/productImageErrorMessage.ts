const IMAGE_ERROR_MESSAGES: Record<string, string> = {
  IMAGE_EMPTY: "أرفق صورة للمنتج",
  IMAGE_INVALID_TYPE: "صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP أو GIF",
  IMAGE_TOO_LARGE: "الصورة أكبر من 10 ميجا",
  IMAGE_OUTPUT_TOO_LARGE: "الصورة لسه كبيرة بعد الضغط. جرّب صورة أوضح أو أصغر",
  IMAGE_COMPRESS_FAILED: "تعذر تجهيز الصورة. جرّب ملف تاني",
  IMAGE_UPLOAD_FAILED: "تعذر رفع الصورة. جرّب تاني",
  IMAGE_DELETE_FAILED: "تعذر حذف الصورة القديمة",
};

export function productImageErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : "";
  return IMAGE_ERROR_MESSAGES[code] ?? "حصل خطأ أثناء التعامل مع الصورة، جرّب تاني";
}
