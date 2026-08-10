import { z } from "zod";

const egyptianPhoneRegex = /^01[0125]\d{8}$/;

/** Shared register fields — reused by the form schema and pre-write validation. */
const registerFieldsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "الاسم لازم يكون حرفين على الأقل" }),
  email: z.email({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }),
  password: z.string().min(6, { message: "كلمة المرور ٦ أحرف على الأقل" }),
  phone: z.string().trim().regex(egyptianPhoneRegex, {
    message: "أدخل رقم موبايل مصري صحيح (مثل 01xxxxxxxxx)",
  }),
  governorate: z.string().min(1, { message: "اختر المحافظة" }),
  markaz: z.string().min(1, { message: "اختر المركز" }),
  addressDescription: z.string().trim().min(10, {
    message: "اكتب وصفًا أوضح للعنوان (مثل الشارع أو علامة مميزة)",
  }),
});

/** Client form schema (includes confirmPassword match). */
export const registerSchema = registerFieldsSchema
  .extend({
    confirmPassword: z.string().min(6, { message: "أكّد كلمة المرور" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

/**
 * Payload validated again before Auth signup / profile metadata write.
 * Same field rules as the form, without confirmPassword (UX-only).
 */
export const registerWriteSchema = registerFieldsSchema;

export const loginSchema = z.object({
  email: z.email({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }),
  password: z.string().min(6, { message: "كلمة المرور ٦ أحرف على الأقل" }),
});

export type RegisterType = z.infer<typeof registerSchema>;
export type RegisterWriteInput = z.infer<typeof registerWriteSchema>;
export type LoginType = z.infer<typeof loginSchema>;
