import { z } from "zod";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_NAME_MIN_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_STATUSES,
  PRODUCT_VOLUME_LABEL_MAX_LENGTH,
} from "./constants";

const priceSchema = z.coerce
  .number({ message: "أدخل سعراً صحيحاً" })
  .positive({ message: "السعر لازم يكون أكبر من صفر" })
  .max(PRODUCT_PRICE_MAX, { message: "السعر أكبر من الحد المسموح" });

function assertCurrentPriceNotAboveOriginal(
  variant: { originalPrice: number; currentPrice: number },
  ctx: z.RefinementCtx,
) {
  if (variant.currentPrice > variant.originalPrice) {
    ctx.addIssue({
      code: "custom",
      path: ["currentPrice"],
      message: "سعر البيع لازم يكون أقل من أو يساوي السعر الأصلي",
    });
  }
}

const productVariantSchema = z
  .object({
    volumeLabel: z
      .string()
      .trim()
      .max(PRODUCT_VOLUME_LABEL_MAX_LENGTH, {
        message: `اسم المقاس طويل جدًا (حد أقصى ${PRODUCT_VOLUME_LABEL_MAX_LENGTH} حرف)`,
      })
      .nullable()
      .optional()
      .transform((value) => value || null),
    originalPrice: priceSchema,
    currentPrice: priceSchema,
  })
  .superRefine(assertCurrentPriceNotAboveOriginal);

/**
 * File = new upload (13.6). Non-empty string = already-stored image URL
 * so edit (13.8) and post-upload write re-validation (13.11) can reuse
 * the same schema.
 */
const productImageSchema = z.union(
  [
    z.file({ message: "أرفق صورة للمنتج" }).refine((file) => file.size > 0, {
      message: "أرفق صورة للمنتج",
    }),
    z.string().trim().min(1, { message: "أرفق صورة للمنتج" }),
  ],
  { message: "أرفق صورة للمنتج" },
);

/**
 * Admin create/edit product payload. Category is a fixed enum — it does
 * not change which fields exist (no per-category variant shape).
 */
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(PRODUCT_NAME_MIN_LENGTH, {
      message: `الاسم لازم يكون ${PRODUCT_NAME_MIN_LENGTH} حروف على الأقل`,
    })
    .max(PRODUCT_NAME_MAX_LENGTH, {
      message: `الاسم طويل جدًا (حد أقصى ${PRODUCT_NAME_MAX_LENGTH} حرف)`,
    }),
  description: z
    .string()
    .trim()
    .min(1, { message: "أدخل وصف المنتج" })
    .max(PRODUCT_DESCRIPTION_MAX_LENGTH, {
      message: `الوصف طويل جدًا (حد أقصى ${PRODUCT_DESCRIPTION_MAX_LENGTH} حرف)`,
    }),
  category: z.enum(PRODUCT_CATEGORIES, { message: "اختر فئة صحيحة" }),
  status: z.enum(PRODUCT_STATUSES, { message: "اختر حالة المنتج" }),
  image: productImageSchema,
  variants: z
    .array(productVariantSchema)
    .min(1, { message: "أضف مقاساً واحداً على الأقل" }),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
