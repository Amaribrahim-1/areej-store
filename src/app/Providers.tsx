"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import ScrollToTop from "@/components/shared/ScrollToTop";
import { getQueryClient } from "@/lib/query/getQueryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <ScrollToTop />
        {children}
        <Toaster
          dir="rtl"
          position="bottom-center"
          closeButton
          toastOptions={{
            style: {
              width: "fit-content",
              maxWidth: "min(92vw, 22rem)",
            },
            classNames: {
              toast:
                "font-sans! w-fit! max-w-[min(92vw,22rem)]! border! shadow-md! rounded-2xl! px-4! py-3!",
              title: "text-sm! font-medium! leading-snug!",
              success: "bg-brand-50! text-brand-900! border-brand-200!",
              error:
                "bg-destructive/10! text-destructive! border-destructive/20!",
            },
          }}
        />
      </>
    </QueryClientProvider>
  );
}
