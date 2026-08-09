import { z } from "zod";

const egyptianPhoneRegex = /^01[0125]\d{8}$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "الاسم لازم يكون حرفين على الأقل" }),
    email: z.email({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }),
    password: z.string().min(6, { message: "كلمة المرور ٦ أحرف على الأقل" }),
    confirmPassword: z.string().min(6, { message: "أكّد كلمة المرور" }),
    phone: z.string().trim().regex(egyptianPhoneRegex, {
      message: "أدخل رقم موبايل مصري صحيح (مثل 01xxxxxxxxx)",
    }),
    governorate: z.string().min(1, { message: "اختر المحافظة" }),
    markaz: z.string().min(1, { message: "اختر المركز" }),
    addressDescription: z.string().trim().min(10, {
      message: "اكتب وصفًا أوضح للعنوان (مثل الشارع أو علامة مميزة)",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({ message: "أدخل بريدًا إلكترونيًا صحيحًا" }),
  password: z.string().min(6, { message: "كلمة المرور ٦ أحرف على الأقل" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
