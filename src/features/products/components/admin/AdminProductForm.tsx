"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  type DefaultValues,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_SLUG_MAX_LENGTH,
  PRODUCT_STATUS_LABELS,
} from "../../constants";
import { slugifyLabel } from "../../lib/slugifyLabel";
import {
  productSchema,
  type ProductFormValues,
  type ProductInput,
} from "../../schema";

import AdminProductCategoryField from "./AdminProductCategoryField";
import AdminProductImageField from "./AdminProductImageField";
import AdminProductVariantsField, {
  EMPTY_PRODUCT_VARIANT,
} from "./AdminProductVariantsField";

const checkboxClassName = cn(
  "size-4 shrink-0 rounded-sm border border-input accent-primary",
  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
);

const CREATE_DEFAULTS: DefaultValues<ProductFormValues> = {
  name: "",
  slug: "",
  description: "",
  category: "",
  status: "active",
  variants: [{ ...EMPTY_PRODUCT_VARIANT }],
};

type AdminProductFormProps = {
  defaultValues?: DefaultValues<ProductFormValues>;
  onSubmit?: SubmitHandler<ProductInput>;
  submitLabel?: string;
  isSubmitting?: boolean;
  /** Create form: keep slug in sync with name until the slug field is edited. */
  syncSlugFromName?: boolean;
};

export default function AdminProductForm({
  defaultValues,
  onSubmit,
  submitLabel = "حفظ المنتج",
  isSubmitting = false,
  syncSlugFromName = true,
}: AdminProductFormProps) {
  const initialValues = {
    ...CREATE_DEFAULTS,
    ...defaultValues,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<ProductFormValues, unknown, ProductInput>({
    mode: "onBlur",
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  });

  const submitHandler: SubmitHandler<ProductInput> = (data) => {
    onSubmit?.(data);
  };

  function handleCancel() {
    reset(initialValues);
  }

  const slug = watch("slug");
  const nameField = register("name");

  return (
    <form
      className="space-y-6 text-start"
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="space-y-2">
        <Label htmlFor="admin-product-name">اسم المنتج</Label>
        <Input
          id="admin-product-name"
          type="text"
          maxLength={PRODUCT_NAME_MAX_LENGTH}
          aria-invalid={!!errors.name}
          {...nameField}
          onChange={(event) => {
            nameField.onChange(event);
            if (syncSlugFromName && !dirtyFields.slug) {
              setValue(
                "slug",
                slugifyLabel(event.target.value, PRODUCT_SLUG_MAX_LENGTH),
                { shouldDirty: false },
              );
            }
          }}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-product-slug">رابط المنتج</Label>
        <Input
          id="admin-product-slug"
          type="text"
          dir="ltr"
          className="text-start"
          maxLength={PRODUCT_SLUG_MAX_LENGTH}
          aria-invalid={!!errors.slug}
          aria-describedby="admin-product-slug-hint"
          {...register("slug")}
        />
        <p
          id="admin-product-slug-hint"
          className="text-sm text-muted-foreground"
          dir="ltr"
        >
          /products/{slug || "…"}
        </p>
        <FieldError message={errors.slug?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-product-description">الوصف</Label>
        <Textarea
          id="admin-product-description"
          rows={5}
          maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <AdminProductCategoryField
        register={register}
        setValue={setValue}
        error={errors.category}
      />

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <input
                id="admin-product-status"
                type="checkbox"
                ref={field.ref}
                name={field.name}
                className={checkboxClassName}
                checked={field.value === "active"}
                aria-invalid={!!errors.status}
                aria-describedby="admin-product-status-hint"
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(event.target.checked ? "active" : "inactive")
                }
              />
            )}
          />
          <Label htmlFor="admin-product-status">
            {PRODUCT_STATUS_LABELS.active} في المتجر
          </Label>
        </div>
        <p
          id="admin-product-status-hint"
          className="text-sm text-muted-foreground"
        >
          لو شلت العلامة، المنتج مش هيظهر في كتالوج المتجر.
        </p>
        <FieldError message={errors.status?.message} />
      </div>

      <AdminProductImageField
        control={control}
        error={errors.image?.message}
      />

      <AdminProductVariantsField
        control={control}
        register={register}
        errors={errors}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full sm:w-auto sm:min-w-40"
        >
          {isSubmitting ? "جاري الحفظ..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto sm:min-w-40"
          onClick={handleCancel}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
