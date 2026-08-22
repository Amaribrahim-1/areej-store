import type { FieldErrors, UseFormRegister } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
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
};

export default function AdminProductVariantRow({
  index,
  register,
  errors,
}: AdminProductVariantRowProps) {
  const variantErrors = errors.variants?.[index];
  const volumeId = `admin-product-variant-${index}-volume`;
  const originalPriceId = `admin-product-variant-${index}-original-price`;
  const currentPriceId = `admin-product-variant-${index}-current-price`;

  return (
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
  );
}
