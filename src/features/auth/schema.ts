import { z } from "zod";

import {
  isGovernorate,
  isMarkazForGovernorate,
} from "@/lib/egypt-locations";
import { egyptianPhoneRegex } from "@/lib/egyptianPhoneRegex";

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

/** Shared register fields — object shape before location / password refinements. */
const registerFieldsObject = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "الاسم لازم يكون حرفين على الأقل" }),
  email: z.email({ message: "أدخلي بريدًا إلكترونيًا صحيحًا" }),
  password: z.string().min(6, { message: "كلمة المرور ٦ أحرف على الأقل" }),
  phone: z.string().trim().regex(egyptianPhoneRegex, {
    message: "أدخلي رقم موبايل مصري صحيح (مثل 01xxxxxxxxx)",
  }),
  governorate: z.string().min(1, { message: "اختاري المحافظة" }),
  markaz: z.string().min(1, { message: "اختاري المركز" }),
  addressDescription: z.string().trim().min(10, {
    message: "اكتبي وصفًا أوضح للعنوان (مثل الشارع أو علامة مميزة)",
  }),
});

/**
 * Payload validated again before Auth signup / profile metadata write.
 * Same field rules as the form, without confirmPassword (UX-only).
 */
export const registerWriteSchema = registerFieldsObject.superRefine(
  assertValidEgyptLocation,
);

/** Client form schema (includes confirmPassword match). */
export const registerSchema = registerFieldsObject
  .extend({
    confirmPassword: z.string().min(6, { message: "أكّدي كلمة المرور" }),
  })
  .superRefine(assertValidEgyptLocation)
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({ message: "أدخلي بريدًا إلكترونيًا صحيحًا" }),
  password: z.string().min(6, { message: "كلمة المرور ٦ أحرف على الأقل" }),
});

/**
 * Editable account fields — name/phone/address only (task 4.1). No
 * email/password here; those go through Supabase Auth flows, not this form.
 * Validated again in `updateMyProfile` before the Supabase write.
 */
export const profileWriteSchema = z
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
  })
  .superRefine(assertValidEgyptLocation);

export type RegisterType = z.infer<typeof registerSchema>;
export type RegisterWriteInput = z.infer<typeof registerWriteSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type ProfileWriteInput = z.infer<typeof profileWriteSchema>;
