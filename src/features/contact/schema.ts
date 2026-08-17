import { z } from "zod";

import { egyptianPhoneRegex } from "@/lib/egyptianPhoneRegex";

import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
} from "./constants";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "الاسم لازم يكون حرفين على الأقل" })
    .max(CONTACT_NAME_MAX_LENGTH, {
      message: `الاسم طويل جدًا (حد أقصى ${CONTACT_NAME_MAX_LENGTH} حرف)`,
    }),
  phone: z.string().trim().regex(egyptianPhoneRegex, {
    message: "أدخل رقم موبايل مصري صحيح (مثل 01xxxxxxxxx)",
  }),
  message: z
    .string()
    .trim()
    .min(CONTACT_MESSAGE_MIN_LENGTH, {
      message: `الرسالة قصيرة جدًا (حد أدنى ${CONTACT_MESSAGE_MIN_LENGTH} حروف)`,
    })
    .max(CONTACT_MESSAGE_MAX_LENGTH, {
      message: `الرسالة طويلة جدًا (حد أقصى ${CONTACT_MESSAGE_MAX_LENGTH} حرف)`,
    }),
});

export type ContactInput = z.infer<typeof contactSchema>;
