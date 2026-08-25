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
import type { AuthUser } from "@/features/auth/api/getCurrentUser";
import { useCurrentUser } from "@/features/auth/api/useCurrentUser";
import { cn } from "@/lib/utils";

import { useCreateReview } from "../../api/useCreateReview";
import { useMyProductReview } from "../../api/useMyProductReview";
import { reviewSchema, type ReviewSchemaType } from "../../schema";
import OwnedReviewPanel from "./OwnedReviewPanel";

function CreateReviewForm({ slug }: { slug: string }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const { mutate, isPending } = useCreateReview();

  const onSubmit: SubmitHandler<ReviewSchemaType> = (data) => {
    mutate(
      {
        productSlug: slug,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          reset({ rating: 0, comment: "" });
        },
      },
    );
  };

  return (
    <form
      className="space-y-4 rounded-3xl border border-border bg-brand-50/40 p-4 text-start sm:p-5"
      noValidate
      aria-busy={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          أضيفي تقييمك
        </h3>
        <p className="text-sm text-muted-foreground">
          قيّمي المنتج وشاركي رأيك مع باقي العملاء.
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
          placeholder="إيه اللي عجبكِ في المنتج؟"
          aria-invalid={!!errors.comment}
          {...register("comment")}
        />
        <FieldError message={errors.comment?.message} />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="w-full sm:w-auto sm:min-w-40"
      >
        {isPending ? "جاري الإرسال..." : "إرسال التقييم"}
      </Button>
    </form>
  );
}

type AddReviewFormProps = {
  slug: string;
  initialUser: AuthUser | null;
};

export default function AddReviewForm({
  slug,
  initialUser,
}: AddReviewFormProps) {
  const user = useCurrentUser(initialUser);
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;

  const {
    data: myReview,
    isLoading: isLoadingMyReview,
    isError: isMyReviewError,
    refetch: refetchMyReview,
  } = useMyProductReview({ slug }, !!user);

  if (!user) {
    return (
      <div className="space-y-3 rounded-3xl border border-border bg-brand-50/40 p-4 text-start sm:p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          أضيفي تقييمك
        </h3>
        <p className="text-sm text-muted-foreground">
          سجّلي دخولك عشان تقدري تقيّمي المنتج وتشاركي رأيك.
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

  if (isLoadingMyReview) {
    return (
      <div
        className="h-40 animate-pulse rounded-3xl border border-border bg-brand-50/40"
        aria-busy="true"
        aria-label="جاري التحقق من تقييمك"
      />
    );
  }

  if (isMyReviewError) {
    return (
      <div
        className="space-y-3 rounded-3xl border border-border bg-brand-50/40 p-4 text-start sm:p-5"
        role="alert"
      >
        <h3 className="font-heading text-lg font-semibold text-foreground">
          أضيفي تقييمك
        </h3>
        <p className="text-sm text-muted-foreground">
          تعذّر التحقق من تقييمك الحالي. حاولي مرة أخرى.
        </p>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => refetchMyReview()}
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (myReview) {
    return <OwnedReviewPanel slug={slug} review={myReview} />;
  }

  return <CreateReviewForm slug={slug} />;
}
