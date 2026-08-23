"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";

import StarRating from "@/components/shared/StarRating";
import UserAvatar from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteAdminReview } from "../../api/useDeleteAdminReview";
import { formatReviewDate } from "../../lib/formatReviewDate";
import type { AdminReview } from "../../types";

type AdminReviewCardProps = {
  review: AdminReview;
};

type DeleteAdminReviewConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

function DeleteAdminReviewConfirm({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteAdminReviewConfirmProps) {
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
            التقييم هيتشال نهائيًا من المنتج. الخطوة دي مش هترجع.
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

export default function AdminReviewCard({ review }: AdminReviewCardProps) {
  const headingId = `admin-review-${review.id}-heading`;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: deleteMutate, isPending: isDeleting } =
    useDeleteAdminReview();

  const confirmDelete = () => {
    deleteMutate(
      { reviewId: review.id },
      { onSuccess: () => setIsConfirmOpen(false) },
    );
  };

  return (
    <article
      className="rounded-2xl border border-border bg-card p-4"
      aria-labelledby={headingId}
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <p
          id={headingId}
          className="font-heading text-sm font-semibold text-brand-700"
        >
          {review.productName}
        </p>
        <StarRating value={review.rating} size="sm" />
      </header>

      <div className="mt-3 flex items-start gap-3">
        <UserAvatar alt={`صورة ${review.authorName}`} size="sm" />

        <div className="min-w-0 flex-1 space-y-1 text-start">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {review.authorName}
            </p>
            <time
              dateTime={review.createdAt}
              className="text-xs text-muted-foreground"
            >
              {formatReviewDate(review.createdAt)}
            </time>
          </div>

          {review.comment ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/70 italic">
              بدون تعليق
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsConfirmOpen(true)}
          aria-label={`حذف تقييم ${review.authorName} على ${review.productName}`}
        >
          <Trash2Icon aria-hidden="true" />
          حذف
        </Button>
      </div>

      <DeleteAdminReviewConfirm
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </article>
  );
}
