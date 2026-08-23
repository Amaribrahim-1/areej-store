import { Trash2Icon } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  PRODUCT_VOLUME_LABEL_MAX_LENGTH,
  PRODUCT_VOLUME_LABEL_PLACEHOLDER,
} from "../../constants";
import type { ProductFormValues } from "../../schema";

type AdminProductVariantRowProps = {
  index: number;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onRemove?: (index: number) => void;
};

export default function AdminProductVariantRow({
  index,
  register,
  errors,
  onRemove,
}: AdminProductVariantRowProps) {
  const variantErrors = errors.variants?.[index];
  const headingId = `admin-product-variant-${index}-heading`;
  const volumeId = `admin-product-variant-${index}-volume`;
  const originalPriceId = `admin-product-variant-${index}-original-price`;
  const currentPriceId = `admin-product-variant-${index}-current-price`;
  const variantNumber = index + 1;

  return (
    <div
      className="space-y-3 rounded-2xl border border-border bg-background p-3 sm:p-4"
      role="group"
      aria-labelledby={headingId}
    >
      <div className="flex items-center justify-between gap-3">
        <p id={headingId} className="text-sm font-medium text-foreground">
          مقاس {variantNumber}
        </p>
        <input type="hidden" {...register(`variants.${index}.id`)} />
        {onRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            aria-label={`حذف المقاس ${variantNumber}`}
            className="size-11 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={volumeId}>اسم المقاس (اختياري)</Label>
          <Input
            id={volumeId}
            type="text"
            maxLength={PRODUCT_VOLUME_LABEL_MAX_LENGTH}
            placeholder={PRODUCT_VOLUME_LABEL_PLACEHOLDER}
            aria-invalid={!!variantErrors?.volumeLabel}
            {...register(`variants.${index}.volumeLabel`)}
          />
          <FieldError message={variantErrors?.volumeLabel?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={originalPriceId}>السعر الأصلي</Label>
          <Input
            id={originalPriceId}
            type="text"
            inputMode="decimal"
            dir="ltr"
            className="text-start"
            aria-invalid={!!variantErrors?.originalPrice}
            {...register(`variants.${index}.originalPrice`)}
          />
          <FieldError message={variantErrors?.originalPrice?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={currentPriceId}>سعر البيع</Label>
          <Input
            id={currentPriceId}
            type="text"
            inputMode="decimal"
            dir="ltr"
            className="text-start"
            aria-invalid={!!variantErrors?.currentPrice}
            {...register(`variants.${index}.currentPrice`)}
          />
          <FieldError message={variantErrors?.currentPrice?.message} />
        </div>
      </div>
    </div>
  );
}
