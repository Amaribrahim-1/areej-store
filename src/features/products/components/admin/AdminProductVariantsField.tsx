"use client";

import { PlusIcon } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";

import type { ProductFormValues, ProductInput } from "../../schema";

import AdminProductVariantRow from "./AdminProductVariantRow";

export const EMPTY_PRODUCT_VARIANT: ProductFormValues["variants"][number] = {
  volumeLabel: "",
  originalPrice: "",
  currentPrice: "",
};

type AdminProductVariantsFieldProps = {
  control: Control<ProductFormValues, unknown, ProductInput>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
};

export default function AdminProductVariantsField({
  control,
  register,
  errors,
}: AdminProductVariantsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
    // Keep RHF's React key off `id` so edit-prefill (13.8) can keep DB variant ids.
    keyName: "fieldId",
  });

  function handleAddVariant() {
    append({ ...EMPTY_PRODUCT_VARIANT });
  }

  function handleRemoveVariant(index: number) {
    if (fields.length <= 1) return;
    remove(index);
  }

  const canRemove = fields.length > 1;

  return (
    <fieldset className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <legend className="px-1 font-heading text-base font-semibold text-foreground">
        المقاسات
      </legend>
      <p className="text-sm text-muted-foreground">
        مقاس واحد على الأقل. اسم المقاس اختياري لو المنتج بحجم واحد.
      </p>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <AdminProductVariantRow
            key={field.fieldId}
            index={index}
            register={register}
            errors={errors}
            onRemove={canRemove ? handleRemoveVariant : undefined}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handleAddVariant}
      >
        <PlusIcon data-icon="inline-start" aria-hidden />
        إضافة مقاس
      </Button>
      <FieldError message={errors.variants?.message} />
      <FieldError message={errors.variants?.root?.message} />
    </fieldset>
  );
}
