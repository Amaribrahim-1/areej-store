"use client";

import { Mail as MailIcon } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { ListSkeleton } from "@/components/shared/ContentSkeleton";

import { useAdminContactMessages } from "../../api/useAdminContactMessages";

import AdminContactMessagesList from "./AdminContactMessagesList";

export default function AdminContactMessagesPage() {
  const { data: messages, isPending, isError, refetch } =
    useAdminContactMessages();
  const messageList = messages ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand-900 sm:text-3xl">
          الرسائل
        </h1>
        <p className="text-sm text-muted-foreground">
          رسائل نموذج التواصل، الأحدث أولاً.
        </p>
      </header>

      {isPending ? <ListSkeleton count={6} /> : null}

      {isError ? (
        <ErrorState
          title="تعذر تحميل الرسائل"
          description="تعذّر جلب قائمة الرسائل. جرّب إعادة المحاولة."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && messageList.length === 0 ? (
        <EmptyState
          icon={<MailIcon />}
          title="لا توجد رسائل بعد"
          description="عندما يرسل الزوار رسالة من صفحة التواصل، ستظهر هنا."
        />
      ) : null}

      {!isPending && !isError && messageList.length > 0 ? (
        <AdminContactMessagesList messages={messageList} />
      ) : null}
    </div>
  );
}
