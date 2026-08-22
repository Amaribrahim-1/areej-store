import { z } from "zod";

import {
  CATEGORY_LABEL_MAX_LENGTH,
  CATEGORY_LABEL_MIN_LENGTH,
  CATEGORY_SLUG_MAX_LENGTH,
  isProductImageMimeType,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_IMAGE_MAX_INPUT_BYTES,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_NAME_MIN_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_SLUG_MAX_LENGTH,
  PRODUCT_SLUG_MIN_LENGTH,
  PRODUCT_SLUG_PATTERN,
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

/** Blank/missing = new row on edit. UUID = existing `product_variants.id`. */
const variantIdSchema = z
  .union([z.uuid(), z.literal("")])
  .optional()
  .transform((value) =>
    value === "" || value === undefined ? undefined : value,
  );

const productVariantSchema = z
  .object({
    id: variantIdSchema,
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
const productImageFileSchema = z
  .file({ message: "أرفق صورة للمنتج" })
  .refine((file) => file.size > 0, {
    message: "أرفق صورة للمنتج",
  })
  .refine((file) => isProductImageMimeType(file.type), {
    message: "صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP أو GIF",
  })
  .refine((file) => file.size <= PRODUCT_IMAGE_MAX_INPUT_BYTES, {
    message: "الصورة أكبر من 10 ميجا",
  });

const productImageSchema = z.union(
  [
    productImageFileSchema,
    z.string().trim().min(1, { message: "أرفق صورة للمنتج" }),
  ],
  { message: "أرفق صورة للمنتج" },
);

const slugSchema = z
  .string()
  .trim()
  .min(PRODUCT_SLUG_MIN_LENGTH, {
    message: `الرابط لازم يكون ${PRODUCT_SLUG_MIN_LENGTH} حروف على الأقل`,
  })
  .max(PRODUCT_SLUG_MAX_LENGTH, {
    message: `الرابط طويل جدًا (حد أقصى ${PRODUCT_SLUG_MAX_LENGTH} حرف)`,
  })
  .regex(PRODUCT_SLUG_PATTERN, {
    message: "الرابط حروف وأرقام وشرطات فقط، من غير مسافات",
  });

export const categorySchema = z.object({
  label: z
    .string()
    .trim()
    .min(CATEGORY_LABEL_MIN_LENGTH, {
      message: `اسم الفئة لازم يكون ${CATEGORY_LABEL_MIN_LENGTH} حروف على الأقل`,
    })
    .max(CATEGORY_LABEL_MAX_LENGTH, {
      message: `اسم الفئة طويل جدًا (حد أقصى ${CATEGORY_LABEL_MAX_LENGTH} حرف)`,
    }),
  slug: z
    .string()
    .trim()
    .min(PRODUCT_SLUG_MIN_LENGTH, {
      message: `رابط الفئة لازم يكون ${PRODUCT_SLUG_MIN_LENGTH} حروف على الأقل`,
    })
    .max(CATEGORY_SLUG_MAX_LENGTH, {
      message: `رابط الفئة طويل جدًا (حد أقصى ${CATEGORY_SLUG_MAX_LENGTH} حرف)`,
    })
    .regex(PRODUCT_SLUG_PATTERN, {
      message: "الرابط حروف وأرقام وشرطات فقط، من غير مسافات",
    }),
});

/**
 * Admin create/edit product payload. Category is a slug from `categories`
 * — it does not change which fields exist (no per-category variant shape).
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
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .min(1, { message: "أدخل وصف المنتج" })
    .max(PRODUCT_DESCRIPTION_MAX_LENGTH, {
      message: `الوصف طويل جدًا (حد أقصى ${PRODUCT_DESCRIPTION_MAX_LENGTH} حرف)`,
    }),
  category: z.string().trim().min(1, { message: "اختر فئة صحيحة" }),
  status: z.enum(PRODUCT_STATUSES, { message: "اختر حالة المنتج" }),
  image: productImageSchema,
  variants: z
    .array(productVariantSchema)
    .min(1, { message: "أضف مقاساً واحداً على الأقل" }),
});

export type ProductInput = z.output<typeof productSchema>;
export type ProductFormValues = z.input<typeof productSchema>;
export type ProductVariantInput = z.output<typeof productVariantSchema>;
export type CategoryInput = z.output<typeof categorySchema>;
