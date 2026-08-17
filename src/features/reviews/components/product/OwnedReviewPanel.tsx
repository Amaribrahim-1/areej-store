"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import StarRating from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sanitizePlainText } from "@/lib/sanitizePlainText";

import { useDeleteReview } from "../../api/useDeleteReview";
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

type DeleteReviewConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

function DeleteReviewConfirm({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteReviewConfirmProps) {
  const changeOpen = (nextOpen: boolean) => {
    if (isPending) {
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>حذف التقييم؟</DialogTitle>
          <DialogDescription>
            التقييم هيتشال من المنتج، وتقدري تكتبي تقييم جديد بعد كده. الخطوة دي
            مش هترجع.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "جاري الحذف..." : "حذف التقييم"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OwnedReviewPanel({
  slug,
  review,
}: OwnedReviewPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateReview();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteReview();
  const isBusy = isUpdating || isDeleting;

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
    updateMutate(
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

  const confirmDelete = () => {
    deleteMutate(
      { productSlug: slug },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
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
          قيّمتِ المنتج ده قبل كده — تقدر تعدّلي التقييم أو تحذفيه.
        </p>
        <StarRating value={review.rating} size="lg" />
        {safeComment ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {safeComment}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="lg"
            disabled={isBusy}
            onClick={startEditing}
          >
            تعديل التقييم
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isBusy}
            onClick={() => setIsConfirmOpen(true)}
          >
            حذف التقييم
          </Button>
        </div>
        <DeleteReviewConfirm
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={confirmDelete}
          isPending={isDeleting}
        />
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
          disabled={isBusy}
          size="lg"
          className="w-full sm:w-auto sm:min-w-40"
        >
          {isUpdating ? "جاري الحفظ..." : "حفظ التعديل"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isBusy}
          onClick={cancelEditing}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
