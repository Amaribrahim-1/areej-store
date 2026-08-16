"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import StarRating from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { useUpdateReview } from "../../api/useUpdateReview";
import { reviewSchema, type ReviewSchemaType } from "../../schema";
import type { MyProductReview } from "../../types";

type OwnedReviewPanelProps = {
  slug: string;
  review: MyProductReview;
};

function formValuesFromReview(review: MyProductReview): ReviewSchemaType {
  return {
    rating: review.rating,
    comment: review.comment ?? "",
  };
}

export default function OwnedReviewPanel({
  slug,
  review,
}: OwnedReviewPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending } = useUpdateReview();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(reviewSchema),
    defaultValues: formValuesFromReview(review),
  });

  const startEditing = () => {
    reset(formValuesFromReview(review));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    reset(formValuesFromReview(review));
  };

  const onSubmit: SubmitHandler<ReviewSchemaType> = (data) => {
    mutate(
      {
        productSlug: slug,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const safeComment =
    review.comment != null && review.comment.length > 0
      ? sanitizePlainText(review.comment)
      : "";

  if (!isEditing) {
    return (
      <div className="space-y-3 rounded-3xl border border-border bg-brand-50/40 p-4 text-start sm:p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          تقييمك
        </h3>
        <p className="text-sm text-muted-foreground">
          قيّمتِ المنتج ده قبل كده — تقدر تعدّلي التقييم.
        </p>
        <StarRating value={review.rating} size="lg" />
        {safeComment ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {safeComment}
          </p>
        ) : null}
        <Button type="button" size="lg" onClick={startEditing}>
          تعديل التقييم
        </Button>
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
          تعديل تقييمك
        </h3>
        <p className="text-sm text-muted-foreground">
          غيّري النجوم أو التعليق، وبعدين احفظي.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-review-rating">التقييم</Label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating
              id="edit-review-rating"
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
        <Label htmlFor="edit-review-comment">تعليقك (اختياري)</Label>
        <Textarea
          id="edit-review-comment"
          rows={3}
          placeholder="إيه اللي عجبك في المنتج؟"
          aria-invalid={!!errors.comment}
          {...register("comment")}
        />
        <FieldError message={errors.comment?.message} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full sm:w-auto sm:min-w-40"
        >
          {isPending ? "جاري الحفظ..." : "حفظ التعديل"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isPending}
          onClick={cancelEditing}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
