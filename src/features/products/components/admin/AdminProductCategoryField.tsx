"use client";

import { useState } from "react";
import type {
  FieldError as FieldErrorType,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useCreateCategory } from "../../api/admin/useCreateCategory";
import { useCategories } from "../../api/useCategories";
import { CATEGORY_LABEL_MAX_LENGTH, CATEGORY_SLUG_MAX_LENGTH } from "../../constants";
import { slugifyLabel } from "../../lib/slugifyLabel";
import { categorySchema, type ProductFormValues } from "../../schema";

const selectClassName = cn(
  "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 text-sm",
  "text-foreground outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
);

type AdminProductCategoryFieldProps = {
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  error?: FieldErrorType;
};

export default function AdminProductCategoryField({
  register,
  setValue,
  error,
}: AdminProductCategoryFieldProps) {
  const { data: categories = [], isPending, isError, refetch } =
    useCategories();
  const { mutate, isPending: isCreating } = useCreateCategory();

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [addError, setAddError] = useState<string | undefined>();
  const displayedSlug = slugTouched
    ? newSlug
    : slugifyLabel(newLabel, CATEGORY_SLUG_MAX_LENGTH);

  function resetAddForm() {
    setIsAdding(false);
    setNewLabel("");
    setNewSlug("");
    setSlugTouched(false);
    setAddError(undefined);
  }

  function handleAddCategory() {
    const parsed = categorySchema.safeParse({
      label: newLabel,
      slug: displayedSlug,
    });
    if (!parsed.success) {
      setAddError(parsed.error.issues[0]?.message ?? "بيانات الفئة غير صحيحة");
      return;
    }

    mutate(parsed.data, {
      onSuccess: (created) => {
        setValue("category", created.slug, { shouldValidate: true });
        resetAddForm();
      },
    });
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="admin-product-category">الفئة</Label>
      <select
        id="admin-product-category"
        className={selectClassName}
        disabled={isPending || isError}
        aria-invalid={!!error}
        {...register("category")}
      >
        <option value="" disabled>
          {isPending ? "جاري تحميل الفئات..." : "اختر الفئة"}
        </option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.label}
          </option>
        ))}
      </select>
      <FieldError message={error?.message} />
      {isError ? (
        <p className="text-sm text-destructive" role="alert">
          تعذّر تحميل الفئات.{" "}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => refetch()}
          >
            إعادة المحاولة
          </button>
        </p>
      ) : null}

      {isAdding ? (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-3">
          <div className="space-y-2">
            <Label htmlFor="admin-new-category-label">اسم الفئة الجديد</Label>
            <Input
              id="admin-new-category-label"
              type="text"
              maxLength={CATEGORY_LABEL_MAX_LENGTH}
              value={newLabel}
              onChange={(event) => {
                setNewLabel(event.target.value);
                setAddError(undefined);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-new-category-slug">رابط الفئة</Label>
            <Input
              id="admin-new-category-slug"
              type="text"
              dir="ltr"
              className="text-start"
              maxLength={CATEGORY_SLUG_MAX_LENGTH}
              value={displayedSlug}
              onChange={(event) => {
                setSlugTouched(true);
                setNewSlug(event.target.value);
                setAddError(undefined);
              }}
            />
          </div>
          <FieldError message={addError} />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={isCreating}
              onClick={handleAddCategory}
            >
              {isCreating ? "جاري الإضافة..." : "حفظ الفئة"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isCreating}
              onClick={resetAddForm}
            >
              إلغاء
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending || isError}
          onClick={() => setIsAdding(true)}
        >
          إضافة فئة جديدة
        </Button>
      )}
    </div>
  );
}
