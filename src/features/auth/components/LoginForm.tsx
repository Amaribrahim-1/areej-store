"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import FieldError from "@/components/shared/FieldError";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLogin } from "../api/useLogin";
import { loginSchema, type LoginType } from "../schema";

type LoginFormProps = {
  /** Already-sanitized relative path from the login page. */
  nextPath?: string;
};

export default function LoginForm({ nextPath = "/" }: LoginFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useLogin();

  const registerHref =
    nextPath === "/"
      ? "/register"
      : `/register?next=${encodeURIComponent(nextPath)}`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginType> = (data) => {
    mutate(data, {
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
      onSubmit={handleSubmit(onSubmit)}
    >
      <header className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          تسجيل الدخول
        </h1>
        <p className="text-sm text-muted-foreground">
          ادخلي بياناتك عشان تقدري تكمّلي الطلب ومتابعة طلباتك.
        </p>
      </header>

      <div className="space-y-2">
        <Label htmlFor="login-email">البريد الإلكتروني</Label>
        <Input
          id="login-email"
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
        <Label htmlFor="login-password">كلمة المرور</Label>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full" size="lg">
        {isPending ? "جاري الدخول..." : "دخول"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        مش عندك حساب؟{" "}
        <Link
          href={registerHref}
          className="font-medium text-text-accent underline-offset-4 hover:underline"
        >
          أنشئي حساب
        </Link>
      </p>
    </form>
  );
}
