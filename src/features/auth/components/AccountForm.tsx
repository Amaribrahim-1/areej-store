"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getGovernorates,
  getMarkazByGovernorate,
} from "@/lib/egypt-locations";
import { cn } from "@/lib/utils";
import type { MyProfile } from "@/types/profile";

import { useUpdateMyProfile } from "../api/useUpdateMyProfile";
import { profileWriteSchema, type ProfileWriteInput } from "../schema";

const ADDRESS_HINT = "قرية قراجة، جانب الموقف";

const selectClassName = cn(
  "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 text-sm",
  "text-foreground outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
);

const governorates = getGovernorates();

type AccountFormProps = {
  initialProfile: MyProfile | null;
};

function toDefaultValues(profile: MyProfile | null): ProfileWriteInput {
  return {
    fullName: profile?.fullName ?? "",
    phone: profile?.phone ?? "",
    governorate: profile?.governorate ?? "",
    markaz: profile?.markaz ?? "",
    addressText: profile?.addressText ?? "",
  };
}

export default function AccountForm({ initialProfile }: AccountFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileWriteInput>({
    mode: "onBlur",
    resolver: zodResolver(profileWriteSchema),
    defaultValues: toDefaultValues(initialProfile),
  });

  const selectedGovernorate = watch("governorate");
  const markazOptions = getMarkazByGovernorate(selectedGovernorate);

  const { mutate, isPending } = useUpdateMyProfile();

  // Clear markaz only when the governorate actually changes. A "skip first
  // run" ref fails in React Strict Mode (the second effect pass wipes the
  // saved markaz on load).
  const previousGovernorateRef = useRef(selectedGovernorate);
  useEffect(() => {
    if (previousGovernorateRef.current === selectedGovernorate) {
      return;
    }
    previousGovernorateRef.current = selectedGovernorate;
    setValue("markaz", "", { shouldValidate: false });
  }, [selectedGovernorate, setValue]);

  const onSubmit: SubmitHandler<ProfileWriteInput> = (data) => {
    mutate(data, {
      onSuccess: (result) => reset(toDefaultValues(result)),
    });
  };

  return (
    <form
      className="w-full space-y-6 text-start"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <header className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          بياناتي
        </h1>
        <p className="text-sm text-muted-foreground">
          عدّلي اسمك ورقم موبايلك وعنوانك — التعديل بيسري على الطلبات
          القادمة فقط.
        </p>
      </header>

      <div className="space-y-2">
        <Label htmlFor="account-full-name">الاسم الكامل</Label>
        <Input
          id="account-full-name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="account-phone">رقم الموبايل</Label>
        <Input
          id="account-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          dir="ltr"
          className="text-start"
          placeholder="01xxxxxxxxx"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        <FieldError message={errors.phone?.message} />
      </div>

      <fieldset className="space-y-6">
        <legend className="font-heading text-base font-semibold text-foreground">
          العنوان
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="account-governorate">المحافظة</Label>
            <select
              id="account-governorate"
              className={selectClassName}
              aria-invalid={!!errors.governorate}
              {...register("governorate")}
            >
              <option value="" disabled>
                اختاري المحافظة
              </option>
              {governorates.map((governorate) => (
                <option key={governorate.value} value={governorate.value}>
                  {governorate.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.governorate?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-markaz">المركز</Label>
            <select
              id="account-markaz"
              className={selectClassName}
              disabled={!selectedGovernorate}
              aria-invalid={!!errors.markaz}
              {...register("markaz")}
            >
              <option value="" disabled>
                {selectedGovernorate ? "اختاري المركز" : "اختاري المحافظة أولاً"}
              </option>
              {markazOptions.map((markaz) => (
                <option key={markaz.value} value={markaz.value}>
                  {markaz.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.markaz?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-address-text">وصف الموقع</Label>
          <Textarea
            id="account-address-text"
            autoComplete="street-address"
            rows={3}
            aria-describedby="account-address-text-hint"
            aria-invalid={!!errors.addressText}
            {...register("addressText")}
          />
          <p
            id="account-address-text-hint"
            className="text-sm text-muted-foreground"
          >
            مثال: {ADDRESS_HINT}
          </p>
          <FieldError message={errors.addressText?.message} />
        </div>
      </fieldset>

      <Button
        type="submit"
        disabled={isPending || !isDirty}
        className="w-full"
        size="lg"
      >
        {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
      </Button>
    </form>
  );
}
