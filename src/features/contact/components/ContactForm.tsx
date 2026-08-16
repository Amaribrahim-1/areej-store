"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";

import EmptyState from "@/components/shared/EmptyState";
import FieldError from "@/components/shared/FieldError";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { useCreateContactMessage } from "../api/useCreateContactMessage";
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
} from "../constants";
import { contactSchema, type ContactInput } from "../schema";

export default function ContactForm() {
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    mode: "onBlur",
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  const { mutate, isPending } = useCreateContactMessage();

  const onSubmit: SubmitHandler<ContactInput> = (data) => {
    if (honeypotRef.current?.value) {
      setSubmitted(true);
      return;
    }

    mutate(data, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  if (submitted) {
    return (
      <EmptyState
        titleAs="h2"
        title="وصلتنا رسالتك"
        description="هنرجع لكِ على رقم الموبايل في أقرب وقت. تقدري تكمّلي تسوّق أو ترجعي للرئيسية."
        action={
          <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
            تسوّقي المنتجات
          </Link>
        }
      />
    );
  }

  return (
    <form
      className="relative space-y-4 text-start"
      noValidate
      aria-busy={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-px w-px overflow-hidden opacity-0"
      >
        <label htmlFor="contact-website">الموقع</label>
        <input
          id="contact-website"
          ref={honeypotRef}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-name">الاسم</Label>
        <Input
          id="contact-name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          maxLength={CONTACT_NAME_MAX_LENGTH}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone">رقم الموبايل</Label>
        <Input
          id="contact-phone"
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

      <div className="space-y-2">
        <Label htmlFor="contact-message">الرسالة</Label>
        <Textarea
          id="contact-message"
          rows={5}
          maxLength={CONTACT_MESSAGE_MAX_LENGTH}
          placeholder="اكتبي سؤالك أو تفاصيل طلبك"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="w-full sm:w-auto sm:min-w-40"
      >
        {isPending ? "جاري الإرسال..." : "إرسال الرسالة"}
      </Button>
    </form>
  );
}
