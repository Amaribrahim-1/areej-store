"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PRODUCT_IMAGE_ACCEPT } from "../../constants";
import type { ProductFormValues, ProductInput } from "../../schema";

type AdminProductImageFieldProps = {
  control: Control<ProductFormValues, unknown, ProductInput>;
  error?: string;
};

export default function AdminProductImageField({
  control,
  error,
}: AdminProductImageFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="admin-product-image">صورة المنتج</Label>
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <>
            <Input
              id="admin-product-image"
              type="file"
              accept={PRODUCT_IMAGE_ACCEPT}
              className="cursor-pointer pe-3 ps-2"
              aria-invalid={!!error}
              aria-describedby="admin-product-image-hint"
              name={field.name}
              onBlur={field.onBlur}
              ref={field.ref}
              onChange={(event) => handleImageChange(event, field.onChange)}
            />
            <ImageSelectionSummary image={field.value} />
          </>
        )}
      />
      <p id="admin-product-image-hint" className="text-sm text-muted-foreground">
        صورة واحدة لكل المنتج، مشتركة بين كل المقاسات.
      </p>
      <FieldError message={error} />
    </div>
  );
}

function handleImageChange(
  event: ChangeEvent<HTMLInputElement>,
  onChange: (file: File | undefined) => void,
) {
  onChange(event.currentTarget.files?.[0]);
}

function ImageSelectionSummary({
  image,
}: {
  image: ProductFormValues["image"];
}) {
  if (typeof image === "string" && image.length > 0) {
    return (
      <div className="relative size-24 overflow-hidden rounded-2xl bg-brand-50">
        <Image
          src={image}
          alt="صورة المنتج الحالية"
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    );
  }

  if (image instanceof File) {
    return <SelectedFilePreview file={image} />;
  }

  return null;
}

function SelectedFilePreview({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div className="flex items-center gap-3">
      {previewUrl ? (
        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-brand-50">
          <Image
            src={previewUrl}
            alt={`معاينة ${file.name}`}
            fill
            unoptimized
            className="object-cover"
            sizes="96px"
          />
        </div>
      ) : (
        <div
          className="size-24 shrink-0 rounded-2xl bg-brand-50"
          aria-hidden
        />
      )}
      <p className="min-w-0 text-sm text-foreground">{file.name}</p>
    </div>
  );
}
