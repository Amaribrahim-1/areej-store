"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAdminLogin } from "../api/useAdminLogin";
import { adminLoginSchema, type AdminLoginType } from "../schema";

type AdminLoginFormProps = {
  /** Already-sanitized admin-only relative path from the login page. */
  nextPath?: string;
};

export default function AdminLoginForm({
  nextPath = "/admin",
}: AdminLoginFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginType>({
    mode: "onBlur",
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AdminLoginType> = (credentials) => {
    mutate(credentials, {
      onSuccess: () => {
        router.push(nextPath);
        router.refresh();
      },
    });
  };

  return (
    <form
      className="w-full space-y-6 text-start"
      noValidate
      aria-busy={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <header className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          تسجيل دخول المدير
        </h1>
        <p className="text-sm text-muted-foreground">
          أدخل بيانات حساب الإدارة للوصول إلى لوحة التحكم.
        </p>
      </header>

      <div className="space-y-2">
        <Label htmlFor="admin-login-email">البريد الإلكتروني</Label>
        <Input
          id="admin-login-email"
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
        <Label htmlFor="admin-login-password">كلمة المرور</Label>
        <PasswordInput
          id="admin-login-password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full" size="lg">
        {isPending ? "جاري الدخول..." : "دخول"}
      </Button>
    </form>
  );
}
