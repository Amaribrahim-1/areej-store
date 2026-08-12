"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import StarRating from "@/components/shared/StarRating";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/features/auth/api/useCurrentUser";
import { cn } from "@/lib/utils";

import { reviewSchema, type ReviewSchemaType } from "../../schema";

export default function AddReviewForm() {
  const user = useCurrentUser();
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit: SubmitHandler<ReviewSchemaType> = () => {
    // 7.5 — submit mutation
  };

  if (!user) {
    return (
      <div className="space-y-3 rounded-3xl border border-border bg-brand-50/40 p-4 text-start sm:p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          أضف تقييمك
        </h3>
        <p className="text-sm text-muted-foreground">
          سجّل دخولك عشان تقدر تقيّم المنتج وتشارك رأيك.
        </p>
        <Link
          href={loginHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full sm:w-auto sm:min-w-40",
          )}
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-3xl border border-border bg-brand-50/40 p-4 text-start sm:p-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          أضف تقييمك
        </h3>
        <p className="text-sm text-muted-foreground">
          قيّم المنتج وشارك رأيك مع باقي العملاء.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="add-review-rating">التقييم</Label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating
              id="add-review-rating"
              value={field.value}
              size="lg"
              interactive
              onChange={field.onChange}
            />
          )}
        />
        <FieldError message={errors.rating?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="add-review-comment">تعليقك (اختياري)</Label>
        <Textarea
          id="add-review-comment"
          rows={3}
          placeholder="إيه اللي عجبك في المنتج؟"
          aria-invalid={!!errors.comment}
          {...register("comment")}
        />
        <FieldError message={errors.comment?.message} />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto sm:min-w-40">
        إرسال التقييم
      </Button>
    </form>
  );
}
