import { z } from "zod";

import {
  isGovernorate,
  isMarkazForGovernorate,
} from "@/lib/egypt-locations";
import { egyptianPhoneRegex } from "@/lib/egyptianPhoneRegex";

import { ORDER_STATUSES } from "./constants";

function assertValidEgyptLocation(
  data: { governorate: string; markaz: string },
  ctx: z.RefinementCtx,
) {
  if (!isGovernorate(data.governorate)) {
    ctx.addIssue({
      code: "custom",
      path: ["governorate"],
      message: "اختاري محافظة صحيحة",
    });
    return;
  }

  if (!isMarkazForGovernorate(data.governorate, data.markaz)) {
    ctx.addIssue({
      code: "custom",
      path: ["markaz"],
      message: "اختاري مركزًا صحيحًا لهذه المحافظة",
    });
  }
}

/**
 * Submitted checkout payload — line items + contact + address snapshot.
 * No total or unit prices: those are resolved server-side by place_order.
 */
export const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "الاسم لازم يكون حرفين على الأقل" }),
    phone: z.string().trim().regex(egyptianPhoneRegex, {
      message: "أدخلي رقم موبايل مصري صحيح (مثل 01xxxxxxxxx)",
    }),
    governorate: z.string().min(1, { message: "اختاري المحافظة" }),
    markaz: z.string().min(1, { message: "اختاري المركز" }),
    addressText: z.string().trim().min(10, {
      message: "اكتبي وصفًا أوضح للعنوان (مثل الشارع أو علامة مميزة)",
    }),
    items: z
      .array(
        z.object({
          variantId: z.uuid({ message: "معرّف المقاس غير صالح" }),
          quantity: z
            .number()
            .int({ message: "الكمية لازم تكون رقم صحيح" })
            .positive({ message: "الكمية لازم تكون أكبر من صفر" }),
        }),
      )
      .min(1, { message: "الطلب لازم يحتوي على منتج واحد على الأقل" }),
  })
  .superRefine(assertValidEgyptLocation);

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Body for POST /api/orders/notify — triggers admin WhatsApp/email (best-effort). */
export const notifyOrderSchema = z.object({
  orderId: z.uuid({ message: "معرّف الطلب غير صالح" }),
});

export type NotifyOrderInput = z.infer<typeof notifyOrderSchema>;

/** Admin status write — values must match `ORDER_STATUSES`, never free text. */
export const updateAdminOrderStatusSchema = z.object({
  orderId: z
    .string()
    .trim()
    .uuid({ message: "معرّف الطلب غير صالح" }),
  status: z.enum(ORDER_STATUSES),
});

export type UpdateAdminOrderStatusInput = z.infer<
  typeof updateAdminOrderStatusSchema
>;
