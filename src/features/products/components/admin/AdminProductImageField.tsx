"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PRODUCT_IMAGE_ACCEPT } from "../../constants";
import {
  assertProductImageFile,
  compressProductImage,
} from "../../lib/compressProductImage";
import { formatImageFileSize } from "../../lib/formatImageFileSize";
import { productImageErrorMessage } from "../../lib/productImageErrorMessage";
import type { ProductFormValues, ProductInput } from "../../schema";
import type { ProductImageUploadProgress } from "../../types";

type AdminProductImageFieldProps = {
  control: Control<ProductFormValues, unknown, ProductInput>;
  error?: string;
  disabled?: boolean;
  uploadProgress?: ProductImageUploadProgress | null;
  onBusyChange?: (busy: boolean) => void;
  onReplaceImage?: () => void | Promise<void>;
};

export default function AdminProductImageField({
  control,
  error,
  disabled = false,
  uploadProgress = null,
  onBusyChange,
  onReplaceImage,
}: AdminProductImageFieldProps) {
  const prepareRequestIdRef = useRef(0);
  const [prepareError, setPrepareError] = useState<string | undefined>();
  const [prepareProgress, setPrepareProgress] =
    useState<ProductImageUploadProgress | null>(null);

  const progress = uploadProgress ?? prepareProgress;
  const isBusy = progress !== null;

  async function prepareSelectedFile(
    event: ChangeEvent<HTMLInputElement>,
    onChange: (file: File | undefined) => void,
  ) {
    const file = event.currentTarget.files?.[0];
    const input = event.currentTarget;
    if (!file) return;

    const requestId = ++prepareRequestIdRef.current;
    setPrepareError(undefined);
    onBusyChange?.(true);
    setPrepareProgress({ phase: "compressing", percent: 0 });

    try {
      assertProductImageFile(file);
      const compressed = await compressProductImage(file, (percent) => {
        if (requestId !== prepareRequestIdRef.current) return;
        setPrepareProgress({ phase: "compressing", percent });
      });
      if (requestId !== prepareRequestIdRef.current) return;
      void onReplaceImage?.();
      onChange(compressed);
    } catch (caught) {
      if (requestId !== prepareRequestIdRef.current) return;
      input.value = "";
      setPrepareError(productImageErrorMessage(caught));
    } finally {
      if (requestId === prepareRequestIdRef.current) {
        setPrepareProgress(null);
        onBusyChange?.(false);
      }
    }
  }

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
              disabled={disabled || isBusy}
              aria-invalid={!!(prepareError ?? error)}
              aria-describedby="admin-product-image-hint"
              name={field.name}
              onBlur={field.onBlur}
              ref={(element) => {
                field.ref(element);
                if (element && !(field.value instanceof File)) {
                  element.value = "";
                }
              }}
              onChange={(event) => {
                void prepareSelectedFile(event, field.onChange);
              }}
            />
            <ImageSelectionSummary image={field.value} />
          </>
        )}
      />
      {progress ? <ImageUploadProgress progress={progress} /> : null}
      <p id="admin-product-image-hint" className="text-sm text-muted-foreground">
        صورة واحدة لكل المنتج، مشتركة بين كل المقاسات. هتتصغّر وتتحوّل WebP
        قبل الرفع.
      </p>
      <FieldError message={prepareError ?? error} />
    </div>
  );
}

function ImageUploadProgress({
  progress,
}: {
  progress: ProductImageUploadProgress;
}) {
  const label =
    progress.phase === "compressing"
      ? "جاري تجهيز الصورة"
      : "جاري رفع الصورة";
  const percent = progress.percent;
  const isIndeterminate = percent === null;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {label}
        {percent !== null ? ` — ${percent}%` : "…"}
      </p>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : percent}
        className="h-2 overflow-hidden rounded-full bg-brand-100"
      >
        <div
          className={
            isIndeterminate
              ? "h-full w-1/3 animate-pulse rounded-full bg-brand-600"
              : "h-full rounded-full bg-brand-600 transition-[width]"
          }
          style={isIndeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    </div>
  );
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
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex items-center gap-3">
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
      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-sm text-foreground">{file.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatImageFileSize(file.size)}
        </p>
      </div>
    </div>
  );
}
