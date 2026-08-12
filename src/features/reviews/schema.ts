import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ message: "اختار تقييمًا بالنجوم" })
    .int({ message: "التقييم لازم يكون رقم صحيح" })
    .min(1, { message: "التقييم من ١ إلى ٥ نجوم" })
    .max(5, { message: "التقييم من ١ إلى ٥ نجوم" }),
  comment: z
    .string()
    .trim()
    .max(1000, { message: "التعليق طويل جدًا (حد أقصى ١٠٠٠ حرف)" })
    .optional(),
});

export type ReviewSchemaType = z.infer<typeof reviewSchema>;
