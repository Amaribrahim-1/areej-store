"use client";

import { useEffect } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  getGovernorates,
  getMarkazByGovernorate,
} from "../data/egypt-locations";
import { registerSchema, type RegisterType } from "../schema";
import { useRegister } from "../api/useRegister";
import { useRouter } from "next/navigation";

const ADDRESS_HINT = "قرية قراجة، جانب الموقف";

const selectClassName = cn(
  "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 text-sm",
  "text-foreground outline-none transition-colors",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
);

const governorates = getGovernorates();

type RegisterFormProps = {
  /** Already-sanitized relative path from the register page. */
  nextPath?: string;
};

export default function RegisterForm({ nextPath = "/" }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterType>({
    mode: "onBlur",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      governorate: "",
      markaz: "",
      addressDescription: "",
    },
  });

  const selectedGovernorate = watch("governorate");
  const markazOptions = getMarkazByGovernorate(selectedGovernorate);

  const router = useRouter();
  const { mutate, isPending } = useRegister();

  const loginHref =
    nextPath === "/"
      ? "/login"
      : `/login?next=${encodeURIComponent(nextPath)}`;

  useEffect(() => {
    setValue("markaz", "", { shouldValidate: false });
  }, [selectedGovernorate, setValue]);

  const onSubmit: SubmitHandler<RegisterType> = (data) => {
    const { confirmPassword: _, ...input } = data;
    mutate(input, {
      onSuccess: (result) => {
        if (result.needsEmailConfirmation) {
          router.push(loginHref);
          return;
        }
        router.push(nextPath);
        router.refresh();
      },
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
          إنشاء حساب
        </h1>
        <p className="text-sm text-muted-foreground">
          سجّلي بياناتك عشان تقدري تكمّلي الطلب ومتابعة طلباتك.
        </p>
      </header>

      <div className="space-y-2">
        <Label htmlFor="register-full-name">الاسم الكامل</Label>
        <Input
          id="register-full-name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">البريد الإلكتروني</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          dir="ltr"
          className="text-start"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-phone">رقم الموبايل</Label>
        <Input
          id="register-phone"
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="register-password">كلمة المرور</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            className="text-start"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-confirm-password">تأكيد كلمة المرور</Label>
          <Input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            className="text-start"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>
      </div>

      <fieldset className="space-y-6">
        <legend className="font-heading text-base font-semibold text-foreground">
          العنوان
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="register-governorate">المحافظة</Label>
            <select
              id="register-governorate"
              className={selectClassName}
              aria-invalid={!!errors.governorate}
              {...register("governorate")}
            >
              <option value="" disabled>
                اختر المحافظة
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
            <Label htmlFor="register-markaz">المركز</Label>
            <select
              id="register-markaz"
              className={selectClassName}
              disabled={!selectedGovernorate}
              aria-invalid={!!errors.markaz}
              {...register("markaz")}
            >
              <option value="" disabled>
                {selectedGovernorate ? "اختر المركز" : "اختر المحافظة أولاً"}
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
          <Label htmlFor="register-address-description">وصف الموقع</Label>
          <Textarea
            id="register-address-description"
            autoComplete="street-address"
            rows={3}
            aria-describedby="register-address-description-hint"
            aria-invalid={!!errors.addressDescription}
            {...register("addressDescription")}
          />
          <p
            id="register-address-description-hint"
            className="text-sm text-muted-foreground"
          >
            مثال: {ADDRESS_HINT}
          </p>
          <FieldError message={errors.addressDescription?.message} />
        </div>
      </fieldset>

      <Button type="submit" disabled={isPending} className="w-full" size="lg">
        {isPending ? "جاري الإنشاء..." : "إنشاء حساب"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        عندك حساب؟{" "}
        <Link
          href={loginHref}
          className="font-medium text-text-accent underline-offset-4 hover:underline"
        >
          سجّلي الدخول
        </Link>
      </p>
    </form>
  );
}
